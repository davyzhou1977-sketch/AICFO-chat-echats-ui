export type ChartMode = "bar" | "line";

export interface FilterChip {
  label: string;
  value: string;
}

export interface ReportRow {
  id: string;
  reason: string;
  applicant: string;
  department: string;
  status: string;
  amount: string;
  verifiedAmount: string;
  verifiedDate: string;
}

export interface ChartSeries {
  name: string;
  color: string;
  data: number[];
}

export interface ReportData {
  title: string;
  subtitle: string;
  filterChips: FilterChip[];
  rows: ReportRow[];
  drawer: {
    title: string;
    description: string;
    summaryMetrics: Array<{ label: string; value: string }>;
    labels: string[];
    series: ChartSeries[];
    insight: string;
  };
}

export const reportData: ReportData = {
  title: "报销单",
  subtitle: "当前查询结果可直接生成轻量图表报告，用于快速汇报和二次分析。",
  filterChips: [
    { label: "审批状态", value: "已核销" },
    { label: "报销事由", value: "水费" },
    { label: "时间范围", value: "2026年1-3月" },
    { label: "校区", value: "东校区 + 西校区" },
  ],
  rows: [
    {
      id: "RI-20260306-0001",
      reason: "西校区3月份水费",
      applicant: "姚喜",
      department: "后勤部-后勤中学",
      status: "已核销",
      amount: "3,234.00",
      verifiedAmount: "3,234.00",
      verifiedDate: "2026-03-09",
    },
    {
      id: "RI-20260227-0001",
      reason: "西校区2月份水费",
      applicant: "姚喜",
      department: "后勤部-后勤中学",
      status: "已核销",
      amount: "11,382.00",
      verifiedAmount: "11,382.00",
      verifiedDate: "2026-03-02",
    },
    {
      id: "RI-20260226-0001",
      reason: "东校区2026年2月份水费",
      applicant: "侯海元",
      department: "后勤部-后勤小学",
      status: "已核销",
      amount: "18,162.00",
      verifiedAmount: "18,162.00",
      verifiedDate: "2026-03-03",
    },
    {
      id: "RI-20260108-0001",
      reason: "东校区2026年1月份水费",
      applicant: "侯海元",
      department: "后勤部-后勤小学",
      status: "已核销",
      amount: "17,166.00",
      verifiedAmount: "17,166.00",
      verifiedDate: "2026-01-14",
    },
    {
      id: "RI-20260107-0003",
      reason: "西校区2026年1月份水费",
      applicant: "姚喜",
      department: "后勤部-后勤中学",
      status: "已核销",
      amount: "8,160.00",
      verifiedAmount: "8,160.00",
      verifiedDate: "2026-01-09",
    },
  ],
  drawer: {
    title: "AI报表查询结果",
    description: "系统根据当前筛选条件自动汇总为图表报告，无需二次导出 Excel 再处理。",
    summaryMetrics: [
      { label: "查询笔数", value: "5 笔" },
      { label: "西校区总额", value: "22,776 元" },
      { label: "东校区总额", value: "35,328 元" },
      { label: "合计金额", value: "58,104 元" },
    ],
    labels: ["1月", "2月", "3月"],
    series: [
      { name: "西校区", color: "#2f6bff", data: [8160, 11382, 3234] },
      { name: "东校区", color: "#18b47a", data: [17166, 18162, 0] },
    ],
    insight:
      "2026年1-3月水费共 58,104 元，其中东校区高于西校区，2 月达到阶段峰值，建议后续补充校区面积或人数口径后再看单位成本。",
  },
};
