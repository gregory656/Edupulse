import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  Divider,
  Stack,
  CircularProgress,
} from "@mui/material";
import { askAI } from "../services/openaiService.js";

const statuses = ["Applied", "Interviewing", "Offer", "Rejected", "Ghosted 👻"];

export default function JobTrackerDashboard() {
  const [job, setJob] = useState({ company: "", position: "", status: "Applied", date: "" });
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [aiFeedback, setAiFeedback] = useState("");

  const handleAddJob = () => {
    if (!job.company || !job.position) return;
    setJobs([...jobs, { ...job, id: Date.now() }]);
    setJob({ company: "", position: "", status: "Applied", date: "" });
  };

  const handleAnalyze = async () => {
    if (jobs.length === 0) return;
    setLoading(true);
    try {
      const jobList = jobs
        .map(
          (j) =>
            `Company: ${j.company}, Position: ${j.position}, Status: ${j.status}, Date: ${
              j.date || "N/A"
            }`
        )
        .join("\n");

      const prompt = `
You are EdupulseAI Career Coach — sarcastic but supportive 😎.
The user has the following job applications:
${jobList}

Give a short roast-style but helpful summary about their job hunt progress. 
Keep it motivational but cheeky. Max 5 sentences.
      `;

      const aiRaw = await askAI(prompt);
      setAiFeedback(aiRaw);
    } catch (err) {
      console.error("AI Analysis Error:", err);
      setAiFeedback("😅 EdupulseAI choked on your job data — try again!");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    const data = JSON.stringify(jobs, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `edupulse_jobtracker_${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Box p={4}>
      <Typography variant="h4" color="primary" fontWeight={700} gutterBottom>
        💼 Edupulse Job Tracker
      </Typography>

      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Stack spacing={2}>
          <TextField
            label="Company"
            value={job.company}
            onChange={(e) => setJob({ ...job, company: e.target.value })}
            fullWidth
          />
          <TextField
            label="Position"
            value={job.position}
            onChange={(e) => setJob({ ...job, position: e.target.value })}
            fullWidth
          />
          <TextField
            select
            label="Status"
            value={job.status}
            onChange={(e) => setJob({ ...job, status: e.target.value })}
            fullWidth
          >
            {statuses.map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Date Applied"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={job.date}
            onChange={(e) => setJob({ ...job, date: e.target.value })}
            fullWidth
          />

          <Box display="flex" gap={2}>
            <Button variant="contained" color="primary" onClick={handleAddJob}>
              Add Job
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleAnalyze}
              disabled={loading || jobs.length === 0}
            >
              {loading ? <CircularProgress size={18} /> : "Analyze My Progress 🤖"}
            </Button>
            <Button variant="outlined" onClick={handleExport}>
              Export Data 📤
            </Button>
          </Box>
        </Stack>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          Your Job Applications ({jobs.length})
        </Typography>

        {jobs.length > 0 ? (
          <List dense>
            {jobs.map((j) => (
              <ListItem key={j.id}>
                <ListItemText
                  primary={`${j.company} — ${j.position}`}
                  secondary={`Status: ${j.status} | Date: ${j.date || "N/A"}`}
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography color="text.secondary">No job applications yet.</Typography>
        )}

        {aiFeedback && (
          <Paper sx={{ mt: 3, p: 2, backgroundColor: "#f8f8f8" }}>
            <Typography variant="subtitle1" fontWeight={700}>
              EdupulseAI’s Verdict:
            </Typography>
            <Typography sx={{ whiteSpace: "pre-line" }}>{aiFeedback}</Typography>
          </Paper>
        )}
      </Paper>
    </Box>
  );
}