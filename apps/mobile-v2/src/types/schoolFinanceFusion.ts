import type {
  FilterOption,
  FinancialPeriod,
  GuaranteeTopicSection,
  InsightBlock,
  PersonnelTopicSection,
  ReimbursementTopicSection,
} from "@/types/schoolFinanceV2";

export interface BudgetOverviewItem {
  label: string;
  value: number;
  color: string;
}

export interface BudgetDepartmentCompletionItem {
  departmentId: number;
  departmentName: string;
  ratio: number;
}

export interface BudgetTransitItem {
  key: string;
  label: string;
  amount: number;
  color: string;
}

export interface BudgetStandardExpenseItem {
  key: string;
  label: string;
  amount: number;
  color: string;
}

export interface LegacyBudgetTopicSection {
  totalBudget: number;
  completedAmount: number;
  inTransitAmount: number;
  availableAmount: number;
  completionRate: number;
  overviewItems: BudgetOverviewItem[];
  departmentCompletion: BudgetDepartmentCompletionItem[];
  inTransitItems: BudgetTransitItem[];
  standardExpense: {
    totalAmount: number;
    highlightLabel: string;
    highlightRate: number;
    items: BudgetStandardExpenseItem[];
  };
  insight: InsightBlock;
}

export interface FinancialAnalysisFusionSnapshot {
  budget: LegacyBudgetTopicSection;
  reimbursement: ReimbursementTopicSection;
  personnel: PersonnelTopicSection;
  guarantee: GuaranteeTopicSection;
}

export interface FinancialAnalysisFusionData {
  defaultPeriod: FinancialPeriod;
  periodOptions: FilterOption<FinancialPeriod>[];
  snapshots: Record<FinancialPeriod, FinancialAnalysisFusionSnapshot>;
}
