"use client";
import { useState, useEffect } from "react";

export default function ShortlistedResumesPage() {
  const [setResumes] = useState([]);

  useEffect(() => {
    fetch("/api/shortlisted-resumes")
      .then(res => res.json())
      .then(setResumes);
  }, []);

  return (
    <div>
      <h1>Shortlisted Resumes</h1>
      {/* Render resumes in a table, just like your main resumes page */}
    </div>
  );
}
