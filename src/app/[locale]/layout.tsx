import type { Metadata } from "next";
import "../globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SessionProvider from "@/components/providers/SessionProvider";
import { Toaster } from 'react-hot-toast';
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';

export const metadata: Metadata = {
  title: "Rent&Home",
  description: "Rent and Buy a home with ease",
};

export default async function LocaleLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}>) {
  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();
  const {locale} = await params;
  
  return (
    <NextIntlClientProvider messages={messages}>
      <SessionProvider>
        <div className="relative z-50">
          <Navbar />
        </div>
        <div className="relative">
          {children}
        </div>
        <div className="relative">
          <Footer />
        </div>
        <Toaster 
          position="top-center"
          toastOptions={{
            duration: 4000,
            success: {
              duration: 3000,
            },
            error: {
              duration: 4000,
            },
          }}
        />
      </SessionProvider>
    </NextIntlClientProvider>
  );
} 