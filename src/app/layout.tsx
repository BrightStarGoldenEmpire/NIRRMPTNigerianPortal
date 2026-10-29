// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GlobalChatbot from "@/components/GlobalChatbot";

export const metadata: Metadata = {
  title: "NIRRMPT - Nigerian Institute of Regenerative Resource Management and Protection Technologies",
  description: "Official Federal Republic of Nigeria Portal for Regenerative Resource Management and Environmental Protection Technologies.",
  icons: {
    icon: "/favicon.ico", // Ensures your custom logo/favicon displays on browser tabs
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Tailwind CSS CDN */}
        <script src="https://cdn.tailwindcss.com"></script>
        {/* FontAwesome CDN */}
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" 
        />
      </head>
      <body className="bg-slate-50 text-slate-900 antialiased min-h-screen flex flex-col justify-between">
        {/* Global Navigation Bar */}
        <Navbar />

        <main className="flex-grow">
          {children}
        </main>
        
        {/* Global Floating Chatbot */}
        <GlobalChatbot />

        {/* Global Footer */}
        <Footer />
      </body>
    </html>
  );
}