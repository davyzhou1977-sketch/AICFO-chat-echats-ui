import ruleThemeMappingMock from "@/data/mock/control-risk-rule-theme-mapping.json";
import type { ControlRiskRuleMappingData } from "@/types/controlRiskRuleMapping";

// 预留规则主题映射主数据接口，后续可替换为后端规则库导出或配置中心。
export async function fetchControlRiskRuleThemeMapping(): Promise<ControlRiskRuleMappingData> {
  return Promise.resolve(ruleThemeMappingMock as ControlRiskRuleMappingData);
}
