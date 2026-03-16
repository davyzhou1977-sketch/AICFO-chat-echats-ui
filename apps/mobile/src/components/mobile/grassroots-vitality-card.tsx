import { BarChart3, Layers3 } from "lucide-react";
import { AIBriefCard } from "@/components/mobile/ai-brief-card";
import { Chart } from "@/components/mobile/chart";
import { ChartPanel } from "@/components/mobile/chart-panel";
import { SectionHeader } from "@/components/mobile/section-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  getGrassrootsBudgetDualBarOption,
  getLowActivityRankingOption,
} from "@/charts/schoolFinanceGovernanceOptions";
import type { GrassrootsVitalitySection } from "@/types/schoolFinanceGovernance";

interface GrassrootsVitalityCardProps {
  section: GrassrootsVitalitySection;
}

export function GrassrootsVitalityCard({
  section,
}: GrassrootsVitalityCardProps) {
  return (
    <section id="grassroots-vitality" className="space-y-4 scroll-mt-24">
      <SectionHeader title="基层活力仪表盘" caption="仅统计基层自主预算池" />

      <Card className="border-white/70 bg-white/92">
        <CardContent className="grid grid-cols-3 gap-3 p-4">
          <VitalityMetric icon={Layers3} label="自主预算池" value={section.autonomousPool} />
          <VitalityMetric icon={BarChart3} label="激活单位" value={section.activatedUnits} />
          <VitalityMetric
            icon={BarChart3}
            label="平均使用率"
            value={section.averageUsageRate}
          />
        </CardContent>
      </Card>

      <ChartPanel
        title="基层预算有没有真正用起来"
        badge="核定预算 vs 已使用"
        legend={
          <div className="flex flex-wrap gap-3 text-xs text-slate-500">
            <LegendDot color="#CBD5E1" label="核定预算" />
            <LegendDot color="#2F6BFF" label="已使用金额" />
          </div>
        }
      >
        <Chart
          className="chart-lg"
          option={getGrassrootsBudgetDualBarOption(section.units)}
        />
      </ChartPanel>
      <AIBriefCard insight={section.budgetInsight} scene="grassroots-vitality-budget" />

      <ChartPanel
        title="哪些基层单位还没真正动起来"
        badge="低活跃单位"
        hint="低活跃并不等于低价值，更需要结合项目立项和审批效率排查。"
      >
        <Chart
          className="chart-sm"
          option={getLowActivityRankingOption(section.lowActivityRanking)}
        />
        <div className="space-y-2">
          {section.lowActivityRanking.map((item) => (
            <div
              key={item.name}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
            >
              <div className="mb-1 flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-slate-900">{item.name}</p>
                <Badge variant="outline">{item.value}%</Badge>
              </div>
              <p className="text-xs leading-5 text-slate-500">{item.note}</p>
            </div>
          ))}
        </div>
      </ChartPanel>
      <AIBriefCard insight={section.lowActivityInsight} scene="grassroots-vitality-low-activity" />
    </section>
  );
}

function VitalityMetric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Layers3;
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

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </span>
  );
}
