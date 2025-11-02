import React from "react";
import EdupulseLayout from "./layouts/EdupulseLayout.jsx";

export default function App() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(to bottom right, rgba(106,13,173,0.1), rgba(30,144,255,0.1))",
      }}
    >
      <EdupulseLayout />
    </div>
  );
}