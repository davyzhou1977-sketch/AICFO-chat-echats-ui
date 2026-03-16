import { BrainCircuit } from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { InsightBlock } from "@/types/schoolFinance";
import { pushGovernanceBriefToChat } from "@/services/schoolFinanceBriefService";

interface AIBriefCardProps {
  insight: InsightBlock;
  scene: string;
}

export function AIBriefCard({ insight, scene }: AIBriefCardProps) {
  const [status, setStatus] = useState<"idle" | "pushed">("idle");

  const handlePush = async () => {
    await pushGovernanceBriefToChat({ scene, insight });
    setStatus("pushed");
  };

  return (
    <Card className="overflow-hidden border-[#D9CFFD] bg-[linear-gradient(135deg,rgba(236,253,248,0.95),rgba(243,240,255,0.98))]">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white/80 text-violet-600 shadow-sm">
            <BrainCircuit className="h-4 w-4" />
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
        <div className="flex items-center justify-between gap-3 rounded-2xl bg-white/60 px-3 py-2">
          <p className="text-[11px] text-slate-500">可将本板块结论推送到校长 Chat，接口已预留。</p>
          <Button size="sm" variant="secondary" onClick={() => void handlePush()}>
            {status === "pushed" ? "已推送占位" : "推送给校长"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
