import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownWideNarrow,
  ArrowUpWideNarrow,
  BadgeCheck,
  FileClock,
  LoaderCircle,
  ReceiptText,
  ShieldCheck,
  UsersRound,
  WalletCards,
} from "lucide-react";
import { AIInsightCard } from "@/components/mobile/ai-insight-card";
import { Chart } from "@/components/mobile/chart";
import { ChartPanel } from "@/components/mobile/chart-panel";
import { MetricCard } from "@/components/mobile/metric-card";
import { RankingList } from "@/components/mobile/ranking-list";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  getBudgetCompletionRingOption,
  getBudgetDepartmentBarOption,
  getBudgetStandardExpenseOption,
} from "@/charts/schoolFinanceFusionOptions";
import {
  getExpenseCategoryOption,
  getMonthlyTrendOption,
  getVendorRankingOption,
} from "@/charts/schoolFinanceOptions";
import {
  getHorizontalRankingOption,
  getMultiLineOption,
  getSingleLineOption,
  getStackedBarOption,
} from "@/charts/schoolFinanceV2Options";
import type {
  FinancialPeriod,
  GuaranteeFocusType,
  GuaranteeTopicSection,
  ReimbursementTopicSection,
} from "@/types/schoolFinanceV2";
import type {
  FinancialAnalysisFusionData,
  LegacyBudgetTopicSection,
} from "@/types/schoolFinanceFusion";

type FusionTopic = "budget" | "reimbursement" | "personnel" | "guarantee";
type SortMode = "desc" | "asc";

const topicMeta: Record<FusionTopic, { label: string; icon: typeof WalletCards }> = {
  budget: { label: "预算", icon: WalletCards },
  reimbursement: { label: "报销", icon: ReceiptText },
  personnel: { label: "人员", icon: UsersRound },
  guarantee: { label: "保障", icon: ShieldCheck },
};

const transitionLabelMap: Record<string, typeof FileClock> = {
  applying: FileClock,
  additional: LoaderCircle,
  approved: BadgeCheck,
  reimbursing: ReceiptText,
};

