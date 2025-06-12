"use client";
import { useEffect, useState } from "react";


export default function OfferLettersPage() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState(false);
  const [offerLetters, setOfferLetters] = useState([]);

  useEffect(() => {
    // Load shortlisted candidates from localStorage
    const stored = localStorage.getItem("shortlistedResumes");
    if (stored) {
      const parsed = JSON.parse(stored);
      setOfferLetters(parsed.map((c, i) => ({
        id: c.id || i + 1,
        name: c.name || c,
        position: c.position || "Shortlisted Candidate",
        date: new Date().toISOString().slice(0, 10),

        status: c.status || "Accepted",


        email: c.email || "unknown@example.com",
        phone: c.phone || "N/A"
      })));
    } else {
      setOfferLetters([]);
    }
  }, []);

  // Filtered list based on search
  const filtered = offerLetters.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.position.toLowerCase().includes(search.toLowerCase()) ||
      item.status.toLowerCase().includes(search.toLowerCase())
  );

  // Send offer letter via API
  async function handleSendOfferLetter(candidate) {
    try {
      const res = await fetch("/api/send-offer-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: candidate.id,
          email: candidate.email,
          name: candidate.name,
          position: candidate.position
        }),
      });
      const data = await res.json();
      if (data.success) {
        setToast(true);
        setTimeout(() => setToast(false), 2000);
      } else {
        alert(`Failed to send email: ${data.error}`);
      }
    } catch (error) {
      console.error("Email sending error:", error);
      alert("Failed to send offer letter. Please check the console.");
    }
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 px-4 py-8">
      <div className="max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Offer Letters</h1>
      <div className="mb-6 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search..."
          className="border-2 border-blue-200 rounded-xl px-4 py-3 w-80 shadow-lg focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all duration-300"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <div className="w-full overflow-x-auto">
      <table className="w-full bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100">
  <thead>
    <tr className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white">
      <th className="px-6 py-4 text-left font-semibold text-white shadow-inner">Name</th>
      <th className="px-6 py-4 text-left font-semibold text-white shadow-inner">Position</th>
      <th className="px-6 py-4 text-left font-semibold text-white shadow-inner">Date</th>
      <th className="px-6 py-4 text-left font-semibold text-white shadow-inner">Status</th>
      <th className="px-6 py-4 text-left font-semibold text-white shadow-inner">Actions</th>
    </tr>
  </thead>
  <tbody>
    {filtered.length > 0 ? (
      filtered.map((item, idx) => (
        <tr
          key={item.id}
          className={`transition-all duration-300 hover:shadow-lg hover:bg-gradient-to-r hover:from-blue-50 hover:via-purple-50 hover:to-pink-50 ${
            idx % 2 === 0 ? "bg-white" : "bg-gradient-to-r from-gray-50 to-blue-50"
          }`}
        >
          <td className="px-6 py-4 font-semibold flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 mr-2 shadow-lg animate-pulse"></span>
            <span className="text-gray-800">{item.name}</span>
          </td>
          <td className="px-6 py-4 text-gray-700 font-medium">{item.position}</td>
          <td className="px-6 py-4">
            <span className="inline-block bg-gradient-to-r from-gray-100 to-gray-200 px-3 py-2 rounded-lg text-xs font-mono text-gray-700 shadow-md border border-gray-200">
              {item.date}
            </span>
          </td>
          <td className="px-6 py-4">
            <span
              className={
                item.status === "Accepted"
                  ? "bg-gradient-to-r from-emerald-400 to-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg transform hover:scale-105 transition-transform duration-200"
                  : "bg-gradient-to-r from-blue-400 to-indigo-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg transform hover:scale-105 transition-transform duration-200"
              }
            >
              {item.status}
            </span>
          </td>
          <td className="px-6 py-4 flex gap-2 items-center">
            <button
              onClick={() => handleSendOfferLetter(item)}
              className="hover:bg-gradient-to-r hover:from-blue-400 hover:to-blue-500 hover:text-white bg-blue-100 text-blue-600 rounded-full p-3 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110"
              title="Send Offer Letter"
            >
              <Mail size={18} />
            </button>
            <button
              onClick={() => setSelected(item)}
              className="hover:bg-gradient-to-r hover:from-purple-400 hover:to-purple-500 hover:text-white bg-purple-100 text-purple-600 rounded-full p-3 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110"
              title="View Details"
            >
              <MoreVertical size={18} />
            </button>
          </td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan={5} className="text-center py-12 text-gray-500 bg-gradient-to-r from-gray-50 to-blue-50">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-xl">📄</span>
            </div>
            <span className="text-lg font-medium">No shortlisted candidates found.</span>
          </div>
        </td>
      </tr>
    )}
  </tbody>
      </table>
      </div>
      </div>

      {/* Modal for candidate details */}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-lg w-full border-2 border-gray-100 transform transition-all duration-300">
            <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 -m-8 mb-6 p-6 rounded-t-2xl">
              <h2 className="text-2xl font-bold text-white">{selected.name}</h2>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                <p className="text-gray-600 text-sm font-semibold">EMAIL</p>
                <p className="text-gray-800 font-medium">{selected.email}</p>
              </div>
              
              <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100">
                <p className="text-gray-600 text-sm font-semibold">POSITION</p>
                <p className="text-gray-800 font-medium">{selected.position}</p>
              </div>
              
              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100">
                <p className="text-gray-600 text-sm font-semibold">STATUS</p>
                <p className="text-gray-800 font-medium">{selected.status}</p>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelected(null)}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast notification for mail sent */}
      {toast && (
        <div className="fixed bottom-8 right-8 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-xl shadow-2xl z-50 border border-green-400 transform animate-bounce">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 bg-white rounded-full animate-ping"></span>
            <span className="font-semibold">Offer letter sent!</span>
          </div>
        </div>
      )}
    </div>
  );
}
