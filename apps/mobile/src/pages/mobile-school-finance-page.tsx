import { useEffect, useState } from "react";
import { Building2, ChartColumnBig, GraduationCap, Wallet } from "lucide-react";
import { AIInsightCard } from "@/components/mobile/ai-insight-card";
import { Chart } from "@/components/mobile/chart";
import { ChartPanel } from "@/components/mobile/chart-panel";
import { MetricCard } from "@/components/mobile/metric-card";
import { MobileShell } from "@/components/mobile/mobile-shell";
import { RankingList } from "@/components/mobile/ranking-list";
import { SectionHeader } from "@/components/mobile/section-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  getExpenseCategoryOption,
  getInvestmentCompareOption,
  getMonthlyTrendOption,
  getResourceFlowOption,
  getStructureTrendOption,
  getVendorRankingOption,
} from "@/charts/schoolFinanceOptions";
import { fetchSchoolFinanceDashboard } from "@/services/schoolFinanceService";
import "@/styles/school-finance-mobile.css";
import type { SchoolFinanceDashboardData } from "@/types/schoolFinance";

type ModuleTab = "expense" | "principal";

const tabs: Array<{
  value: ModuleTab;
  label: string;
  icon: typeof Wallet;
}> = [
  { value: "expense", label: "报销数据分析", icon: Wallet },
  { value: "principal", label: "校长视角洞察", icon: GraduationCap },
];

export function MobileSchoolFinancePage() {
  const [activeTab, setActiveTab] = useState<ModuleTab>("expense");
  const [data, setData] = useState<SchoolFinanceDashboardData | null>(null);

  useEffect(() => {
    void fetchSchoolFinanceDashboard().then(setData);
  }, []);

  if (!data) {
    return (
      <div className="mx-auto flex min-h-screen max-w-[430px] items-center justify-center px-4 text-sm text-slate-500">
        数据加载中...
      </div>
    );
  }

  const { header, expenseAnalysis, principalPerspective } = data;

  return (
    <MobileShell
      title={header.title}
      subtitle={header.subtitle}
      periodLabel={header.periodLabel}
      tags={header.tags}
    >
      <div className="mobile-tabs -mx-1 mb-4 flex gap-2 overflow-x-auto px-1 pb-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.value;

          return (
            <Button
              key={tab.value}
              variant={isActive ? "default" : "outline"}
              className="h-10 shrink-0 gap-2 rounded-full px-4"
              onClick={() => setActiveTab(tab.value)}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </Button>
          );
        })}
      </div>

      <div className="safe-bottom space-y-4">
        {activeTab === "expense" ? (
          <>
            <section>
              <SectionHeader title="报销数据分析" caption="现有数据可做" />
              <div className="grid grid-cols-2 gap-3">
                {expenseAnalysis.metrics.map((metric) => (
                  <MetricCard key={metric.label} metric={metric} />
                ))}
              </div>
            </section>

            <ChartPanel
              title="月度报销趋势"
              badge="金额 / 笔数"
              legend={
                <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                  <LegendDot color="#2F6BFF" label="报销金额" />
                  <LegendDot color="#18B47A" label="报销笔数" />
                </div>
              }
              hint="适合校长判断是否存在学期末冲高、月底集中报销，以及学校整体支出活跃度是否异常波动。"
            >
              <Chart
                className="chart-md"
                option={getMonthlyTrendOption(expenseAnalysis.monthlyTrend)}
              />
            </ChartPanel>

            <ChartPanel title="报销类别结构" badge="现有分类">
              <div className="grid grid-cols-[128px_1fr] items-center gap-3">
                <Chart
                  className="chart-xs"
                  option={getExpenseCategoryOption(expenseAnalysis.categoryBreakdown)}
                />
                <RankingList items={expenseAnalysis.categoryBreakdown.slice(0, 5)} />
              </div>
            </ChartPanel>

            <ChartPanel
              title="高频供应商 TOP5"
              badge="金额口径"
              hint="移动端默认展示 TOP5，避免首屏过长，后续可通过接口拓展完整榜单与下钻。"
            >
              <Chart
                className="chart-sm"
                option={getVendorRankingOption(expenseAnalysis.topVendors)}
              />
            </ChartPanel>

            <ChartPanel title="大额报销排行" badge="风险雷达">
              <div className="space-y-3">
                {expenseAnalysis.largeExpenses.map((item, index) => (
                  <Card key={item.project} className="border-slate-200/80 bg-slate-50 shadow-none">
                    <CardContent className="flex items-center justify-between gap-3 p-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">TOP {index + 1}</Badge>
                          <span className="text-sm font-medium text-slate-900">
                            {item.project}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">{item.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-slate-900">{item.amount}</p>
                        <p className="text-xs text-rose-500">大额关注</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ChartPanel>

            <AIInsightCard insight={expenseAnalysis.insight} />
          </>
        ) : (
          <>
            <section>
              <SectionHeader title="校长视角洞察" caption="AI 重分类后" />
              <Card className="border-white/70 bg-white/92">
                <CardContent className="grid grid-cols-3 gap-3 p-4">
                  <QuickInfo icon={Building2} label="资源口径" value="6 类" />
                  <QuickInfo icon={ChartColumnBig} label="趋势周期" value="12 月" />
                  <QuickInfo icon={GraduationCap} label="学生投入" value="41%" />
                </CardContent>
              </Card>
            </section>

            <ChartPanel
              title="资源流向结构"
              badge="校长视角"
              hint="该图基于 AI 重分类，不再依赖传统财务科目，更适合校长快速理解资源配置。"
            >
              <div className="grid grid-cols-[128px_1fr] items-center gap-3">
                <Chart
                  className="chart-xs"
                  option={getResourceFlowOption(principalPerspective.resourceFlow)}
                />
                <RankingList items={principalPerspective.resourceFlow} />
              </div>
            </ChartPanel>

            <ChartPanel
              title="学生 / 教师 / 运转投入对比"
              badge="最易懂"
              legend={
                <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                  {principalPerspective.investmentCompare.map((item) => (
                    <LegendDot key={item.name} color={item.color} label={item.name} />
                  ))}
                </div>
              }
            >
              <Chart
                className="chart-sm"
                option={getInvestmentCompareOption(principalPerspective.investmentCompare)}
              />
            </ChartPanel>

            <ChartPanel title="资源结构月度趋势" badge="12 个月">
              <Chart
                className="chart-md"
                option={getStructureTrendOption(principalPerspective.structureTrend)}
              />
            </ChartPanel>

            <ChartPanel title="需补充的数据项" badge="接口预留">
              <div className="space-y-3">
                {principalPerspective.dataNeeds.map((item) => (
                  <div
                    key={item.field}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                  >
                    <div className="mb-1 flex items-center justify-between gap-3">
                      <p className="text-sm font-medium text-slate-900">{item.field}</p>
                      <Badge variant="outline">字段</Badge>
                    </div>
                    <p className="text-xs leading-5 text-slate-500">{item.purpose}</p>
                  </div>
                ))}
              </div>
            </ChartPanel>

            <AIInsightCard insight={principalPerspective.insight} />
          </>
        )}
      </div>
    </MobileShell>
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

function QuickInfo({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Building2;
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
