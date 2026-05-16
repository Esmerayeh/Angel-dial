import type { Metadata } from "next";
import "@/styles/globals.css";
import "@/styles/crt.css";
import "@/styles/y2k.css";
import "@/styles/gothic.css";
import "@/styles/glitch.css";
import "@/styles/dream.css";

export const metadata: Metadata = {
  title: "ANGEL DIAL ✦",
  description:
    "A soft haunted internet instrument. Turn, pull, tune, open, and drift.",
  icons: {
    icon: [
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
