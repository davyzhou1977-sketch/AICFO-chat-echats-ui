import { ArrowDownRight, ArrowUpRight, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { SummaryMetric, TrendState } from "@/types/schoolFinance";

const trendMap: Record<
  TrendState,
  { className: string; icon: typeof ArrowUpRight }
> = {
  up: {
    className: "text-emerald-600",
    icon: ArrowUpRight,
  },
  down: {
    className: "text-rose-500",
    icon: ArrowDownRight,
  },
  warning: {
    className: "text-amber-600",
    icon: AlertTriangle,
  },
};

interface MetricCardProps {
  metric: SummaryMetric;
}

export function MetricCard({ metric }: MetricCardProps) {
  const { icon: Icon, className } = trendMap[metric.trendState];

  return (
    <Card className="border-white/70 bg-white/90 backdrop-blur">
      <CardContent className="space-y-3 p-4">
        <p className="text-xs text-slate-500">{metric.label}</p>
        <p className="text-[28px] font-semibold tracking-tight text-slate-950">
          {metric.value}
        </p>
        <div className={`flex items-center gap-1.5 text-xs ${className}`}>
          <Icon className="h-3.5 w-3.5" />
          <span>{metric.trend}</span>
        </div>
      </CardContent>
    </Card>
  );
}
