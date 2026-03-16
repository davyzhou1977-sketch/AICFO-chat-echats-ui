import { Sparkles, Users } from "lucide-react";
import { AIBriefCard } from "@/components/mobile/ai-brief-card";
import { Chart } from "@/components/mobile/chart";
import { ChartPanel } from "@/components/mobile/chart-panel";
import { SectionHeader } from "@/components/mobile/section-header";
import { Card, CardContent } from "@/components/ui/card";
import {
  getTeacherMomentumBarOption,
  getTeacherMomentumTrendOption,
} from "@/charts/schoolFinanceGovernanceOptions";
import type { TeacherMomentumSection } from "@/types/schoolFinanceGovernance";

interface TeacherMomentumCardProps {
  section: TeacherMomentumSection;
}

export function TeacherMomentumCard({ section }: TeacherMomentumCardProps) {
  return (
    <section id="teacher-momentum" className="space-y-4 scroll-mt-24">
      <SectionHeader title="教师成长与激励" caption="不含基础工资" />

      <Card className="border-white/70 bg-white/92">
        <CardContent className="grid grid-cols-3 gap-3 p-4">
          <MomentumMetric icon={Sparkles} label="全年投入" value={section.yearlyInvestment} />
          <MomentumMetric icon={Users} label="覆盖教师" value={section.coverage[0]?.value ?? ""} />
          <MomentumMetric icon={Sparkles} label="人均投入" value={section.coverage[2]?.value ?? ""} />
        </CardContent>
      </Card>

      <ChartPanel title="学校有没有持续为教师成长买单" badge="投入结构">
        <Chart
          className="chart-sm"
          option={getTeacherMomentumBarOption(section.categories)}
        />
      </ChartPanel>
      <AIBriefCard insight={section.categoryInsight} scene="teacher-momentum-category" />

      <ChartPanel title="教师成长投入覆盖面" badge="覆盖情况">
        <div className="grid grid-cols-3 gap-3">
          {section.coverage.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3"
            >
              <p className="text-[11px] text-slate-500">{item.label}</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">{item.value}</p>
              <p className="mt-1 text-[11px] leading-5 text-slate-500">{item.helper}</p>
            </div>
          ))}
        </div>
      </ChartPanel>

      <ChartPanel
        title="教师成长投入是否在持续"
        badge="12 个月"
        hint="只统计教师成长与激励性投入，不混入基础工资和常规薪酬。"
      >
        <Chart
          className="chart-md"
          option={getTeacherMomentumTrendOption(section.trend)}
        />
      </ChartPanel>
      <AIBriefCard insight={section.trendInsight} scene="teacher-momentum-trend" />
    </section>
  );
}

function MomentumMetric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Sparkles;
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
