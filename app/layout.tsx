import "./globals.css";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/components/authComps/authcontext";
import { SocketProvider } from "@/components/contextProvider/websocketContext";
import { NotificationProvider } from "@/components/contextProvider/notificationContext";
import type { Metadata } from "next";
import { ChatProvider } from "@/components/contextProvider/chatContext";
import { UserInteractionsProvider } from "@/components/contextProvider/userInteractionContext";

const interFont = Inter({
  weight: ["400", "700"],
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
          {/* <div className="fixed w-screen h-screen pointer-events-none bg-orange-400 bg-opacity-[0.07]"></div> */}

          <AuthProvider>
            <SocketProvider>
              <ChatProvider>
                <UserInteractionsProvider>
                  {/* Notification Provider is for the notification pop up component context */}
                  <NotificationProvider>{children} </NotificationProvider>
                </UserInteractionsProvider>
              </ChatProvider>
            </SocketProvider>
          </AuthProvider>
        </main>
      </body>
    </html>
  );
}

export default RootLayout;
