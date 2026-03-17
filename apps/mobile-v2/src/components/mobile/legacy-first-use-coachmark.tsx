import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import type { CSSProperties } from "react";
import { Bot, ReceiptText, ShieldCheck, UsersRound, X } from "@/components/mobile/legacy-icons";

function cx(...classNames: Array<string | undefined | false>) {
  return classNames.filter(Boolean).join(" ");
}

export interface LegacyFirstUseCoachmarkRef {
  open: () => void;
  close: () => void;
}

interface LegacyFirstUseCoachmarkProps {
  visible?: boolean;
  defaultVisible?: boolean;
  onVisibleChange?: (visible: boolean) => void;
  className?: string;
  style?: CSSProperties;
}

export const LegacyFirstUseCoachmark = forwardRef<
  LegacyFirstUseCoachmarkRef,
  LegacyFirstUseCoachmarkProps
>(function LegacyFirstUseCoachmark(
  { visible, defaultVisible = false, onVisibleChange, className, style },
  ref,
) {
  const [innerVisible, setInnerVisible] = useState(defaultVisible);
  const isControlled = useMemo(() => visible !== undefined, [visible]);
  const currentVisible = isControlled ? visible : innerVisible;

  const setVisible = (nextVisible: boolean) => {
    if (!isControlled) {
      setInnerVisible(nextVisible);
    }
    onVisibleChange?.(nextVisible);
  };

  useEffect(() => {
    if (!isControlled) {
      setInnerVisible(defaultVisible);
    }
  }, [defaultVisible, isControlled]);

  useImperativeHandle(ref, () => ({
    open: () => setVisible(true),
    close: () => setVisible(false),
  }));

  if (!currentVisible) {
    return null;
  }

  return (
    <div className={cx("legacy-coachmark", className)} style={style}>
      <div className="legacy-coachmark__arrow" />

      <div className="legacy-coachmark__head">
        <div className="legacy-coachmark__eyebrow">新增分析主题</div>
        <button
          type="button"
          className="legacy-coachmark__close"
          onClick={() => setVisible(false)}
          aria-label="关闭提示"
        >
          <X className="legacy-coachmark__close-icon" />
        </button>
      </div>

      <div className="legacy-coachmark__title">已新增 3 个主题和 AI 解读</div>
      <div className="legacy-coachmark__desc">
        除了预算执行分析，现在还可以查看报销行为、人员费用和基本保障费用，并在每个主题里快速看到 AI 解读。
      </div>

      <div className="legacy-coachmark__chips">
        <span className="legacy-coachmark__chip">
          <ReceiptText className="legacy-coachmark__chip-icon" />
          报销行为分析
        </span>
        <span className="legacy-coachmark__chip">
          <UsersRound className="legacy-coachmark__chip-icon" />
          人员费用分析
        </span>
        <span className="legacy-coachmark__chip">
          <ShieldCheck className="legacy-coachmark__chip-icon" />
          基本保障费用分析
        </span>
        <span className="legacy-coachmark__chip legacy-coachmark__chip--accent">
          <Bot className="legacy-coachmark__chip-icon" />
          AI 解读
        </span>
      </div>

      <div className="legacy-coachmark__tips">
        <div className="legacy-coachmark__tip">点按上方主题，切换不同分析视角</div>
        <div className="legacy-coachmark__tip">每个主题底部都有 AI 解读卡，帮助快速抓住重点</div>
      </div>

      <div className="legacy-coachmark__actions">
        <button
          type="button"
          className="legacy-coachmark__button"
          onClick={() => setVisible(false)}
        >
          我知道了
        </button>
      </div>
    </div>
  );
});
