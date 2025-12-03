import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "./components/I18nProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Orlando Ascanio | AI & Product Engineer",
    template: "%s | Orlando Ascanio"
  },
  description: "AI & Product Engineer with a founder mindset. Building intelligent, user-centric systems with Next.js, TypeScript, and RAG technology.",
  keywords: ["AI Engineer", "Product Engineer", "Full Stack Developer", "Next.js", "TypeScript", "RAG Systems", "Orlando Ascanio", "Software Architecture"],
  authors: [{ name: "Orlando Ascanio" }],
  creator: "Orlando Ascanio",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://personal-ai-assitant.vercel.app",
    title: "Orlando Ascanio | AI & Product Engineer",
    description: "Explore the portfolio and interactive AI assistant of Orlando Ascanio. specialized in building intelligent agents and scalable web systems.",
    siteName: "Orlando Ascanio Portfolio",
    images: [
      {
        url: "/banner.jpg",
        width: 1200,
        height: 630,
        alt: "Orlando Ascanio - AI & Product Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Orlando Ascanio | AI & Product Engineer",
    description: "AI & Product Engineer building intelligent systems. Check out my interactive AI portfolio.",
    images: ["/banner.jpg"],
    creator: "@orlandoascanio",
  },
  icons: {
    icon: "/logo.jpg",
    shortcut: "/logo.jpg",
    apple: "/logo.jpg",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.className} ${geistMono.className} antialiased`}
      >
        <I18nProvider>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
