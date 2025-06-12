"use client";
import { useState, useEffect } from "react";
import { Eye, Download } from "lucide-react";

export default function ResumesPage() {
  const [resumes, setResumes] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetch("/api/resumes")
      .then((res) => res.json())
      .then((data) => setResumes(data));
  }, []);

  function getStatus(resume) {
    if (resume.experience && resume.experience > 2) return "Experienced";
    return "New";
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-5xl mx-auto py-12">
        <div className="bg-gradient-to-br from-white via-blue-50 to-purple-50 rounded-2xl shadow-2xl p-4">
          <table className="min-w-full bg-white/90 rounded-xl shadow overflow-hidden">
            <thead>
              <tr className="bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100">
                <th className="px-6 py-4 text-center font-bold text-gray-700 tracking-wide">Name</th>
                <th className="px-6 py-4 text-center font-bold text-gray-700 tracking-wide">Status</th>
                <th className="px-6 py-4 text-center font-bold text-gray-700 tracking-wide">% of skills matched</th>
                <th className="px-6 py-4 text-center font-bold text-gray-700 tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {resumes.map((resume, idx) => (
                <tr
                  key={resume.id}
                  className={`transition-all duration-200 ${
                    idx % 2 === 0 ? "bg-white" : "bg-blue-50"
                  } hover:bg-pink-50`}
                >
                  <td className="px-6 py-4 text-center font-semibold flex items-center gap-2 justify-center">
                    <span className="inline-block w-2 h-2 rounded-full bg-gradient-to-br from-blue-400 to-pink-400"></span>
                    {resume.name}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-700 shadow">
                      {getStatus(resume)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={
                        resume.atsScore >= 80
                          ? "px-3 py-1 rounded-full text-sm font-bold bg-green-100 text-green-700 shadow"
                          : resume.atsScore >= 50
                          ? "px-3 py-1 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-700 shadow"
                          : "px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-600 shadow"
                      }
                    >
                      {typeof resume.atsScore === "number"
                        ? `${resume.atsScore}%`
                        : "N/A"}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-4 items-center justify-center">
                    <button
                      title="View"
                      className="hover:bg-blue-100 rounded-full p-2 transition"
                      onClick={() => setSelected(resume)}
                    >
                      <Eye size={18} />
                    </button>
                    <a
                      href={`/api/files/${resume.fileName}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:bg-pink-100 rounded-full p-2 transition"
                      title="Download"
                    >
                      <Download size={18} />
                    </a>
                  </td>
                </tr>
              ))}
              {resumes.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-gray-400">
                    No resumes found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modal for resume details */}
        {selected && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-lg w-full border-2 border-blue-200">
              <h2 className="text-2xl font-extrabold mb-4 text-blue-900">
                {selected.name}
              </h2>
              <div className="space-y-2 text-gray-700">
                <p>
                  <b>Email:</b> {selected.email}
                </p>
                <p>
                  <b>Skills:</b>{" "}
                  <span className="text-blue-600">
                    {Array.isArray(selected.skills)
                      ? selected.skills.join(", ")
                      : selected.skills}
                  </span>
                </p>
                <p>
                  <b>Experience:</b> {selected.experience}
                </p>
                <p>
                  <b>Domain:</b> {selected.domain}
                </p>
                <p>
                  <b>Education:</b> {selected.education}
                </p>
                <p>
                  <b>Location:</b> {selected.location}
                </p>
                <p>
                  <b>Summary:</b> {selected.summary}
                </p>
                <p>
                  <b>ATS Score:</b>{" "}
                  <span className="font-bold text-green-700">
                    {typeof selected.atsScore === "number"
                      ? `${selected.atsScore}%`
                      : "N/A"}
                  </span>
                </p>
                {selected.matchedSkills && (
                  <p>
                    <b>Matched Skills:</b>{" "}
                    <span className="text-blue-600">
                      {selected.matchedSkills.join(", ")}
                    </span>
                  </p>
                )}
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelected(null)}
                  className="bg-gradient-to-r from-pink-500 to-blue-500 text-white px-6 py-2 rounded shadow font-semibold hover:scale-105 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
