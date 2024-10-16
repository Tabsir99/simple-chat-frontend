

export const ecnf = {
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
    backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001',
    frontendUrl: process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:5000',
    googleClientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
    hostname: process.env.NEXT_PUBLIC_HOSTNAME || 'localhost',
  };