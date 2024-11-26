// I messed up with writing comments, Should have written as I created individual hooks and components
// But it's too late now. Sorry for the inconvenience for if anyone watching


import "./globals.css";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/components/shared/contexts/auth/authcontext";
import { CommunicationProvider } from "@/components/shared/contexts/communication/communicationContext";
import type { Metadata } from "next";
import { ChatProvider } from "@/components/shared/contexts/chat/chatContext";
import { RecentActivitiesProvider } from "@/components/shared/contexts/chat/recentActivityContext";

const interFont = Inter({
  weight: ["400", "700"],
  preload: true,
  subsets: ["latin"],
  display: "swap",
  fallback: ["system"],
});

export const metadata: Metadata = {
  title: "Simple Chat",
};

function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ margin: 0, padding: 0 }}>
      <body style={{ margin: 0, padding: 0 }}>
        <main
          className={` overflow-hidden flex ${interFont.className}`}
          style={{
            backgroundColor: "hsl(250,24%,9%)",
            height: "100dvh",
            minWidth: "100vw",
          }}
        >
          <AuthProvider>
            <CommunicationProvider>
              <ChatProvider>
                <RecentActivitiesProvider>{children}</RecentActivitiesProvider>
              </ChatProvider>
            </CommunicationProvider>
          </AuthProvider>
        </main>
      </body>
    </html>
  );
}

export default RootLayout;
