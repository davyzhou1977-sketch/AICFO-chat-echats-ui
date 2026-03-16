import { useEffect, useMemo, useState } from "react";
import { ReceiptText, ShieldCheck, Sparkles, UsersRound, WalletCards } from "lucide-react";
import { AIInsightCard } from "@/components/mobile/ai-insight-card";
import { Chart } from "@/components/mobile/chart";
import { ChartPanel } from "@/components/mobile/chart-panel";
import { MetricCard } from "@/components/mobile/metric-card";
import { RankingList } from "@/components/mobile/ranking-list";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  getBudgetExecutionOverviewOption,
  getBudgetProjectCompareOption,
  getFocusedProjectOption,
  getGroupedBarOption,
  getHorizontalRankingOption,
  getMultiLineOption,
  getSingleLineOption,
  getStackedBarOption,
} from "@/charts/schoolFinanceV2Options";
import {
  getExpenseCategoryOption,
  getMonthlyTrendOption,
  getVendorRankingOption,
} from "@/charts/schoolFinanceOptions";
import type {
  FinancialAnalysisV2Section,
  FinancialPeriod,
  FinanceTopic,
  GuaranteeFocusType,
  GuaranteeTopicSection,
  ReimbursementTopicSection,
  SpecialTopic,
  SpecialTopicSection,
} from "@/types/schoolFinanceV2";

interface FinancialAnalysisTabProps {
  section: FinancialAnalysisV2Section;
  activePeriod: FinancialPeriod;
}

const topicMeta: Record<
  FinanceTopic,
  { label: string; icon: typeof WalletCards }
> = {
  budget: { label: "预算", icon: WalletCards },
  reimbursement: { label: "报销", icon: ReceiptText },
  personnel: { label: "人员", icon: UsersRound },
  guarantee: { label: "保障", icon: ShieldCheck },
  special: { label: "专题", icon: Sparkles },
};

const topicButtonClass =
  "flex h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors";

export function FinancialAnalysisTab({
  section,
  activePeriod,
}: FinancialAnalysisTabProps) {
  const [activeTopic, setActiveTopic] = useState<FinanceTopic>(
    section.defaultTopic ?? "budget",
  );

  useEffect(() => {
    setActiveTopic(section.defaultTopic ?? "budget");
  }, [section.defaultTopic]);

  const snapshot = section.snapshots[activePeriod];

  return (
    <section className="space-y-4">
      <div className="mobile-tabs -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {section.topicOptions.map((item) => {
          const meta = topicMeta[item.value];
          const Icon = meta.icon;
          const isActive = item.value === activeTopic;

          return (
            <button
              key={item.value}
              type="button"
              onClick={() => setActiveTopic(item.value)}
              className={`${topicButtonClass} ${
                isActive
                  ? "border-blue-500 bg-blue-600 text-white shadow-sm"
                  : "border-slate-200 bg-white text-slate-600"
              }`}
            >
              <Icon className="h-4 w-4" />
              {meta.label}
            </button>
          );
        })}
      </div>

      {activeTopic === "budget" ? <BudgetTopicContent section={snapshot.budget} /> : null}
      {activeTopic === "reimbursement" ? (
        <ReimbursementTopicContent section={snapshot.reimbursement} />
      ) : null}
      {activeTopic === "personnel" ? <PersonnelTopicContent section={snapshot.personnel} /> : null}
      {activeTopic === "guarantee" ? <GuaranteeTopicContent section={snapshot.guarantee} /> : null}
      {activeTopic === "special" ? <SpecialTopicContent section={snapshot.special} /> : null}
    </section>
  );
}

function BudgetTopicContent({
  section,
}: {
  section: FinancialAnalysisV2Section["snapshots"][FinancialPeriod]["budget"];
}) {
  return (
    <div className="space-y-4">
      <TopicIntro
        title="预算"
        caption="默认首页"
        description="先看预算金额、执行率、可用预算和项目部门执行率。"
      />
      <MetricsGrid metrics={section.metrics} />

      <ChartPanel
        title="月度预算执行总览"
        badge="预算 / 执行 / 执行率"
        legend={
          <div className="flex flex-wrap gap-3 text-xs text-slate-500">
            <LegendDot color="#DBEAFE" label="预算金额" />
            <LegendDot color="#2F6BFF" label="已执行" />
            <LegendDot color="#F97316" label="执行率" />
          </div>
        }
      >
        <Chart
          className="chart-md"
          option={getBudgetExecutionOverviewOption(section.monthlyExecution)}
        />
      </ChartPanel>
      <AIInsightCard insight={section.executionInsight} />

      <ChartPanel title="项目预算执行对比" badge="项目维度">
        <Chart
          className="chart-sm"
          option={getBudgetProjectCompareOption(section.projectComparison)}
        />
      </ChartPanel>
      <AIInsightCard insight={section.projectInsight} />

      <ChartPanel title="部门执行率排行" badge="部门维度">
        <Chart
          className="chart-sm"
          option={getHorizontalRankingOption(section.departmentExecution)}
        />
      </ChartPanel>
      <AIInsightCard insight={section.departmentInsight} />

      <ChartPanel title={`${section.focusedProject.name} · 项目部门交叉`} badge="交叉视图">
        <Chart
          className="chart-sm"
          option={getFocusedProjectOption(section.focusedProject.departments)}
        />
      </ChartPanel>
      <AIInsightCard insight={section.focusedProject.insight} />
    </div>
  );
}

