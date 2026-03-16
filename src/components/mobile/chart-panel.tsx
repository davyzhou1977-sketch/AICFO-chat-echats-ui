import type { PropsWithChildren, ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ChartPanelProps extends PropsWithChildren {
  title: string;
  badge?: string;
  hint?: string;
  legend?: ReactNode;
  rightSlot?: ReactNode;
}

export function ChartPanel({
  title,
  badge,
  hint,
  legend,
  rightSlot,
  children,
}: ChartPanelProps) {
  return (
    <Card className="border-white/70 bg-white/92 backdrop-blur">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-3">
          <CardTitle>{title}</CardTitle>
          <div className="flex items-center gap-2">
            {rightSlot}
            {badge ? <Badge variant="outline">{badge}</Badge> : null}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {children}
        {legend}
        {hint ? <p className="text-xs leading-5 text-slate-500">{hint}</p> : null}
      </CardContent>
    </Card>
  );
}
