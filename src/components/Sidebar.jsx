import { Box, List, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import { motion } from "framer-motion";
import PsychologyAltIcon from "@mui/icons-material/PsychologyAlt";
import DescriptionIcon from "@mui/icons-material/Description";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import SchoolIcon from "@mui/icons-material/School";
import ChatIcon from "@mui/icons-material/Chat";
import WorkIcon from "@mui/icons-material/Work";
import GroupIcon from "@mui/icons-material/Group";
import { useState } from "react";

const items = [
  { text: "AI Interviewer", icon: <PsychologyAltIcon /> },
  { text: "Smart CV Builder", icon: <DescriptionIcon /> },
  { text: "Career Predictor", icon: <TrendingUpIcon /> },
  { text: "Student Analytics", icon: <SchoolIcon /> },
  { text: "AI Mentor", icon: <ChatIcon /> },
  { text: "Course Recommender", icon: <SchoolIcon /> },
  { text: "Job Tracker", icon: <WorkIcon /> },
  { text: "Community Hub", icon: <GroupIcon /> },
];

export default function Sidebar({ onSelect }) {
  const [active, setActive] = useState("AI Interviewer");

  const handleClick = (item) => {
    setActive(item.text);
    onSelect(item.text);
  };

  return (
    <motion.div
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Box
        sx={{
          width: 240,
          height: "100vh",
          background: "linear-gradient(180deg, #6A0DAD, #1E90FF)",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          p: 2,
          boxShadow: "2px 0 10px rgba(0,0,0,0.15)",
        }}
      >
        <Typography
          variant="h5"
          fontWeight={800}
          mb={3}
          textAlign="center"
          sx={{
            background: "linear-gradient(90deg, #fff, #32CD32, #fff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            animation: "shine 3s linear infinite",
            "@keyframes shine": {
              "0%": { backgroundPosition: "0 0" },
              "100%": { backgroundPosition: "200px 0" },
            },
          }}
        >
          Edupulse
        </Typography>

        <List>
          {items.map((item) => (
            <motion.div
              key={item.text}
              whileHover={{ scale: 1.05, x: 8 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <ListItemButton
                onClick={() => handleClick(item)}
                sx={{
                  borderRadius: 2,
                  mb: 1,
                  backgroundColor:
                    active === item.text
                      ? "rgba(255,255,255,0.2)"
                      : "transparent",
                  position: "relative",
                  overflow: "hidden",
                  "&:before": {
                    content: '""',
                    position: "absolute",
                    left: 0,
                    top: 0,
                    width: "100%",
                    height: "100%",
                    background:
                      active === item.text
                        ? "linear-gradient(90deg, rgba(255,255,255,0.3), rgba(106,13,173,0.2), rgba(255,255,255,0.3))"
                        : "transparent",
                    opacity: 0,
                    transition: "opacity 0.4s ease",
                  },
                  "&:hover:before": {
                    opacity: 1,
                  },
                  "&:hover": {
                    boxShadow: "0 0 10px rgba(255,255,255,0.3)",
                    transform: "translateX(5px)",
                  },
                  "&.Mui-selected": {
                    backgroundColor: "rgba(255,255,255,0.3)",
                  },
                }}
              >
                <ListItemIcon sx={{ color: "white" }}>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: active === item.text ? 700 : 500,
                  }}
                />
              </ListItemButton>
            </motion.div>
          ))}
        </List>
      </Box>
    </motion.div>
  );
}