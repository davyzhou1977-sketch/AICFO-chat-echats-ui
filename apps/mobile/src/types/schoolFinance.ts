export type TrendState = "up" | "down" | "warning";
export type FinancialPeriod = "year" | "quarter" | "month";
export type FinancialSubTheme = "control" | "reimbursement";

export interface SummaryMetric {
  label: string;
  value: string;
  trend: string;
  trendState: TrendState;
}

export interface MonthlyTrendItem {
  month: string;
  amount: number;
  count: number;
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
}

export interface LargeExpenseItem {
  project: string;
  category: string;
  amount: string;
}

export interface DataNeedItem {
  field: string;
  purpose: string;
}

export interface InvestmentCompareItem {
  name: string;
  value: number;
  color: string;
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

export interface HeaderInfo {
  title: string;
  subtitle: string;
  tags: string[];
  periodLabel: string;
}

export interface ExpenseAnalysisSection {
  metrics: SummaryMetric[];
  monthlyTrend: MonthlyTrendItem[];
  categoryBreakdown: CategoryItem[];
  topVendors: RankingItem[];
  largeExpenses: LargeExpenseItem[];
  insight: InsightBlock;
  defaultPeriod?: FinancialPeriod;
  periodOptions?: FilterOption<FinancialPeriod>[];
  subThemeOptions?: FilterOption<FinancialSubTheme>[];
  controlAnalysis?: Record<FinancialPeriod, ControlAnalysisSection>;
  reimbursementAnalysis?: Record<FinancialPeriod, ReimbursementAnalysisSnapshot>;
}

export interface ReimbursementAnalysisSnapshot {
  metrics: SummaryMetric[];
  monthlyTrend: MonthlyTrendItem[];
  categoryBreakdown: CategoryItem[];
  topVendors: RankingItem[];
  largeExpenses: LargeExpenseItem[];
  insight: InsightBlock;
}

export interface ControlRiskThemeItem extends CategoryItem {}

export interface ControlTrendItem {
  month: string;
  hitRate: number;
  riskCount: number;
}

export interface ControlRuleHitItem extends RankingItem {}

export interface ControlDepartmentRiskItem {
  name: string;
  prompt: number;
  attention: number;
  high: number;
}

export interface ControlClosureTrendItem {
  month: string;
  found: number;
  resolved: number;
}

export interface ControlLowClosureItem {
  name: string;
  value: number;
  note: string;
}

export interface ControlOverviewSection {
  metrics: SummaryMetric[];
  riskTrend: ControlTrendItem[];
  riskThemeDistribution: ControlRiskThemeItem[];
  trendInsight: InsightBlock;
  themeInsight: InsightBlock;
}

export interface ControlWeaknessSection {
  topThemes: ControlRuleHitItem[];
  topRules: ControlRuleHitItem[];
  themeInsight: InsightBlock;
  ruleInsight: InsightBlock;
}

export interface ControlConcentrationSection {
  departmentDistribution: ControlDepartmentRiskItem[];
  businessDistribution: ControlRuleHitItem[];
  departmentInsight: InsightBlock;
  businessInsight: InsightBlock;
}

export interface ControlClosureSection {
  closureTrend: ControlClosureTrendItem[];
  lowClosureUnits: ControlLowClosureItem[];
  closureInsight: InsightBlock;
  unitInsight: InsightBlock;
}

export interface ControlAnalysisSection {
  overview: ControlOverviewSection;
  weakness: ControlWeaknessSection;
  concentration: ControlConcentrationSection;
  closure: ControlClosureSection;
}

export interface PrincipalPerspectiveSection {
  resourceFlow: CategoryItem[];
  investmentCompare: InvestmentCompareItem[];
  structureTrend: {
    month: string;
    student: number;
    teacher: number;
    operation: number;
  }[];
  dataNeeds: DataNeedItem[];
  insight: InsightBlock;
}

export interface SchoolFinanceDashboardData {
  header: HeaderInfo;
  expenseAnalysis: ExpenseAnalysisSection;
  principalPerspective: PrincipalPerspectiveSection;
}
