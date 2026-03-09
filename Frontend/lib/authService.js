import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

// Create axios instance
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper function to clear all local authentication data
const clearLocalAuthData = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("token"); // Remove old key
    localStorage.removeItem("user");
    localStorage.removeItem("permissions");
    localStorage.removeItem("access_level");
    localStorage.removeItem("user_role");
    document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }
};

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token") || localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const isAuthEndpoint = originalRequest.url?.includes('/login') ||
      originalRequest.url?.includes('/register');
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true; // Mark the request as retried
      
      try {
        // Try to refresh the token
        const refresh_token = localStorage.getItem("refresh_token");
        
        if (!refresh_token) {
          // No refresh token available, clear local data and reject
          console.warn("No refresh token available, clearing local auth data.");
          clearLocalAuthData(); // Direct clear, no API call
          return Promise.reject(error);
        }
        
        // Call refresh token endpoint
        const response = await axios.post(`${API_URL}/refresh`, {
          refresh_token: refresh_token
        });
        
        if (response.data.access_token) {
          // Store the new tokens
          localStorage.setItem("token", response.data.access_token);
          localStorage.setItem("access_token", response.data.access_token); // Keep both for compatibility
          localStorage.setItem("refresh_token", response.data.refresh_token);
          
          // Update the authorization header for subsequent requests
          api.defaults.headers.common["Authorization"] = `Bearer ${response.data.access_token}`;
          
          // Retry the original request with the new token
          return api(originalRequest);
        }
      } catch (refreshError) {
        // If refresh token is invalid, clear local data and reject
        console.error("Token refresh failed, clearing local auth data:", refreshError);
        clearLocalAuthData(); // Direct clear, no API call
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export const authService = {
  async register(userData) {
    try {
      const response = await api.post("/register", userData);
      if (response.data.access_token) {
        localStorage.setItem("token", response.data.access_token);
        localStorage.setItem("access_token", response.data.access_token); // Keep both for compatibility
        localStorage.setItem("refresh_token", response.data.refresh_token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Registration failed",
      };
    }
  },

  async refresh() {
    try {
      const refresh_token = localStorage.getItem("refresh_token");
      if (!refresh_token) {
        throw new Error("No refresh token available");
      }
      
      const response = await api.post("/refresh", { refresh_token });
      
      if (response.data.access_token) {
        localStorage.setItem("token", response.data.access_token);
        localStorage.setItem("access_token", response.data.access_token); // Keep both for compatibility
        localStorage.setItem("refresh_token", response.data.refresh_token);
        // Update the cookie with new token
        document.cookie = `access_token=${response.data.access_token}; path=/; secure; samesite=strict; max-age=${7 * 24 * 60 * 60}`;
      }
      return { success: true, data: response.data };
    } catch (error) {
      // If refresh fails, clear local data directly
      console.error("Token refresh failed in refresh method, clearing local auth data:", error);
      clearLocalAuthData(); // Direct clear, no API call
      return {
        success: false,
        error: error.response?.data?.message || "Token refresh failed",
      };
    }
  },

  async login(credentials) {
    try {
      const response = await api.post("/login", credentials);
      if (response.data.access_token) {
        localStorage.setItem("token", response.data.access_token);
        localStorage.setItem("access_token", response.data.access_token); // Keep both for compatibility
        localStorage.setItem("refresh_token", response.data.refresh_token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
          document.cookie = `access_token=${response.data.access_token}; path=/; secure; samesite=strict; max-age=${7 * 24 * 60 * 60}`;
      }
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Login failed",
      };
    }
  },

  async logout() {
    // Grab tokens BEFORE clearing so the API call has auth headers
    const refresh_token = localStorage.getItem("refresh_token");
    const access_token = localStorage.getItem("access_token") || localStorage.getItem("token");

    try {
      await api.post("/logout", { refresh_token }, {
        headers: { Authorization: `Bearer ${access_token}` },
      });
    } catch (error) {
      console.warn("Server-side logout call failed (ignored):", error?.response?.status);
    } finally {
      clearLocalAuthData();
    }

    return { success: true };
  },

  async userProfile() {
    try {
      const response = await api.get("/user/profile"); // This should match your Laravel route
      return response.data; // Return the raw data as your backend already formats it correctly
    } catch (error) {
      // Re-throw the original error, allowing AuthContext to handle Axios errors with response status
      throw error; 
    }
  },

  async getProfile() {
    try {
      const response = await api.get("/user-profile");
      return { success: true, data: response.data };  
    } catch (error) {
      // Re-throw the original error
      throw error; 
    }
  },

  async user() {
    try {
      const response = await api.get("/user");
      return response.data; // Return raw data for compatibility with your AuthContext
    } catch (error) {
      // Re-throw the original error
      throw error; 
    }
  },

  isAuthenticated() {
    return !!(localStorage.getItem("access_token") || localStorage.getItem("token"));
  },

  getAccessToken() {
    return localStorage.getItem("access_token") || localStorage.getItem("token");
  },
  
  getRefreshToken() {
    return localStorage.getItem("refresh_token");
  },
  
  getUser() {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  }
};
