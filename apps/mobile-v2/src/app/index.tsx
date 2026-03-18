import { useEffect, useState } from "react";
import { ActivityIndicator } from "antd-mobile";
import { ChevronDown } from "@/components/mobile/legacy-icons";
import { FinancialAnalysisFusionLegacy } from "@/components/mobile/financial-analysis-fusion-legacy";
import { LegacyBottomNav } from "@/components/mobile/legacy-bottom-nav";
import { syncHostNavigationTitle } from "@/services/hostNavigationService";
import { fetchSchoolFinanceFusionDemo } from "@/services/schoolFinanceFusionService";
import type { FinancialPeriod } from "@/types/schoolFinanceV2";
import type { FinancialAnalysisFusionData } from "@/types/schoolFinanceFusion";
import styles from "./index.less";

const targetPath = "/mobile/school-finance-fusion-demo";

function LoadingState() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 16px",
        color: "#64748b",
        fontSize: 14,
        flexDirection: "column",
        gap: 12,
      }}
    >
      <ActivityIndicator size="large" text="" />
      页面加载中...
    </div>
  );
}

function NotFoundState() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 16px",
        color: "#64748b",
        fontSize: 14,
      }}
    >
      请访问 /mobile/school-finance-fusion-demo
    </div>
  );
}

export function App() {
  const [data, setData] = useState<FinancialAnalysisFusionData | null>(null);
  const [activePeriod, setActivePeriod] = useState<FinancialPeriod>("year");

  useEffect(() => {
    if (window.location.pathname === "/") {
      window.history.replaceState({}, "", targetPath);
    }
  }, []);

  useEffect(() => {
    void fetchSchoolFinanceFusionDemo().then((dashboard) => {
      setData(dashboard);
      setActivePeriod(dashboard.defaultPeriod);
    });
  }, []);

  useEffect(() => {
    void syncHostNavigationTitle("财务分析");
  }, []);

  if (window.location.pathname !== targetPath && window.location.pathname !== "/") {
    return <NotFoundState />;
  }

  if (!data) {
    return <LoadingState />;
  }

  return (
    <div className={styles.page}>
      <FinancialAnalysisFusionLegacy
        data={data}
        activePeriod={activePeriod}
        periodControl={
          <label className={styles.period}>
            <select
              value={activePeriod}
              onChange={(event) => setActivePeriod(event.target.value as FinancialPeriod)}
              className={styles.periodSelect}
              aria-label="选择分析数据周期"
            >
              {data.periodOptions.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
            <ChevronDown className={styles.periodIcon} />
          </label>
        }
      />
      <LegacyBottomNav activeKey="report" />
    </div>
  );
}
