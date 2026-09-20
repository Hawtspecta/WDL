"use client";

/**
 * SidebarLink — CLIENT COMPONENT
 * Needs usePathname() to determine active state.
 * Resolves icon names to components client-side to avoid passing
 * non-serializable function props across the RSC boundary.
 */
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Layers,
  ShoppingCart,
  FileText,
  Zap,
  BarChart3,
  Gauge,
  LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, LucideIcon> = {
  Home,
  Layers,
  ShoppingCart,
  FileText,
  Zap,
  BarChart3,
  Gauge,
};

interface SidebarLinkProps {
  href: string;
  label: string;
  iconName: string;
}

export function SidebarLink({ href, label, iconName }: SidebarLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;
  const Icon = ICON_MAP[iconName] ?? Home;

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150",
        isActive
          ? "bg-primary text-primary-foreground shadow-sm"
          : "text-muted-foreground hover:bg-accent hover:text-foreground"
      )}
    >
      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
      {label}
    </Link>
  );
}
