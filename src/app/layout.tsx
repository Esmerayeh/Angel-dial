import type { Metadata } from "next";
import "@/styles/globals.css";
import "@/styles/crt.css";
import "@/styles/y2k.css";
import "@/styles/gothic.css";
import "@/styles/glitch.css";
import "@/styles/dream.css";

export const metadata: Metadata = {
  title: "ANGEL DIAL: A Soft Haunted Internet Instrument",
  description:
    "A soft pastel haunted internet instrument of circular rituals, pearl clocks, ghost veils, moon bottles, and visitor relics.",
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
