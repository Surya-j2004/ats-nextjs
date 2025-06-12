"use client";
import { useState } from "react";

export default function SetJDPage() {
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState(""); // New state for required skills
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const title = "Job Description";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // Convert comma-separated string to array, trim spaces
    const requiredSkills = skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      const response = await fetch("/api/job-descriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          requiredSkills,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: "JD saved successfully!" });
        setDescription("");
        setSkills(""); // Clear skills input
      } else {
        setMessage({ type: "error", text: data.error || "Failed to save JD" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f6f8fc]">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-xl flex flex-col items-stretch"
      >
        <h1 className="text-3xl font-bold mb-8 text-center flex items-center gap-2">
          <span role="img" aria-label="doc" className="text-blue-600">📝</span>
          Create New Job Description
        </h1>

        <label className="block text-lg font-medium text-gray-700 mb-2">
          Job Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full h-32 p-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 text-gray-800 text-base mb-4 resize-none"
          placeholder="should be experienced in web development."
          required
        />

        <label className="block text-lg font-medium text-gray-700 mb-2">
          Required Skills <span className="text-gray-400 text-base"></span>
        </label>
        <input
          type="text"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          className="w-full p-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 text-gray-800 text-base mb-8"
          placeholder="e.g. Node JS, React, MongoDB"
          required
        />

        <button
          type="submit"
          disabled={loading || !description.trim() || !skills.trim()}
          className="w-full py-3 rounded-lg text-white text-lg font-semibold bg-gradient-to-r from-blue-400 to-purple-400 transition-all disabled:opacity-60 disabled:cursor-not-allowed mb-2"
        >
          {loading ? "Saving..." : "Save Job Description"}
        </button>

        {message && (
          <div
            className={`mt-2 text-center font-medium ${
              message.type === "success"
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {message.text}
          </div>
        )}
      </form>
    </div>
  );
}
