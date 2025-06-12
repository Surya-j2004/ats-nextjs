"use client";
import Sidebar from "./sidebar"; // adjust import path as needed
import Link from "next/link";
import { useEffect, useState } from "react";



export default function Dashboard() {

    const [counts, setCounts] = useState({
    resumes: 0,
    offerLetters: 0,
    joiningLetters: 0
  });

  useEffect(() => {
    fetch("/api/dashboard-counts")
      .then(res => res.json())
      .then(setCounts);
  }, []);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main
        className="flex-1 relative bg-gradient-to-br from-[#181A20] via-[#2B2540] to-[#2C1C4D] overflow-auto"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 50% 30%, rgba(99, 102, 241, 0.35) 0%, rgba(79, 70, 229, 0.25) 40%, transparent 80%), radial-gradient(ellipse at 80% 80%, rgba(236, 72, 153, 0.2) 0%, transparent 70%), radial-gradient(ellipse at 20% 80%, rgba(34, 197, 94, 0.15) 0%, transparent 70%)"

        }}
      >
        {/* Optional: Add a starfield or glowing overlay here for extra effect */}

        <div className="relative z-10 flex flex-col items-center justify-center h-full py-24 px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-12 text-center drop-shadow-lg">
            Welcome to your<br />
            ATS Resume Hiring System
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 w-full max-w-6xl">
            {/* Card 1 */}
            <div className="rounded-2xl p-8 bg-white/10 border border-blue-400/30 shadow-lg backdrop-blur-md flex flex-col items-start text-black hover:shadow-blue-500/30 transition">
            <Link href="./dashboard/resumes"
            className="text-lg font-semibold mb-2 cursor-pointer hover:text-blue-400 transition-colors">
                Resumes
            </Link>

              <div className="text-4xl font-extrabold mb-1">{counts.resumes}</div>

              <div className="text-base opacity-80">Total resumes in system</div>
            </div>
            {/* Card 2 */}
            <div className="rounded-2xl p-8 bg-white/10 border border-cyan-400/30 shadow-lg backdrop-blur-md flex flex-col items-start text-black hover:shadow-cyan-400/20 transition">
            <Link href="./dashboard/requirements"
            
               className="text-lg font-semibold mb-2 cursor-pointer hover:text-blue-400 transition-colors">Requirements
              </Link>
              <div className="text-4xl font-extrabold mb-1">7</div>
              <div className="text-base opacity-80">Active job requirements</div>
            </div>
            {/* Card 3 */}
            <div className="rounded-2xl p-8 bg-white/10 border border-pink-400/30 shadow-lg backdrop-blur-md flex flex-col items-start text-black hover:shadow-pink-400/20 transition">
            <Link href="./dashboard/offer-letters"

               className="text-lg font-semibold mb-2 cursor-pointer hover:text-blue-400 transition-colors">Offer Letters
            </Link>
              <div className="text-4xl font-extrabold mb-1">1</div>
              <div className="text-base opacity-80">Offer letters</div>
            </div>
            {/* Card 4 */}
            <div className="rounded-2xl p-8 bg-white/10 border border-purple-400/30 shadow-lg backdrop-blur-md flex flex-col items-start text-black hover:shadow-purple-400/20 transition">
            <Link href="./dashboard/joining-letters"

               className="text-lg font-semibold mb-2 cursor-pointer hover:text-blue-400 transition-colors">Joining Letters
            </Link>   
              <div className="text-4xl font-extrabold mb-1">1</div>
              <div className="text-base opacity-80">Accepted offers pending joining</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
