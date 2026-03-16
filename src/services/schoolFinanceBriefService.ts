import type { InsightBlock } from "@/types/schoolFinance";

interface PushBriefPayload {
  scene: string;
  insight: InsightBlock;
}

// 预留 Chat 推送接口，后续可替换为真实消息推送服务。
export async function pushGovernanceBriefToChat(_payload: PushBriefPayload) {
  return Promise.resolve({ success: true });
}
