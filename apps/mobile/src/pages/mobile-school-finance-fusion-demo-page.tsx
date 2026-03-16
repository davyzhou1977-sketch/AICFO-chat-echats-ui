import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { FinancialAnalysisFusionLegacy } from "@/components/mobile/financial-analysis-fusion-legacy";
import { LegacyBottomNav } from "@/components/mobile/legacy-bottom-nav";
import { syncHostNavigationTitle } from "@/services/hostNavigationService";
import { fetchSchoolFinanceFusionDemo } from "@/services/schoolFinanceFusionService";
import "@/styles/school-finance-fusion-legacy.less";
import type { FinancialPeriod } from "@/types/schoolFinanceV2";
import type { FinancialAnalysisFusionData } from "@/types/schoolFinanceFusion";

export function MobileSchoolFinanceFusionDemoPage() {
  const [data, setData] = useState<FinancialAnalysisFusionData | null>(null);
  const [activePeriod, setActivePeriod] = useState<FinancialPeriod>("year");

  useEffect(() => {
    void fetchSchoolFinanceFusionDemo().then((dashboard) => {
      setData(dashboard);
      setActivePeriod(dashboard.defaultPeriod);
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

  return (
    <div className="legacy-page">
      <FinancialAnalysisFusionLegacy
        data={data}
        activePeriod={activePeriod}
        periodControl={
          <label className="legacy-page__period">
            <select
              value={activePeriod}
              onChange={(event) => setActivePeriod(event.target.value as FinancialPeriod)}
              className="legacy-page__period-select"
              aria-label="选择分析数据周期"
            >
              {data.periodOptions.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
            <ChevronDown className="legacy-page__period-icon" />
          </label>
        }
      />
      <LegacyBottomNav activeKey="report" />
    </div>
  );
}
