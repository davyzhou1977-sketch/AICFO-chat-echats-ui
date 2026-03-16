import { Navigate, createBrowserRouter } from "react-router-dom";
import { MobileSchoolFinancePage } from "@/pages/mobile-school-finance-page";
import { MobileSchoolFinanceFusionDemoPage } from "@/pages/mobile-school-finance-fusion-demo-page";
import { MobileSchoolFinanceV2Page } from "@/pages/mobile-school-finance-v2-page";
import { ReimbursementAiReportDemoPage } from "@/pages/reimbursement-ai-report-demo-page";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/mobile/school-finance" replace />,
  },
  {
    path: "/mobile/school-finance",
    element: <MobileSchoolFinancePage />,
  },
  {
    path: "/mobile/school-finance-v2",
    element: <MobileSchoolFinanceV2Page />,
  },
  {
    path: "/mobile/school-finance-fusion-demo",
    element: <MobileSchoolFinanceFusionDemoPage />,
  },
  {
    path: "/web/reimbursements/ai-report-demo",
    element: <ReimbursementAiReportDemoPage />,
  },
]);
