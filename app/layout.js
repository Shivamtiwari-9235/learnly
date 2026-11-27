import { Instrument_Serif, Inter, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import AppShell from "@/components/layout/AppShell";

const fontSans = Inter({ subsets: ["latin"], variable: "--font-sans" });
const fontDisplay = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-display" });
const fontSerif = Instrument_Serif({ subsets: ["latin"], weight: "400", variable: "--font-serif" });
const fontMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata = {
  title: "Learnly — Mastery-First Mini Learning Platform",
  description: "Discover courses, study distraction-free lessons, pass quizzes, earn XP, and export printable A4 certificates.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${fontSans.variable} ${fontDisplay.variable} ${fontSerif.variable} ${fontMono.variable}`} suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <StoreProvider>
          <AppShell>{children}</AppShell>
        </StoreProvider>
      </body>
    </html>
  );
}
