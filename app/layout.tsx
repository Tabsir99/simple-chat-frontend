import "./globals.css";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/components/authComps/authcontext";
import { SocketProvider } from "@/components/contextProvider/websocketContext";
import { NotificationProvider } from "@/components/contextProvider/notificationContext";
import type { Metadata } from "next";
import { ChatProvider } from "@/components/contextProvider/chatContext";

const interFont = Inter({
  weight: ["400","700"],
  preload: true,
  subsets: ["latin"],
  display: "swap",
  fallback: ["sans-serif"],
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
    <html lang="en" style={{ overflow: "hidden" }}>
      <body className={interFont.className} style={{ overflow: "hidden" }}>
        <main className="bg-[hsl(250,24%,9%)] h-screen min-w-[100vw] overflow-hidden">
          <AuthProvider>
            <SocketProvider>
              <ChatProvider>
                <NotificationProvider>{children} </NotificationProvider>
              </ChatProvider>
            </SocketProvider>
          </AuthProvider>
        </main>
      </body>
    </html>
  );
}

export default RootLayout;
