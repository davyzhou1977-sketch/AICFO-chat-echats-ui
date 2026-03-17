import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef, useEffect, useImperativeHandle, useMemo, useState, } from "react";
import { ArrowDownWideNarrow, ArrowUpWideNarrow, ReceiptText, ShieldCheck, UsersRound, WalletCards, } from "@/components/mobile/legacy-icons";
import { Chart } from "@/components/mobile/chart";
import { LegacyFirstUseCoachmark } from "@/components/mobile/legacy-first-use-coachmark";
import { getBudgetCompletionRingOption, getBudgetDepartmentBarOption, getBudgetStandardExpenseOption, } from "@/charts/schoolFinanceFusionOptions";
import { getExpenseCategoryOption, getMonthlyTrendOption, getVendorRankingOption, } from "@/charts/schoolFinanceOptions";
import { getHorizontalRankingOption, getMultiLineOption, getSingleLineOption, getStackedBarOption, } from "@/charts/schoolFinanceV2Options";
const topicMeta = {
    budget: { label: "预算", icon: WalletCards },
    reimbursement: { label: "报销", icon: ReceiptText },
    personnel: { label: "人员", icon: UsersRound },
    guarantee: { label: "保障", icon: ShieldCheck },
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
    return (_jsxs("div", { className: cx("legacy-analysis", className), style: style, children: [_jsx(LegacyTopicTabs, { activeTopic: activeTopic, onChange: setActiveTopic }), _jsx(LegacyFirstUseCoachmark, { visible: showCoachmark, onVisibleChange: handleCoachmarkChange }), activeTopic === "budget" ? (_jsx(BudgetTopicContent, { section: snapshot.budget, periodControl: periodControl })) : null, activeTopic === "reimbursement" ? (_jsx(ReimbursementTopicContent, { section: snapshot.reimbursement, periodControl: periodControl })) : null, activeTopic === "personnel" ? (_jsx(PersonnelTopicContent, { section: snapshot.personnel, periodControl: periodControl })) : null, activeTopic === "guarantee" ? (_jsx(GuaranteeTopicContent, { section: snapshot.guarantee, periodControl: periodControl })) : null] }));
}
const LegacyTopicTabs = forwardRef(function LegacyTopicTabs({ activeTopic, defaultTopic = "budget", onChange, className, style }, ref) {
    const [innerTopic, setInnerTopic] = useState(defaultTopic);
    const currentTopic = activeTopic ?? innerTopic;
    useImperativeHandle(ref, () => ({
        focusActive: () => {
            const element = document.querySelector(".legacy-topic-tabs__button--active");
            element?.focus();
        },
    }));
    const handleClick = (topic) => {
        if (activeTopic === undefined) {
            setInnerTopic(topic);
        }
        onChange?.(topic);
    };
    return (_jsx("div", { className: cx("legacy-topic-tabs", className), style: style, children: Object.keys(topicMeta).map((topic) => {
            const meta = topicMeta[topic];
            const Icon = meta.icon;
            const isActive = currentTopic === topic;
            return (_jsxs("button", { type: "button", className: cx("legacy-topic-tabs__button", isActive && "legacy-topic-tabs__button--active"), onClick: () => handleClick(topic), children: [_jsx(Icon, { className: "legacy-topic-tabs__icon" }), _jsx("span", { children: meta.label })] }, topic));
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
    return (_jsxs("div", { className: "legacy-topic", children: [_jsx(LegacyTopicHeading, { title: "\u9884\u7B97\u6267\u884C\u5206\u6790", rightSlot: periodControl }), _jsxs(LegacyCard, { className: "legacy-budget-hero", children: [_jsxs("div", { className: "legacy-budget-hero__headline", children: [_jsx("div", { className: "legacy-budget-hero__label", children: "\u672C\u671F\u9884\u7B97\u603B\u989D(\u5143)" }), _jsx("div", { className: "legacy-budget-hero__value", children: currencyFormatter.format(section.totalBudget) })] }), _jsx("div", { className: "legacy-budget-hero__ring", children: _jsx(Chart, { className: "legacy-chart legacy-chart--ring", option: getBudgetCompletionRingOption(section.completionRate) }) }), _jsx("div", { className: "legacy-budget-hero__summary-list", children: section.overviewItems.map((item) => (_jsxs("div", { className: "legacy-budget-summary-row", children: [_jsxs("div", { className: "legacy-budget-summary-row__label", children: [_jsx("span", { className: "legacy-budget-summary-row__dot", style: { backgroundColor: item.color } }), _jsx("span", { children: item.label })] }), _jsx("div", { className: "legacy-budget-summary-row__value", children: currencyFormatter.format(item.value) })] }, item.label))) })] }), _jsx(LegacySectionCard, { title: "\u90E8\u95E8\u5B8C\u6210\u7387", badge: "\u5355\u4F4D\uFF1A%", rightSlot: _jsxs("button", { type: "button", className: "legacy-ghost-button", onClick: () => setSortMode((current) => (current === "desc" ? "asc" : "desc")), children: [sortMode === "desc" ? (_jsx(ArrowDownWideNarrow, { className: "legacy-ghost-button__icon" })) : (_jsx(ArrowUpWideNarrow, { className: "legacy-ghost-button__icon" })), _jsx("span", { children: sortMode === "desc" ? "降序展示" : "升序展示" })] }), children: _jsx(Chart, { className: "legacy-chart legacy-chart--medium", option: getBudgetDepartmentBarOption(sortedDepartments) }) }), _jsx(LegacySectionCard, { title: "\u5728\u9014\u9884\u7B97", badge: "\u5355\u4F4D\uFF1A\u5143", children: _jsx("div", { className: "legacy-progress-list", children: section.inTransitItems.map((item) => (_jsxs("div", { className: "legacy-progress-item", children: [_jsxs("div", { className: "legacy-progress-item__header", children: [_jsx("span", { className: "legacy-progress-item__title", children: item.label }), _jsx("span", { className: "legacy-progress-item__value", children: currencyFormatter.format(item.amount) })] }), _jsx("div", { className: "legacy-progress-item__track", children: _jsx("div", { className: "legacy-progress-item__fill", style: {
                                        width: animateTransit
                                            ? `${Math.max((item.amount / maxTransitAmount) * 100, item.amount > 0 ? 4 : 0)}%`
                                            : "0%",
                                        backgroundColor: item.color,
                                    } }) })] }, item.key))) }) }), _jsx(LegacySectionCard, { title: "\u6807\u51C6\u7ECF\u8D39\u652F\u51FA", badge: "\u5355\u4F4D\uFF1A\u5143", children: _jsxs("div", { className: "legacy-budget-expense", children: [_jsx("div", { className: "legacy-budget-expense__chart", children: _jsx(Chart, { className: "legacy-chart legacy-chart--small", option: getBudgetStandardExpenseOption(section.standardExpense.totalAmount, section.standardExpense.highlightLabel, section.standardExpense.highlightRate, section.standardExpense.items) }) }), _jsx("div", { className: "legacy-budget-expense__legend", children: section.standardExpense.items.map((item) => (_jsx("div", { className: "legacy-budget-expense__legend-item", children: _jsxs("div", { className: "legacy-budget-expense__legend-line", children: [_jsxs("span", { className: "legacy-budget-expense__legend-label", children: [_jsx("span", { className: "legacy-budget-expense__legend-dot", style: { backgroundColor: item.color } }), item.label] }), _jsx("span", { className: "legacy-budget-expense__legend-value", children: currencyFormatter.format(item.amount) })] }) }, item.key))) })] }) }), _jsx(LegacyInsightCard, { insight: section.insight })] }));
}
function ReimbursementTopicContent({ section, periodControl, }) {
    return (_jsxs("div", { className: "legacy-topic", children: [_jsx(LegacyTopicHeading, { title: "\u62A5\u9500\u884C\u4E3A\u5206\u6790", rightSlot: periodControl }), _jsx(LegacyMetricsGrid, { metrics: section.metrics }), _jsx(LegacySectionCard, { title: "\u62A5\u9500\u91D1\u989D\u4E0E\u7B14\u6570\u8D8B\u52BF", badge: "\u91D1\u989D / \u7B14\u6570", footer: _jsx(LegacyLegend, { items: [["#2F6BFF", "报销金额"], ["#18B47A", "报销笔数"]] }), children: _jsx(Chart, { className: "legacy-chart legacy-chart--large", option: getMonthlyTrendOption(section.monthlyTrend) }) }), _jsx(LegacyInsightCard, { insight: section.monthlyInsight }), _jsx(LegacySectionCard, { title: "\u62A5\u9500\u7C7B\u522B\u7ED3\u6784", badge: "\u7C7B\u522B\u53E3\u5F84", children: _jsxs("div", { className: "legacy-split-panel", children: [_jsx(Chart, { className: "legacy-chart legacy-chart--small", option: getExpenseCategoryOption(section.categoryBreakdown) }), _jsx(LegacyRankingList, { items: section.categoryBreakdown })] }) }), _jsx(LegacyInsightCard, { insight: section.categoryInsight }), _jsx(LegacySectionCard, { title: "\u9AD8\u9891\u4F9B\u5E94\u5546 TOP5", badge: "\u4F9B\u5E94\u5546", children: _jsx(Chart, { className: "legacy-chart legacy-chart--medium", option: getVendorRankingOption(section.topVendors) }) }), _jsx(LegacyInsightCard, { insight: section.vendorInsight }), _jsx(LegacySectionCard, { title: "\u5927\u989D\u62A5\u9500\u6392\u884C", badge: "\u91CD\u70B9\u9879\u76EE", children: _jsx(LegacyLargeExpenseList, { items: section.largeExpenses }) }), _jsx(LegacyInsightCard, { insight: section.largeExpenseInsight })] }));
}
function PersonnelTopicContent({ section, periodControl, }) {
    return (_jsxs("div", { className: "legacy-topic", children: [_jsx(LegacyTopicHeading, { title: "\u4EBA\u5458\u8D39\u7528\u5206\u6790", rightSlot: periodControl }), _jsx(LegacyMetricsGrid, { metrics: section.metrics }), _jsx(LegacySectionCard, { title: "\u6708\u5EA6\u4EBA\u5458\u8D39\u7528\u6784\u6210", badge: "\u65F6\u95F4 \u00D7 \u8D39\u7528\u7C7B\u578B", footer: _jsx(LegacySeriesLegend, { series: section.monthlyComposition.series }), children: _jsx(Chart, { className: "legacy-chart legacy-chart--large", option: getStackedBarOption(section.monthlyComposition) }) }), _jsx(LegacyInsightCard, { insight: section.compositionInsight }), _jsx(LegacySectionCard, { title: "\u91CD\u70B9\u8D39\u7528\u8D8B\u52BF", badge: "\u5DE5\u8D44 / \u7EE9\u6548 / \u793E\u4FDD / \u8865\u8D34", children: _jsx(Chart, { className: "legacy-chart legacy-chart--large", option: getMultiLineOption(section.focusTrend) }) }), _jsx(LegacyInsightCard, { insight: section.focusInsight }), _jsx(LegacySectionCard, { title: "\u5F53\u524D\u5468\u671F\u8D39\u7528\u7ED3\u6784", badge: "\u8D39\u7528\u7C7B\u578B", children: _jsx(Chart, { className: "legacy-chart legacy-chart--medium", option: getHorizontalRankingOption(section.structureBreakdown) }) }), _jsx(LegacyInsightCard, { insight: section.structureInsight })] }));
}
function GuaranteeTopicContent({ section, periodControl, }) {
    const [activeFocus, setActiveFocus] = useState(section.focusOptions[0]?.value ?? "water");
    useEffect(() => {
        setActiveFocus(section.focusOptions[0]?.value ?? "water");
    }, [section.focusOptions]);
    return (_jsxs("div", { className: "legacy-topic", children: [_jsx(LegacyTopicHeading, { title: "\u57FA\u672C\u4FDD\u969C\u8D39\u7528\u5206\u6790", rightSlot: periodControl }), _jsx(LegacyMetricsGrid, { metrics: section.metrics }), _jsx(LegacySectionCard, { title: "\u57FA\u7840\u4FDD\u969C\u6708\u5EA6\u6784\u6210", badge: "\u603B\u89C8", footer: _jsx(LegacySeriesLegend, { series: section.monthlyComposition.series }), children: _jsx(Chart, { className: "legacy-chart legacy-chart--large", option: getStackedBarOption(section.monthlyComposition) }) }), _jsx(LegacyInsightCard, { insight: section.compositionInsight }), _jsx(LegacySectionCard, { title: "\u5355\u9879\u4FDD\u969C\u8D8B\u52BF", badge: "\u6309\u8D39\u7528\u5207\u6362", rightSlot: _jsx("div", { className: "legacy-segment-tabs", children: section.focusOptions.map((item) => (_jsx("button", { type: "button", className: cx("legacy-segment-tabs__button", activeFocus === item.value && "legacy-segment-tabs__button--active"), onClick: () => setActiveFocus(item.value), children: item.label }, item.value))) }), children: _jsx(Chart, { className: "legacy-chart legacy-chart--medium", option: getSingleLineOption(section.focusTrends[activeFocus]) }) }), _jsx(LegacyInsightCard, { insight: section.focusInsights[activeFocus] }), _jsx(LegacySectionCard, { title: "\u5F53\u524D\u5468\u671F\u8D39\u7528\u7ED3\u6784", badge: "\u4FDD\u969C\u7C7B\u522B", children: _jsx(Chart, { className: "legacy-chart legacy-chart--medium", option: getHorizontalRankingOption(section.structureBreakdown) }) }), _jsx(LegacyInsightCard, { insight: section.structureInsight })] }));
}
function LegacyCard({ className, style, children }) {
    return (_jsx("div", { className: cx("legacy-card", className), style: style, children: children }));
}
function LegacySectionCard({ title, badge, rightSlot, footer, className, style, children, }) {
    return (_jsxs(LegacyCard, { className: cx("legacy-section-card", className), style: style, children: [_jsxs("div", { className: "legacy-section-card__header", children: [_jsx("div", { className: "legacy-section-card__title", children: title }), _jsxs("div", { className: "legacy-section-card__actions", children: [rightSlot, badge ? _jsx("span", { className: "legacy-badge", children: badge }) : null] })] }), _jsx("div", { className: "legacy-section-card__content", children: children }), footer ? _jsx("div", { className: "legacy-section-card__footer", children: footer }) : null] }));
}
function LegacyTopicHeading({ title, rightSlot, }) {
    return (_jsxs("div", { className: "legacy-topic-heading", children: [_jsx("div", { className: "legacy-topic-heading__title", children: title }), rightSlot ? _jsx("div", { className: "legacy-topic-heading__actions", children: rightSlot }) : null] }));
}
function LegacyMetricsGrid({ metrics, }) {
    return (_jsx("div", { className: "legacy-metrics-grid", children: metrics.map((metric) => (_jsx(LegacyMetricCard, { metric: metric }, metric.label))) }));
}
function LegacyMetricCard({ metric, }) {
    return (_jsxs(LegacyCard, { className: "legacy-metric-card", children: [_jsx("div", { className: "legacy-metric-card__label", children: metric.label }), _jsx("div", { className: "legacy-metric-card__value", children: metric.value }), _jsx("div", { className: cx("legacy-metric-card__trend", `legacy-metric-card__trend--${metric.trendState}`), children: metric.trend })] }));
}
function LegacyInsightCard({ insight, }) {
    return (_jsxs(LegacyCard, { className: "legacy-insight-card", children: [_jsx("div", { className: "legacy-insight-card__title", children: insight.title }), _jsx("div", { className: "legacy-insight-card__summary", children: insight.summary }), _jsx("div", { className: "legacy-insight-card__list", children: insight.bullets.map((bullet) => (_jsxs("div", { className: "legacy-insight-card__item", children: [_jsx("span", { className: "legacy-insight-card__item-dot" }), _jsx("span", { children: bullet })] }, bullet))) })] }));
}
function LegacyLegend({ items, }) {
    return (_jsx("div", { className: "legacy-legend", children: items.map(([color, label]) => (_jsxs("span", { className: "legacy-legend__item", children: [_jsx("span", { className: "legacy-legend__dot", style: { backgroundColor: color } }), _jsx("span", { children: label })] }, label))) }));
}
function LegacySeriesLegend({ series, }) {
    return (_jsx(LegacyLegend, { items: series.map((item) => [item.color, item.name]) }));
}
function LegacyRankingList({ items, }) {
    const max = Math.max(...items.map((item) => item.value), 1);
    return (_jsx("div", { className: "legacy-ranking-list", children: items.map((item) => (_jsxs("div", { className: "legacy-ranking-list__item", children: [_jsxs("div", { className: "legacy-ranking-list__header", children: [_jsx("span", { className: "legacy-ranking-list__name", children: item.name }), _jsxs("span", { className: "legacy-ranking-list__value", children: [item.value, item.unit ?? "%"] })] }), _jsx("div", { className: "legacy-ranking-list__track", children: _jsx("div", { className: "legacy-ranking-list__fill", style: {
                            width: `${(item.value / max) * 100}%`,
                            backgroundColor: item.color ?? "#2F6BFF",
                        } }) })] }, item.name))) }));
}
function LegacyLargeExpenseList({ items, }) {
    return (_jsx("div", { className: "legacy-large-expense-list", children: items.map((item, index) => (_jsxs("div", { className: "legacy-large-expense-list__item", children: [_jsxs("div", { className: "legacy-large-expense-list__left", children: [_jsxs("span", { className: "legacy-large-expense-list__tag", children: ["TOP ", index + 1] }), _jsxs("div", { children: [_jsx("div", { className: "legacy-large-expense-list__name", children: item.project }), _jsx("div", { className: "legacy-large-expense-list__category", children: item.category })] })] }), _jsxs("div", { className: "legacy-large-expense-list__right", children: [_jsx("div", { className: "legacy-large-expense-list__amount", children: item.amount }), _jsx("div", { className: "legacy-large-expense-list__remark", children: "\u91CD\u70B9\u5173\u6CE8" })] })] }, item.project))) }));
}
