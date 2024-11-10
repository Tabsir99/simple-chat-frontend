"use client";
import useSWR, { SWRConfiguration } from "swr";
import { useAuth } from "@/components/shared/contexts/auth/authcontext";
import { ApiResponse } from "@/types/responseType";

const fetcher = async (url: string, token: string): Promise<any> => {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  } else {
    const data: ApiResponse = await response.json();
    return data.data;
  }
};

const useCustomSWR = <T = any>(
  url: string | null,
  config?: SWRConfiguration
) => {
  const { checkAndRefreshToken } = useAuth();

  const { data, error, isLoading, mutate } = useSWR<T>(
    url,
    async (key) => {
      const token = await checkAndRefreshToken();
      if (!token) {
        throw new Error("401");
      }

      return fetcher(key, token);
    },
    {
      ...config,
      revalidateOnFocus: false,
      dedupingInterval: 4000,
      errorRetryCount: 1,
      shouldRetryOnError: (err) => {
        if (err instanceof Error && err.message !== "401") {
          return true;
        }
        return false;
      },
    }
  );

  return {
    data: data,
    error,
    isLoading,
    mutate,
  };
};

export default useCustomSWR;
