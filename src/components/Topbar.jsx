import { AppBar, Toolbar, Typography, Avatar, Box, IconButton } from "@mui/material";
import { motion } from "framer-motion";
import MenuIcon from "@mui/icons-material/Menu";

export default function Topbar({ current, isMobile, onDrawerToggle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <AppBar
        position="static"
        color="transparent"
        elevation={0}
        sx={{
          background:
            "linear-gradient(90deg, rgba(106,13,173,0.05), rgba(30,144,255,0.05))",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 0 10px rgba(106,13,173,0.2)",
          animation: "glowBar 3s ease-in-out infinite alternate",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={onDrawerToggle}
              sx={{ mr: 2, position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography
            variant="h6"
            color="primary"
            fontWeight={700}
            sx={{
              textShadow: "0 0 5px rgba(106,13,173,0.3)",
            }}
          >
            {current}
          </Typography>

          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="body1" color="text.secondary">
              Welcome, Stephen 😎
            </Typography>

            <motion.div
              whileHover={{ rotate: 360, scale: 1.2 }}
              transition={{ duration: 0.6 }}
            >
              <Avatar
                sx={{
                  bgcolor: "primary.main",
                  boxShadow: "0 0 10px rgba(106,13,173,0.4)",
                  transition: "all 0.3s ease",
                }}
              >
                S
              </Avatar>
            </motion.div>
          </Box>
        </Toolbar>
      </AppBar>
    </motion.div>
  );
}
