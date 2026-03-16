import { Compass, Layers3, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface GovernanceIntroDialogProps {
  onClose: () => void;
}

const introSteps = [
  {
    icon: Compass,
    badge: "治理视角",
    title: "先看真正可治理的钱",
    description:
      "校长治理页默认不看全口径总支出，而是优先看更适合校长决策的“可治理支出池”。",
    points: [
      "避免被工资、刚性支出稀释判断",
      "更快识别哪些资源真的可以调整",
      "所有核心图表默认按治理口径呈现",
    ],
  },
  {
    icon: Layers3,
    badge: "三层分析",
    title: "三张卡，看清钱花到哪里",
    description:
      "本页把同一笔钱拆成资源投向、治理方式和支出口径三层，帮助校长看清钱最终作用于哪里、由谁支配。",
    points: [
      "资源投向：钱最终作用于哪里",
      "治理方式：基层自主还是行政统筹",
      "支出口径：默认聚焦可治理支出池",
    ],
  },
  {
    icon: Sparkles,
    badge: "使用方式",
    title: "每张图都配一段校长可读结论",
    description:
      "每个小板块都配有 AI 解读，并预留“推送给校长”能力，后续可直接生成简报或 Chat 消息。",
    points: [
      "图表下方直接看到三句话提醒",
      "优先回答管理问题，而不是解释图表技术",
      "适合后续接入消息推送和日报机制",
    ],
  },
];

export function GovernanceIntroDialog({
  onClose,
}: GovernanceIntroDialogProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const step = introSteps[stepIndex];
  const Icon = step.icon;
  const isLastStep = stepIndex === introSteps.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-slate-950/45 px-4 pb-4 pt-20">
      <Card className="mx-auto w-full max-w-[430px] overflow-hidden border-white/80 bg-white shadow-soft">
        <div className="bg-[linear-gradient(135deg,#2563ff_0%,#5f86ff_100%)] px-5 pb-5 pt-5 text-white">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-blue-100/90">
                First Use Guide
              </p>
              <p className="mt-2 text-2xl font-semibold">校长治理引导</p>
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 rounded-full bg-white/10 p-0 text-white hover:bg-white/20 hover:text-white"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2 text-xs text-blue-50/90">
            {introSteps.map((_, index) => (
              <span
                key={index}
                className={`h-1.5 rounded-full transition-all ${
                  index === stepIndex ? "w-6 bg-white" : "w-2 bg-white/45"
                }`}
              />
            ))}
            <span className="ml-2">
              {stepIndex + 1}/{introSteps.length}
            </span>
          </div>
        </div>

        <CardContent className="space-y-4 p-5">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Icon className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <Badge>{step.badge}</Badge>
              <p className="mt-3 text-xl font-semibold tracking-tight text-slate-900">
                {step.title}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {step.description}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {step.points.map((point) => (
              <div
                key={point}
                className="flex items-start gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
              >
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                <p className="text-sm leading-6 text-slate-700">{point}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between gap-3 pt-1">
            <Button
              variant="outline"
              className="rounded-full"
              onClick={() => {
                if (stepIndex === 0) {
                  onClose();
                  return;
                }
                setStepIndex((current) => current - 1);
              }}
            >
              {stepIndex === 0 ? "稍后再看" : "上一步"}
            </Button>
            <Button
              className="rounded-full"
              onClick={() => {
                if (isLastStep) {
                  onClose();
                  return;
                }
                setStepIndex((current) => current + 1);
              }}
            >
              {isLastStep ? "开始查看" : "下一步"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
