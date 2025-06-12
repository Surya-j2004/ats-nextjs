"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function AcceptOfferPage() {
  const searchParams = useSearchParams();
  const candidateId = searchParams.get("candidateId");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (candidateId) {
      fetch("/api/accept-offer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ candidateId }),
      }).then(() => setSuccess(true));
    }
  }, [candidateId]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      {success ? (
        <div className="text-2xl font-bold text-green-700">
          Thank you! Your offer letter has been accepted. You will receive your joining letter soon.
        </div>
      ) : (
        <div className="text-lg text-blue-700">Accepting your offer...</div>
      )}
    </div>
  );
}
