import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

const plexThai = localFont({
  src: [
    { path: "../node_modules/@fontsource/ibm-plex-sans-thai/files/ibm-plex-sans-thai-thai-400-normal.woff2", weight: "400" },
    { path: "../node_modules/@fontsource/ibm-plex-sans-thai/files/ibm-plex-sans-thai-thai-500-normal.woff2", weight: "500" },
  ],
  variable: "--font-thai",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ice Pongphisut | Video Editor & Motion Designer",
  description:
    "Portfolio of Pongphisut Kaewnil (Ice): short form, long form, motion graphics, stills and banners.",
};

export const viewport: Viewport = { themeColor: "#101010", colorScheme: "dark" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} ${plexThai.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
