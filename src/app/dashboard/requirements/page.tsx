"use client";
import { useState } from "react";
import { ChevronDown, X } from "lucide-react";

export default function SetRequirementsPage() {
  const [jobTitle, setJobTitle] = useState("");
  const [domain, setDomain] = useState("");
 
  const [skills] = useState([]);
  const [edu, setEdu] = useState("");
  const [exp, setExp] = useState("");
  const [location, setLocation] = useState("");
  const [shortlisted, setShortlisted] = useState([]);
  const [showModal, setShowModal] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    const requiredSkills = skills.split(",").map(s => s.trim()).filter(Boolean);

    // Only shortlist resumes, do NOT save JD to DB
    const reqObj = {
      jobTitle,
      domain,
      skills: requiredSkills,
      edu,
      exp,
      location,
    };
    const shortlistRes = await fetch("/api/shortlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reqObj),
    });
    const data = await shortlistRes.json();

    setShortlisted(Array.isArray(data.shortlisted) ? data.shortlisted : []);
    localStorage.setItem(
      "shortlistedResumes",
      JSON.stringify(Array.isArray(data.shortlisted) ? data.shortlisted : [])
    );
    setShowModal(true);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_center,_#e0e7ff_0%,_#c7d2fe_50%,_#a5b4fc_100%)] px-4 py-12">
      <div className="w-full max-w-2xl bg-white/95 rounded-3xl shadow-2xl p-10 border border-blue-100">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block font-semibold text-gray-700 mb-1">Job Title</label>
              <input
                type="text"
                placeholder="e.g. Frontend Developer"
                className="w-full rounded-xl border border-blue-200 bg-blue-50/60 px-4 py-3 text-base focus:outline-none focus:border-blue-400 transition"
                value={jobTitle}
                onChange={e => setJobTitle(e.target.value)}
                required
              />
            </div>
            <div className="flex-1">
              <label className="block font-semibold text-gray-700 mb-1">Domain</label>
              <input
                type="text"
                placeholder="e.g. Web Development"
                className="w-full rounded-xl border border-purple-200 bg-purple-50/60 px-4 py-3 text-base focus:outline-none focus:border-purple-400 transition"
                value={domain}
                onChange={e => setDomain(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <label className="block font-semibold text-gray-700 mb-1">Education Qualification</label>
              <select
                className="w-full rounded-xl border border-blue-200 bg-blue-50/60 px-4 py-3 text-base appearance-none focus:outline-none focus:border-blue-400 transition"
                value={edu}
                onChange={e => setEdu(e.target.value)}
                required
              >
                <option value="">Select education level</option>
                <option>Bachelor's Degree</option>
                <option>Master's Degree</option>
                <option>PhD</option>
                <option>Diploma</option>
                <option>UG</option>
                <option>PG</option>
                <option>Other</option>
              </select>
              <ChevronDown className="absolute right-4 top-10 text-blue-300 pointer-events-none" size={18} />
            </div>
            <div className="flex-1 relative">
              <label className="block font-semibold text-gray-700 mb-1">Experience Level</label>
              <select
                className="w-full rounded-xl border border-purple-200 bg-purple-50/60 px-4 py-3 text-base appearance-none focus:outline-none focus:border-purple-400 transition"
                value={exp}
                onChange={e => setExp(e.target.value)}
                required
              >
                <option value="">Select experience level</option>
                <option>0</option>
                <option>1 year</option>
                <option>2 years</option>
                <option>3 years</option>
                <option>4 years</option>
                <option>5 years</option>
                <option>6 years</option>
                <option>7 years</option>
                <option>8 years</option>
                <option>9 years</option>
                <option>10 years</option>
              </select>
              <ChevronDown className="absolute right-4 top-10 text-purple-300 pointer-events-none" size={18} />
            </div>
          </div>
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Location</label>
            <input
              type="text"
              placeholder="e.g. New York, NY"
              className="w-full rounded-xl border border-green-200 bg-green-50/60 px-4 py-3 text-base focus:outline-none focus:border-green-400 transition"
              value={location}
              onChange={e => setLocation(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 mt-2 rounded-xl font-bold text-white text-lg bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-md hover:shadow-lg transition"
          >
            Save Requirements
          </button>
        </form>
      </div>

      {/* Modal for shortlisted resumes */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-8 relative border border-blue-200">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
              onClick={() => setShowModal(false)}
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold mb-4 text-blue-700">Shortlisted Resumes</h2>
            {shortlisted.length > 0 ? (
              <ul className="space-y-2">
                {shortlisted.map((resume) => (
                  <li key={resume.id} className="text-lg font-semibold text-gray-800">
                    {resume.name}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-gray-500 text-lg">No resumes matched your requirements.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
