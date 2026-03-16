import { PieChart, WalletCards } from "lucide-react";
import { AIBriefCard } from "@/components/mobile/ai-brief-card";
import { Chart } from "@/components/mobile/chart";
import { ChartPanel } from "@/components/mobile/chart-panel";
import { RankingList } from "@/components/mobile/ranking-list";
import { SectionHeader } from "@/components/mobile/section-header";
import { Card, CardContent } from "@/components/ui/card";
import { getGovernanceFlowDonutOption } from "@/charts/schoolFinanceGovernanceOptions";
import type { GovernanceOverviewSection } from "@/types/schoolFinanceGovernance";

interface GovernanceOverviewCardProps {
  section: GovernanceOverviewSection;
}

export function GovernanceOverviewCard({
  section,
}: GovernanceOverviewCardProps) {
  return (
    <section id="governance-overview" className="space-y-4 scroll-mt-24">
      <SectionHeader title="可治理资金流向总览" caption="主口径：可治理支出池" />

      <Card className="border-white/70 bg-white/92">
        <CardContent className="grid grid-cols-3 gap-3 p-4">
          <TopMetric icon={WalletCards} label="可治理资金" value={section.governableAmount} />
          <TopMetric icon={PieChart} label="占总支出" value={section.totalExpenseShare} />
          <TopMetric icon={PieChart} label="资源主分类" value={`${section.flow.length} 类`} />
        </CardContent>
      </Card>

      <p className="rounded-2xl border border-blue-100 bg-blue-50/80 px-4 py-3 text-xs leading-5 text-slate-600">
        {section.summary}
      </p>

      <ChartPanel title="这些可治理的钱，主要花到哪里了" badge="一级分类占比">
        <div className="grid grid-cols-[128px_1fr] items-center gap-3">
          <Chart
            className="chart-xs"
            option={getGovernanceFlowDonutOption(section.flow)}
          />
          <RankingList items={section.flow} />
        </div>
      </ChartPanel>

      <AIBriefCard insight={section.flowInsight} scene="governance-overview" />
    </section>
  );
}

function TopMetric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof WalletCards;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3">
      <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
        <Icon className="h-4 w-4" />
      </div>
      <p className="text-[11px] text-slate-500">{label}</p>
      <p className="mt-1 text-base font-semibold text-slate-900">{value}</p>
    </div>
  );
}
