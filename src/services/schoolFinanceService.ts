import dashboardMock from "@/data/mock/school-finance-dashboard.json";
import type { SchoolFinanceDashboardData } from "@/types/schoolFinance";

// 预留真实接口切换点，后续可在此替换为 fetch/axios 调用。
export async function fetchSchoolFinanceDashboard(): Promise<SchoolFinanceDashboardData> {
  return Promise.resolve(dashboardMock as SchoolFinanceDashboardData);
}
