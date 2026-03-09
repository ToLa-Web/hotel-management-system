"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { authService } from "@/lib/authService";

export default function GoogleCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState("Processing your login...");

  useEffect(() => {
    const accessToken = searchParams.get("access_token");
    const refreshToken = searchParams.get("refresh_token");

    if (!accessToken || !refreshToken) {
      setStatus("Login failed. Redirecting...");
      setTimeout(() => router.push("/login"), 2000);
      return;
    }

    // Store tokens
    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("token", accessToken);
    localStorage.setItem("refresh_token", refreshToken);
    document.cookie = `access_token=${accessToken}; path=/; secure; samesite=strict; max-age=${7 * 24 * 60 * 60}`;

    // Fetch profile and redirect
    const completeLogin = async () => {
      try {
        const profileData = await authService.userProfile();
        if (profileData?.user) {
          localStorage.setItem("user", JSON.stringify(profileData.user));
          localStorage.setItem("permissions", JSON.stringify(profileData.permissions || []));
          localStorage.setItem("access_level", (profileData.access_level || 0).toString());
          localStorage.setItem("user_role", profileData.user.role || "");
          document.cookie = `user_role=${profileData.user.role || ""}; path=/; max-age=86400; SameSite=Lax`;

          setStatus("Login successful! Redirecting...");

          // Redirect by role
          switch (profileData.user.role) {
            case "Admin":
              window.location.href = "/role";
              break;
            case "Owner":
              window.location.href = "/OwnerDashboard";
              break;
            default:
              window.location.href = "/";
          }
        } else {
          throw new Error("Invalid profile data");
        }
      } catch (error) {
        console.error("Google auth completion failed:", error);
        setStatus("Something went wrong. Redirecting...");
        localStorage.removeItem("access_token");
        localStorage.removeItem("token");
        localStorage.removeItem("refresh_token");
        setTimeout(() => router.push("/login"), 2000);
      }
    };

    completeLogin();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
      <div className="text-center">
        <div className="w-10 h-10 border-3 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-white/70 text-sm">{status}</p>
      </div>
    </div>
  );
}
