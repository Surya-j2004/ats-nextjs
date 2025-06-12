"use client";
import { useState } from "react";
import ResumeReviewForm from "@/components/ResumeReviewForm";

export default function ResumeUpload({ onUpload }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [parsed, setParsed] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload-resume", { 
        method: "POST", 
        body: formData 
      });
      const data = await res.json();
      
      if (res.ok) {
        setParsed(data); // Show human review form
        setFile(null);
      } else {
        setError(data.error || "Parsing failed");
      }
    } catch (err) {
      setError("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Step 2: Show human review form if parsed data is available
  if (parsed) {
    return (
      <ResumeReviewForm
        parsedData={parsed}
        onSave={() => {
          setParsed(null);
          if (onUpload) onUpload();
          alert("Resume saved successfully!");
        }}
      />
    );
  }

  // Step 3: Show upload form if not reviewing
  return (
    <form onSubmit={handleSubmit} className="flex gap-4 items-center mb-8">
      <input
        type="file"
        accept=".pdf"
        onChange={e => setFile(e.target.files[0])}
        required
        className="border rounded px-2 py-1"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Uploading..." : "Upload Resume"}
      </button>
     
      {error && <span className="text-red-500 ml-2">{error}</span>}
    </form>
  );
}