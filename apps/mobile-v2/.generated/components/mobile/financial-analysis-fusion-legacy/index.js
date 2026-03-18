import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef, useEffect, useImperativeHandle, useMemo, useState, } from "react";
import { ArrowDownWideNarrow, ArrowUpWideNarrow, ReceiptText, ShieldCheck, UsersRound, WalletCards, } from "@/components/mobile/legacy-icons";
import { Chart } from "@/components/mobile/chart";
import { LegacyFirstUseCoachmark } from "@/components/mobile/legacy-first-use-coachmark";
import { getBudgetCompletionRingOption, getBudgetDepartmentBarOption, getBudgetStandardExpenseOption, } from "@/charts/schoolFinanceFusionOptions";
import { getExpenseCategoryOption, getMonthlyTrendOption, getVendorRankingOption, } from "@/charts/schoolFinanceOptions";
import { getHorizontalRankingOption, getMultiLineOption, getSingleLineOption, getStackedBarOption, } from "@/charts/schoolFinanceV2Options";
import styles from "./index.less";
const topicMeta = {
    budget: { label: "预算", icon: WalletCards },
    reimbursement: { label: "报销", icon: ReceiptText },
    personnel: { label: "人员", icon: UsersRound },
    guarantee: { label: "保障", icon: ShieldCheck },
};
const metricTrendClassMap = {
    up: styles.legacyMetricCardTrendUp,
    down: styles.legacyMetricCardTrendDown,
    warning: styles.legacyMetricCardTrendWarning,
};
const currencyFormatter = new Intl.NumberFormat("zh-CN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});
function cx(...classNames) {
    return classNames.filter(Boolean).join(" ");
}
export function FinancialAnalysisFusionLegacy({ data, activePeriod, periodControl, className, style, }) {
    const [activeTopic, setActiveTopic] = useState("budget");
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
    const handleCoachmarkChange = (visible) => {
        setShowCoachmark(visible);
        if (!visible && typeof window !== "undefined") {
            window.localStorage.setItem("aicfo-mobile-fusion-first-use-coachmark-v1", "1");
        }
    };
    return (_jsxs("div", { className: cx(styles.legacyAnalysis, className), style: style, children: [_jsx(LegacyTopicTabs, { activeTopic: activeTopic, onChange: setActiveTopic }), _jsx(LegacyFirstUseCoachmark, { visible: showCoachmark, onVisibleChange: handleCoachmarkChange }), activeTopic === "budget" ? (_jsx(BudgetTopicContent, { section: snapshot.budget, periodControl: periodControl })) : null, activeTopic === "reimbursement" ? (_jsx(ReimbursementTopicContent, { section: snapshot.reimbursement, periodControl: periodControl })) : null, activeTopic === "personnel" ? (_jsx(PersonnelTopicContent, { section: snapshot.personnel, periodControl: periodControl })) : null, activeTopic === "guarantee" ? (_jsx(GuaranteeTopicContent, { section: snapshot.guarantee, periodControl: periodControl })) : null] }));
}
const LegacyTopicTabs = forwardRef(function LegacyTopicTabs({ activeTopic, defaultTopic = "budget", onChange, className, style }, ref) {
    const [innerTopic, setInnerTopic] = useState(defaultTopic);
    const currentTopic = activeTopic ?? innerTopic;
    useImperativeHandle(ref, () => ({
        focusActive: () => {
            const element = document.querySelector('[data-active-topic-tab="true"]');
            element?.focus();
        },
    }));
    const handleClick = (topic) => {
        if (activeTopic === undefined) {
            setInnerTopic(topic);
        }
        onChange?.(topic);
    };
    return (_jsx("div", { className: cx(styles.legacyTopicTabs, className), style: style, children: Object.keys(topicMeta).map((topic) => {
            const meta = topicMeta[topic];
            const Icon = meta.icon;
            const isActive = currentTopic === topic;
            return (_jsxs("button", { type: "button", className: cx(styles.legacyTopicTabsButton, isActive && styles.legacyTopicTabsButtonActive), onClick: () => handleClick(topic), "data-active-topic-tab": isActive ? "true" : undefined, children: [_jsx(Icon, { className: styles.legacyTopicTabsIcon }), _jsx("span", { children: meta.label })] }, topic));
        }) }));
});
function BudgetTopicContent({ section, periodControl, }) {
    const [sortMode, setSortMode] = useState("desc");
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
    return (_jsxs("div", { className: styles.legacyTopic, children: [_jsx(LegacyTopicHeading, { title: "\u9884\u7B97\u6267\u884C\u5206\u6790", rightSlot: periodControl }), _jsxs(LegacyCard, { className: styles.legacyBudgetHero, children: [_jsxs("div", { className: styles.legacyBudgetHeroHeadline, children: [_jsx("div", { className: styles.legacyBudgetHeroLabel, children: "\u672C\u671F\u9884\u7B97\u603B\u989D(\u5143)" }), _jsx("div", { className: styles.legacyBudgetHeroValue, children: currencyFormatter.format(section.totalBudget) })] }), _jsx("div", { className: styles.legacyBudgetHeroRing, children: _jsx(Chart, { className: cx(styles.chartFrame, styles.legacyChartRing), option: getBudgetCompletionRingOption(section.completionRate) }) }), _jsx("div", { className: styles.legacyBudgetHeroSummaryList, children: section.overviewItems.map((item) => (_jsxs("div", { className: styles.legacyBudgetSummaryRow, children: [_jsxs("div", { className: styles.legacyBudgetSummaryRowLabel, children: [_jsx("span", { className: styles.legacyBudgetSummaryRowDot, style: { backgroundColor: item.color } }), _jsx("span", { children: item.label })] }), _jsx("div", { className: styles.legacyBudgetSummaryRowValue, children: currencyFormatter.format(item.value) })] }, item.label))) })] }), _jsx(LegacySectionCard, { title: "\u90E8\u95E8\u5B8C\u6210\u7387", badge: "\u5355\u4F4D\uFF1A%", rightSlot: _jsxs("button", { type: "button", className: styles.legacyGhostButton, onClick: () => setSortMode((current) => (current === "desc" ? "asc" : "desc")), children: [sortMode === "desc" ? (_jsx(ArrowDownWideNarrow, { className: styles.legacyGhostButtonIcon })) : (_jsx(ArrowUpWideNarrow, { className: styles.legacyGhostButtonIcon })), _jsx("span", { children: sortMode === "desc" ? "降序展示" : "升序展示" })] }), children: _jsx(Chart, { className: cx(styles.chartFrame, styles.legacyChartMedium), option: getBudgetDepartmentBarOption(sortedDepartments) }) }), _jsx(LegacySectionCard, { title: "\u5728\u9014\u9884\u7B97", badge: "\u5355\u4F4D\uFF1A\u5143", children: _jsx("div", { className: styles.legacyProgressList, children: section.inTransitItems.map((item) => (_jsxs("div", { children: [_jsxs("div", { className: styles.legacyProgressItemHeader, children: [_jsx("span", { className: styles.legacyProgressItemTitle, children: item.label }), _jsx("span", { className: styles.legacyProgressItemValue, children: currencyFormatter.format(item.amount) })] }), _jsx("div", { className: styles.legacyProgressItemTrack, children: _jsx("div", { className: styles.legacyProgressItemFill, style: {
                                        width: animateTransit
                                            ? `${Math.max((item.amount / maxTransitAmount) * 100, item.amount > 0 ? 4 : 0)}%`
                                            : "0%",
                                        backgroundColor: item.color,
                                    } }) })] }, item.key))) }) }), _jsx(LegacySectionCard, { title: "\u6807\u51C6\u7ECF\u8D39\u652F\u51FA", badge: "\u5355\u4F4D\uFF1A\u5143", children: _jsxs("div", { className: styles.legacyBudgetExpense, children: [_jsx("div", { className: styles.legacyBudgetExpenseChart, children: _jsx(Chart, { className: cx(styles.chartFrame, styles.legacyChartSmall), option: getBudgetStandardExpenseOption(section.standardExpense.totalAmount, section.standardExpense.highlightLabel, section.standardExpense.highlightRate, section.standardExpense.items) }) }), _jsx("div", { className: styles.legacyBudgetExpenseLegend, children: section.standardExpense.items.map((item) => (_jsx("div", { className: styles.legacyBudgetExpenseLegendItem, children: _jsxs("div", { className: styles.legacyBudgetExpenseLegendLine, children: [_jsxs("span", { className: styles.legacyBudgetExpenseLegendLabel, children: [_jsx("span", { className: styles.legacyBudgetExpenseLegendDot, style: { backgroundColor: item.color } }), item.label] }), _jsx("span", { className: styles.legacyBudgetExpenseLegendValue, children: currencyFormatter.format(item.amount) })] }) }, item.key))) })] }) }), _jsx(LegacyInsightCard, { insight: section.insight })] }));
}
function ReimbursementTopicContent({ section, periodControl, }) {
    return (_jsxs("div", { className: styles.legacyTopic, children: [_jsx(LegacyTopicHeading, { title: "\u62A5\u9500\u884C\u4E3A\u5206\u6790", rightSlot: periodControl }), _jsx(LegacyMetricsGrid, { metrics: section.metrics }), _jsx(LegacySectionCard, { title: "\u62A5\u9500\u91D1\u989D\u4E0E\u7B14\u6570\u8D8B\u52BF", badge: "\u91D1\u989D / \u7B14\u6570", footer: _jsx(LegacyLegend, { items: [["#2F6BFF", "报销金额"], ["#18B47A", "报销笔数"]] }), children: _jsx(Chart, { className: cx(styles.chartFrame, styles.legacyChartLarge), option: getMonthlyTrendOption(section.monthlyTrend) }) }), _jsx(LegacyInsightCard, { insight: section.monthlyInsight }), _jsx(LegacySectionCard, { title: "\u62A5\u9500\u7C7B\u522B\u7ED3\u6784", badge: "\u7C7B\u522B\u53E3\u5F84", children: _jsxs("div", { className: styles.legacySplitPanel, children: [_jsx(Chart, { className: cx(styles.chartFrame, styles.legacyChartSmall, styles.legacySplitPanelChart), option: getExpenseCategoryOption(section.categoryBreakdown) }), _jsx(LegacyRankingList, { items: section.categoryBreakdown })] }) }), _jsx(LegacyInsightCard, { insight: section.categoryInsight }), _jsx(LegacySectionCard, { title: "\u9AD8\u9891\u4F9B\u5E94\u5546 TOP5", badge: "\u4F9B\u5E94\u5546", children: _jsx(Chart, { className: cx(styles.chartFrame, styles.legacyChartMedium), option: getVendorRankingOption(section.topVendors) }) }), _jsx(LegacyInsightCard, { insight: section.vendorInsight }), _jsx(LegacySectionCard, { title: "\u5927\u989D\u62A5\u9500\u6392\u884C", badge: "\u91CD\u70B9\u9879\u76EE", children: _jsx(LegacyLargeExpenseList, { items: section.largeExpenses }) }), _jsx(LegacyInsightCard, { insight: section.largeExpenseInsight })] }));
}
function PersonnelTopicContent({ section, periodControl, }) {
    return (_jsxs("div", { className: styles.legacyTopic, children: [_jsx(LegacyTopicHeading, { title: "\u4EBA\u5458\u8D39\u7528\u5206\u6790", rightSlot: periodControl }), _jsx(LegacyMetricsGrid, { metrics: section.metrics }), _jsx(LegacySectionCard, { title: "\u6708\u5EA6\u4EBA\u5458\u8D39\u7528\u6784\u6210", badge: "\u65F6\u95F4 \u00D7 \u8D39\u7528\u7C7B\u578B", footer: _jsx(LegacySeriesLegend, { series: section.monthlyComposition.series }), children: _jsx(Chart, { className: cx(styles.chartFrame, styles.legacyChartLarge), option: getStackedBarOption(section.monthlyComposition) }) }), _jsx(LegacyInsightCard, { insight: section.compositionInsight }), _jsx(LegacySectionCard, { title: "\u91CD\u70B9\u8D39\u7528\u8D8B\u52BF", badge: "\u5DE5\u8D44 / \u7EE9\u6548 / \u793E\u4FDD / \u8865\u8D34", children: _jsx(Chart, { className: cx(styles.chartFrame, styles.legacyChartLarge), option: getMultiLineOption(section.focusTrend) }) }), _jsx(LegacyInsightCard, { insight: section.focusInsight }), _jsx(LegacySectionCard, { title: "\u5F53\u524D\u5468\u671F\u8D39\u7528\u7ED3\u6784", badge: "\u8D39\u7528\u7C7B\u578B", children: _jsx(Chart, { className: cx(styles.chartFrame, styles.legacyChartMedium), option: getHorizontalRankingOption(section.structureBreakdown) }) }), _jsx(LegacyInsightCard, { insight: section.structureInsight })] }));
}
function GuaranteeTopicContent({ section, periodControl, }) {
    const [activeFocus, setActiveFocus] = useState(section.focusOptions[0]?.value ?? "water");
    useEffect(() => {
        setActiveFocus(section.focusOptions[0]?.value ?? "water");
    }, [section.focusOptions]);
    return (_jsxs("div", { className: styles.legacyTopic, children: [_jsx(LegacyTopicHeading, { title: "\u57FA\u672C\u4FDD\u969C\u8D39\u7528\u5206\u6790", rightSlot: periodControl }), _jsx(LegacyMetricsGrid, { metrics: section.metrics }), _jsx(LegacySectionCard, { title: "\u57FA\u7840\u4FDD\u969C\u6708\u5EA6\u6784\u6210", badge: "\u603B\u89C8", footer: _jsx(LegacySeriesLegend, { series: section.monthlyComposition.series }), children: _jsx(Chart, { className: cx(styles.chartFrame, styles.legacyChartLarge), option: getStackedBarOption(section.monthlyComposition) }) }), _jsx(LegacyInsightCard, { insight: section.compositionInsight }), _jsx(LegacySectionCard, { title: "\u5355\u9879\u4FDD\u969C\u8D8B\u52BF", badge: "\u6309\u8D39\u7528\u5207\u6362", rightSlot: _jsx("div", { className: styles.legacySegmentTabs, children: section.focusOptions.map((item) => (_jsx("button", { type: "button", className: cx(styles.legacySegmentTabsButton, activeFocus === item.value && styles.legacySegmentTabsButtonActive), onClick: () => setActiveFocus(item.value), children: item.label }, item.value))) }), children: _jsx(Chart, { className: cx(styles.chartFrame, styles.legacyChartMedium), option: getSingleLineOption(section.focusTrends[activeFocus]) }) }), _jsx(LegacyInsightCard, { insight: section.focusInsights[activeFocus] }), _jsx(LegacySectionCard, { title: "\u5F53\u524D\u5468\u671F\u8D39\u7528\u7ED3\u6784", badge: "\u4FDD\u969C\u7C7B\u522B", children: _jsx(Chart, { className: cx(styles.chartFrame, styles.legacyChartMedium), option: getHorizontalRankingOption(section.structureBreakdown) }) }), _jsx(LegacyInsightCard, { insight: section.structureInsight })] }));
}
function LegacyCard({ className, style, children }) {
    return (_jsx("div", { className: cx(styles.legacyCard, className), style: style, children: children }));
}
function LegacySectionCard({ title, badge, rightSlot, footer, className, style, children, }) {
    return (_jsxs(LegacyCard, { className: cx(styles.legacySectionCard, className), style: style, children: [_jsxs("div", { className: styles.legacySectionCardHeader, children: [_jsx("div", { className: styles.legacySectionCardTitle, children: title }), _jsxs("div", { className: styles.legacySectionCardActions, children: [rightSlot, badge ? _jsx("span", { className: styles.legacyBadge, children: badge }) : null] })] }), _jsx("div", { className: styles.legacySectionCardContent, children: children }), footer ? _jsx("div", { className: styles.legacySectionCardFooter, children: footer }) : null] }));
}
function LegacyTopicHeading({ title, rightSlot, }) {
    return (_jsxs("div", { className: styles.legacyTopicHeading, children: [_jsx("div", { className: styles.legacyTopicHeadingTitle, children: title }), rightSlot ? _jsx("div", { className: styles.legacyTopicHeadingActions, children: rightSlot }) : null] }));
}
function LegacyMetricsGrid({ metrics, }) {
    return (_jsx("div", { className: styles.legacyMetricsGrid, children: metrics.map((metric) => (_jsx(LegacyMetricCard, { metric: metric }, metric.label))) }));
}
function LegacyMetricCard({ metric, }) {
    return (_jsxs(LegacyCard, { className: styles.legacyMetricCard, children: [_jsx("div", { className: styles.legacyMetricCardLabel, children: metric.label }), _jsx("div", { className: styles.legacyMetricCardValue, children: metric.value }), _jsx("div", { className: cx(styles.legacyMetricCardTrend, metricTrendClassMap[metric.trendState]), children: metric.trend })] }));
}
function LegacyInsightCard({ insight, }) {
    return (_jsxs(LegacyCard, { className: styles.legacyInsightCard, children: [_jsx("div", { className: styles.legacyInsightCardTitle, children: insight.title }), _jsx("div", { className: styles.legacyInsightCardSummary, children: insight.summary }), _jsx("div", { className: styles.legacyInsightCardList, children: insight.bullets.map((bullet) => (_jsxs("div", { className: styles.legacyInsightCardItem, children: [_jsx("span", { className: styles.legacyInsightCardItemDot }), _jsx("span", { children: bullet })] }, bullet))) })] }));
}
function LegacyLegend({ items, }) {
    return (_jsx("div", { className: styles.legacyLegend, children: items.map(([color, label]) => (_jsxs("span", { className: styles.legacyLegendItem, children: [_jsx("span", { className: styles.legacyLegendDot, style: { backgroundColor: color } }), _jsx("span", { children: label })] }, label))) }));
}
function LegacySeriesLegend({ series, }) {
    return (_jsx(LegacyLegend, { items: series.map((item) => [item.color, item.name]) }));
}
function LegacyRankingList({ items, }) {
    const max = Math.max(...items.map((item) => item.value), 1);
    return (_jsx("div", { className: styles.legacyRankingList, children: items.map((item) => (_jsxs("div", { className: styles.legacyRankingListItem, children: [_jsxs("div", { className: styles.legacyRankingListHeader, children: [_jsx("span", { className: styles.legacyRankingListName, children: item.name }), _jsxs("span", { className: styles.legacyRankingListValue, children: [item.value, item.unit ?? "%"] })] }), _jsx("div", { className: styles.legacyRankingListTrack, children: _jsx("div", { className: styles.legacyRankingListFill, style: {
                            width: `${(item.value / max) * 100}%`,
                            backgroundColor: item.color ?? "#2F6BFF",
                        } }) })] }, item.name))) }));
}
function LegacyLargeExpenseList({ items, }) {
    return (_jsx("div", { className: styles.legacyLargeExpenseList, children: items.map((item, index) => (_jsxs("div", { className: styles.legacyLargeExpenseListItem, children: [_jsxs("div", { className: styles.legacyLargeExpenseListLeft, children: [_jsxs("span", { className: styles.legacyLargeExpenseListTag, children: ["TOP ", index + 1] }), _jsxs("div", { children: [_jsx("div", { className: styles.legacyLargeExpenseListName, children: item.project }), _jsx("div", { className: styles.legacyLargeExpenseListCategory, children: item.category })] })] }), _jsxs("div", { className: styles.legacyLargeExpenseListRight, children: [_jsx("div", { className: styles.legacyLargeExpenseListAmount, children: item.amount }), _jsx("div", { className: styles.legacyLargeExpenseListRemark, children: "\u91CD\u70B9\u5173\u6CE8" })] })] }, item.project))) }));
}
