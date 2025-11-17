"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SignInRequiredPage() {
  const router = useRouter();
  useEffect(() => {
    // Clear any residual auth state
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("selectedProgram");
    } catch {}
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-md border border-bd p-8 text-center">
        <div className="mb-4">
          <i className="fa-solid fa-lock text-4xl text-primary"></i>
        </div>
        <h1 className="text-2xl font-bold text-font-base mb-2">Sign-in Required</h1>
        <p className="text-font-detail mb-6">
          Your session has ended. Please sign in again to continue.
        </p>
        <button
          onClick={() => router.push("/")}
          className="w-full bg-primary hover:bg-primary-light text-white px-4 py-3 rounded-lg font-medium transition-colors"
        >
          Go to Sign In
        </button>
      </div>
    </div>
  );
}
