import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import React from "react";
import ThemeRegistry from "./ThemeRegistry"; // <-- our client component

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Timeline Maker (2025)",
  description: "Made by Ben",
};

// NO "use client" directive here, so layout.tsx remains server-side for better performance
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Wrap children with our client-side ThemeRegistry */}
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}
