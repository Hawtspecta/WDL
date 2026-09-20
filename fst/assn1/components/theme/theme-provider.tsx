"use client";

/**
 * ThemeProvider wraps next-themes to prevent hydration mismatches.
 * We set attribute="class" so dark mode adds the .dark class.
 * suppressHydrationWarning is added to <html> in layout.tsx.
 * scriptProps with suppressHydrationWarning is passed to suppress React 19 script element warnings.
 */
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ReactNode } from "react";

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange={false}
      scriptProps={{ suppressHydrationWarning: true }}
    >
      {children}
    </NextThemesProvider>
  );
}
