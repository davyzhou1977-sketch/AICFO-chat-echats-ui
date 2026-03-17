const periods = [
    { key: "year", label: "本年" },
    { key: "quarter", label: "本季" },
    { key: "month", label: "本月" },
];
const topics = [
    { key: "budget", label: "预算" },
    { key: "reimbursement", label: "报销" },
    { key: "personnel", label: "人员" },
    { key: "guarantee", label: "保障" },
];
const periodScale = {
    year: 1,
    quarter: 0.34,
    month: 0.12,
};
function formatAmount(value) {
    return `${value.toFixed(value >= 100 ? 0 : 1)} 万`;
}
function formatPercent(value) {
    return `${value.toFixed(0)}%`;
}
function scaleSeries(series, scale) {
    return series.map((item) => Number((item * scale).toFixed(1)));
}
function buildSnapshot(scale) {
    const budgetTotal = 1637.7 * scale;
    const budgetDone = 456.6 * scale;
    const budgetTransit = 80.6 * scale;
    const budgetAvailable = 169.9 * scale;
    const reimbursementAmount = 1962 * scale;
    const personnelAmount = 1328 * scale;
    const guaranteeAmount = 760 * scale;
    return {
        budget: {
            headlineLabel: "预算执行总额",
            headlineValue: formatAmount(budgetTotal),
            headlineSummary: "默认把预算、报销、人员、保障四个主题收口为一张移动融合页。",
            metrics: [
                { label: "已执行金额", value: formatAmount(budgetDone), note: "本期已落地" },
                { label: "在途预算", value: formatAmount(budgetTransit), note: "等待转执行" },
                { label: "可用预算", value: formatAmount(budgetAvailable), note: "仍可调剂" },
            ],
            trendLabels: ["纪检", "人事处", "总务处", "德育中心", "信息中心"],
            trendSeries: [
                {
                    name: "执行率",
                    color: "#0b72f6",
                    data: [26, 31, 54, 67, 74].map((item) => Math.round(item * (0.8 + scale * 0.2))),
                },
            ],
            donut: [
                { name: "已执行", value: Number(budgetDone.toFixed(1)), color: "#00a2ad" },
                { name: "在途", value: Number(budgetTransit.toFixed(1)), color: "#2f6bff" },
                { name: "可用", value: Number(budgetAvailable.toFixed(1)), color: "#d7e3f8" },
            ],
            rankingTitle: "部门执行率",
            ranking: [
                { name: "后勤部-后勤小学", value: formatPercent(81), rate: 81 },
                { name: "教学服务中心", value: formatPercent(76), rate: 76 },
                { name: "德育中心", value: formatPercent(69), rate: 69 },
            ],
            insight: [
                "预算主题适合作为融合版首屏，信息密度高但阅读路径足够清晰。",
                "在途预算仍明显存在，说明审批和执行转化仍有空间。",
            ],
        },
        reimbursement: {
            headlineLabel: "报销分析总额",
            headlineValue: formatAmount(reimbursementAmount),
            headlineSummary: "保留趋势、结构和大额项目三类核心信息，不再叠加无关装饰。",
            metrics: [
                { label: "报销笔数", value: `${Math.round(4286 * scale)} 笔`, note: "提交频次" },
                { label: "平均单笔", value: "4,578 元", note: "仍偏高" },
                { label: "TOP10 供应商", value: "39.8%", note: "集中度中高" },
            ],
            trendLabels: ["1月", "2月", "3月", "4月", "5月", "6月"],
            trendSeries: [
                { name: "报销金额", color: "#2f6bff", data: scaleSeries([96, 102, 110, 126, 121, 142], scale) },
                { name: "报销笔数", color: "#18b47a", data: scaleSeries([102, 108, 121, 132, 126, 148], scale) },
            ],
            donut: [
                { name: "活动费", value: 28, color: "#2f6bff" },
                { name: "设备材料", value: 21, color: "#18b47a" },
                { name: "维修费", value: 17, color: "#ff9f43" },
                { name: "培训差旅", value: 14, color: "#13b5b1" },
            ],
            rankingTitle: "大额项目",
            ranking: [
                { name: "实验室设备采购", value: "18.6 万", rate: 92 },
                { name: "校园文化节执行", value: "13.3 万", rate: 68 },
                { name: "暑期教室维修", value: "11.8 万", rate: 61 },
            ],
            insight: [
                "保留 ECharts v4 后，图表仍覆盖趋势与结构两类表达，没有 Tailwind 依赖。",
                "金额和笔数同步抬升，更适合和预算执行联动阅读。",
            ],
        },
        personnel: {
            headlineLabel: "人员费用总额",
            headlineValue: formatAmount(personnelAmount),
            headlineSummary: "把结构变化聚焦到工资、绩效、社保与补贴四条线，便于移动端快速判断。",
            metrics: [
                { label: "工资总额", value: formatAmount(911 * scale), note: "刚性主项" },
                { label: "社保公积金", value: formatAmount(252 * scale), note: "附加成本稳定" },
                { label: "补贴津贴", value: formatAmount(119 * scale), note: "四季度抬升" },
            ],
            trendLabels: ["1月", "2月", "3月", "4月", "5月", "6月"],
            trendSeries: [
                { name: "基本工资", color: "#2f6bff", data: scaleSeries([74, 74, 75, 75, 76, 76], scale) },
                { name: "绩效工资", color: "#18b47a", data: scaleSeries([22, 22, 23, 24, 24, 24], scale) },
                { name: "社保公积金", color: "#ff9f43", data: scaleSeries([20, 20, 21, 21, 21, 21], scale) },
            ],
            donut: [
                { name: "基本工资", value: 69, color: "#2f6bff" },
                { name: "绩效工资", value: 18, color: "#18b47a" },
                { name: "社保公积金", value: 9, color: "#ff9f43" },
                { name: "补贴津贴", value: 4, color: "#7c5cff" },
            ],
            rankingTitle: "重点部门",
            ranking: [
                { name: "行政部-人力", value: "96%", rate: 96 },
                { name: "行政部-财务", value: "91%", rate: 91 },
                { name: "教学服务中心", value: "84%", rate: 84 },
            ],
            insight: [
                "人员费用结构稳定，真正驱动变化的是绩效和补贴，而不是基础工资。",
                "移动端只保留最该读的结构趋势与重点部门，页面更干净。",
            ],
        },
        guarantee: {
            headlineLabel: "治理保障资金",
            headlineValue: formatAmount(guaranteeAmount),
            headlineSummary: "保障主题回到治理视角，只看资源下沉与风险集中度，不再混入旧版组件。",
            metrics: [
                { label: "学生贴近投入", value: "63%", note: "离学生更近" },
                { label: "基层预算池", value: formatAmount(328 * scale), note: "8/10 单位激活" },
                { label: "教师动能投入", value: formatAmount(108 * scale), note: "覆盖率 82%" },
            ],
            trendLabels: ["学生成长", "教师发展", "组织运行", "后勤保障", "校园基建"],
            trendSeries: [
                {
                    name: "治理投入",
                    color: "#2f6bff",
                    data: scaleSeries([286, 118, 94, 76, 134], scale),
                },
            ],
            donut: [
                { name: "学生成长", value: 38, color: "#2f6bff" },
                { name: "教师发展", value: 16, color: "#18b47a" },
                { name: "组织运行", value: 12, color: "#ff9f43" },
                { name: "校园基建", value: 18, color: "#94a3b8" },
            ],
            rankingTitle: "低活跃单位",
            ranking: [
                { name: "综合实践组", value: "32%", rate: 32 },
                { name: "数学组", value: "31%", rate: 31 },
                { name: "科学组", value: "47%", rate: 47 },
            ],
            insight: [
                "治理主题只保留资源分布、低活跃单位和两条管理结论，信息更聚焦。",
                "基层活力弱点集中在跨学科与项目制条线，问题更像机制而不是预算不足。",
            ],
        },
    };
}
export const dashboardByPeriod = {
    year: buildSnapshot(periodScale.year),
    quarter: buildSnapshot(periodScale.quarter),
    month: buildSnapshot(periodScale.month),
};
export const fusionDashboard = {
    title: "财务分析",
    subtitle: "移动端 v2 仅保留融合演示页，样式统一使用 Less Module，图表统一兼容 ECharts v4。",
    periods,
    topics,
};
