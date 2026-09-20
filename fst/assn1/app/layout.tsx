import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap", // Prevents layout shift during font load
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Next.js Architecture Lab | Assignment 1",
    template: "%s | Next.js Lab",
  },
  description:
    "Academic demonstration of Next.js 16 App Router architecture: RSC/Client boundaries, Zustand state management, Zod + Server Actions, hydration optimization, and Core Web Vitals.",
  keywords: [
    "Next.js",
    "RSC",
    "Zustand",
    "Zod",
    "Server Actions",
    "Core Web Vitals",
  ],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    /*
     * suppressHydrationWarning is placed on <html> specifically because
     * next-themes injects the theme class on the server based on cookies,
     * but the initial server render may not match the client class if the
     * user's preference differs. This single attribute prevents that warning
     * without suppressing all other hydration mismatches.
     */
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background text-foreground">
        <ThemeProvider>
          <div className="flex min-h-screen">
            {/* Sidebar — Server Component */}
            <Sidebar />

            {/* Main content area */}
            <div className="flex flex-1 flex-col min-w-0">
              <Header />
              <main className="flex-1 p-4 lg:p-6" id="main-content">
                {children}
              </main>
            </div>
          </div>

          {/* Global toast notifications */}
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
