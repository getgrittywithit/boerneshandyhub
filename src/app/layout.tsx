import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./boerne-colors.css";
import LayoutWrapper from "@/components/LayoutWrapper";
import { HomeownerAuthProvider } from "@/contexts/HomeownerAuthContext";
import { RealtorAuthProvider } from "@/contexts/RealtorAuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://boerneshandyhub.com'),
  title: {
    default: "Boerne's Handy Hub | Find Trusted Local Service Providers in Boerne, TX",
    template: "%s | Boerne's Handy Hub",
  },
  description: 'Find trusted local service providers in Boerne, Texas. Connect with licensed plumbers, electricians, HVAC technicians, contractors, and more in the Hill Country.',
  keywords: [
    'Boerne services',
    'Boerne contractors',
    'Boerne plumbers',
    'Boerne electricians',
    'Boerne HVAC',
    'Hill Country services',
    'Kendall County contractors',
    'home services Boerne TX',
    'local service providers',
    'Boerne Texas',
  ],
  authors: [{ name: "Boerne's Handy Hub" }],
  creator: "Boerne's Handy Hub",
  publisher: "Boerne's Handy Hub",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://boerneshandyhub.com',
    siteName: "Boerne's Handy Hub",
    title: "Boerne's Handy Hub | Find Trusted Local Service Providers",
    description: 'Find trusted local service providers in Boerne, Texas. Connect with licensed plumbers, electricians, HVAC technicians, contractors, and more.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: "Boerne's Handy Hub - Local Service Directory",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Boerne's Handy Hub | Find Trusted Local Service Providers",
    description: 'Find trusted local service providers in Boerne, Texas. Connect with licensed plumbers, electricians, HVAC technicians, contractors, and more.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <HomeownerAuthProvider>
          <RealtorAuthProvider>
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
          </RealtorAuthProvider>
        </HomeownerAuthProvider>
      </body>
    </html>
  );
}
