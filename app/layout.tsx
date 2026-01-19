import "./globals.css";
import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { LevelUpToast } from "@/components/LevelUpToast";

export const metadata: Metadata = {
  title: "Agent Kingdom",
  description: "Turn AI agents into a strategy/city-builder RPG."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground">
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1 px-6 pb-16 pt-6">{children}</main>
          <LevelUpToast />
        </div>
      </body>
    </html>
  );
}
