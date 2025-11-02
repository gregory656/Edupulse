// src/dashboards/CommunityHubDashboard.jsx
import { useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { askAI } from "../services/openaiService.js";

export default function CommunityHubDashboard() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [loading, setLoading] = useState(false);
  const feedRef = useRef(null);

  // Auto scroll to latest post
  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
  }, [posts]);

  const handlePost = async () => {
    if (!newPost.trim()) return;

    const userPost = { author: "You", content: newPost, time: new Date().toLocaleTimeString() };
    setPosts(prev => [...prev, userPost]);
    setNewPost("");
    setLoading(true);

    try {
      const roastPrompts = [
        "Give a funny comeback",
        "Respond sarcastically but helpful",
        "Roast them lightly but end kindly",
        "Act like a chill mentor giving advice",
      ];
      const randomPrompt = roastPrompts[Math.floor(Math.random() * roastPrompts.length)];

      const aiReply = await askAI(
        `You are EdupulseAI, a witty and funny AI who hangs out with students in a community forum. ${randomPrompt} to this message: "${newPost}". Keep it short, fun, and clever.
      `);

      setPosts(prev => [
        ...prev,
        { author: "EdupulseAI 🤖", content: aiReply.trim(), time: new Date().toLocaleTimeString() },
      ]);
    } catch (err) {
      setPosts(prev => [
        ...prev,
        { author: "EdupulseAI 🤖", content: "😅 Oops! My roast circuits glitched.", time: new Date().toLocaleTimeString() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom color="primary">
        🌐 Edupulse Community Hub
      </Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Share something fun, ask AI, or roast your friend..."
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          multiline
          minRows={2}
        />
        <Box mt={2} display="flex" justifyContent="flex-end">
          <Button variant="contained" onClick={handlePost} disabled={loading}>
            {loading ? "AI typing..." : "Post"}
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ p: 2, maxHeight: "60vh", overflowY: "auto" }} ref={feedRef}>
        <List>
          {posts.map((p, i) => (
            <Box key={i} sx={{ mb: 1 }}>
              <ListItem
                alignItems="flex-start"
                sx={{
                  backgroundColor: p.author === "You" ? "#e0f7fa" : "#f3e5f5",
                  borderRadius: 2,
                  mb: 0.5,
                  p: 1,
                }}
              >
                <ListItemText
                  primary={`${p.author} (${p.time})`}
                  secondary={p.content}
                  primaryTypographyProps={{
                    fontWeight: "bold",
                    color: p.author.includes("AI") ? "secondary" : "text.primary",
                  }}
                />
              </ListItem>
            </Box>
          ))}
        </List>

        {posts.length === 0 && (
          <Typography variant="body2" color="text.secondary" align="center">
            No posts yet. Start the conversation! 👋
          </Typography>
        )}
      </Paper>
    </Box>
  );
}