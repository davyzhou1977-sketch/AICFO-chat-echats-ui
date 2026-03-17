import financeDashboardV2Mock from "@/data/mock/school-finance-v2.json";
const categoryPalette = ["#00A2AD", "#0B72F6", "#1890FF", "#FF7D00", "#32A3FF", "#F74F63"];
const seriesPalette = ["#00A2AD", "#0B72F6", "#32A3FF", "#FF7D00", "#04B42A", "#F74F63"];
const baseBudgetSample = {
    totalBudget: 16376958,
    completedAmount: 456562.17,
    inTransitAmount: 80589.98,
    availableAmount: 169935.89,
    departmentCompletion: [
        { departmentId: 10006, departmentName: "纪检监察办公室", ratio: 26 },
        { departmentId: 50000, departmentName: "人力资源管理教师党支部", ratio: 13 },
        { departmentId: 10007, departmentName: "人事处", ratio: 11 },
    ],
    inTransitItems: [
        { key: "applying", label: "申请中", amount: 9848, color: "#00A2AD" },
        { key: "additional", label: "追加中", amount: 1595.5, color: "#1BC0CB" },
        { key: "approved", label: "审批通过", amount: 6086, color: "#0B72F6" },
        { key: "reimbursing", label: "报销中", amount: 57193.48, color: "#32A3FF" },
    ],
    standardExpense: [
        { key: "travel", label: "差旅费", amount: 29, color: "#0B72F6" },
        { key: "labor", label: "劳务费", amount: 1610, color: "#04B42A" },
        { key: "meeting", label: "会议费", amount: 0, color: "#00A2AD" },
        { key: "training", label: "培训费", amount: 0, color: "#32A3FF" },
    ],
};
const periodScaleMap = {
    year: 1,
    quarter: 0.34,
    month: 0.12,
};
const periodLabelMap = {
    year: "本年",
    quarter: "本季",
    month: "本月",
};
function createBudgetSnapshot(period) {
    const scale = periodScaleMap[period];
    const totalBudget = Number((baseBudgetSample.totalBudget * scale).toFixed(2));
    const completedAmount = Number((baseBudgetSample.completedAmount * scale).toFixed(2));
    const inTransitAmount = Number((baseBudgetSample.inTransitAmount * scale).toFixed(2));
    const availableAmount = Number((baseBudgetSample.availableAmount * scale).toFixed(2));
    const completionRate = totalBudget > 0 ? (completedAmount / totalBudget) * 100 : 0;
    const overviewItems = [
        { label: "已执行金额", value: completedAmount, color: "#35C4F0" },
        { label: "在途预算", value: inTransitAmount, color: "#48D8D1" },
        { label: "实时可用预算", value: availableAmount, color: "#E2E8F0" },
    ];
    const standardExpenseItems = baseBudgetSample.standardExpense.map((item) => ({
        ...item,
        amount: Number((item.amount * scale).toFixed(2)),
    }));
    const totalExpense = Number(standardExpenseItems
        .reduce((sum, item) => sum + item.amount, 0)
        .toFixed(2));
    const highlightItem = standardExpenseItems.reduce((maxItem, item) => item.amount > maxItem.amount ? item : maxItem) ?? standardExpenseItems[0];
    const highlightRate = totalExpense > 0 ? (highlightItem.amount / totalExpense) * 100 : 0;
    return {
        totalBudget,
        completedAmount,
        inTransitAmount,
        availableAmount,
        completionRate,
        overviewItems,
        departmentCompletion: baseBudgetSample.departmentCompletion,
        inTransitItems: baseBudgetSample.inTransitItems.map((item) => ({
            ...item,
            amount: Number((item.amount * scale).toFixed(2)),
        })),
        standardExpense: {
            totalAmount: totalExpense,
            highlightLabel: highlightItem.label,
            highlightRate,
            items: standardExpenseItems,
        },
        insight: {
            title: "AI 解读",
            summary: `${periodLabelMap[period]}预算主题里，已执行金额占总预算比例仍然较低，说明预算主体仍停留在可用和在途阶段，更适合继续盯审批和执行转化。`,
            bullets: [
                "预算主题不建议再重写页面逻辑，优先直接作为融合版的默认首页。",
                "当前可用预算和在途预算同时存在，说明预算盘子还没有充分转成实际执行结果。",
                "部门完成率只展示正向部门，避免把负值或无数据部门直接推到首屏影响阅读。",
            ],
        },
    };
}
function recolorCategoryItems(items) {
    return items.map((item, index) => ({
        ...item,
        color: categoryPalette[index % categoryPalette.length],
    }));
}
function recolorSeries(items) {
    return items.map((item, index) => ({
        ...item,
        color: seriesPalette[index % seriesPalette.length],
    }));
}
function createThemeSnapshot(section) {
    const cloned = JSON.parse(JSON.stringify(section));
    if (cloned.categoryBreakdown) {
        cloned.categoryBreakdown = recolorCategoryItems(cloned.categoryBreakdown);
    }
    if (cloned.monthlyComposition?.series) {
        cloned.monthlyComposition.series = recolorSeries(cloned.monthlyComposition.series);
    }
    if (cloned.focusTrend?.series) {
        cloned.focusTrend.series = recolorSeries(cloned.focusTrend.series);
    }
    if (cloned.focusTrends) {
        Object.keys(cloned.focusTrends).forEach((key, index) => {
            cloned.focusTrends[key].color = seriesPalette[index % seriesPalette.length];
        });
    }
    return cloned;
}
export async function fetchSchoolFinanceFusionDemo() {
    const v2Data = financeDashboardV2Mock;
    const { financialAnalysis } = v2Data;
    return Promise.resolve({
        defaultPeriod: financialAnalysis.defaultPeriod,
        periodOptions: financialAnalysis.periodOptions,
        snapshots: {
            year: {
                budget: createBudgetSnapshot("year"),
                reimbursement: createThemeSnapshot(financialAnalysis.snapshots.year.reimbursement),
                personnel: createThemeSnapshot(financialAnalysis.snapshots.year.personnel),
                guarantee: createThemeSnapshot(financialAnalysis.snapshots.year.guarantee),
            },
            quarter: {
                budget: createBudgetSnapshot("quarter"),
                reimbursement: createThemeSnapshot(financialAnalysis.snapshots.quarter.reimbursement),
                personnel: createThemeSnapshot(financialAnalysis.snapshots.quarter.personnel),
                guarantee: createThemeSnapshot(financialAnalysis.snapshots.quarter.guarantee),
            },
            month: {
                budget: createBudgetSnapshot("month"),
                reimbursement: createThemeSnapshot(financialAnalysis.snapshots.month.reimbursement),
                personnel: createThemeSnapshot(financialAnalysis.snapshots.month.personnel),
                guarantee: createThemeSnapshot(financialAnalysis.snapshots.month.guarantee),
            },
        },
    });
}
