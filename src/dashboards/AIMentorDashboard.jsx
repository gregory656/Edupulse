// src/dashboards/AIMentorDashboard.jsx
import React, { useState } from "react";
import { Box, Paper, Typography, TextField, Button, CircularProgress, Stack, List, ListItem, ListItemText } from "@mui/material";
import { askAI } from "../services/openaiService.js";

export default function AIMentorDashboard() {
  const [userQuestion, setUserQuestion] = useState("");
  const [response, setResponse] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAsk = async (quickPrompt = "") => {
    const question = quickPrompt || userQuestion;
    if (!question.trim()) return;

    setLoading(true);
    try {
      const prompt = `
You are "EdupulseAI Mentor". Respond to the user question in a fun, friendly, and sometimes lightly roasty way. Give helpful advice or tips based on the question. Keep it concise and engaging.

User Question: ${question}
      `;

      const aiRaw = await askAI(prompt);
      const lines = aiRaw.split(/\r?\n/).filter(line => line.trim() !== "");
      setResponse(lines);

      setUserQuestion(""); // clear input
    } catch (err) {
      console.error("AI Mentor error:", err);
      setResponse(["😅 EdupulseAI tripped — try again!"]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setUserQuestion("");
    setResponse([]);
  };

  return (
    <Box p={4}>
      <Typography variant="h4" color="primary" fontWeight={700} gutterBottom>
        🧑‍🏫 EdupulseAI Mentor
      </Typography>

      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Stack spacing={2}>
          <TextField
            label="Ask your mentor anything..."
            multiline
            minRows={3}
            value={userQuestion}
            onChange={(e) => setUserQuestion(e.target.value)}
          />

          <Box display="flex" gap={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleAsk()}
              disabled={loading || !userQuestion.trim()}
            >
              {loading ? <CircularProgress size={18} /> : "Ask Mentor"}
            </Button>

            <Button variant="outlined" onClick={handleClear}>
              Clear
            </Button>

            {/* Quick fun prompts */}
            <Button variant="text" onClick={() => handleAsk("Give me a motivational tip!")}>
              Motivate Me 💪
            </Button>
            <Button variant="text" onClick={() => handleAsk("Give me a coding tip!")}>
              Coding Tip 💻
            </Button>
            <Button variant="text" onClick={() => handleAsk("How to improve my CV?")}>
              CV Tip 📄
            </Button>
          </Box>
        </Stack>

        {response.length > 0 && (
          <Box mt={3}>
            <Typography variant="h6" gutterBottom>
              EdupulseAI Mentor says:
            </Typography>
            <List dense>
              {response.map((line, idx) => (
                <ListItem key={idx}>
                  <ListItemText primary={line} />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </Paper>
    </Box>
  );
}