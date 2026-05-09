import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Swap to Poppins if preferred
import "./globals.css";
import { Toaster } from "sonner"; // From your requested tech stack

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MediFlow | AI Pharmacy Management",
  description: "The AI-Powered Smart Pharmacy Management Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
