"use client";
import React from "react";

export default function ResumeAnalysisPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        background: "linear-gradient(135deg, rgb(215, 244, 241) 0%, rgb(207, 244, 237) 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: "48px 0",
      }}
    >
      <h1
        style={{
          color: "#fff",
          fontWeight: 800,
          fontSize: "2.75rem",
          marginBottom: "36px",
          letterSpacing: "1.5px",
          textShadow: "0 6px 32px rgba(0,0,0,0.18)",
          background: "linear-gradient(90deg, #764ba2, #667eea)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        <span role="img" aria-label="analysis">📝</span> Resume Analysis
      </h1>
      <div
        style={{
          background: "rgba(255,255,255,0.25)",
          borderRadius: "28px",
          boxShadow: "0 12px 48px 0 rgba(76, 34, 158, 0.12)",
          border: "1.5px solid rgba(255,255,255,0.27)",
          padding: "48px 32px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          maxWidth: "500px",
        }}
      >
        <p
          style={{
            color: "#333",
            fontSize: "1.2rem",
            marginBottom: "32px",
            textAlign: "center",
            fontWeight: 500,
          }}
        >
          Our Resume Analysis tool is powered by advanced AI and runs in a secure environment.<br />
          Click below to open the tool in a new tab.
        </p>
        <a
          href="https://ats-python-backend-gmeesyn76du7jntamwswrs.streamlit.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="resume-analysis-link"
          style={{
            display: "inline-block",
            padding: "18px 40px",
            background: "linear-gradient(90deg,#764ba2,#43e97b)",
            color: "#fff",
            fontWeight: 700,
            fontSize: "1.25rem",
            border: "none",
            borderRadius: "2em",
            textDecoration: "none",
            boxShadow: "0 4px 24px rgba(76,34,158,0.11)",
            transition: "background 0.2s, color 0.2s",
            cursor: "pointer",
            marginBottom: "8px",
          }}
        >
          🚀 Open Resume Analysis Tool
        </a>
        
      </div>
    </div>
  );
}
