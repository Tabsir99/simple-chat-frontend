# Simple Chat Frontend

## Description
A modern, responsive chat application frontend built with Next.js, React, and TypeScript.

## Prerequisites
- Node.js (v18+ recommended)
- npm (v9+)

## Tech Stack
- Next.js 15
- React 18
- TypeScript
- Tailwind CSS
- Socket.IO Client
- SWR (State-While-Revalidate)
- JWT Authentication

## Features
- Real-time messaging
- WebSocket communication
- User authentication
- Responsive design
- Google OAuth integration

## Installation

### 1. Clone the Repository
```bash
git clone [your-repo-url]
cd simple-chat-frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env.local` file in the root directory with the following variables:

```env
# Backend API Configuration
NEXT_PUBLIC_API_URL=https://localhost:3001/api
NEXT_PUBLIC_BACKEND_URL=https://localhost:3001
NEXT_PUBLIC_FRONTEND_URL=https://localhost:5000
NEXT_PUBLIC_HOSTNAME=localhost

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

## Running the Application

### Development Mode
```bash
npm run dev
```

The application will be available at `https://localhost:5000`

### Production Build
```bash
# Build the application
npm run build

# Start the production server
npm start
```

## Project Structure
```
app/
├── (authenticated)/       # Protected routes
│   ├── chats/             # Chat-related pages
│   ├── profile/           # User profile pages
│   └── search-people/     # User search and connection pages
│
├── components/            # Reusable React components
│   ├── features/          # Feature-specific components
│   ├── shared/            # Shared UI components
│   └── ui/                # Atomic design components
│
├── config/                # Configuration files
├── types/                 # TypeScript type definitions
├── utils/                 # Utility functions and constants
└── hooks/                 # Custom React hooks
```

## Key Configuration Files
- `next.config.mjs`: Next.js configuration
- `tailwind.config.ts`: Tailwind CSS configuration
- `tsconfig.json`: TypeScript configuration

## Development Tools
- ESLint for linting
- Postcss for CSS processing
- Experimental Next.js Turbo mode


## Environment Variables
- `NEXT_PUBLIC_API_URL`: Backend API endpoint
- `NEXT_PUBLIC_BACKEND_URL`: Backend base URL
- `NEXT_PUBLIC_FRONTEND_URL`: Frontend base URL
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID`: Google OAuth Client ID


## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Troubleshooting
- Ensure backend is running and accessible
- Check browser console for any connection or authentication errors
- Verify environment variables are correctly set

## Performance Optimization
- Leveraging Next.js Turbo mode
- Using SWR for efficient data fetching

## Contact
hello@tabsircg.com