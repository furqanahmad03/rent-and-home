import type { Metadata } from "next";
import "./globals.css";
import SessionProvider from "@/components/providers/SessionProvider";
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: "Rent&Home",
  description: "Rent and Buy a home with ease",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="font-sans antialiased"
        suppressHydrationWarning
      >
            {children}
      </body>
    </html>
  );
}
