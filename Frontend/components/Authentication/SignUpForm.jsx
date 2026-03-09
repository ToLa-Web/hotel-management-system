"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiMail, FiLock, FiUser, FiArrowRight } from "react-icons/fi";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { authService } from "@/lib/authService";

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (formData.password !== formData.password_confirmation) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const result = await authService.register(formData);

      if (result.success) {
        router.push("/login");
      } else {
        setError(result.error || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "An error occurred during registration");
    } finally {
      setIsLoading(false);
    }
  };

  const handleProviderSignIn = (provider) => {
    if (provider === "google") {
      const apiUrl = process.env.NEXT_PUBLIC_LARAVEL_API_URL || "http://localhost:8000";
      window.location.href = `${apiUrl}/api/auth/google/redirect`;
      return;
    }
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-white/25 outline-none transition focus:border-[#c4a96a]/50 focus:ring-1 focus:ring-[#c4a96a]/30 disabled:opacity-50";

  return (
    <div className="relative z-10 w-full max-w-md mx-4">
      {/* Card */}
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl overflow-hidden">
        {/* Gold accent bar */}
        <div className="h-1 bg-gradient-to-r from-[#857749] via-[#c4a96a] to-[#857749]" />

        <div className="p-8 sm:p-10">
          {/* Header */}
          <div className="text-center mb-7">
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Create <span className="text-[#c4a96a]">Account</span>
            </h1>
            <p className="mt-2 text-sm text-white/50">
              Join Paradise View and start your journey
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 flex items-center gap-3 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-white/40 mb-2">
                Full Name
              </label>
              <div className="relative">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-[#c4a96a]/60" size={18} />
                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  placeholder="John Doe"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-white/40 mb-2">
                Email
              </label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#c4a96a]/60" size={18} />
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  placeholder="your@email.com"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-white/40 mb-2">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#c4a96a]/60" size={18} />
                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  placeholder="••••••••"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-white/40 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#c4a96a]/60" size={18} />
                <input
                  name="password_confirmation"
                  type="password"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  placeholder="••••••••"
                  className={inputClass}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="group w-full flex items-center justify-center gap-2 rounded-xl bg-[#857749] py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#857749]/20 transition hover:bg-[#9a8a56] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-1"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <FiArrowRight className="transition-transform group-hover:translate-x-1" size={16} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-transparent px-4 text-xs text-white/30 backdrop-blur-sm">
                or continue with
              </span>
            </div>
          </div>

          {/* Social */}
          <div className="grid grid-cols-2 gap-3">
            <button
              disabled={isLoading}
              onClick={() => handleProviderSignIn("google")}
              className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-3 text-sm text-white/70 transition hover:bg-white/10 hover:border-white/20 disabled:opacity-50"
            >
              <FcGoogle size={18} />
              Google
            </button>
            <button
              disabled={isLoading}
              onClick={() => handleProviderSignIn("github")}
              className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-3 text-sm text-white/70 transition hover:bg-white/10 hover:border-white/20 disabled:opacity-50"
            >
              <FaGithub size={18} />
              GitHub
            </button>
          </div>

          {/* Footer link */}
          <p className="mt-7 text-center text-sm text-white/40">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[#c4a96a] hover:text-[#ddc07f] transition-colors font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
