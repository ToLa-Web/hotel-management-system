"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/authService";
import Loading from "@app/loading";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(false);
  const [userName, setUserName] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({});
  const [token, setToken] = useState(null); // Add token state

  const [permissions, setPermissions] = useState([]);
  const [accessLevel, setAccessLevel] = useState(0);
  const [userRole, setUserRole] = useState("");

  const [loginError, setLoginError] = useState(null);
  const [lastAuthCheckFailed, setLastAuthCheckFailed] = useState(false);

  // Helper function to get token from localStorage
  const getStoredToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("access_token");
    }
    return null;
  };

  // Helper function to update token state
  const updateTokenState = () => {
    const storedToken = getStoredToken();
    setToken(storedToken);
  };

  const hasPermission = (permission) => permissions.includes(permission);
  const hasMinimumAccessLevel = (requiredLevel) => accessLevel >= requiredLevel;
  const canAccess = (requiredPermissions = [], requiredAccessLevel = 0) => {
    const hasRequiredPermissions = requiredPermissions.length === 0 ||
      requiredPermissions.every(permission => hasPermission(permission));
    const hasRequiredAccessLevel = hasMinimumAccessLevel(requiredAccessLevel);
    return hasRequiredPermissions && hasRequiredAccessLevel;
  };
  const isAdmin = userRole === 'Admin';
  const isOwner = userRole === 'Owner';
  const isUser = userRole === 'User';

  const storeAuthData = (authData) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(authData.user || {}));
      localStorage.setItem("permissions", JSON.stringify(authData.permissions || []));
      localStorage.setItem("access_level", authData.access_level?.toString() || "0");
      localStorage.setItem("user_role", authData.user?.role || "");
      // Set role cookie for server-side middleware
      const role = authData.user?.role || "";
      document.cookie = `user_role=${role}; path=/; max-age=86400; SameSite=Lax`;
      // Update token state after storing
      updateTokenState();
    }
  };

  const loadCachedAuthData = () => {
    if (typeof window !== "undefined") {
      try {
        const cachedUser = localStorage.getItem("user");
        const cachedPermissions = localStorage.getItem("permissions");
        const cachedAccessLevel = localStorage.getItem("access_level");
        const cachedRole = localStorage.getItem("user_role");

        if (cachedUser && cachedPermissions) {
          const user = JSON.parse(cachedUser);
          setUserData(user);
          setPermissions(JSON.parse(cachedPermissions));
          setAccessLevel(parseInt(cachedAccessLevel) || 0);
          setUserRole(cachedRole || "");
          setUserName(user.lastName || user.name || "");
          // Update token state
          updateTokenState();
        }
      } catch (error) {
        console.error("Error loading cached auth data:", error);
        clearAuthData();
      }
    }
  };

  const clearAuthData = () => {
    setIsLogin(false);
    setUserName("");
    setUserData({});
    setPermissions([]);
    setAccessLevel(0);
    setUserRole("");
    setToken(null); // Clear token state
    setLoginError(null);
    setLastAuthCheckFailed(false);

    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("permissions");
      localStorage.removeItem("access_level");
      localStorage.removeItem("user_role");
      document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
  };

  const handleLogin = async (email, password) => {
    setLoginError(null);
    try {
      const response = await authService.login({ email, password });

      if (!response.success) {
        const errorMessage = response.error || "Invalid credentials. Please check your email and password.";
        setLoginError(errorMessage);
        setLastAuthCheckFailed(true);
        return { success: false, error: errorMessage };
      }

      const profileData = await authService.userProfile();
      if (profileData && profileData.user) {
        setIsLogin(true);
        setUserName(profileData.user.lastName || profileData.user.name || "");
        setUserData(profileData.user);
        setPermissions(profileData.permissions || []);
        setAccessLevel(profileData.access_level || 0);
        setUserRole(profileData.user.role || "");
        storeAuthData(profileData);
        setLastAuthCheckFailed(false);
      } else {
        console.warn("User profile fetch after login failed, using basic login data.");
        setIsLogin(true);
        setUserName(response.data.user?.lastName || response.data.user?.name || "");
        setUserData(response.data.user || {});
        setUserRole(response.data.user?.role || "");
        storeAuthData({ user: response.data.user, permissions: [], access_level: 0 });
        setLastAuthCheckFailed(false);
      }

      const role = profileData?.user?.role || response.data?.user?.role || "";
      return { success: true, role };
    } catch (error) {
      console.error("Login failed:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to log in. Please check your credentials.";
      setLoginError(errorMessage);
      clearAuthData();
      setLastAuthCheckFailed(true);
      return { success: false, error: errorMessage };
    }
  };

  const checkAuthentication = async () => {
    setLoading(true);
    setLastAuthCheckFailed(false);
    try {
      loadCachedAuthData();

      const profileData = await authService.userProfile();
      if (profileData && profileData.user) {
        setIsLogin(true);
        setUserName(profileData.user.lastName || profileData.user.name || "");
        setUserData(profileData.user);
        setPermissions(profileData.permissions || []);
        setAccessLevel(profileData.access_level || 0);
        setUserRole(profileData.user.role || "");
        storeAuthData(profileData);
        setLastAuthCheckFailed(false);
      } else {
        console.warn("User profile check failed, clearing authentication data.");
        clearAuthData();
        setLastAuthCheckFailed(true);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        console.warn("Auth check: User is unauthorized. This is expected for unauthenticated users.", error);
      } else {
        console.error("Auth check failed:", error);
      }
      clearAuthData();
      setLastAuthCheckFailed(true);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      clearAuthData();
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
      clearAuthData();
      window.location.href = "/";
    }
  };

  useEffect(() => {
    checkAuthentication();
  }, []);

  if (loading) {
    return <Loading/> ;
  }

  return (
    <AuthContext.Provider
      value={{
        isLogin,
        userName,
        isDropdownOpen,
        setIsDropdownOpen,
        userData,
        token, 
        handleLogout,
        handleLogin,
        loading, 
        permissions,
        accessLevel,
        userRole,
        hasPermission,
        hasMinimumAccessLevel,
        canAccess,
        isAdmin,
        isOwner,
        isUser,
        loginError,
        lastAuthCheckFailed,
        refreshUserData: checkAuthentication,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};