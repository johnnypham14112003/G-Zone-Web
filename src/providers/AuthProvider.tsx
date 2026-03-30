import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { getUser, setUser, removeUser } from "@/lib/local-storage";
import { loginApi } from "@/features/auth/api/auth-api";
import {
  getAccountMe,
  getAvatarImage,
} from "@/features/accounts/api/account-api";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  user: any | null;
  avatarUrl: string | null;
  login: (email, password) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<any | null>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUserState] = useState<any | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchAndSetAvatar = useCallback(async (profile: any) => {
    // This function now uses a functional update to safely clean up the previous URL
    const setNewUrl = (newUrl: string | null) => {
      setAvatarUrl((prevUrl) => {
        if (prevUrl && prevUrl.startsWith("blob:")) {
          URL.revokeObjectURL(prevUrl);
        }
        return newUrl;
      });
    };

    if (profile && profile["avatar-url"]) {
      try {
        const blob = await getAvatarImage(profile["avatar-url"]);
        const newAvatarUrl = URL.createObjectURL(blob);
        setNewUrl(newAvatarUrl);
      } catch (error) {
        console.error("Failed to fetch avatar:", error);
        setNewUrl(null); // or a fallback
      }
    } else {
      setNewUrl(null); // No avatar URL in profile
    }
  }, []); // Now has no dependencies, is stable.

  const logout = useCallback(() => {
    setAvatarUrl((prevUrl) => {
      if (prevUrl && prevUrl.startsWith("blob:")) {
        URL.revokeObjectURL(prevUrl);
      }
      return null;
    });
    removeUser();
    setUserState(null);
    navigate("/login");
  }, [navigate]);

  const refreshUser = useCallback(async () => {
    setLoading(true);
    try {
      const freshUser = await getAccountMe();
      const currentUser = getUser() || {}; // Get existing user data (with tokens)
      const newUser = {
        ...currentUser,
        ...freshUser,
        "account-id": freshUser.id || currentUser.id,
      }; // Explicitly preserve account-id
      setUser(newUser); // Save merged data back to localStorage
      setUserState(newUser); // Update React state
      await fetchAndSetAvatar(newUser);
      return newUser;
    } catch (error) {
      console.error("Failed to refresh user, logging out.", error);
      // If we can't get the user profile, they are likely unauthenticated
      logout();
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchAndSetAvatar, logout]);

  useEffect(() => {
    const storedUser = getUser();
    if (storedUser) {
      setUserState(storedUser);
      refreshUser();
    } else {
      setLoading(false);
    }
  }, [refreshUser]);

  const login = useCallback(
    async (email, password) => {
      try {
        const loginResponseData = await loginApi(email, password);
        // First, store the user data containing the token. This is critical
        // so that subsequent API calls (like in refreshUser) are authenticated.
        const userData = {
          ...loginResponseData,
          "account-id": loginResponseData.id,
        };
        setUser(userData);

        // Now, refresh the user state to get the full, canonical user profile
        // from the server, which will also trigger the avatar fetch.
        const user = await refreshUser();

        // Navigate only after the full user profile is loaded.
        if (user && (user.role === "Admin" || user.role === "Staff")) {
          navigate("/management");
        } else {
          navigate("/");
        }
      } catch (error) {
        // If login fails, ensure we clean up any partial state.
        removeUser();
        setUserState(null);
        throw error;
      }
    },
    [navigate, refreshUser],
  );

  const isAuthenticated = user !== null;

  const contextValue = useMemo(
    () => ({
      user,
      avatarUrl,
      login,
      logout,
      refreshUser,
      isAuthenticated,
    }),
    [user, avatarUrl, login, logout, refreshUser, isAuthenticated],
  );

  if (loading) {
    return null; // Render nothing while we're fetching the initial user state
  }

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
