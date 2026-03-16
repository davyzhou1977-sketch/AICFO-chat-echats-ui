import type { HeaderInfo, InsightBlock } from "@/types/schoolFinance";

export interface GovernanceFlowItem {
  name: string;
  value: number;
  color: string;
}

export interface GovernanceSplitItem {
  name: string;
  shortName: string;
  grassroots: number;
  administrative: number;
}

export interface GovernanceTrendItem {
  month: string;
  student: number;
  administrative: number;
}

export interface GrassrootsUnitBudgetItem {
  name: string;
  allocated: number;
  used: number;
}

export interface LowActivityUnitItem {
  name: string;
  value: number;
  unit: string;
  note: string;
}

export interface TeacherMomentumItem {
  name: string;
  value: number;
  color: string;
}

export interface CoverageMetric {
  label: string;
  value: string;
  helper: string;
}

export interface TeacherTrendItem {
  month: string;
  value: number;
}

export interface GovernanceOverviewSection {
  governableAmount: string;
  totalExpenseShare: string;
  summary: string;
  flow: GovernanceFlowItem[];
  flowInsight: InsightBlock;
}

export interface StudentProximitySection {
  studentGrassrootsRatio: string;
  studentGovernableAmount: string;
  frontlineCoverage: string;
  split: GovernanceSplitItem[];
  trend: GovernanceTrendItem[];
  structureInsight: InsightBlock;
  trendInsight: InsightBlock;
}

export interface GrassrootsVitalitySection {
  autonomousPool: string;
  activatedUnits: string;
  averageUsageRate: string;
  units: GrassrootsUnitBudgetItem[];
  lowActivityRanking: LowActivityUnitItem[];
  budgetInsight: InsightBlock;
  lowActivityInsight: InsightBlock;
}

export interface TeacherMomentumSection {
  yearlyInvestment: string;
  categories: TeacherMomentumItem[];
  coverage: CoverageMetric[];
  trend: TeacherTrendItem[];
  categoryInsight: InsightBlock;
  trendInsight: InsightBlock;
}

export interface GovernanceFinanceDashboardV2Data {
  header: HeaderInfo;
  governanceOverview: GovernanceOverviewSection;
  studentProximity: StudentProximitySection;
  grassrootsVitality: GrassrootsVitalitySection;
  teacherMomentum: TeacherMomentumSection;
}
