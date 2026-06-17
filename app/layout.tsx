import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Abhyāsa by Trayini — AI worksheets for Indian tuition centres & schools",
  description:
    "Generate board-aligned practice worksheets, grade them by scanning OMR strips with a phone, and let Abhyāsa recommend the next practice set for every student.",
  openGraph: {
    title: "Abhyāsa by Trayini — AI worksheets that grow with every student",
    description:
      "Personalised, board-aligned worksheets. Print on A4. Scan with a phone. Adapt for every learner.",
    url: "https://abhyasa.trayini.ai",
    siteName: "Abhyāsa by Trayini",
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
