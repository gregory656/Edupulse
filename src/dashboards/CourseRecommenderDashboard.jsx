// src/dashboards/CourseRecommenderDashboard.jsx
import React, { useState } from "react";
import { Box, Paper, Typography, TextField, Button, CircularProgress, List, ListItem, ListItemText, Stack } from "@mui/material";
import { askAI } from "../services/openaiService.js";

export default function CourseRecommenderDashboard() {
  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState(""); // optional: beginner, intermediate, advanced
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [history, setHistory] = useState([]);

  const handleRecommend = async () => {
    if (!topic.trim()) return;

    setLoading(true);
    try {
      const prompt = `
You are "EdupulseAI Course Recommender". 
Recommend 5 courses based on the following user input. Be friendly, fun, and lightly roasty if the input is too vague.
Topic: ${topic}
Level: ${level || "any"}
Return only the course names and optionally a short note (one line each).
      `;

      const aiRaw = await askAI(prompt);
      const items = aiRaw.split(/\r?\n/).filter(line => line.trim() !== "");
      setRecommendations(items);

      setHistory(prev => [
        ...prev,
        { topic, level, recommendations: items, time: new Date().toISOString() },
      ]);
    } catch (err) {
      console.error("Course Recommender error:", err);
      setRecommendations(["😅 EdupulseAI tripped — try again!"]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setTopic("");
    setLevel("");
    setRecommendations([]);
  };

  return (
    <Box p={4}>
      <Typography variant="h4" color="primary" fontWeight={700} gutterBottom>
        🎓 Course Recommender
      </Typography>

      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Stack spacing={2}>
          <TextField
            label="Topic / Skill you want to learn"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          <TextField
            label="Level (optional)"
            placeholder="Beginner, Intermediate, Advanced"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
          />

          <Box display="flex" gap={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleRecommend}
              disabled={loading || !topic.trim()}
            >
              {loading ? <CircularProgress size={18} /> : "Recommend Courses"}
            </Button>

            <Button variant="outlined" onClick={handleClear}>
              Clear
            </Button>

            <Button variant="text" onClick={() => handleRecommend("Popular courses")}>
              Popular Courses 🔥
            </Button>

            <Button variant="text" onClick={() => handleRecommend("Trending courses")}>
              Trending Courses 📈
            </Button>
          </Box>
        </Stack>

        {recommendations.length > 0 && (
          <Box mt={3}>
            <Typography variant="h6" gutterBottom>
              EdupulseAI Recommendations:
            </Typography>
            <List dense>
              {recommendations.map((item, idx) => (
                <ListItem key={idx}>
                  <ListItemText primary={item} />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </Paper>
    </Box>
  );
}