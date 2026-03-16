import { type ReactNode, useEffect, useState } from "react";
import { BarChart3, Download, ListFilter, Settings2, Sparkles, X } from "lucide-react";
import { AIInsightCard } from "@/components/mobile/ai-insight-card";
import { Chart } from "@/components/mobile/chart";
import { ChartPanel } from "@/components/mobile/chart-panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getGroupedBarOption,
  getMultiLineOption,
} from "@/charts/schoolFinanceV2Options";
import { fetchReimbursementAiReportDemo } from "@/services/schoolFinanceV2Service";
import type { ReimbursementAiReportDemoData } from "@/types/schoolFinanceV2";

const currencyFormatter = new Intl.NumberFormat("zh-CN");

export function ReimbursementAiReportDemoPage() {
  const [data, setData] = useState<ReimbursementAiReportDemoData | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(true);

  useEffect(() => {
    void fetchReimbursementAiReportDemo().then(setData);
  }, []);

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 text-sm text-slate-500">
        页面加载中...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EEF3FB] px-6 py-6 text-slate-900">
      <div className="mx-auto max-w-[1440px] space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-[30px] font-semibold tracking-tight">{data.title}</h1>
            <p className="mt-1 text-sm text-slate-500">{data.subtitle}</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="h-10 gap-2 px-4">
              <ListFilter className="h-4 w-4" />
              批量操作
            </Button>
            <Button variant="outline" className="h-10 gap-2 px-4">
              <Download className="h-4 w-4" />
              导出Excel
            </Button>
            <Button className="h-10 gap-2 px-4" onClick={() => setDrawerOpen(true)}>
              <Sparkles className="h-4 w-4" />
              AI报表查询
            </Button>
          </div>
        </div>

        <Card className="border-white/80 bg-white/92 shadow-soft">
          <CardContent className="flex items-center justify-between gap-4 p-4">
            <div className="flex flex-1 flex-wrap gap-2">
              {data.filterChips.map((chip) => (
                <div
                  key={`${chip.label}-${chip.value}`}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600"
                >
                  <span className="text-slate-400">{chip.label}:</span>
                  <span className="font-medium text-slate-800">{chip.value}</span>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500"
            >
              <Settings2 className="h-4 w-4" />
            </button>
          </CardContent>
        </Card>

        <div className="relative min-h-[720px]">
          <Card
            className={`border-white/80 bg-white/96 transition-all ${
              drawerOpen ? "mr-[420px]" : ""
            }`}
          >
            <CardHeader className="border-b border-slate-100 pb-4">
              <div className="flex items-center justify-between gap-4">
                <CardTitle className="text-[18px]">查询结果列表</CardTitle>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Badge variant="outline">共 {data.rows.length} 条记录</Badge>
                  <button
                    type="button"
                    onClick={() => setDrawerOpen((open) => !open)}
                    className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600"
                  >
                    <BarChart3 className="h-3.5 w-3.5" />
                    {drawerOpen ? "收起报表" : "查看报表"}
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-hidden rounded-b-[24px]">
                <table className="w-full table-fixed text-left text-sm">
                  <thead className="bg-[#EAF5FD] text-slate-700">
                    <tr>
                      <TableHeader label="单据编号" />
                      <TableHeader label="报销事由" />
                      <TableHeader label="申请人" />
                      <TableHeader label="申请部门" />
                      <TableHeader label="审批状态" />
                      <TableHeader label="报销金额" align="right" />
                      <TableHeader label="核销金额" align="right" />
                      <TableHeader label="核销日期" />
                    </tr>
                  </thead>
                  <tbody>
                    {data.rows.map((row, index) => (
                      <tr
                        key={row.id}
                        className={index % 2 === 0 ? "bg-white" : "bg-slate-50/80"}
                      >
                        <TableCell className="w-[160px] text-slate-500">{row.id}</TableCell>
                        <TableCell className="w-[300px] font-medium text-slate-800">
                          {row.reason}
                        </TableCell>
                        <TableCell>{row.applicant}</TableCell>
                        <TableCell className="text-slate-500">{row.department}</TableCell>
                        <TableCell>
                          <span className="inline-flex rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-600">
                            {row.status}
                          </span>
                        </TableCell>
                        <TableCell align="right">{row.amount}</TableCell>
                        <TableCell align="right">{row.verifiedAmount}</TableCell>
                        <TableCell>{row.verifiedDate}</TableCell>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <aside
            className={`absolute right-0 top-0 h-full w-[400px] rounded-[28px] border border-white/80 bg-white/96 shadow-[0_24px_80px_rgba(15,23,42,0.14)] transition-all ${
              drawerOpen ? "translate-x-0 opacity-100" : "pointer-events-none translate-x-6 opacity-0"
            }`}
          >
            <div className="flex h-full flex-col">
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-5">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-blue-600">
                    AI Report Query
                  </p>
                  <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">
                    {data.drawer.title}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {data.drawer.description}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
                <div className="grid grid-cols-2 gap-3">
                  {data.drawer.summaryMetrics.map((metric) => (
                    <Card key={metric.label} className="border-slate-200/80 bg-slate-50 shadow-none">
                      <CardContent className="space-y-2 p-4">
                        <p className="text-xs text-slate-500">{metric.label}</p>
                        <p className="text-lg font-semibold tracking-tight text-slate-900">
                          {metric.value}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <ChartPanel
                  title="东西校区月度水费对比"
                  badge="柱状图"
                  hint="根据当前查询结果自动识别出“时间 + 校区”这类适合做对比图的结构。"
                >
                  <Chart
                    className="chart-sm"
                    option={getGroupedBarOption(data.drawer.groupedBar, (value) =>
                      `${currencyFormatter.format(value)}`
                    )}
                  />
                </ChartPanel>

                <ChartPanel
                  title="东西校区月度水费趋势"
                  badge="折线图"
                  hint="若继续选择更多月份，系统将沿用同一趋势图口径自动扩展。"
                >
                  <Chart
                    className="chart-sm"
                    option={getMultiLineOption(data.drawer.trendLine, "元")}
                  />
                </ChartPanel>

                <AIInsightCard
                  insight={{
                    title: "一句话摘要",
                    summary: data.drawer.insight,
                    bullets: [
                      "当前轻量版只输出图表、汇总金额和一句话结论。",
                      "后续可继续增加“导出图片”和“复制到汇报材料”。",
                      "也可以把当前查询条件继续传给后端做更复杂的即时统计。"
                    ],
                  }}
                />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function TableHeader({
  label,
  align = "left",
}: {
  label: string;
  align?: "left" | "right";
}) {
  return (
    <th
      className={`px-4 py-4 text-sm font-medium ${
        align === "right" ? "text-right" : "text-left"
      }`}
    >
      {label}
    </th>
  );
}

function TableCell({
  children,
  align = "left",
  className = "",
}: {
  children: ReactNode;
  align?: "left" | "right";
  className?: string;
}) {
  return (
    <td
      className={`px-4 py-4 align-middle ${
        align === "right" ? "text-right" : "text-left"
      } ${className}`}
    >
      {children}
    </td>
  );
}
