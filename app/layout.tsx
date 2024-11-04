import "./globals.css";
// import { Inter } from "next/font/google";
import { AuthProvider } from "@/components/authComps/authcontext";
import { SocketProvider } from "@/components/contextProvider/websocketContext";
import { NotificationProvider } from "@/components/contextProvider/notificationContext";
import type { Metadata } from "next";
import { ChatProvider } from "@/components/contextProvider/chatContext";
import { RecentActivitiesProvider } from "@/components/contextProvider/recentActivityContext";

// const interFont = Inter({
//   weight: ["400", "700"],
//   preload: true,
//   subsets: ["latin"],
//   display: "swap",
//   fallback: ["system"],
// });

export const metadata: Metadata = {
  title: "Simple Chat",
};

function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ overflow: "hidden", margin: 0, padding: 0 }}>
      <body
        style={{ overflow: "hidden", margin: 0, padding: 0 }}
      >
        <main
          className=" overflow-hidden"
          style={{
            backgroundColor: "hsl(250,24%,9%)",
            height: "100vh",
            minWidth: "100vw",
          }}
        >
          {/* <div className="fixed w-screen h-screen pointer-events-none bg-orange-400 bg-opacity-[0.07]"></div> */}

          <AuthProvider>
            <SocketProvider>
              <ChatProvider>
                <RecentActivitiesProvider>
                  {/* Notification Provider is for the notification pop up component context */}
                  <NotificationProvider>{children} </NotificationProvider>
                </RecentActivitiesProvider>
              </ChatProvider>
            </SocketProvider>
          </AuthProvider>
        </main>
      </body>
    </html>
  );
}

export default RootLayout;
