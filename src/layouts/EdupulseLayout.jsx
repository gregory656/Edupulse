import { Box } from "@mui/material";
import Sidebar from "../components/Sidebar.jsx";
import Topbar from "../components/Topbar.jsx";
import { useState } from "react";
import InterviewDashboard from "../dashboards/InterviewDashboard.jsx";
import { motion, AnimatePresence } from "framer-motion";
import ResumeDashboard from "../dashboards/ResumeDashboard.jsx";
import CareerPredictorDashboard from "../dashboards/CareerPredictorDashboard.jsx";
import StudentAnalyticsDashboard from "../dashboards/StudentAnalyticsDashboard.jsx";
import AIMentorDashboard from "../dashboards/AIMentorDashboard.jsx";
import CourseRecommenderDashboard from "../dashboards/CourseRecommenderDashboard.jsx";
import JobTrackerDashboard from "../dashboards/JobTrackerDashboard.jsx";
import CommunityHubDashboard from "../dashboards/CommunityHubDashboard.jsx";

export default function EdupulseLayout() {
  const [selected, setSelected] = useState("AI Interviewer");

  const renderDashboard = () => {
    switch (selected) {
      case "AI Interviewer":
        return <InterviewDashboard />;
        case "Smart CV Builder":
          return <ResumeDashboard />
        case "Career Predictor":
          return <CareerPredictorDashboard />
        case "Student Analytics":
          return <StudentAnalyticsDashboard />
        case "AI Mentor":
         return <AIMentorDashboard />
        case "Course Recommender":
          return <CourseRecommenderDashboard />
        case "Job Tracker":
          return <JobTrackerDashboard />
        case "Community Hub":
        return<CommunityHubDashboard />
      
      default:
        return <h2 style={{ padding: 20 }}>🚧 Coming soon...</h2>;
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", backgroundColor: "#f7f7f7" }}>
      <Sidebar onSelect={setSelected} />
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Topbar current={selected} />
        <Box sx={{ flex: 1, overflowY: "auto", p: 3 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={selected}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {renderDashboard()}
            </motion.div>
          </AnimatePresence>
        </Box>
      </Box>
    </Box>
  );
}