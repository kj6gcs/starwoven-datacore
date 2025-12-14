import "./globals.css";
import type { Metadata } from "next";
import { Saira_Semi_Condensed } from "next/font/google";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// special font I like to use for Sci-Fi stuff (obviously including Starwoven lol)
const saira = Saira_Semi_Condensed({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Starwoven Datacore",
  description: "Starwoven Datacore — characters, ships, factions, and lore.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${saira.className} min-h-screen flex flex-col`}>
        <Navbar />

        <div className="flex-1">{children}</div>

        <Footer />
      </body>
    </html>
  );
}
