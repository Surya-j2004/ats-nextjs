"use client";
import { useState } from "react";
export default function ResumeReviewForm({ parsedData, onSave }) {
  const [form, setForm] = useState({
    fileName: parsedData.fileName || "",
    name: parsedData.name || "",
    email: parsedData.email || "",
    skills: Array.isArray(parsedData.skills) ? parsedData.skills.join(", ") : (parsedData.skills || ""),
    experience: parsedData.experience_years || 0,
    domain: parsedData.domain || "",
    education: parsedData.education || "",
    location: parsedData.location || "",
    summary: parsedData.summary || "",
  });
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }
  async function handleSubmit(e) {
    e.preventDefault();
    const formToSend = {
      ...form,
      skills: typeof form.skills === "string"
        ? form.skills.split(",").map(s => s.trim()).filter(Boolean)
        : form.skills,
    };
    await fetch("/api/save-reviewed-resume", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formToSend),
    });
    if (onSave) onSave();
  }
  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Review Parsed Resume Data</h2>
      {Object.entries(form).map(([key, value]) => (
        <div key={key}>
          <label className="block font-medium capitalize mb-1">{key}</label>
          <input
            name={key}
            value={value}
            onChange={handleChange}
            className="border px-2 py-1 rounded w-full"
          />
        </div>
      ))}
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Save Resume
      </button>
    </form>
  );
}
