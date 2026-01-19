import { Box, useTheme, useMediaQuery } from "@mui/material";
import Sidebar from "../components/Sidebar.jsx";
import Topbar from "../components/Topbar.jsx";
import { useState } from "react";
import InterviewDashboard from "../dashboards/InterviewDashboard.jsx";
import ResumeDashboard from "../dashboards/ResumeDashboard.jsx";
import CareerPredictorDashboard from "../dashboards/CareerPredictorDashboard.jsx";
import StudentAnalyticsDashboard from "../dashboards/StudentAnalyticsDashboard.jsx";
import AIMentorDashboard from "../dashboards/AIMentorDashboard.jsx";
import CourseRecommenderDashboard from "../dashboards/CourseRecommenderDashboard.jsx";
import JobTrackerDashboard from "../dashboards/JobTrackerDashboard.jsx";
import CommunityHubDashboard from "../dashboards/CommunityHubDashboard.jsx";
import CareerCounselorDashboard from "../dashboards/CareerCounselorDashboard.jsx";

export default function EdupulseLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [selected, setSelected] = useState("AI Interviewer");
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile); // Open by default on desktop, closed on mobile

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
        case "CareerFlow":
          return <CareerCounselorDashboard />

      default:
        return <h2 style={{ padding: 20 }}>🚧 Coming soon...</h2>;
    }
  };

  const handleDrawerToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", backgroundColor: "#f7f7f7", overflowX: "hidden" }}>
      <Sidebar
        onSelect={setSelected}
        isMobile={isMobile}
        open={sidebarOpen}
        onClose={handleDrawerToggle}
      />
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <Topbar
          current={selected}
          isMobile={isMobile}
          onDrawerToggle={handleDrawerToggle}
        />
        <Box sx={{ flex: 1, overflowY: "auto", overflowX: "hidden", p: isMobile ? 2 : 3 }}>
          {renderDashboard()}
        </Box>
      </Box>
    </Box>
  );
}