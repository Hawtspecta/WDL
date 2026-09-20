/**
 * ServerDataCard — SERVER COMPONENT
 *
 * Renders server-fetched data. No client JS. Pure HTML output.
 * This component cannot have useState, useEffect, or event handlers.
 */
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Server } from "lucide-react";

interface ServerData {
  timestamp: string;
  renderedOn: string;
  nodeVersion: string;
  environment: string;
  dataSource: string;
  serializedProps: {
    title: string;
    status: string;
    count: number;
  };
}

export function ServerDataCard({ data }: { data: ServerData }) {
  const formattedTime = new Date(data.timestamp).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div className="space-y-3" role="region" aria-label="Server-rendered data">
      <div className="flex items-center gap-2">
        <Server className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
        <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
          Rendered at {formattedTime}
        </span>
      </div>

      <dl className="space-y-2">
        {[
          { label: "Rendered on", value: data.renderedOn.toUpperCase() },
          { label: "Node.js", value: data.nodeVersion },
          { label: "Environment", value: data.environment },
        ].map(({ label, value }) => (
          <div key={label} className="flex justify-between items-center text-sm">
            <dt className="text-muted-foreground">{label}</dt>
            <dd>
              <Badge variant="secondary" className="text-xs font-mono">
                {value}
              </Badge>
            </dd>
          </div>
        ))}
      </dl>

      <div className="rounded-md bg-blue-100/50 dark:bg-blue-950/30 p-3">
        <p className="text-xs text-muted-foreground leading-relaxed">
          📡 <strong>Data source:</strong> {data.dataSource}
        </p>
      </div>

      <div className="rounded-md border border-blue-200 dark:border-blue-900/50 p-3">
        <p className="text-xs font-medium mb-2 text-blue-700 dark:text-blue-300">
          Props passed to Client Island →
        </p>
        <pre className="text-xs font-mono text-muted-foreground overflow-auto">
          {JSON.stringify(data.serializedProps, null, 2)}
        </pre>
      </div>
    </div>
  );
}
