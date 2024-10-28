"use client";
import {
  createContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
  useContext,
  useRef,
} from "react";
import { jwtDecode } from "jwt-decode";
import { IUserMiniProfile } from "@/types/userTypes";
import FullPageLoader from "../ui/fullpageloader";
import { useRouter } from "next/navigation";
import { ApiResponse } from "@/types/responseType";
import { ecnf } from "@/utils/env";

interface AuthContextType {
  accessToken: string | null;
  loading: boolean;
  checkAndRefreshToken: () => Promise<string | null>;
  user: Omit<IUserMiniProfile, "bio"> | null;
}

interface DecodedToken {
  exp: number;
  userId: string;
}

enum AuthError {
  NETWORK_ERROR = "Network error occurred",
  SERVER_ERROR = "Server error occurred",
  INVALID_TOKEN = "Invalid token",
  UNKNOWN_ERROR = "An unknown error occurred",
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<Omit<IUserMiniProfile, "bio"> | null>(null);
  const refreshRef = useRef(false);

  const clearAuthState = useCallback(() => {
    setAccessToken(null);
    setUser(null);
  }, []);

  const refreshAccessToken = useCallback(async (): Promise<string | null> => {
    if (refreshRef.current) {
      return new Promise((resolve) => {
        const checkRefresh = setInterval(() => {
          if (!refreshRef.current) {
            clearInterval(checkRefresh);
            resolve(accessToken);
          }
        }, 100);
      });
    }

    refreshRef.current = true;
    try {
      const response = await fetch(
        `${ecnf.apiUrl}/auth/verify-refresh`,
        {
          method: "POST",
          credentials: "include",
          cache: "no-cache",
        }
      );

      if (response.ok) {
        const { accessToken: newAccessToken } = await response.json();
        setAccessToken(newAccessToken);
        
        return newAccessToken;
      } else if (response.status === 401) {
        throw new Error(AuthError.INVALID_TOKEN);
      } else {
        throw new Error(AuthError.SERVER_ERROR);
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === AuthError.INVALID_TOKEN) {
          clearAuthState();
          return null;
        }
      }
      clearAuthState();
      return null;
    } finally {
      setLoading(false);
      refreshRef.current = false;
    }
  }, [accessToken, clearAuthState]);

  const checkAndRefreshToken = useCallback(async (): Promise<string | null> => {
    if (!accessToken) {
      return refreshAccessToken();
    }

    try {
      const decodedToken = jwtDecode<DecodedToken>(accessToken);
      const currentTime = Math.floor(Date.now() / 1000);
      const timeUntilExpiry = decodedToken.exp - currentTime;

      if (timeUntilExpiry < 120) {
        return refreshAccessToken();
      }

      return accessToken;
    } catch (error) {
      console.error("Token decoding failed:", error);
      return refreshAccessToken();
    }
  }, [accessToken, refreshAccessToken]);

  const fetchUserData = useCallback(
    async (token: string) => {
      try {
        const response = await fetch(
          `${ecnf.apiUrl}/users/me?userId=true&username=true&profilePicture=true`,
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data: ApiResponse<Omit<{userInfo: IUserMiniProfile, isOwner: boolean}, "bio"> | null> =
            await response.json();
          if (data.data) {
            setUser(data.data.userInfo);
          }
          
        } else if (response.status === 401) {
          throw new Error(AuthError.INVALID_TOKEN);
        } else {
          throw new Error(AuthError.SERVER_ERROR);
        }
      } catch (error) {
       
        if (
          error instanceof Error &&
          error.message === AuthError.INVALID_TOKEN
        ) {
          clearAuthState();
        }
      }
    },
    [clearAuthState]
  );

  useEffect(() => {
    checkAndRefreshToken();
  }, []);

  useEffect(() => {
    if (accessToken && !user) {
      fetchUserData(accessToken);
    }
  }, [accessToken, user, fetchUserData]);

  const contextValue: AuthContextType = {
    accessToken,
    loading: loading && !user,
    checkAndRefreshToken,
    user,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};




export const ProtectedRoute: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { accessToken, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !accessToken) {
      router.push("/");
    }
  }, [loading, accessToken, router]);

  if (loading) {
    return <FullPageLoader />;
  }

  return accessToken ? <>{children}</> : <FullPageLoader />;
};

export const PublicRoute: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { accessToken, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && accessToken) {
      router.push("/chats");
    }
  }, [loading, accessToken, router]);

  if (loading) {
    return <FullPageLoader />;
  }

  return !accessToken ? <>{children}</> : <FullPageLoader />;
};
