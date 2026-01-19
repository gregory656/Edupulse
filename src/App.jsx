import React from "react";
import EdupulseLayout from "./layouts/EdupulseLayout.jsx";
import { ErrorBoundary } from "./components/ErrorBoundary.jsx";
import { CustomThemeProvider } from "./contexts/ThemeContext.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { NotificationProvider } from "./components/NotificationToast.jsx";

export default function App() {
  return (
    <ErrorBoundary>
      <CustomThemeProvider>
        <AuthProvider>
          <NotificationProvider>
            <div
              style={{
                minHeight: "100vh",
                background:
                  "linear-gradient(to bottom right, rgba(106,13,173,0.1), rgba(30,144,255,0.1))",
              }}
            >
              <EdupulseLayout />
            </div>
          </NotificationProvider>
        </AuthProvider>
      </CustomThemeProvider>
    </ErrorBoundary>
  );
}