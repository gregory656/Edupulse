import React, { useState } from "react";
import { Box, Button, Typography, Card, CardContent, TextField } from "@mui/material";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import FeedbackIcon from "@mui/icons-material/Feedback";

const AIInterviewer = () => {
  const [started, setStarted] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");

  const startInterview = () => {
    setStarted(true);
    setQuestion("Tell me about yourself.");
    setFeedback("");
    setAnswer("");
  };

  const submitAnswer = () => {
    setFeedback("Analyzing your response... (AI feedback coming soon 🤖)");
  };

  return (
    <Box sx={{ padding: 3, color: "white" }}>
      <Typography variant="h4" sx={{ mb: 2, color: "#a78bfa", fontWeight: "bold" }}>
        🧠 AI Interviewer
      </Typography>

      {!started ? (
        <Card
          sx={{
            background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
            color: "white",
            borderRadius: "20px",
            p: 4,
            textAlign: "center",
            boxShadow: "0 4px 30px rgba(0,0,0,0.3)",
          }}
        >
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Welcome to your personal AI Interviewer
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Ready to test your skills? Click below to begin your interview session.
            </Typography>
            <Button
              onClick={startInterview}
              variant="contained"
              size="large"
              startIcon={<PlayCircleOutlineIcon />}
              sx={{
                backgroundColor: "#34d399",
                "&:hover": { backgroundColor: "#10b981" },
                borderRadius: "10px",
                fontWeight: "bold",
              }}
            >
              Start Interview
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Box>
          <Card sx={{ mb: 3, backgroundColor: "#1e293b", borderRadius: "15px", p: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: "#38bdf8" }}>
                {question}
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your answer here..."
                sx={{
                  mt: 2,
                  backgroundColor: "#334155",
                  borderRadius: "10px",
                  "& .MuiInputBase-input": { color: "white" },
                }}
              />
              <Button
                onClick={submitAnswer}
                variant="contained"
                startIcon={<FeedbackIcon />}
                sx={{
                  mt: 2,
                  backgroundColor: "#8b5cf6",
                  "&:hover": { backgroundColor: "#7c3aed" },
                  borderRadius: "8px",
                  fontWeight: "bold",
                }}
              >
                Submit Answer
              </Button>
            </CardContent>
          </Card>

          {feedback && (
            <Card sx={{ backgroundColor: "#0f172a", borderRadius: "15px", p: 2 }}>
              <CardContent>
                <Typography variant="body1" sx={{ color: "#a3e635" }}>
                  {feedback}
                </Typography>
              </CardContent>
            </Card>
          )}
        </Box>
      )}
    </Box>
  );
};

export default AIInterviewer;