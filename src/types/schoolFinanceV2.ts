export type TrendState = "up" | "down" | "warning";
export type FinancialPeriod = "year" | "quarter" | "month";
export type FinanceTopic = "budget" | "reimbursement" | "personnel" | "guarantee" | "special";
export type GuaranteeFocusType = "water" | "electricity" | "property" | "heating";
export type SpecialTopic = "studentActivity" | "teacherGrowth";

export interface SummaryMetric {
  label: string;
  value: string;
  trend: string;
  trendState: TrendState;
}

export interface InsightBlock {
  title: string;
  summary: string;
  bullets: string[];
}

export interface FilterOption<T extends string> {
  value: T;
  label: string;
}

export interface CategoryItem {
  name: string;
  value: number;
  color: string;
}

export interface RankingItem {
  name: string;
  value: number;
  unit: string;
  note?: string;
}

export interface LargeExpenseItem {
  project: string;
  category: string;
  amount: string;
}

export interface MonthlyTrendItem {
  month: string;
  amount: number;
  count: number;
}

export interface ChartSeries {
  name: string;
  color: string;
  data: number[];
}

export interface MultiSeriesDataset {
  labels: string[];
  series: ChartSeries[];
}

export interface SingleSeriesDataset {
  labels: string[];
  name: string;
  color: string;
  data: number[];
}

export interface BudgetExecutionTrendItem {
  month: string;
  budget: number;
  executed: number;
  rate: number;
}

export interface BudgetProjectCompareItem {
  name: string;
  budget: number;
  executed: number;
}

export interface BudgetDepartmentRateItem extends RankingItem {}

export interface BudgetProjectDepartmentItem {
  name: string;
  budget: number;
  executed: number;
  rate: number;
}

export interface BudgetTopicSection {
  metrics: SummaryMetric[];
  monthlyExecution: BudgetExecutionTrendItem[];
  executionInsight: InsightBlock;
  projectComparison: BudgetProjectCompareItem[];
  projectInsight: InsightBlock;
  departmentExecution: BudgetDepartmentRateItem[];
  departmentInsight: InsightBlock;
  focusedProject: {
    name: string;
    departments: BudgetProjectDepartmentItem[];
    insight: InsightBlock;
  };
}

export interface ReimbursementTopicSection {
  metrics: SummaryMetric[];
  monthlyTrend: MonthlyTrendItem[];
  monthlyInsight: InsightBlock;
  categoryBreakdown: CategoryItem[];
  categoryInsight: InsightBlock;
  topVendors: RankingItem[];
  vendorInsight: InsightBlock;
  largeExpenses: LargeExpenseItem[];
  largeExpenseInsight: InsightBlock;
}

export interface PersonnelTopicSection {
  metrics: SummaryMetric[];
  monthlyComposition: MultiSeriesDataset;
  compositionInsight: InsightBlock;
  focusTrend: MultiSeriesDataset;
  focusInsight: InsightBlock;
  structureBreakdown: RankingItem[];
  structureInsight: InsightBlock;
}

export interface GuaranteeTopicSection {
  metrics: SummaryMetric[];
  monthlyComposition: MultiSeriesDataset;
  compositionInsight: InsightBlock;
  focusOptions: FilterOption<GuaranteeFocusType>[];
  focusTrends: Record<GuaranteeFocusType, SingleSeriesDataset>;
  focusInsights: Record<GuaranteeFocusType, InsightBlock>;
  structureBreakdown: RankingItem[];
  structureInsight: InsightBlock;
}

export interface SpecialTopicDetail {
  title: string;
  metrics: SummaryMetric[];
  monthlyTrend: SingleSeriesDataset;
  trendInsight: InsightBlock;
  categoryBreakdown: CategoryItem[];
  structureInsight: InsightBlock;
  projectRanking: RankingItem[];
  projectInsight: InsightBlock;
}

export interface SpecialTopicSection {
  defaultTopic: SpecialTopic;
  options: FilterOption<SpecialTopic>[];
  topics: Record<SpecialTopic, SpecialTopicDetail>;
}

export interface FinancialAnalysisPeriodSnapshot {
  budget: BudgetTopicSection;
  reimbursement: ReimbursementTopicSection;
  personnel: PersonnelTopicSection;
  guarantee: GuaranteeTopicSection;
  special: SpecialTopicSection;
}

export interface FinancialAnalysisV2Section {
  defaultPeriod: FinancialPeriod;
  periodOptions: FilterOption<FinancialPeriod>[];
  defaultTopic: FinanceTopic;
  topicOptions: FilterOption<FinanceTopic>[];
  snapshots: Record<FinancialPeriod, FinancialAnalysisPeriodSnapshot>;
}

export interface SchoolFinanceDashboardV2Data {
  financialAnalysis: FinancialAnalysisV2Section;
}

export interface QueryFilterChip {
  label: string;
  value: string;
}

export interface ReimbursementTableRow {
  id: string;
  reason: string;
  applicant: string;
  department: string;
  status: string;
  amount: string;
  verifiedAmount: string;
  verifiedDate: string;
}

export interface ReportSummaryMetric {
  label: string;
  value: string;
}

export interface ReportQueryDrawerData {
  title: string;
  description: string;
  summaryMetrics: ReportSummaryMetric[];
  groupedBar: MultiSeriesDataset;
  trendLine: MultiSeriesDataset;
  insight: string;
}

export interface ReimbursementAiReportDemoData {
  title: string;
  subtitle: string;
  filterChips: QueryFilterChip[];
  rows: ReimbursementTableRow[];
  drawer: ReportQueryDrawerData;
}
