import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  Divider,
  Stack,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  UploadFile,
  Assessment,
  Queue,
  Person,
  School,
  Business,
  CheckCircle,
  Pending,
  PriorityHigh,
  Refresh,
  Download,
} from "@mui/icons-material";
import { extractTextFromFile, validateFile } from "../services/documentService.js";
import { analyzeResume, scoreInterviewResponse, generateCareerRecommendation } from "../services/openaiService.js";
import {
  addResumeSubmission,
  getResumeSubmissions,
  updateResumeSubmission,
  addInterviewSubmission,
  getInterviewSubmissions,
  updateInterviewSubmission,
  addCareerRecommendation,
  getCareerRecommendations,
  updateCareerRecommendation,
} from "../services/firebaseService.js";

const CareerCounselorDashboard = () => {
  const [userMode, setUserMode] = useState("counselor"); // "counselor" or "student"
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submissions, setSubmissions] = useState({
    resumes: [],
    interviews: [],
    recommendations: [],
  });

  // Student form states
  const [studentInfo, setStudentInfo] = useState({
    name: "",
    email: "",
    major: "",
    graduationYear: "",
    targetIndustry: "",
    experience: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [interviewQuestion, setInterviewQuestion] = useState("");
  const [interviewAnswer, setInterviewAnswer] = useState("");

  // Counselor review states
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [counselorReview, setCounselorReview] = useState("");
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);

  useEffect(() => {
    if (userMode === "counselor") {
      loadSubmissions();
    }
  }, [userMode]);

  const loadSubmissions = async () => {
    setLoading(true);
    try {
      const [resumes, interviews, recommendations] = await Promise.all([
        getResumeSubmissions(),
        getInterviewSubmissions(),
        getCareerRecommendations(),
      ]);
      setSubmissions({ resumes, interviews, recommendations });
    } catch (error) {
      console.error("Error loading submissions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        validateFile(file);
        setSelectedFile(file);
      } catch (error) {
        alert(error.message);
      }
    }
  };

  const handleResumeSubmission = async () => {
    if (!selectedFile || !studentInfo.name || !studentInfo.email) {
      alert("Please fill in all required fields and select a resume file.");
      return;
    }

    setLoading(true);
    try {
      const resumeText = await extractTextFromFile(selectedFile);
      const aiAnalysis = await analyzeResume(resumeText, studentInfo);

      await addResumeSubmission(studentInfo, resumeText, aiAnalysis);

      alert("Resume submitted successfully! You'll receive AI feedback shortly.");
      setSelectedFile(null);
      setStudentInfo({
        name: "",
        email: "",
        major: "",
        graduationYear: "",
        targetIndustry: "",
        experience: "",
      });
    } catch (error) {
      console.error("Error submitting resume:", error);
      alert("Error submitting resume. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInterviewSubmission = async () => {
    if (!interviewQuestion.trim() || !interviewAnswer.trim() || !studentInfo.name || !studentInfo.email) {
      alert("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      const aiAnalysis = await scoreInterviewResponse(interviewQuestion, interviewAnswer, studentInfo);

      await addInterviewSubmission(studentInfo, interviewQuestion, interviewAnswer, aiAnalysis);

      alert("Interview response submitted successfully!");
      setInterviewQuestion("");
      setInterviewAnswer("");
    } catch (error) {
      console.error("Error submitting interview response:", error);
      alert("Error submitting interview response. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCareerRecommendationRequest = async () => {
    if (!studentInfo.name || !studentInfo.email || !studentInfo.major) {
      alert("Please fill in your basic information.");
      return;
    }

    setLoading(true);
    try {
      const aiRecommendation = await generateCareerRecommendation(studentInfo);

      await addCareerRecommendation(studentInfo, aiRecommendation);

      alert("Career recommendation request submitted successfully!");
    } catch (error) {
      console.error("Error requesting career recommendation:", error);
      alert("Error requesting career recommendation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmission = async (type, submissionId, status) => {
    try {
      const updates = {
        status,
        counselorReview,
        reviewedAt: new Date(),
        reviewedBy: "Counselor", // In real app, this would be the logged-in user
      };

      switch (type) {
        case "resume":
          await updateResumeSubmission(submissionId, updates);
          break;
        case "interview":
          await updateInterviewSubmission(submissionId, updates);
          break;
        case "recommendation":
          await updateCareerRecommendation(submissionId, updates);
          break;
      }

      setReviewDialogOpen(false);
      setSelectedSubmission(null);
      setCounselorReview("");
      loadSubmissions();
    } catch (error) {
      console.error("Error updating submission:", error);
      alert("Error updating submission. Please try again.");
    }
  };

  const getPriorityColor = (level) => {
    switch (level?.toLowerCase()) {
      case "urgent":
        return "error";
      case "high":
        return "warning";
      case "medium":
        return "info";
      default:
        return "default";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "success";
      case "in_review":
        return "warning";
      case "pending":
        return "default";
      default:
        return "default";
    }
  };

  const renderStudentInterface = () => (
    <Box p={3}>
      <Typography variant="h4" color="primary" fontWeight={700} gutterBottom>
        🎓 Student Career Services
      </Typography>

      {/* Student Information Form */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Your Information
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Full Name"
              value={studentInfo.name}
              onChange={(e) => setStudentInfo({ ...studentInfo, name: e.target.value })}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={studentInfo.email}
              onChange={(e) => setStudentInfo({ ...studentInfo, email: e.target.value })}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Major"
              value={studentInfo.major}
              onChange={(e) => setStudentInfo({ ...studentInfo, major: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Graduation Year"
              value={studentInfo.graduationYear}
              onChange={(e) => setStudentInfo({ ...studentInfo, graduationYear: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Target Industry"
              value={studentInfo.targetIndustry}
              onChange={(e) => setStudentInfo({ ...studentInfo, targetIndustry: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Experience Level</InputLabel>
              <Select
                value={studentInfo.experience}
                onChange={(e) => setStudentInfo({ ...studentInfo, experience: e.target.value })}
              >
                <MenuItem value="none">No Experience</MenuItem>
                <MenuItem value="internship">Internship</MenuItem>
                <MenuItem value="part-time">Part-time Work</MenuItem>
                <MenuItem value="full-time">Full-time Experience</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
        <Tab icon={<UploadFile />} label="Resume Review" />
        <Tab icon={<Assessment />} label="Interview Practice" />
        <Tab icon={<Business />} label="Career Guidance" />
      </Tabs>

      {activeTab === 0 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Resume Analysis
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Upload your resume (DOCX or TXT) for AI-powered analysis and feedback.
          </Typography>
          <Box sx={{ mb: 2 }}>
            <input
              accept=".docx,.txt"
              style={{ display: "none" }}
              id="resume-file"
              type="file"
              onChange={handleFileUpload}
            />
            <label htmlFor="resume-file">
              <Button variant="outlined" component="span">
                Choose Resume File
              </Button>
            </label>
            {selectedFile && (
              <Typography variant="body2" sx={{ ml: 2 }}>
                Selected: {selectedFile.name}
              </Typography>
            )}
          </Box>
          <Button
            variant="contained"
            color="primary"
            onClick={handleResumeSubmission}
            disabled={loading || !selectedFile}
            startIcon={loading ? <CircularProgress size={18} /> : null}
          >
            Submit for Analysis
          </Button>
        </Paper>
      )}

      {activeTab === 1 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Interview Practice
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Submit an interview question and your response for AI scoring and feedback.
          </Typography>
          <TextField
            fullWidth
            label="Interview Question"
            multiline
            rows={2}
            value={interviewQuestion}
            onChange={(e) => setInterviewQuestion(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Your Answer"
            multiline
            rows={6}
            value={interviewAnswer}
            onChange={(e) => setInterviewAnswer(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleInterviewSubmission}
            disabled={loading || !interviewQuestion.trim() || !interviewAnswer.trim()}
            startIcon={loading ? <CircularProgress size={18} /> : null}
          >
            Submit for Scoring
          </Button>
        </Paper>
      )}

      {activeTab === 2 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Career Recommendations
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Get personalized career guidance based on your profile and goals.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCareerRecommendationRequest}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={18} /> : null}
          >
            Request Career Guidance
          </Button>
        </Paper>
      )}
    </Box>
  );

  const renderCounselorInterface = () => (
    <Box p={3}>
      <Typography variant="h4" color="primary" fontWeight={700} gutterBottom>
        👨‍🏫 Career Counselor Dashboard
      </Typography>

      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={loadSubmissions}
          disabled={loading}
        >
          Refresh Queue
        </Button>
        <Chip
          label={`${submissions.resumes.length + submissions.interviews.length + submissions.recommendations.length} Total Submissions`}
          color="primary"
        />
      </Stack>

      <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
        <Tab icon={<UploadFile />} label={`Resume Reviews (${submissions.resumes.length})`} />
        <Tab icon={<Assessment />} label={`Interview Scoring (${submissions.interviews.length})`} />
        <Tab icon={<Business />} label={`Career Guidance (${submissions.recommendations.length})`} />
      </Tabs>

      {activeTab === 0 && (
        <Grid container spacing={3}>
          {submissions.resumes.map((submission) => (
            <Grid item xs={12} md={6} lg={4} key={submission.id}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="start" mb={1}>
                    <Typography variant="h6">{submission.name}</Typography>
                    <Chip
                      label={submission.status}
                      color={getStatusColor(submission.status)}
                      size="small"
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {submission.email}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    Major: {submission.major || "Not specified"}
                  </Typography>
                  {submission.aiAnalysis && (
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="body2" fontWeight="bold">
                        AI Score: {submission.aiAnalysis.overallScore}/10
                      </Typography>
                      <Chip
                        label={submission.aiAnalysis.priorityLevel}
                        color={getPriorityColor(submission.aiAnalysis.priorityLevel)}
                        size="small"
                      />
                    </Box>
                  )}
                  <Stack direction="row" spacing={1} mt={2}>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => {
                        setSelectedSubmission({ ...submission, type: "resume" });
                        setReviewDialogOpen(true);
                      }}
                    >
                      Review
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      color="success"
                      onClick={() => handleReviewSubmission("resume", submission.id, "completed")}
                    >
                      Approve
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {activeTab === 1 && (
        <Grid container spacing={3}>
          {submissions.interviews.map((submission) => (
            <Grid item xs={12} md={6} lg={4} key={submission.id}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="start" mb={1}>
                    <Typography variant="h6">{submission.name}</Typography>
                    <Chip
                      label={submission.status}
                      color={getStatusColor(submission.status)}
                      size="small"
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {submission.email}
                  </Typography>
                  <Typography variant="body2" noWrap sx={{ mb: 1 }}>
                    Q: {submission.question}
                  </Typography>
                  {submission.aiScore && (
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="body2" fontWeight="bold">
                        AI Score: {submission.aiScore.overallScore}/10
                      </Typography>
                      <Chip
                        label={submission.aiScore.priorityLevel}
                        color={getPriorityColor(submission.aiScore.priorityLevel)}
                        size="small"
                      />
                    </Box>
                  )}
                  <Stack direction="row" spacing={1} mt={2}>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => {
                        setSelectedSubmission({ ...submission, type: "interview" });
                        setReviewDialogOpen(true);
                      }}
                    >
                      Review
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      color="success"
                      onClick={() => handleReviewSubmission("interview", submission.id, "completed")}
                    >
                      Approve
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {activeTab === 2 && (
        <Grid container spacing={3}>
          {submissions.recommendations.map((submission) => (
            <Grid item xs={12} md={6} lg={4} key={submission.id}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="start" mb={1}>
                    <Typography variant="h6">{submission.name}</Typography>
                    <Chip
                      label={submission.status}
                      color={getStatusColor(submission.status)}
                      size="small"
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {submission.email}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    Major: {submission.major || "Not specified"}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    Target: {submission.targetIndustry || "Not specified"}
                  </Typography>
                  <Stack direction="row" spacing={1} mt={2}>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => {
                        setSelectedSubmission({ ...submission, type: "recommendation" });
                        setReviewDialogOpen(true);
                      }}
                    >
                      Review
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      color="success"
                      onClick={() => handleReviewSubmission("recommendation", submission.id, "completed")}
                    >
                      Approve
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      {/* Mode Toggle */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box display="flex" justifyContent="center" gap={2}>
          <Button
            variant={userMode === "student" ? "contained" : "outlined"}
            startIcon={<School />}
            onClick={() => setUserMode("student")}
          >
            Student Mode
          </Button>
          <Button
            variant={userMode === "counselor" ? "contained" : "outlined"}
            startIcon={<Person />}
            onClick={() => setUserMode("counselor")}
          >
            Counselor Mode
          </Button>
        </Box>
      </Paper>

      {userMode === "student" ? renderStudentInterface() : renderCounselorInterface()}

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onClose={() => setReviewDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Review Submission - {selectedSubmission?.name}
        </DialogTitle>
        <DialogContent>
          {selectedSubmission && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Student Information
              </Typography>
              <Typography>Name: {selectedSubmission.name}</Typography>
              <Typography>Email: {selectedSubmission.email}</Typography>
              <Typography>Major: {selectedSubmission.major || "Not specified"}</Typography>

              <Divider sx={{ my: 2 }} />

              {selectedSubmission.type === "resume" && selectedSubmission.aiAnalysis && (
                <>
                  <Typography variant="h6" gutterBottom>
                    AI Analysis
                  </Typography>
                  <Typography>Overall Score: {selectedSubmission.aiAnalysis.overallScore}/10</Typography>
                  <Typography>Priority: {selectedSubmission.aiAnalysis.priorityLevel}</Typography>
                  <Typography sx={{ mt: 1, fontWeight: "bold" }}>Strengths:</Typography>
                  <List dense>
                    {selectedSubmission.aiAnalysis.strengths.map((strength, idx) => (
                      <ListItem key={idx}>
                        <ListItemText primary={strength} />
                      </ListItem>
                    ))}
                  </List>
                  <Typography sx={{ mt: 1, fontWeight: "bold" }}>Recommendations:</Typography>
                  <List dense>
                    {selectedSubmission.aiAnalysis.recommendations.map((rec, idx) => (
                      <ListItem key={idx}>
                        <ListItemText primary={rec} />
                      </ListItem>
                    ))}
                  </List>
                </>
              )}

              {selectedSubmission.type === "interview" && selectedSubmission.aiScore && (
                <>
                  <Typography variant="h6" gutterBottom>
                    AI Scoring
                  </Typography>
                  <Typography>Overall Score: {selectedSubmission.aiScore.overallScore}/10</Typography>
                  <Typography>Technical Accuracy: {selectedSubmission.aiScore.technicalAccuracy}/10</Typography>
                  <Typography>Communication: {selectedSubmission.aiScore.communicationClarity}/10</Typography>
                  <Typography sx={{ mt: 1, fontStyle: "italic" }}>
                    "{selectedSubmission.aiScore.feedback}"
                  </Typography>
                </>
              )}

              {selectedSubmission.type === "recommendation" && selectedSubmission.aiRecommendation && (
                <>
                  <Typography variant="h6" gutterBottom>
                    AI Career Recommendations
                  </Typography>
                  <Typography sx={{ fontWeight: "bold" }}>Recommended Careers:</Typography>
                  <List dense>
                    {selectedSubmission.aiRecommendation.recommendedCareers.map((career, idx) => (
                      <ListItem key={idx}>
                        <ListItemText primary={career} />
                      </ListItem>
                    ))}
                  </List>
                </>
              )}

              <TextField
                fullWidth
                multiline
                rows={4}
                label="Your Review/Feedback"
                value={counselorReview}
                onChange={(e) => setCounselorReview(e.target.value)}
                sx={{ mt: 2 }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReviewDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => handleReviewSubmission(selectedSubmission?.type, selectedSubmission?.id, "completed")}
          >
            Submit Review
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CareerCounselorDashboard;