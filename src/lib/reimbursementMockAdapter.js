export function formatCurrency(value) {
  return new Intl.NumberFormat('zh-CN').format(Number(value || 0));
}

export function formatDate(value) {
  if (!value) {
    return '--';
  }

  const date = new Date(value);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseCampus(record) {
  const text = `${record.description || ''} ${record.departmentId_show || ''}`;
  if (text.includes('东校区') || text.includes('小学')) {
    return '东校区';
  }
  if (text.includes('西校区') || text.includes('中学')) {
    return '西校区';
  }
  return '未识别校区';
}

function parseMonthLabel(record) {
  const text = record.description || '';
  const match = text.match(/(\d{1,2})月/);
  if (match) {
    return `${Number(match[1])}月`;
  }

  const date = new Date(record.applyDate);
  return `${date.getMonth() + 1}月`;
}

function inferTopic(records) {
  const joined = records
    .map((record) => record.description || '')
    .join(' ');

  if (joined.includes('水费')) {
    return '水费';
  }
  if (joined.includes('电费')) {
    return '电费';
  }
  return '报销';
}

function buildCampusSeries(records) {
  const monthSet = new Set();
  const campusMonthAmount = new Map();
  const campusTotals = {
    东校区: 0,
    西校区: 0,
    未识别校区: 0,
  };

  records.forEach((record) => {
    const month = parseMonthLabel(record);
    const campus = parseCampus(record);
    const amount = Number(record.amount || 0);
    monthSet.add(month);
    campusTotals[campus] = (campusTotals[campus] || 0) + amount;
    campusMonthAmount.set(`${campus}-${month}`, (campusMonthAmount.get(`${campus}-${month}`) || 0) + amount);
  });

  const labels = Array.from(monthSet).sort((a, b) => Number(a.replace('月', '')) - Number(b.replace('月', '')));
  const campuses = Object.keys(campusTotals).filter((campus) => campusTotals[campus] > 0);

  const series = campuses.map((campus) => ({
    name: campus,
    data: labels.map((label) => campusMonthAmount.get(`${campus}-${label}`) || 0),
  }));

  return {
    labels,
    series,
    campusTotals,
  };
}

function buildInsight(records, chartData) {
  const totalAmount = records.reduce((sum, record) => sum + Number(record.amount || 0), 0);
  const totalCount = records.length;
  const totalActual = records.reduce((sum, record) => sum + Number(record.actual || 0), 0);
  const dominantSeries = [...chartData.series].sort(
    (left, right) => right.data.reduce((sum, value) => sum + value, 0) - left.data.reduce((sum, value) => sum + value, 0)
  )[0];
  const combined = chartData.labels.map((label, index) => ({
    label,
    amount: chartData.series.reduce((sum, item) => sum + Number(item.data[index] || 0), 0),
  }));
  const peakPoint = [...combined].sort((left, right) => right.amount - left.amount)[0];
  const averageAmount = totalCount > 0 ? Math.round(totalAmount / totalCount) : 0;

  return {
    summary: `本次查询共 ${totalCount} 笔，报销总金额 ${formatCurrency(totalAmount)} 元，核销金额 ${formatCurrency(totalActual)} 元。${dominantSeries ? `${dominantSeries.name}支出更高，` : ''}${peakPoint ? `${peakPoint.label}达到阶段峰值。` : ''}建议继续关注高金额校区的月度波动，并结合用量口径判断是否存在异常。`,
    footnote: `当前轻量版先展示基础汇总、趋势图和一句话摘要。后续接入后端 LLM 后，可进一步输出分项聚类结论与风险提示。`,
    averageAmount,
  };
}

export function buildReimbursementViewModel(records) {
  const safeRecords = Array.isArray(records) ? records : [];
  const chartData = buildCampusSeries(safeRecords);
  const totalCount = safeRecords.length;
  const totalAmount = safeRecords.reduce((sum, record) => sum + Number(record.amount || 0), 0);
  const statuses = Array.from(new Set(safeRecords.map((record) => record.statusId_show).filter(Boolean)));
  const campuses = chartData.series.map((item) => item.name);
  const months = chartData.labels;
  const topic = inferTopic(safeRecords);
  const defaultChartType = chartData.labels.length > 1 ? 'line' : 'bar';
  const insight = buildInsight(safeRecords, chartData);

  return {
    rows: safeRecords.map((record) => ({
      key: record.code,
      code: record.code,
      status: record.statusId_show || '--',
      reason: record.description || '--',
      department: record.departmentId_show || '--',
      applicant: record.applyUserId_show || '--',
      date: formatDate(record.applyDate),
      verifyAmount: Number(record.actual || 0),
      verifyDate: formatDate(record.verifyDate),
      amount: Number(record.amount || 0),
    })),
    filters: {
      status: statuses.length === 1 ? statuses[0] : `${statuses.length}种状态`,
      topic,
      period: months.length > 0 ? `${months[0]}-${months[months.length - 1]}` : '--',
      campus: campuses.join(' + ') || '--',
    },
    summaryMetrics: [
      { label: '报销单笔数', value: `${totalCount} 笔` },
      { label: '报销总金额', value: `${formatCurrency(totalAmount)} 元` },
    ],
    chartData,
    defaultChartType,
    insight,
  };
}
