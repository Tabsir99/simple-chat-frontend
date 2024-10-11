'use client';
import useSWR, { SWRConfiguration } from 'swr';
import { useAuth } from '@/components/authComps/authcontext';
import { ApiResponse } from '@/types/responseType';

const fetcher = async (url: string, token: string): Promise<any> => {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const useCustomSWR = <T = any>(url: string | null, config?: SWRConfiguration) => {
  const { checkAndRefreshToken } = useAuth();

  const { data, error, isLoading,mutate } = useSWR<ApiResponse<T>>(
    url,
    async (key) => {

      const token = await checkAndRefreshToken();
      if(!token){
        throw new Error("No access Token")
      }

      return fetcher(key, token);
    },
    {
      ...config,
      revalidateOnFocus: false,
      dedupingInterval: 4000
    }
  );

  return {
    data: data?.data,
    error,
    isLoading,
    mutate
  };
};

export default useCustomSWR;



/*Fetched from the cache, friends
Verify-refresh controller running... 

Provided refresh toekn:b336fd0bf1
time:2024-10-10T04:54:19.808Z
Verifyorrefresh service running,  [ [ null, '742161ae-7f60-4ce3-af98-e62416818f5a' ], [ null, 604637 ] ]
new refresh tokne generated, 
old:b336fd0bf1
 new:783449aba0
2024-10-10T04:54:19.817Z
Verify-refresh controller running... 

Provided refresh toekn:b336fd0bf1
time:2024-10-10T04:54:19.833Z
Verifyorrefresh service running,  [ [ null, null ], [ null, -2 ] ]
FROM VERIFY OR REFRESH  "Invalid Refresh Token, from tokenTTl "
 -2
 null*/