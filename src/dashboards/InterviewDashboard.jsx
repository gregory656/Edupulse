import React, { useMemo, useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  TextField,
  CircularProgress,
  Divider,
  Chip,
  Stack,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import PsychologyAltIcon from "@mui/icons-material/PsychologyAlt";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import ReplayIcon from "@mui/icons-material/Replay";
import { askAI } from "../services/openaiService.js";

const localQuestions = [
  "Tell me about yourself and your journey into tech.",
  "What’s one project you’re most proud of and why?",
  "How would you handle a disagreement in a team?",
  "What’s the difference between frontend and backend development?",
  "Explain a time you solved a tough coding problem.",
  "If you could build any app to improve campus life, what would it be?",
  "What’s your biggest strength and weakness as a developer?",
  "How would you explain AI to a 10-year-old?",
  "How do you test your code for bugs?",
  "Describe a situation when you had to learn something quickly.",
];

export default function InterviewDashboard() {
  const [mode, setMode] = useState("practice");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [userQuery, setUserQuery] = useState("");
  const [askResponse, setAskResponse] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);

  const totalAnswered = useMemo(
    () => history.filter((h) => h.type === "practice" && h.score !== null).length,
    [history]
  );

  const averageScore = useMemo(() => {
    const scores = history
      .filter((h) => h.type === "practice" && typeof h.score === "number")
      .map((h) => h.score);
    if (!scores.length) return null;
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    return Math.round(avg * 10) / 10;
  }, [history]);

  const generateQuestion = async () => {
    setLoading(true);
    setAnswer("");
    setAskResponse("");
    try {
      const q = await askAI(
        "Generate one random mixed interview question suitable for a university student preparing for tech jobs. Keep it short (one sentence)."
      );
      const cleaned = (q || "").split(/\r?\n/)[0].trim();
      if (cleaned) setQuestion(cleaned);
      else throw new Error("Empty from AI, fallback");
    } catch {
      const pick = localQuestions[Math.floor(Math.random() * localQuestions.length)];
      setQuestion(pick);
    } finally {
      setLoading(false);
    }
  };

  const handleStart = async () => {
    setStarted(true);
    setHistory([]);
    await generateQuestion();
  };

  const handleEndSession = () => {
    setStarted(false);
    setQuestion("");
    setAnswer("");
    setUserQuery("");
    setAskResponse("");
    setHistory([]);
  };

  const handleSubmitPractice = async () => {
    if (!answer.trim()) return;
    setLoading(true);
    try {
      const prompt = `
You are "EdupulseAI Interviewer" — fun, encouraging, sometimes lightly roasty, but helpful.  
Given the following interview question and candidate answer, provide a short evaluation with a numeric score from 1 to 10 and a friendly/roasty feedback message. Respond in this exact format:  

Score: X/10  
Feedback: [short feedback text]  

Question: ${question}  
Answer: ${answer}
      `;

      const aiRaw = await askAI(prompt);
      const scoreMatch = aiRaw.match(/Score:\s*(\d{1,2})/i);
      const scoreValue = scoreMatch ? Math.max(0, Math.min(10, parseInt(scoreMatch[1], 10))) : null;

      let feedbackText = aiRaw;
      if (scoreMatch) feedbackText = feedbackText.replace(scoreMatch[0], "").trim();
      feedbackText = feedbackText.replace(/^[:]?\s*Feedback\s*[:-]*/i, "").trim();

      setHistory((prev) => [
        ...prev,
        {
          type: "practice",
          question,
          answer,
          score: scoreValue,
          feedback: feedbackText,
          aiRaw,
          time: new Date().toISOString(),
        },
      ]);

      setAnswer("");
      await generateQuestion();
    } catch (err) {
      console.error("Practice submit error:", err);
      setHistory((prev) => [
        ...prev,
        {
          type: "practice",
          question,
          answer,
          score: null,
          feedback: "EdupulseAI had a small brain freeze. Try again.",
          aiRaw: null,
          time: new Date().toISOString(),
        },
      ]);
      setAnswer("");
      await generateQuestion();
    } finally {
      setLoading(false);
    }
  };

  const handleAskMode = async () => {
    if (!userQuery.trim()) return;
    setLoading(true);
    try {
      const prompt = `
You are EdupulseAI — friendly, funny, and helpful.  
Answer this user question in a concise, helpful way. Question:  
${userQuery}
      `;
      const aiRaw = await askAI(prompt);

      setHistory((prev) => [
        ...prev,
        {
          type: "ask",
          question: userQuery,
          answer: aiRaw,
          score: null,
          feedback: null,
          aiRaw,
          time: new Date().toISOString(),
        },
      ]);

      setAskResponse(aiRaw);
      setUserQuery("");
    } catch (err) {
      console.error("Ask mode error:", err);
      setAskResponse("😅 EdupulseAI tripped — try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  const switchToPractice = async () => {
    setMode("practice");
    if (!question) await generateQuestion();
  };

  const switchToAsk = () => setMode("ask");

  const recentHistory = history.slice(-6).reverse();

  return (
    <Box p={{ xs: 2, sm: 4 }} sx={{ overflowX: 'hidden' }}>
      <Typography variant="h4" color="primary" fontWeight={700} gutterBottom sx={{ wordBreak: 'break-word' }}>
        <PsychologyAltIcon sx={{ mr: 1, verticalAlign: "middle" }} />
        EdupulseAI Interviewer 🎤
      </Typography>

      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
        <Button
          variant={mode === "practice" ? "contained" : "outlined"}
          color="secondary"
          onClick={switchToPractice}
          startIcon={<ReplayIcon />}
          disabled={loading}
        >
          🎤 Practice Mode
        </Button>

        <Button
          variant={mode === "ask" ? "contained" : "outlined"}
          color="primary"
          onClick={switchToAsk}
          startIcon={<ChatBubbleIcon />}
          disabled={loading}
        >
          💬 Ask EdupulseAI
        </Button>

        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

        <Chip label={`Answered: ${totalAnswered}`} color="success" />
        <Chip
          label={averageScore !== null ? `Avg Score: ${averageScore}/10` : "Avg Score: —"}
          color={averageScore !== null ? "primary" : "default"}
        />

        <Box sx={{ flex: 1 }} />

        {!started ? (
          <Button variant="contained" color="success" onClick={handleStart}>
            Start Session 🚀
          </Button>
        ) : (
          <Button variant="outlined" color="error" onClick={handleEndSession}>
            End Session ❌
          </Button>
        )}
      </Stack>

      <Grid container spacing={3}>
        {/* Left Panel */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            {!started ? (
              <Box textAlign="center" py={6}>
                <Typography variant="h6">Hit Start to begin your session</Typography>
                <Typography color="text.secondary" sx={{ mt: 1 }}>
                  You can switch between Practice and Ask modes during the session — your progress will be saved until you end it.
                </Typography>
              </Box>
            ) : mode === "practice" ? (
              <>
                <Typography variant="h6" color="secondary" gutterBottom>
                  {loading ? "Loading..." : question || "No question available"}
                </Typography>

                <TextField
                  fullWidth
                  multiline
                  minRows={5}
                  placeholder="Type your answer here..."
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  sx={{ mt: 2 }}
                />

                <Box mt={3} display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmitPractice}
                    disabled={loading || !answer.trim()}
                    startIcon={loading ? <CircularProgress size={18} /> : null}
                    fullWidth={{ xs: true, sm: false }}
                  >
                    Submit Answer
                  </Button>

                  <Button variant="outlined" onClick={generateQuestion} disabled={loading} fullWidth={{ xs: true, sm: false }}>
                    Skip Question 🔁
                  </Button>

                  <Button variant="text" color="inherit" onClick={() => setAnswer("")} fullWidth={{ xs: true, sm: false }}>
                    Clear
                  </Button>
                </Box>
              </>
            ) : (
              <>
                <Typography variant="h6" color="secondary" gutterBottom>
                  Ask EdupulseAI anything — career tips, how to answer questions, or coding hints.
                </Typography>

                <TextField
                  fullWidth
                  multiline
                  minRows={4}
                  placeholder="E.g., How do I explain a gap in my CV?"
                  value={userQuery}
                  onChange={(e) => setUserQuery(e.target.value)}
                />

                <Box mt={3} display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAskMode}
                    disabled={loading || !userQuery.trim()}
                    startIcon={loading ? <CircularProgress size={18} /> : null}
                    fullWidth={{ xs: true, sm: false }}
                    sx={{ minHeight: { xs: 48, sm: 36 } }}
                  >
                    Ask EdupulseAI
                  </Button>

                  <Button variant="outlined" onClick={() => setUserQuery("")} fullWidth={{ xs: true, sm: false }} sx={{ minHeight: { xs: 48, sm: 36 } }}>
                    Clear
                  </Button>
                </Box>

                {askResponse && (
                  <Paper sx={{ mt: 3, p: 2, background: "#fafafa" }}>
                    <Typography variant="subtitle1" fontWeight={700}>
                      EdupulseAI says:
                    </Typography>
                    <Typography sx={{ whiteSpace: "pre-line" }}>{askResponse}</Typography>
                  </Paper>
                )}
              </>
            )}
          </Paper>
        </Grid>

        {/* Right Panel */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" color="secondary" gutterBottom>
              Session Summary
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Total practice answers: {totalAnswered}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Average score: {averageScore !== null ? `${averageScore}/10` : "—"}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" gutterBottom>
              Recent activity
            </Typography>

            {recentHistory.length ? (
              <List dense>
                {recentHistory.map((h, idx) => (
                  <ListItem key={idx} alignItems="flex-start">
                    <ListItemText
                      primary={h.type === "practice" ? `Q: ${h.question}` : `Ask: ${h.question}`}
                      secondary={
                        <>
                          {h.type === "practice" && (
                            <Typography component="span" variant="body2" color="text.primary">
                              Score: {h.score !== null ? `${h.score}/10` : "—"} —{" "}
                            </Typography>
                          )}
                          <Typography component="span" variant="body2" color="text.secondary">
                            {h.type === "practice"
                              ? h.feedback?.slice(0, 120) || "No feedback"
                              : (h.aiRaw || "").slice(0, 120)}
                            {((h.type === "practice" ? h.feedback : h.aiRaw) || "").length > 120 ? "..." : ""}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography color="text.secondary">No activity yet.</Typography>
            )}

            <Divider sx={{ my: 2 }} />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
              <Button
                size="small"
                variant="outlined"
                onClick={() => {
                  const last = [...history].reverse().find((h) => h.type === "practice");
                  if (!last) return;
                  setQuestion(last.question);
                  setAnswer(last.answer);
                  setMode("practice");
                }}
                fullWidth={{ xs: true, sm: false }}
              >
                Replay Last
              </Button>

              <Button
                size="small"
                variant="contained"
                color="secondary"
                onClick={() => {
                  const data = JSON.stringify(history, null, 2);
                  const blob = new Blob([data], { type: "application/json" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `edupulse_session_${new Date().toISOString()}.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                fullWidth={{ xs: true, sm: false }}
              >
                Export Session
              </Button>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}