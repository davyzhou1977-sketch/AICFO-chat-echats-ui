import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { ActivityIndicator } from "antd-mobile";
import { ChevronDown } from "@/components/mobile/legacy-icons";
import { FinancialAnalysisFusionLegacy } from "@/components/mobile/financial-analysis-fusion-legacy";
import { LegacyBottomNav } from "@/components/mobile/legacy-bottom-nav";
import { syncHostNavigationTitle } from "@/services/hostNavigationService";
import { fetchSchoolFinanceFusionDemo } from "@/services/schoolFinanceFusionService";
import styles from "./index.less";
const targetPath = "/mobile/school-finance-fusion-demo";
function LoadingState() {
    return (_jsxs("div", { style: {
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 16px",
            color: "#64748b",
            fontSize: 14,
            flexDirection: "column",
            gap: 12,
        }, children: [_jsx(ActivityIndicator, { size: "large", text: "" }), "\u9875\u9762\u52A0\u8F7D\u4E2D..."] }));
}
function NotFoundState() {
    return (_jsx("div", { style: {
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 16px",
            color: "#64748b",
            fontSize: 14,
        }, children: "\u8BF7\u8BBF\u95EE /mobile/school-finance-fusion-demo" }));
}
export function App() {
    const [data, setData] = useState(null);
    const [activePeriod, setActivePeriod] = useState("year");
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
        return _jsx(NotFoundState, {});
    }
    if (!data) {
        return _jsx(LoadingState, {});
    }
    return (_jsxs("div", { className: styles.page, children: [_jsx(FinancialAnalysisFusionLegacy, { data: data, activePeriod: activePeriod, periodControl: _jsxs("label", { className: styles.period, children: [_jsx("select", { value: activePeriod, onChange: (event) => setActivePeriod(event.target.value), className: styles.periodSelect, "aria-label": "\u9009\u62E9\u5206\u6790\u6570\u636E\u5468\u671F", children: data.periodOptions.map((item) => (_jsx("option", { value: item.value, children: item.label }, item.value))) }), _jsx(ChevronDown, { className: styles.periodIcon })] }) }), _jsx(LegacyBottomNav, { activeKey: "report" })] }));
}
