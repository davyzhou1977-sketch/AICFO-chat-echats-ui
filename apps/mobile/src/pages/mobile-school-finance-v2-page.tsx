import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { EmbeddedAppShell } from "@/components/mobile/embedded-app-shell";
import { FinancialAnalysisTab } from "@/components/mobile/financial-analysis-tab";
import { syncHostNavigationTitle } from "@/services/hostNavigationService";
import { fetchSchoolFinanceDashboardV2 } from "@/services/schoolFinanceV2Service";
import "@/styles/school-finance-mobile.css";
import type {
  FinancialPeriod,
  SchoolFinanceDashboardV2Data,
} from "@/types/schoolFinanceV2";

export function MobileSchoolFinanceV2Page() {
  const [data, setData] = useState<SchoolFinanceDashboardV2Data | null>(null);
  const [activePeriod, setActivePeriod] = useState<FinancialPeriod>("year");

  useEffect(() => {
    void fetchSchoolFinanceDashboardV2().then((dashboard) => {
      setData(dashboard);
      setActivePeriod(dashboard.financialAnalysis.defaultPeriod);
    });
  }, []);

  useEffect(() => {
    void syncHostNavigationTitle("财务分析");
  }, []);

  if (!data) {
    return (
      <div className="mx-auto flex min-h-screen max-w-[430px] items-center justify-center px-4 text-sm text-slate-500">
        页面加载中...
      </div>
    );
  }

  const { financialAnalysis } = data;

  return (
    <EmbeddedAppShell
      title="财务分析"
      subtitle="默认从预算进入，围绕预算、报销、人员、保障和专题做分专题查看。"
      actionSlot={
        <label className="relative inline-flex shrink-0 items-center">
          <select
            value={activePeriod}
            onChange={(event) => setActivePeriod(event.target.value as FinancialPeriod)}
            className="h-10 appearance-none rounded-full border border-slate-200 bg-white pl-4 pr-10 text-sm font-medium text-slate-700 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            {financialAnalysis.periodOptions.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-slate-400" />
        </label>
      }
    >
      <div className="safe-bottom space-y-4">
        <FinancialAnalysisTab section={financialAnalysis} activePeriod={activePeriod} />
      </div>
    </EmbeddedAppShell>
  );
}
