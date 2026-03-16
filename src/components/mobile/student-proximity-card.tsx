import { GaugeCircle, School } from "lucide-react";
import { AIBriefCard } from "@/components/mobile/ai-brief-card";
import { Chart } from "@/components/mobile/chart";
import { ChartPanel } from "@/components/mobile/chart-panel";
import { SectionHeader } from "@/components/mobile/section-header";
import { Card, CardContent } from "@/components/ui/card";
import {
  getStudentAdministrativeTrendOption,
  getStudentGovernanceStackedOption,
} from "@/charts/schoolFinanceGovernanceOptions";
import type { StudentProximitySection } from "@/types/schoolFinanceGovernance";

interface StudentProximityCardProps {
  section: StudentProximitySection;
}

export function StudentProximityCard({ section }: StudentProximityCardProps) {
  return (
    <section id="student-proximity" className="space-y-4 scroll-mt-24">
      <SectionHeader title="离学生最近的资源" caption="交叉维：基层自主 / 行政统筹" />

      <Card className="border-white/70 bg-white/92">
        <CardContent className="grid grid-cols-3 gap-3 p-4">
          <QuickMetric icon={School} label="学生类投入" value={section.studentGovernableAmount} />
          <QuickMetric
            icon={GaugeCircle}
            label="基层自主占比"
            value={section.studentGrassrootsRatio}
          />
          <QuickMetric icon={School} label="一线触达" value={section.frontlineCoverage} />
        </CardContent>
      </Card>

      <ChartPanel
        title="这些钱，多少真正下沉到一线"
        badge="基层自主 vs 行政统筹"
        legend={
          <div className="flex flex-wrap gap-3 text-xs text-slate-500">
            <LegendDot color="#2F6BFF" label="基层自主" />
            <LegendDot color="#94A3B8" label="行政统筹" />
          </div>
        }
        hint="重点看“学生成长”这一列中基层自主占比是否保持高位。"
      >
        <Chart
          className="chart-lg"
          option={getStudentGovernanceStackedOption(section.split)}
        />
      </ChartPanel>
      <AIBriefCard insight={section.structureInsight} scene="student-proximity-structure" />

      <ChartPanel
        title="近 12 个月，花在学生身上的钱有没有持续增加"
        badge="学生类投入 vs 行政类投入"
        legend={
          <div className="flex flex-wrap gap-3 text-xs text-slate-500">
            <LegendDot color="#2F6BFF" label="学生类投入" />
            <LegendDot color="#FF9F43" label="行政类投入" />
          </div>
        }
      >
        <Chart
          className="chart-md"
          option={getStudentAdministrativeTrendOption(section.trend)}
        />
      </ChartPanel>
      <AIBriefCard insight={section.trendInsight} scene="student-proximity-trend" />
    </section>
  );
}

function QuickMetric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof School;
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
