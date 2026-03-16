import { Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { InsightBlock } from "@/types/schoolFinance";

interface AIInsightCardProps {
  insight: InsightBlock;
}

export function AIInsightCard({ insight }: AIInsightCardProps) {
  return (
    <Card className="overflow-hidden border-[#D9CFFD] bg-[linear-gradient(135deg,rgba(236,253,248,0.95),rgba(243,240,255,0.98))]">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white/80 text-violet-600 shadow-sm">
            <Sparkles className="h-4 w-4" />
          </div>
          <CardTitle>{insight.title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-sm leading-6 text-slate-700">
        <p>{insight.summary}</p>
        <Separator className="bg-violet-200/70" />
        <div className="space-y-2">
          {insight.bullets.map((bullet) => (
            <div key={bullet} className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-500" />
              <p>{bullet}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
