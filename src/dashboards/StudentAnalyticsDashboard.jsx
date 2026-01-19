// src/dashboards/StudentAnalyticsDashboard.jsx
import React, { useState } from "react";
import { Box, Paper, Typography, TextField, Button, CircularProgress, List, ListItem, ListItemText, Stack } from "@mui/material";
import { askAI } from "../services/openaiService.js";

export default function StudentAnalyticsDashboard() {
  const [courses, setCourses] = useState("");
  const [scores, setScores] = useState("");
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState([]);

  const handleAnalyze = async () => {
    if (!courses && !scores) return;

    setLoading(true);
    try {
      const prompt = `
You are "EdupulseAI Student Analytics". Given the following student performance data, provide a summary analysis. Include strengths, weaknesses, and at least 2 actionable tips. Make it friendly and sometimes lightly humorous.

Courses: ${courses}
Scores (comma separated, same order): ${scores}
`;

      const aiRaw = await askAI(prompt);

      const items = aiRaw.split(/\r?\n/).filter(line => line.trim() !== "");
      setInsights(items);
    } catch (err) {
      console.error("Analytics error:", err);
      setInsights(["😅 EdupulseAI tripped — try again!"]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setCourses("");
    setScores("");
    setInsights([]);
  };

  return (
    <Box p={4}>
      <Typography variant="h4" color="primary" fontWeight={700} gutterBottom>
        📊 Student Analytics
      </Typography>

      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Stack spacing={2}>
          <TextField
            label="Courses (comma separated)"
            value={courses}
            onChange={e => setCourses(e.target.value)}
          />
          <TextField
            label="Scores (comma separated)"
            value={scores}
            onChange={e => setScores(e.target.value)}
          />

          <Box display="flex" gap={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAnalyze}
              disabled={loading}
            >
              {loading ? <CircularProgress size={18} /> : "Analyze 📈"}
            </Button>

            <Button variant="outlined" onClick={handleClear}>
              Clear
            </Button>
          </Box>
        </Stack>

        {insights.length > 0 && (
          <Box mt={3}>
            <Typography variant="h6" gutterBottom>
              EdupulseAI Insights:
            </Typography>
            <List dense>
              {insights.map((i, idx) => (
                <ListItem key={idx}>
                  <ListItemText primary={i} />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </Paper>
    </Box>
  );
}