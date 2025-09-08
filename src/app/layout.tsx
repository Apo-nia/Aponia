import type { Metadata } from "next";
import { Toaster } from "sonner";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import LayoutShell from "@/components/layout-shell";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Aponia: Your all-in-one study and content management planner",
  description:
    "Aponia helps you organize, plan, and manage your study and content efficiently.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {/* 👇 full-viewport background layer */}
          <div className="min-h-screen bg-[image:var(--page-bg)] bg-cover bg-fixed bg-no-repeat transition-colors duration-700">
            <LayoutShell>
              {children}
            </LayoutShell>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}