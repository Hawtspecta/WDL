"use client";

/**
 * MobileNav — CLIENT COMPONENT
 * Uses Sheet (drawer) for mobile navigation. Requires client JS for open/close.
 */
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Layers, ShoppingCart, FileText, Zap, BarChart3, Gauge, Home } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/demo/rsc", label: "RSC vs Client", icon: Layers },
  { href: "/demo/zustand", label: "Zustand Cart", icon: ShoppingCart },
  { href: "/demo/forms", label: "Type-Safe Forms", icon: FileText },
  { href: "/demo/hydration", label: "Hydration", icon: Zap },
  { href: "/demo/performance", label: "Core Web Vitals", icon: BarChart3 },
  { href: "/demo/lighthouse", label: "Lighthouse Audit", icon: Gauge },
] as const;

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className="lg:hidden inline-flex items-center justify-center size-8 rounded-lg border border-transparent hover:bg-muted transition-all focus-visible:ring-2 focus-visible:ring-ring/50 outline-none"
        aria-label="Open navigation menu"
      >
        <Menu className="h-5 w-5" />
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0">
        <SheetHeader className="px-6 py-5 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Layers className="h-4 w-4 text-primary-foreground" />
            </div>
            <SheetTitle className="text-sm font-semibold">Next.js Lab</SheetTitle>
          </div>
        </SheetHeader>
        <nav className="flex-1 px-3 py-4 space-y-1" aria-label="Mobile navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
