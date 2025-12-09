"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { verifyOtpAction } from "~/server/auth/cookies";

export default function VerifyPageClient() {
  const params = useSearchParams();
  const router = useRouter();

  const email = params.get("email") ?? "";
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleVerify = async () => {
    setLoading(true);
    setError("");

    try {
      await verifyOtpAction(email, otp);
      router.push("/dashboard");
    }catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("OTP verification failed");
      }
    }
     finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold">Verify OTP</h1>
      <p className="mt-2 text-gray-600">OTP sent to: {email}</p>

      <input
        type="text"
        placeholder="Enter OTP"
        className="border p-2 mt-4 w-full"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />

      {error && <p className="text-red-500 mt-2">{error}</p>}

      <button
        onClick={handleVerify}
        className="bg-sky-600 text-white p-2 mt-4 w-full"
        disabled={loading}
      >
        {loading ? "Verifying..." : "Verify OTP"}
      </button>
    </main>
  );
}
