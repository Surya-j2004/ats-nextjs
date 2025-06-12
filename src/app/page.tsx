"use client";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 px-4 relative overflow-hidden">
      {/* Animated background shapes */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-white/10 rounded-full blur-3xl z-0 animate-pulse"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-white/10 rounded-full blur-3xl z-0 animate-pulse"></div>
      {/* Main card */}
      <div className="w-full max-w-md bg-white/95 backdrop-blur-lg rounded-2xl p-10 shadow-2xl flex flex-col items-center relative z-10">
        {/* Logo */}
        <div className="mb-4">
          <img
            src="/logo.png" 
            alt="App Logo"
            className="w-16 h-16 rounded-full shadow-lg border-2 border-white"
          />
        </div>
        {/* Welcome */}
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Welcome Back!</h1>
        <p className="text-center text-gray-500 mb-4">
          Sign in to access your dashboard and manage your journey.
        </p>
        {/* Optional: Illustration */}
        <div className="mb-6">
          <img
            src="/login-svgrepo-com.svg" 
            alt="Login Illustration"
            className="w-32 h-24 object-contain"
          />
        </div>
        {/* Google Sign-In Button */}
        <button
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-full text-base font-semibold bg-white border border-gray-300 shadow hover:shadow-lg transition-all duration-200 focus:ring-2 focus:ring-blue-400"
          style={{ color: "#1a1a1a" }}
        >
          <svg className="w-6 h-6" viewBox="0 0 48 48">
            <g>
              <path fill="#4285F4" d="M44.5 20H24v8.5h11.7C34.7 32.1 30.2 35 24 35c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.1 8.1 3l6.4-6.4C34.1 4.5 29.4 2.5 24 2.5 12.8 2.5 3.5 11.8 3.5 23S12.8 43.5 24 43.5c10.7 0 19.3-7.7 19.3-19.3 0-1.3-.1-2.3-.3-3.2z"/>
              <path fill="#34A853" d="M6.3 14.7l7 5.1C15.2 17.1 19.3 14 24 14c3.1 0 5.9 1.1 8.1 3l6.4-6.4C34.1 4.5 29.4 2.5 24 2.5c-7.6 0-14.1 4.3-17.7 10.7z"/>
              <path fill="#FBBC05" d="M24 43.5c5.8 0 10.7-1.9 14.3-5.2l-6.6-5.4c-2 1.6-4.6 2.6-7.7 2.6-6.1 0-11.3-4.1-13.2-9.7l-7 5.4C7.8 39.2 15.3 43.5 24 43.5z"/>
              <path fill="#EA4335" d="M44.5 20H24v8.5h11.7c-1.1 3-3.5 5.3-6.6 6.5l6.6 5.4c3.9-3.6 6.3-9 6.3-15.4 0-1.3-.1-2.3-.3-3.2z"/>
            </g>
          </svg>
          Sign in with Google
        </button>
        {/* Security/Privacy Note */}
        <div className="mt-6 text-center text-gray-400 text-xs">
          <span className="inline-flex items-center gap-1">
            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 11V17M12 7H12.01M21 12.37V12a9 9 0 10-6.219 8.563"/>
            </svg>
            Only Google sign-in is supported for your security.
          </span>
        </div>
        {/* Footer */}
        <div className="mt-8 text-center text-gray-300 text-xs">
          Need help? <a href="/support" className="underline hover:text-blue-500">Contact support</a>
        </div>
      </div>
    </div>
  );
}
