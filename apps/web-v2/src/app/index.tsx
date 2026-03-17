import { useMemo, useState } from "react";
import { Button, Tag } from "antd";
import { ReportPanel } from "@/components/report-panel/index";
import { reportData, type ChartMode } from "@/data/report";
import styles from "./index.module.less";

export function App() {
  const [chartMode, setChartMode] = useState<ChartMode>("bar");
  const totalAmount = useMemo(
    () =>
      reportData.rows.reduce(
        (sum, item) => sum + Number(item.verifiedAmount.replace(/,/g, "")),
        0,
      ),
    [],
  );

  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <section className={styles.main}>
          <header className={styles.hero}>
            <div>
              <div className={styles.kicker}>Web V2</div>
              <h1 className={styles.title}>{reportData.title}</h1>
              <p className={styles.subtitle}>{reportData.subtitle}</p>
            </div>
            <div className={styles.heroCard}>
              <span className={styles.heroLabel}>本次查询核销金额</span>
              <strong className={styles.heroValue}>
                {new Intl.NumberFormat("zh-CN").format(totalAmount)} 元
              </strong>
              <span className={styles.heroHint}>AI 报表已与筛选结果联动展示</span>
            </div>
          </header>

          <section className={styles.filterBar}>
            {reportData.filterChips.map((chip) => (
              <div key={chip.label} className={styles.filterChip}>
                <span className={styles.filterLabel}>{chip.label}</span>
                <span>{chip.value}</span>
              </div>
            ))}
          </section>

          <section className={styles.tableCard}>
            <div className={styles.tableHeader}>
              <div>
                <h2 className={styles.sectionTitle}>查询结果列表</h2>
                <p className={styles.sectionHint}>共 {reportData.rows.length} 条记录，可直接生成图表汇报。</p>
              </div>
              <Button type="primary" className={styles.primaryButton}>
                ai报表
              </Button>
            </div>

            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>单据编号</th>
                    <th>报销事由</th>
                    <th>申请部门</th>
                    <th>申请人</th>
                    <th>状态</th>
                    <th>报销金额</th>
                    <th>核销金额</th>
                    <th>核销日期</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.rows.map((row) => (
                    <tr key={row.id}>
                      <td>{row.id}</td>
                      <td>{row.reason}</td>
                      <td>{row.department}</td>
                      <td>{row.applicant}</td>
                      <td>
                        <Tag className={styles.statusTag} color="green">
                          {row.status}
                        </Tag>
                      </td>
                      <td>{row.amount}</td>
                      <td>{row.verifiedAmount}</td>
                      <td>{row.verifiedDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </section>

        <ReportPanel data={reportData.drawer} mode={chartMode} onModeChange={setChartMode} />
      </div>
    </div>
  );
}
