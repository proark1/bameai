import "./globals.css";
import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { LevelUpToast } from "@/components/LevelUpToast";
import { ToastViewport } from "@/components/ToastViewport";
import { MissionCompleteCelebration } from "@/components/MissionCompleteCelebration";
import { Onboarding } from "@/components/Onboarding";
import { Providers } from "@/components/Providers";

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
    <html lang="en" data-theme="sci-fi">
      <body className="min-h-screen bg-background text-foreground">
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1 px-4 pb-20 pt-4 sm:px-6 sm:pb-16 sm:pt-6">
              <div className="mx-auto w-full max-w-6xl">{children}</div>
            </main>
            <LevelUpToast />
            <ToastViewport />
            <MissionCompleteCelebration />
            <Onboarding />
          </div>
        </Providers>
      </body>
    </html>
  );
}
