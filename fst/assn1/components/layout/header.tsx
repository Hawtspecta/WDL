/**
 * Header — SERVER COMPONENT (mostly)
 * ThemeToggle and MobileNav are client components inserted as islands.
 */
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { MobileNav } from "./mobile-nav";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  title?: string;
  description?: string;
}

export function Header({ title, description }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-background/95 backdrop-blur px-4 lg:px-6">
      {/* Mobile hamburger — client island */}
      <MobileNav />

      {/* Page title (desktop) */}
      <div className="hidden lg:flex items-center gap-2">
        {title && (
          <h1 className="text-sm font-semibold text-foreground">{title}</h1>
        )}
        {description && (
          <span className="text-xs text-muted-foreground hidden xl:block">
            — {description}
          </span>
        )}
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="hidden sm:flex text-xs">
          Next.js 16 · React 19
        </Badge>
        <ThemeToggle />
      </div>
    </header>
  );
}
