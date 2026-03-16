import governanceDashboardMock from "@/data/mock/school-finance-governance-v2.json";
import type { GovernanceFinanceDashboardV2Data } from "@/types/schoolFinanceGovernance";

// 预留 V2 真实接口，后续可在此替换为后端请求。
export async function fetchSchoolFinanceGovernanceDashboard(): Promise<GovernanceFinanceDashboardV2Data> {
  return Promise.resolve(governanceDashboardMock as GovernanceFinanceDashboardV2Data);
}
