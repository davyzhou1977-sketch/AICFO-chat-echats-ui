export type RiskThemeCode =
  | "invoice_evidence"
  | "standard_amount"
  | "budget_indicator"
  | "contract_timeline"
  | "consistency_authenticity";

export interface RiskThemeDefinition {
  code: RiskThemeCode;
  name: string;
  description: string;
}

export interface BusinessTypeReference {
  code: string;
  name: string;
  note?: string;
}

export interface ControlRiskRuleMappingItem {
  ruleCode: string;
  objectType: string;
  ruleName: string;
  themeCode: RiskThemeCode;
  themeName: string;
  mappingReason: string;
  sourceStatus: "confirmed" | "to_be_verified";
}

export interface ControlRiskRuleMappingData {
  version: string;
  generatedAt: string;
  uniquenessRule: string;
  note: string;
  themes: RiskThemeDefinition[];
  businessTypes: BusinessTypeReference[];
  rules: ControlRiskRuleMappingItem[];
}
