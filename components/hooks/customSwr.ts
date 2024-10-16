"use client";
import useSWR, { SWRConfiguration } from "swr";
import { useAuth } from "@/components/authComps/authcontext";
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
    return response.json();
  }
};

const useCustomSWR = <T = any>(
  url: string | null,
  config?: SWRConfiguration
) => {
  const { checkAndRefreshToken } = useAuth();

  const { data, error, isLoading, mutate } = useSWR<ApiResponse<T>>(
    url,
    async (key) => {
      const token = await checkAndRefreshToken();
      if (!token) {
        throw new Error("No access Token");
      }

      return fetcher(key, token);
    },
    {
      ...config,
      revalidateOnFocus: false,
      dedupingInterval: 4000,
      // revalidateOnMount: false
    }
  );

  return {
    data: data?.data,
    error,
    isLoading,
    mutate,
  };
};

export default useCustomSWR;
