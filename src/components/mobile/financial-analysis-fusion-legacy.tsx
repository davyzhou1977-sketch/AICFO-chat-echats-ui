import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import type { CSSProperties, PropsWithChildren, ReactNode } from "react";
import {
  ArrowDownWideNarrow,
  ArrowUpWideNarrow,
  ReceiptText,
  ShieldCheck,
  UsersRound,
  WalletCards,
} from "lucide-react";
import { Chart } from "@/components/mobile/chart";
import { LegacyFirstUseCoachmark } from "@/components/mobile/legacy-first-use-coachmark";
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

const currencyFormatter = new Intl.NumberFormat("zh-CN", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function cx(...classNames: Array<string | undefined | false>) {
  return classNames.filter(Boolean).join(" ");
}

export interface LegacyTopicTabsRef {
  focusActive: () => void;
}

interface FinancialAnalysisFusionLegacyProps {
  data: FinancialAnalysisFusionData;
  activePeriod: FinancialPeriod;
  periodControl?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function FinancialAnalysisFusionLegacy({
  data,
  activePeriod,
  periodControl,
  className,
  style,
}: FinancialAnalysisFusionLegacyProps) {
  const [activeTopic, setActiveTopic] = useState<FusionTopic>("budget");
  const [showCoachmark, setShowCoachmark] = useState(false);
  const snapshot = data.snapshots[activePeriod];

  useEffect(() => {
    setActiveTopic("budget");
  }, [activePeriod]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const storageKey = "aicfo-mobile-fusion-first-use-coachmark-v1";
    const hasDismissed = window.localStorage.getItem(storageKey) === "1";

    if (!hasDismissed) {
      setShowCoachmark(true);
    }
  }, []);

  const handleCoachmarkChange = (visible: boolean) => {
    setShowCoachmark(visible);

    if (!visible && typeof window !== "undefined") {
      window.localStorage.setItem("aicfo-mobile-fusion-first-use-coachmark-v1", "1");
    }
  };

  return (
    <div className={cx("legacy-analysis", className)} style={style}>
      <LegacyTopicTabs activeTopic={activeTopic} onChange={setActiveTopic} />
      <LegacyFirstUseCoachmark
        visible={showCoachmark}
        onVisibleChange={handleCoachmarkChange}
      />

      {activeTopic === "budget" ? (
        <BudgetTopicContent section={snapshot.budget} periodControl={periodControl} />
      ) : null}
      {activeTopic === "reimbursement" ? (
        <ReimbursementTopicContent
          section={snapshot.reimbursement}
          periodControl={periodControl}
        />
      ) : null}
      {activeTopic === "personnel" ? (
        <PersonnelTopicContent section={snapshot.personnel} periodControl={periodControl} />
      ) : null}
      {activeTopic === "guarantee" ? (
        <GuaranteeTopicContent section={snapshot.guarantee} periodControl={periodControl} />
      ) : null}
    </div>
  );
}

interface LegacyTopicTabsProps {
  activeTopic?: FusionTopic;
  defaultTopic?: FusionTopic;
  onChange?: (topic: FusionTopic) => void;
  className?: string;
  style?: CSSProperties;
}

const LegacyTopicTabs = forwardRef<LegacyTopicTabsRef, LegacyTopicTabsProps>(
  function LegacyTopicTabs(
    { activeTopic, defaultTopic = "budget", onChange, className, style },
    ref,
  ) {
    const [innerTopic, setInnerTopic] = useState<FusionTopic>(defaultTopic);
    const currentTopic = activeTopic ?? innerTopic;

    useImperativeHandle(ref, () => ({
      focusActive: () => {
        const element = document.querySelector(
          ".legacy-topic-tabs__button--active",
        ) as HTMLButtonElement | null;
        element?.focus();
      },
    }));

    const handleClick = (topic: FusionTopic) => {
      if (activeTopic === undefined) {
        setInnerTopic(topic);
      }
      onChange?.(topic);
    };

    return (
      <div className={cx("legacy-topic-tabs", className)} style={style}>
        {(Object.keys(topicMeta) as FusionTopic[]).map((topic) => {
          const meta = topicMeta[topic];
          const Icon = meta.icon;
          const isActive = currentTopic === topic;

          return (
            <button
              key={topic}
              type="button"
              className={cx(
                "legacy-topic-tabs__button",
                isActive && "legacy-topic-tabs__button--active",
              )}
              onClick={() => handleClick(topic)}
            >
              <Icon className="legacy-topic-tabs__icon" />
              <span>{meta.label}</span>
            </button>
          );
        })}
      </div>
    );
  },
);

function BudgetTopicContent({
  section,
  periodControl,
}: {
  section: LegacyBudgetTopicSection;
  periodControl?: ReactNode;
}) {
  const [sortMode, setSortMode] = useState<SortMode>("desc");
  const [animateTransit, setAnimateTransit] = useState(false);

  const sortedDepartments = useMemo(() => {
    const list = [...section.departmentCompletion];
    list.sort((a, b) => (sortMode === "desc" ? b.ratio - a.ratio : a.ratio - b.ratio));
    return list;
  }, [section.departmentCompletion, sortMode]);

  const maxTransitAmount = Math.max(...section.inTransitItems.map((item) => item.amount), 1);

  useEffect(() => {
    setAnimateTransit(false);
    const timer = window.setTimeout(() => {
      setAnimateTransit(true);
    }, 80);

    return () => {
      window.clearTimeout(timer);
    };
  }, [section.inTransitItems]);

  return (
    <div className="legacy-topic">
      <LegacyTopicHeading title="预算执行分析" rightSlot={periodControl} />

      <LegacyCard className="legacy-budget-hero">
        <div className="legacy-budget-hero__headline">
          <div className="legacy-budget-hero__label">本期预算总额(元)</div>
          <div className="legacy-budget-hero__value">
            {currencyFormatter.format(section.totalBudget)}
          </div>
        </div>

        <div className="legacy-budget-hero__ring">
          <Chart
            className="legacy-chart legacy-chart--ring"
            option={getBudgetCompletionRingOption(section.completionRate)}
          />
        </div>

        <div className="legacy-budget-hero__summary-list">
          {section.overviewItems.map((item) => (
            <div key={item.label} className="legacy-budget-summary-row">
              <div className="legacy-budget-summary-row__label">
                <span
                  className="legacy-budget-summary-row__dot"
                  style={{ backgroundColor: item.color }}
                />
                <span>{item.label}</span>
              </div>
              <div className="legacy-budget-summary-row__value">
                {currencyFormatter.format(item.value)}
              </div>
            </div>
          ))}
        </div>
      </LegacyCard>

      <LegacySectionCard
        title="部门完成率"
        badge="单位：%"
        rightSlot={
          <button
            type="button"
            className="legacy-ghost-button"
            onClick={() =>
              setSortMode((current) => (current === "desc" ? "asc" : "desc"))
            }
          >
            {sortMode === "desc" ? (
              <ArrowDownWideNarrow className="legacy-ghost-button__icon" />
            ) : (
              <ArrowUpWideNarrow className="legacy-ghost-button__icon" />
            )}
            <span>{sortMode === "desc" ? "降序展示" : "升序展示"}</span>
          </button>
        }
      >
        <Chart
          className="legacy-chart legacy-chart--medium"
          option={getBudgetDepartmentBarOption(sortedDepartments)}
        />
      </LegacySectionCard>

      <LegacySectionCard title="在途预算" badge="单位：元">
        <div className="legacy-progress-list">
          {section.inTransitItems.map((item) => (
            <div key={item.key} className="legacy-progress-item">
              <div className="legacy-progress-item__header">
                <span className="legacy-progress-item__title">{item.label}</span>
                <span className="legacy-progress-item__value">
                  {currencyFormatter.format(item.amount)}
                </span>
              </div>
              <div className="legacy-progress-item__track">
                <div
                  className="legacy-progress-item__fill"
                  style={{
                    width: animateTransit
                      ? `${Math.max(
                          (item.amount / maxTransitAmount) * 100,
                          item.amount > 0 ? 4 : 0,
                        )}%`
                      : "0%",
                    backgroundColor: item.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </LegacySectionCard>

      <LegacySectionCard title="标准经费支出" badge="单位：元">
        <div className="legacy-budget-expense">
          <div className="legacy-budget-expense__chart">
            <Chart
              className="legacy-chart legacy-chart--small"
              option={getBudgetStandardExpenseOption(
                section.standardExpense.totalAmount,
                section.standardExpense.highlightLabel,
                section.standardExpense.highlightRate,
                section.standardExpense.items,
              )}
            />
          </div>
          <div className="legacy-budget-expense__legend">
            {section.standardExpense.items.map((item) => (
              <div key={item.key} className="legacy-budget-expense__legend-item">
                <div className="legacy-budget-expense__legend-line">
                  <span className="legacy-budget-expense__legend-label">
                    <span
                      className="legacy-budget-expense__legend-dot"
                      style={{ backgroundColor: item.color }}
                    />
                    {item.label}
                  </span>
                  <span className="legacy-budget-expense__legend-value">
                    {currencyFormatter.format(item.amount)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </LegacySectionCard>

      <LegacyInsightCard insight={section.insight} />
    </div>
  );
}

function ReimbursementTopicContent({
  section,
  periodControl,
}: {
  section: ReimbursementTopicSection;
  periodControl?: ReactNode;
}) {
  return (
    <div className="legacy-topic">
      <LegacyTopicHeading title="报销行为分析" rightSlot={periodControl} />

      <LegacyMetricsGrid metrics={section.metrics} />

      <LegacySectionCard
        title="报销金额与笔数趋势"
        badge="金额 / 笔数"
        footer={<LegacyLegend items={[["#2F6BFF", "报销金额"], ["#18B47A", "报销笔数"]]} />}
      >
        <Chart
          className="legacy-chart legacy-chart--large"
          option={getMonthlyTrendOption(section.monthlyTrend)}
        />
      </LegacySectionCard>
      <LegacyInsightCard insight={section.monthlyInsight} />

      <LegacySectionCard title="报销类别结构" badge="类别口径">
        <div className="legacy-split-panel">
          <Chart
            className="legacy-chart legacy-chart--small"
            option={getExpenseCategoryOption(section.categoryBreakdown)}
          />
          <LegacyRankingList items={section.categoryBreakdown} />
        </div>
      </LegacySectionCard>
      <LegacyInsightCard insight={section.categoryInsight} />

      <LegacySectionCard title="高频供应商 TOP5" badge="供应商">
        <Chart
          className="legacy-chart legacy-chart--medium"
          option={getVendorRankingOption(section.topVendors)}
        />
      </LegacySectionCard>
      <LegacyInsightCard insight={section.vendorInsight} />

      <LegacySectionCard title="大额报销排行" badge="重点项目">
        <LegacyLargeExpenseList items={section.largeExpenses} />
      </LegacySectionCard>
      <LegacyInsightCard insight={section.largeExpenseInsight} />
    </div>
  );
}

function PersonnelTopicContent({
  section,
  periodControl,
}: {
  section: FinancialAnalysisFusionData["snapshots"][FinancialPeriod]["personnel"];
  periodControl?: ReactNode;
}) {
  return (
    <div className="legacy-topic">
      <LegacyTopicHeading title="人员费用分析" rightSlot={periodControl} />

      <LegacyMetricsGrid metrics={section.metrics} />

      <LegacySectionCard
        title="月度人员费用构成"
        badge="时间 × 费用类型"
        footer={<LegacySeriesLegend series={section.monthlyComposition.series} />}
      >
        <Chart
          className="legacy-chart legacy-chart--large"
          option={getStackedBarOption(section.monthlyComposition)}
        />
      </LegacySectionCard>
      <LegacyInsightCard insight={section.compositionInsight} />

      <LegacySectionCard title="重点费用趋势" badge="工资 / 绩效 / 社保 / 补贴">
        <Chart
          className="legacy-chart legacy-chart--large"
          option={getMultiLineOption(section.focusTrend)}
        />
      </LegacySectionCard>
      <LegacyInsightCard insight={section.focusInsight} />

      <LegacySectionCard title="当前周期费用结构" badge="费用类型">
        <Chart
          className="legacy-chart legacy-chart--medium"
          option={getHorizontalRankingOption(section.structureBreakdown)}
        />
      </LegacySectionCard>
      <LegacyInsightCard insight={section.structureInsight} />
    </div>
  );
}

function GuaranteeTopicContent({
  section,
  periodControl,
}: {
  section: GuaranteeTopicSection;
  periodControl?: ReactNode;
}) {
  const [activeFocus, setActiveFocus] = useState<GuaranteeFocusType>(
    section.focusOptions[0]?.value ?? "water",
  );

  useEffect(() => {
    setActiveFocus(section.focusOptions[0]?.value ?? "water");
  }, [section.focusOptions]);

  return (
    <div className="legacy-topic">
      <LegacyTopicHeading title="基本保障费用分析" rightSlot={periodControl} />

      <LegacyMetricsGrid metrics={section.metrics} />

      <LegacySectionCard
        title="基础保障月度构成"
        badge="总览"
        footer={<LegacySeriesLegend series={section.monthlyComposition.series} />}
      >
        <Chart
          className="legacy-chart legacy-chart--large"
          option={getStackedBarOption(section.monthlyComposition)}
        />
      </LegacySectionCard>
      <LegacyInsightCard insight={section.compositionInsight} />

      <LegacySectionCard
        title="单项保障趋势"
        badge="按费用切换"
        rightSlot={
          <div className="legacy-segment-tabs">
            {section.focusOptions.map((item) => (
              <button
                key={item.value}
                type="button"
                className={cx(
                  "legacy-segment-tabs__button",
                  activeFocus === item.value && "legacy-segment-tabs__button--active",
                )}
                onClick={() => setActiveFocus(item.value)}
              >
                {item.label}
              </button>
            ))}
          </div>
        }
      >
        <Chart
          className="legacy-chart legacy-chart--medium"
          option={getSingleLineOption(section.focusTrends[activeFocus])}
        />
      </LegacySectionCard>
      <LegacyInsightCard insight={section.focusInsights[activeFocus]} />

      <LegacySectionCard title="当前周期费用结构" badge="保障类别">
        <Chart
          className="legacy-chart legacy-chart--medium"
          option={getHorizontalRankingOption(section.structureBreakdown)}
        />
      </LegacySectionCard>
      <LegacyInsightCard insight={section.structureInsight} />
    </div>
  );
}

interface LegacyCardProps extends PropsWithChildren {
  className?: string;
  style?: CSSProperties;
}

function LegacyCard({ className, style, children }: LegacyCardProps) {
  return (
    <div className={cx("legacy-card", className)} style={style}>
      {children}
    </div>
  );
}

interface LegacySectionCardProps extends PropsWithChildren {
  title: string;
  badge?: string;
  rightSlot?: ReactNode;
  footer?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

function LegacySectionCard({
  title,
  badge,
  rightSlot,
  footer,
  className,
  style,
  children,
}: LegacySectionCardProps) {
  return (
    <LegacyCard className={cx("legacy-section-card", className)} style={style}>
      <div className="legacy-section-card__header">
        <div className="legacy-section-card__title">{title}</div>
        <div className="legacy-section-card__actions">
          {rightSlot}
          {badge ? <span className="legacy-badge">{badge}</span> : null}
        </div>
      </div>
      <div className="legacy-section-card__content">{children}</div>
      {footer ? <div className="legacy-section-card__footer">{footer}</div> : null}
    </LegacyCard>
  );
}

function LegacyTopicHeading({
  title,
  rightSlot,
}: {
  title: string;
  rightSlot?: ReactNode;
}) {
  return (
    <div className="legacy-topic-heading">
      <div className="legacy-topic-heading__title">{title}</div>
      {rightSlot ? <div className="legacy-topic-heading__actions">{rightSlot}</div> : null}
    </div>
  );
}

function LegacyMetricsGrid({
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
    <div className="legacy-metrics-grid">
      {metrics.map((metric) => (
        <LegacyMetricCard key={metric.label} metric={metric} />
      ))}
    </div>
  );
}

function LegacyMetricCard({
  metric,
}: {
  metric: {
    label: string;
    value: string;
    trend: string;
    trendState: "up" | "down" | "warning";
  };
}) {
  return (
    <LegacyCard className="legacy-metric-card">
      <div className="legacy-metric-card__label">{metric.label}</div>
      <div className="legacy-metric-card__value">{metric.value}</div>
      <div
        className={cx(
          "legacy-metric-card__trend",
          `legacy-metric-card__trend--${metric.trendState}`,
        )}
      >
        {metric.trend}
      </div>
    </LegacyCard>
  );
}

function LegacyInsightCard({
  insight,
}: {
  insight: {
    title: string;
    summary: string;
    bullets: string[];
  };
}) {
  return (
    <LegacyCard className="legacy-insight-card">
      <div className="legacy-insight-card__title">{insight.title}</div>
      <div className="legacy-insight-card__summary">{insight.summary}</div>
      <div className="legacy-insight-card__list">
        {insight.bullets.map((bullet) => (
          <div key={bullet} className="legacy-insight-card__item">
            <span className="legacy-insight-card__item-dot" />
            <span>{bullet}</span>
          </div>
        ))}
      </div>
    </LegacyCard>
  );
}

function LegacyLegend({
  items,
}: {
  items: Array<[string, string]>;
}) {
  return (
    <div className="legacy-legend">
      {items.map(([color, label]) => (
        <span key={label} className="legacy-legend__item">
          <span className="legacy-legend__dot" style={{ backgroundColor: color }} />
          <span>{label}</span>
        </span>
      ))}
    </div>
  );
}

function LegacySeriesLegend({
  series,
}: {
  series: Array<{ name: string; color: string }>;
}) {
  return (
    <LegacyLegend items={series.map((item) => [item.color, item.name]) as Array<[string, string]>} />
  );
}

function LegacyRankingList({
  items,
}: {
  items: Array<{ name: string; value: number; color?: string; unit?: string }>;
}) {
  const max = Math.max(...items.map((item) => item.value), 1);

  return (
    <div className="legacy-ranking-list">
      {items.map((item) => (
        <div key={item.name} className="legacy-ranking-list__item">
          <div className="legacy-ranking-list__header">
            <span className="legacy-ranking-list__name">{item.name}</span>
            <span className="legacy-ranking-list__value">
              {item.value}
              {item.unit ?? "%"}
            </span>
          </div>
          <div className="legacy-ranking-list__track">
            <div
              className="legacy-ranking-list__fill"
              style={{
                width: `${(item.value / max) * 100}%`,
                backgroundColor: item.color ?? "#2F6BFF",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function LegacyLargeExpenseList({
  items,
}: {
  items: Array<{ project: string; category: string; amount: string }>;
}) {
  return (
    <div className="legacy-large-expense-list">
      {items.map((item, index) => (
        <div key={item.project} className="legacy-large-expense-list__item">
          <div className="legacy-large-expense-list__left">
            <span className="legacy-large-expense-list__tag">TOP {index + 1}</span>
            <div>
              <div className="legacy-large-expense-list__name">{item.project}</div>
              <div className="legacy-large-expense-list__category">{item.category}</div>
            </div>
          </div>
          <div className="legacy-large-expense-list__right">
            <div className="legacy-large-expense-list__amount">{item.amount}</div>
            <div className="legacy-large-expense-list__remark">重点关注</div>
          </div>
        </div>
      ))}
    </div>
  );
}
