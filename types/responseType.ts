export type ApiResponse<T = any> = {
    success: boolean;
    message?: string
    meta: {
      timestamp: string;
      version: "1.0";
    };
    data?: T;
    error?: any;
  };