function ReimbursementTopicContent({ section }: { section: ReimbursementTopicSection }) {
  return (
    <div className="space-y-4">
      <TopicIntro
        title="报销"
        caption="保留上一版能力"
        description="延续原有报销趋势、结构、供应商与大额单据的分析能力。"
      />
      <MetricsGrid metrics={section.metrics} />

      <ChartPanel
        title="报销金额与笔数趋势"
        badge="金额 / 笔数"
        legend={
          <div className="flex flex-wrap gap-3 text-xs text-slate-500">
            <LegendDot color="#2F6BFF" label="报销金额" />
            <LegendDot color="#18B47A" label="报销笔数" />
          </div>
        }
      >
        <Chart className="chart-md" option={getMonthlyTrendOption(section.monthlyTrend)} />
      </ChartPanel>
      <AIInsightCard insight={section.monthlyInsight} />

      <ChartPanel title="报销类别结构" badge="类别口径">
        <div className="grid grid-cols-[128px_1fr] items-center gap-3">
          <Chart
            className="chart-xs"
            option={getExpenseCategoryOption(section.categoryBreakdown)}
          />
          <RankingList items={section.categoryBreakdown} />
        </div>
      </ChartPanel>
      <AIInsightCard insight={section.categoryInsight} />

      <ChartPanel title="高频供应商 TOP5" badge="供应商">
        <Chart className="chart-sm" option={getVendorRankingOption(section.topVendors)} />
      </ChartPanel>
      <AIInsightCard insight={section.vendorInsight} />

      <ChartPanel title="大额报销排行" badge="重点项目">
        <LargeExpenseList items={section.largeExpenses} />
      </ChartPanel>
      <AIInsightCard insight={section.largeExpenseInsight} />
    </div>
  );
}

function PersonnelTopicContent({
  section,
}: {
  section: FinancialAnalysisV2Section["snapshots"][FinancialPeriod]["personnel"];
}) {
  return (
    <div className="space-y-4">
      <TopicIntro
        title="人员"
        caption="附件预处理专题"
        description="基于工资明细附件做 Python 预处理后，再按费用类型做结构统计。"
      />
      <MetricsGrid metrics={section.metrics} />

      <ChartPanel
        title="月度人员费用构成"
        badge="时间 × 费用类型"
        hint="优先用堆叠柱状图同时看总量和结构变化。"
        legend={<SeriesLegend series={section.monthlyComposition.series} />}
      >
        <Chart
          className="chart-md"
          option={getStackedBarOption(section.monthlyComposition)}
        />
      </ChartPanel>
      <AIInsightCard insight={section.compositionInsight} />

      <ChartPanel title="重点费用趋势" badge="工资 / 绩效 / 社保 / 补贴">
        <Chart className="chart-md" option={getMultiLineOption(section.focusTrend)} />
      </ChartPanel>
      <AIInsightCard insight={section.focusInsight} />

      <ChartPanel title="当前周期费用结构" badge="费用类型">
        <Chart
          className="chart-sm"
          option={getHorizontalRankingOption(section.structureBreakdown)}
        />
      </ChartPanel>
      <AIInsightCard insight={section.structureInsight} />
    </div>
  );
}

