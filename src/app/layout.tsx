import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

export const metadata: Metadata = {
  title: "Matheus Serrão Uchôa — Software Engineer",
  description:
    "Software Engineer with 6+ years building cross-platform systems, Android AOSP, and AI/ML solutions. Currently at Stone with Kotlin Multiplatform.",
  keywords: [
    "Software Engineer",
    "Kotlin Multiplatform",
    "Android AOSP",
    "AI/ML",
    "KMP",
    "Matheus Uchôa",
  ],
  authors: [{ name: "Matheus Serrão Uchôa", url: "https://github.com/maktheus" }],
  openGraph: {
    title: "Matheus Serrão Uchôa — Software Engineer",
    description:
      "KMP · Android AOSP · AI/ML Systems · Open to remote / relocation",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Matheus Serrão Uchôa — Software Engineer",
    description: "KMP · Android AOSP · AI/ML Systems",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${GeistSans.variable} ${GeistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
