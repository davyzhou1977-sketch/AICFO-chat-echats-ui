import financeDashboardV2Mock from "@/data/mock/school-finance-v2.json";
import reimbursementAiReportDemoMock from "@/data/mock/reimbursement-ai-report-demo.json";
import type {
  ReimbursementAiReportDemoData,
  SchoolFinanceDashboardV2Data,
} from "@/types/schoolFinanceV2";

// 预留真实接口切换点，后续可将 mock 替换为聚合接口或 Python 预处理结果。
export async function fetchSchoolFinanceDashboardV2(): Promise<SchoolFinanceDashboardV2Data> {
  return Promise.resolve(financeDashboardV2Mock as SchoolFinanceDashboardV2Data);
}

// 预留 Web 端列表 AI 报表查询接口，后续可透传当前筛选条件和结果集。
export async function fetchReimbursementAiReportDemo(): Promise<ReimbursementAiReportDemoData> {
  return Promise.resolve(reimbursementAiReportDemoMock as ReimbursementAiReportDemoData);
}