function GuaranteeTopicContent({ section }: { section: GuaranteeTopicSection }) {
  const [activeFocus, setActiveFocus] = useState<GuaranteeFocusType>(
    section.focusOptions[0]?.value ?? "water",
  );

  useEffect(() => {
    setActiveFocus(section.focusOptions[0]?.value ?? "water");
  }, [section.focusOptions]);

  const activeTrend = useMemo(
    () => section.focusTrends[activeFocus],
    [activeFocus, section.focusTrends],
  );
  const activeInsight = section.focusInsights[activeFocus];

  return (
    <div className="space-y-4">
      <TopicIntro
        title="保障"
        caption="基础运转费用"
        description="先看保障费用月度构成，再按单项费用切换趋势，不依赖校址和面积字段。"
      />
      <MetricsGrid metrics={section.metrics} />

      <ChartPanel
        title="基础保障月度构成"
        badge="总览"
        legend={<SeriesLegend series={section.monthlyComposition.series} />}
      >
        <Chart
          className="chart-md"
          option={getStackedBarOption(section.monthlyComposition)}
        />
      </ChartPanel>
      <AIInsightCard insight={section.compositionInsight} />

      <ChartPanel
        title="单项保障趋势"
        badge="按费用切换"
        rightSlot={
          <div className="mobile-tabs -mr-1 flex max-w-[190px] gap-1 overflow-x-auto pr-1">
            {section.focusOptions.map((item) => {
              const isActive = activeFocus === item.value;

              return (
                <Button
                  key={item.value}
                  type="button"
                  size="sm"
                  variant={isActive ? "default" : "outline"}
                  className="h-8 shrink-0 px-3"
                  onClick={() => setActiveFocus(item.value)}
                >
                  {item.label}
                </Button>
              );
            })}
          </div>
        }
      >
        <Chart className="chart-sm" option={getSingleLineOption(activeTrend)} />
      </ChartPanel>
      <AIInsightCard insight={activeInsight} />

      <ChartPanel title="当前周期费用结构" badge="保障类别">
        <Chart
          className="chart-sm"
          option={getHorizontalRankingOption(section.structureBreakdown)}
        />
      </ChartPanel>
      <AIInsightCard insight={section.structureInsight} />
    </div>
  );
}

function SpecialTopicContent({ section }: { section: SpecialTopicSection }) {
  const [activeTopic, setActiveTopic] = useState<SpecialTopic>(section.defaultTopic);

  useEffect(() => {
    setActiveTopic(section.defaultTopic);
  }, [section.defaultTopic]);

  const activeSection = section.topics[activeTopic];

  return (
    <div className="space-y-4">
      <TopicIntro
        title="专题"
        caption="阶段重点"
        description="当前先聚焦学生活动和教师成长，后续可平滑扩展到其他学校重点专题。"
      />

      <div className="mobile-tabs -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {section.options.map((item) => {
          const isActive = item.value === activeTopic;

          return (
            <Button
              key={item.value}
              type="button"
              variant={isActive ? "default" : "outline"}
              className="h-10 shrink-0 gap-2 rounded-full px-4"
              onClick={() => setActiveTopic(item.value)}
            >
              {item.label}
            </Button>
          );
        })}
      </div>

      <MetricsGrid metrics={activeSection.metrics} />

      <ChartPanel title={`${activeSection.title}投入趋势`} badge="月度趋势">
        <Chart className="chart-sm" option={getSingleLineOption(activeSection.monthlyTrend)} />
      </ChartPanel>
      <AIInsightCard insight={activeSection.trendInsight} />

      <ChartPanel title={`${activeSection.title}投入结构`} badge="结构占比">
        <div className="grid grid-cols-[128px_1fr] items-center gap-3">
          <Chart
            className="chart-xs"
            option={getExpenseCategoryOption(activeSection.categoryBreakdown)}
          />
          <RankingList items={activeSection.categoryBreakdown} />
        </div>
      </ChartPanel>
      <AIInsightCard insight={activeSection.structureInsight} />

      <ChartPanel title={`${activeSection.title}重点项目`} badge="项目排行">
        <Chart
          className="chart-sm"
          option={getHorizontalRankingOption(activeSection.projectRanking)}
        />
      </ChartPanel>
      <AIInsightCard insight={activeSection.projectInsight} />
    </div>
  );
}

function TopicIntro({
  title,
  caption,
  description,
}: {
  title: string;
  caption: string;
  description: string;
}) {
  return (
    <div className="rounded-[24px] border border-white/70 bg-white/78 px-4 py-4 backdrop-blur">
      <div className="mb-2 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold tracking-tight text-slate-900">{title}</h2>
        <Badge variant="outline">{caption}</Badge>
      </div>
      <p className="text-sm leading-6 text-slate-500">{description}</p>
    </div>
  );
}

function MetricsGrid({ metrics }: { metrics: Array<{ label: string; value: string; trend: string; trendState: "up" | "down" | "warning" }> }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {metrics.map((metric) => (
        <MetricCard key={metric.label} metric={metric} />
      ))}
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

function SeriesLegend({ series }: { series: Array<{ name: string; color: string }> }) {
  return (
    <div className="flex flex-wrap gap-3 text-xs text-slate-500">
      {series.map((item) => (
        <LegendDot key={item.name} color={item.color} label={item.name} />
      ))}
    </div>
  );
}

function LargeExpenseList({
  items,
}: {
  items: Array<{ project: string; category: string; amount: string }>;
}) {
  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <Card key={item.project} className="border-slate-200/80 bg-slate-50 shadow-none">
          <CardContent className="flex items-center justify-between gap-3 p-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">TOP {index + 1}</Badge>
                <span className="text-sm font-medium text-slate-900">{item.project}</span>
              </div>
              <p className="text-xs text-slate-500">{item.category}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-900">{item.amount}</p>
              <p className="text-xs text-rose-500">重点关注</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
