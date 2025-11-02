// src/dashboards/CareerPredictorDashboard.jsx
import React, { useState } from "react";
import { Box, Paper, Typography, TextField, Button, CircularProgress, List, ListItem, ListItemText, Stack } from "@mui/material";
import { askAI } from "../services/openaiService.js";

export default function CareerPredictorDashboard() {
  const [skills, setSkills] = useState("");
  const [education, setEducation] = useState("");
  const [interests, setInterests] = useState("");
  const [loading, setLoading] = useState(false);
  const [predictions, setPredictions] = useState([]);
  const [history, setHistory] = useState([]);

  const handlePredict = async () => {
    if (!skills && !education && !interests) return;

    setLoading(true);
    try {
      const prompt = `
You are "EdupulseAI Career Predictor". Based on the following user information, predict 3-5 suitable career paths. Include a short confidence score (1-100%) and a fun encouraging message for each suggestion.

Skills: ${skills}
Education: ${education}
Interests: ${interests}
`;

      const aiRaw = await askAI(prompt);

      // Simple parsing: split by line breaks, filter empty lines
      const items = aiRaw.split(/\r?\n/).filter(line => line.trim() !== "");
      setPredictions(items);

      // Save to history
      setHistory(prev => [
        ...prev,
        { skills, education, interests, predictions: items, time: new Date().toISOString() },
      ]);
    } catch (err) {
      console.error("Career prediction error:", err);
      setPredictions(["😅 EdupulseAI tripped — try again!"]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSkills("");
    setEducation("");
    setInterests("");
    setPredictions([]);
  };

  return (
    <Box p={4}>
      <Typography variant="h4" color="primary" fontWeight={700} gutterBottom>
        🎯 Career Predictor
      </Typography>

      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Stack spacing={2}>
          <TextField
            label="Skills (comma separated)"
            value={skills}
            onChange={e => setSkills(e.target.value)}
          />
          <TextField
            label="Education"
            value={education}
            onChange={e => setEducation(e.target.value)}
          />
          <TextField
            label="Interests"
            value={interests}
            onChange={e => setInterests(e.target.value)}
          />

          <Box display="flex" gap={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={handlePredict}
              disabled={loading}
            >
              {loading ? <CircularProgress size={18} /> : "Predict Careers"}
            </Button>

            <Button variant="outlined" onClick={handleClear}>
              Clear
            </Button>
          </Box>
        </Stack>

        {predictions.length > 0 && (
          <Box mt={3}>
            <Typography variant="h6" gutterBottom>
              EdupulseAI Predictions:
            </Typography>
            <List dense>
              {predictions.map((p, idx) => (
                <ListItem key={idx}>
                  <ListItemText primary={p} />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </Paper>
    </Box>
  );
}