const currencyFormatter = new Intl.NumberFormat("zh-CN", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

interface FinancialAnalysisFusionTabProps {
  data: FinancialAnalysisFusionData;
  activePeriod: FinancialPeriod;
}

export function FinancialAnalysisFusionTab({
  data,
  activePeriod,
}: FinancialAnalysisFusionTabProps) {
  const [activeTopic, setActiveTopic] = useState<FusionTopic>("budget");
  const snapshot = data.snapshots[activePeriod];

  useEffect(() => {
    setActiveTopic("budget");
  }, [activePeriod]);

  return (
    <section className="space-y-4">
      <div className="mobile-tabs -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {(Object.keys(topicMeta) as FusionTopic[]).map((topic) => {
          const meta = topicMeta[topic];
          const Icon = meta.icon;
          const isActive = topic === activeTopic;

          return (
            <button
              key={topic}
              type="button"
              onClick={() => setActiveTopic(topic)}
              className={`flex h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors ${
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
      {activeTopic === "personnel" ? (
        <PersonnelTopicContent section={snapshot.personnel} />
      ) : null}
      {activeTopic === "guarantee" ? (
        <GuaranteeTopicContent section={snapshot.guarantee} />
      ) : null}
    </section>
  );
}

function BudgetTopicContent({ section }: { section: LegacyBudgetTopicSection }) {
  const [sortMode, setSortMode] = useState<SortMode>("desc");

  const sortedDepartments = useMemo(() => {
    const list = [...section.departmentCompletion];
    list.sort((a, b) => (sortMode === "desc" ? b.ratio - a.ratio : a.ratio - b.ratio));
    return list;
  }, [section.departmentCompletion, sortMode]);

  const maxTransitionAmount = Math.max(...section.inTransitItems.map((item) => item.amount), 1);

  return (
    <div className="space-y-4">
      <TopicIntro
        title="预算"
        caption="沿用线上预算页"
        description="预算主题先保留现有预算报表表现方式，再纳入统一的财务分析主题页。"
      />

      <Card className="border-white/70 bg-white/92 backdrop-blur">
        <CardContent className="space-y-4 p-4">
          <div className="text-center">
            <p className="text-sm text-slate-500">本期预算总额(元)</p>
            <p className="mt-2 text-[32px] font-semibold tracking-tight text-slate-950">
              {currencyFormatter.format(section.totalBudget)}
            </p>
          </div>

          <div className="mx-auto max-w-[260px]">
            <Chart
              className="h-[220px] w-full"
              option={getBudgetCompletionRingOption(section.completionRate)}
            />
          </div>

          <div className="space-y-4">
            {section.overviewItems.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between gap-3 border-t border-slate-100 pt-4 first:border-t-0 first:pt-0"
              >
                <div className="flex items-center gap-3 text-sm text-slate-700">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span>{item.label}</span>
                </div>
                <span className="text-right text-[18px] font-medium text-slate-950">
                  {currencyFormatter.format(item.value)}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <ChartPanel
        title="部门完成率"
        badge="单位：%"
        rightSlot={
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-8 gap-1.5 px-3"
            onClick={() =>
              setSortMode((current) => (current === "desc" ? "asc" : "desc"))
            }
          >
            {sortMode === "desc" ? (
              <ArrowDownWideNarrow className="h-3.5 w-3.5" />
            ) : (
              <ArrowUpWideNarrow className="h-3.5 w-3.5" />
            )}
            {sortMode === "desc" ? "降序展示" : "升序展示"}
          </Button>
        }
      >
        <Chart
          className="chart-sm"
          option={getBudgetDepartmentBarOption(sortedDepartments)}
        />
      </ChartPanel>

      <ChartPanel title="在途预算" badge="单位：元">
        <div className="space-y-5">
          {section.inTransitItems.map((item) => {
            const ratio = Math.max((item.amount / maxTransitionAmount) * 100, 4);
            const Icon = transitionLabelMap[item.key] ?? ReceiptText;

            return (
              <div key={item.key} className="flex items-start gap-3">
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-amber-500">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="text-base font-medium text-slate-900">{item.label}</span>
                    <span className="text-right text-[18px] font-medium text-slate-950">
                      {currencyFormatter.format(item.amount)}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.min(ratio, 100)}%`,
                        background: item.color,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ChartPanel>

      <ChartPanel title="标准经费支出" badge="单位：元">
        <div className="grid grid-cols-[148px_1fr] items-center gap-3">
          <Chart
            className="chart-xs"
            option={getBudgetStandardExpenseOption(
              section.standardExpense.totalAmount,
              section.standardExpense.highlightLabel,
              section.standardExpense.highlightRate,
              section.standardExpense.items,
            )}
          />
          <div className="space-y-3">
            {section.standardExpense.items.map((item) => (
              <div key={item.key} className="space-y-1.5">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="flex items-center gap-2 text-slate-700">
                    <span
                      className="h-3 w-3 rounded-sm"
                      style={{ backgroundColor: item.color }}
                    />
                    {item.label}
                  </span>
                  <span className="text-slate-900">
                    {currencyFormatter.format(item.amount)}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${
                        section.standardExpense.totalAmount > 0
                          ? Math.max(
                              (item.amount / section.standardExpense.totalAmount) * 100,
                              item.amount > 0 ? 4 : 0,
                            )
                          : 0
                      }%`,
                      background: item.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </ChartPanel>

      <AIInsightCard insight={section.insight} />
    </div>
  );
}

function ReimbursementTopicContent({ section }: { section: ReimbursementTopicSection }) {
  return (
    <div className="space-y-4">
      <TopicIntro
        title="报销"
        caption="优先接入"
        description="报销主题最容易落地，适合先把趋势、结构、供应商和大额单据分析接进融合版。"
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
  section: FinancialAnalysisFusionData["snapshots"][FinancialPeriod]["personnel"];
}) {
  return (
    <div className="space-y-4">
      <TopicIntro
        title="人员"
        caption="数据依赖最重"
        description="人员主题优先做结构与趋势，后续再根据标准化明细继续加人数、人均和部门对比。"
      />
      <MetricsGrid metrics={section.metrics} />

      <ChartPanel
        title="月度人员费用构成"
        badge="时间 × 费用类型"
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
        caption="分类先行"
        description="保障主题先把分类映射做稳定，再看月度构成和单项趋势，适合逐步替换人工汇总。"
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

function MetricsGrid({
  metrics,
}: {
  metrics: Array<{
    label: string;
    value: string;
    trend: string;
    trendState: "up" | "down" | "warning";
  }>;
}) {
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
