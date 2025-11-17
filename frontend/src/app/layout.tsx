import type { Metadata } from "next";
import Script from "next/script";
import SessionSync from "./components/session-sync";
import "./globals.css";
import { logoUrl } from "./utils/logo";

export const metadata: Metadata = {
  title: "Mass. DYS - Youth Supervision Platform",
  description: "Massachusetts Department of Youth Services Youth Supervisory Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
        {/* Font Awesome */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        {/* Favicon */}
        <link rel="icon" href={logoUrl} sizes="32x32" />
        <link rel="icon" href={logoUrl} sizes="192x192" />
        <link rel="apple-touch-icon" href={logoUrl} />
        <meta name="theme-color" content="#14558f" />
      </head>
      <body>
        {/* 👇 Load Highcharts safely */}
        <Script
          src="https://code.highcharts.com/highcharts.js"
          strategy="afterInteractive"
        />
        <SessionSync />
        {children}
        </body>
    </html>
  );
}
