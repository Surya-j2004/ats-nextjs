"use client";
import { useEffect, useState } from "react";
import ResumeUpload from "@/components/ResumeUpload";

export default function ViewResumesPage() {
  const [resumes, setResumes] = useState([]);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    fetch("/api/resumes")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setResumes(data);
        } else if (Array.isArray(data.resumes)) {
          setResumes(data.resumes);
        } else {
          setResumes([]);
        }
      });
  }, [refresh]);

  return (
    <div className="flex justify-left">
      <div className="max-w-4xl mx-auto py-12">
        <h1 className="text-3xl font-bold mb-6 text-blue-900">Uploaded Resumes</h1>
        <ResumeUpload onUpload={() => setRefresh(r => r + 1)} />
        <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-2xl shadow-lg p-2">
          <table className="min-w-full bg-white rounded-xl shadow overflow-hidden">
            <thead>
              <tr className="bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100">
                <th className="px-6 py-4 text-left font-semibold text-gray-700">Name</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-700">Skills</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-700">Experience</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-700">Domain</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-700">Education</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-700">Location</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-700">Summary</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-700">File</th>
              </tr>
            </thead>
            <tbody>
              {(Array.isArray(resumes) ? resumes : []).map((resume, idx) => (
                <tr
                  key={resume.id}
                  className={`transition-all duration-200 ${
                    idx % 2 === 0 ? "bg-white" : "bg-blue-50"
                  } hover:bg-purple-50`}
                >
                  <td className="px-6 py-4 font-semibold flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-gradient-to-br from-blue-400 to-pink-400 mr-2"></span>
                    {resume.name}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-mono">
                      {Array.isArray(resume.skills) ? resume.skills.join(", ") : resume.skills}
                    </span>
                  </td>
                  <td className="px-6 py-4">{resume.experience}</td>
                  <td className="px-6 py-4">{resume.domain}</td>
                  <td className="px-6 py-4">{resume.education}</td>
                  <td className="px-6 py-4">{resume.location}</td>
                  <td className="px-6 py-4">{resume.summary}</td>
                  <td className="px-6 py-4">
                    <a
                      href={`/api/files/${resume.fileName}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 font-semibold underline hover:text-pink-600 transition"
                    >
                      View PDF
                    </a>
                  </td>
                </tr>
              ))}
              {(Array.isArray(resumes) && resumes.length === 0) && (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-gray-400">
                    No resumes found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
