/**
 * ArchitectureDiagram — SERVER COMPONENT
 * Visual representation of the RSC → Client boundary.
 */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function ArchitectureDiagram() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Architecture: RSC → Client Boundary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-[420px] space-y-2">
            {/* Server layer */}
            <div className="rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50/40 dark:bg-blue-950/20 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Badge className="bg-blue-600 text-white text-xs">SERVER</Badge>
                <span className="text-xs text-muted-foreground">No JS sent to browser</span>
              </div>
              <div className="space-y-2">
                <DiagramBox label="RootLayout (RSC)" note="ThemeProvider wraps here" color="blue" />
                <div className="ml-4">
                  <DiagramBox label="page.tsx (RSC)" note="async — can fetch data" color="blue" />
                  <div className="ml-4 mt-2">
                    <DiagramBox label="ServerDataCard (RSC)" note="renders server data" color="blue" />
                  </div>
                </div>
              </div>
            </div>

            {/* Boundary indicator */}
            <div className="flex items-center gap-2 py-1">
              <div className="flex-1 border-t border-dashed border-muted-foreground/40" />
              <span className="text-xs font-medium text-muted-foreground px-2 bg-background rounded border border-border">
                ↓ serialized props cross here ↓
              </span>
              <div className="flex-1 border-t border-dashed border-muted-foreground/40" />
            </div>

            {/* Client layer */}
            <div className="rounded-lg border border-orange-200 dark:border-orange-800 bg-orange-50/40 dark:bg-orange-950/20 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Badge className="bg-orange-500 text-white text-xs">CLIENT</Badge>
                <span className="text-xs text-muted-foreground">JS bundle → browser</span>
              </div>
              <div className="space-y-2">
                <DiagramBox label="ClientIsland (CC)" note="'use client' — useState, useEffect" color="orange" />
                <div className="ml-4">
                  <DiagramBox label="ThemeToggle (CC)" note="useTheme hook" color="orange" />
                  <DiagramBox label="MobileNav (CC)" note="useState for sheet open/close" color="orange" />
                  <DiagramBox label="SidebarLink (CC)" note="usePathname for active state" color="orange" />
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="flex gap-4 pt-2">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <div className="h-2 w-2 rounded-full bg-blue-500" aria-hidden="true" />
                RSC = React Server Component
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <div className="h-2 w-2 rounded-full bg-orange-500" aria-hidden="true" />
                CC = Client Component
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function DiagramBox({
  label,
  note,
  color,
}: {
  label: string;
  note: string;
  color: "blue" | "orange";
}) {
  const styles = {
    blue: "border-blue-300 dark:border-blue-700 bg-blue-100/60 dark:bg-blue-900/30",
    orange: "border-orange-300 dark:border-orange-700 bg-orange-100/60 dark:bg-orange-900/30",
  };
  return (
    <div className={`rounded border ${styles[color]} px-3 py-1.5`}>
      <span className="text-xs font-mono font-medium">{label}</span>
      <span className="text-xs text-muted-foreground ml-2">— {note}</span>
    </div>
  );
}
