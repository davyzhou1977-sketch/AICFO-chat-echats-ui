import { forwardRef, useImperativeHandle } from "react";
import type { CSSProperties } from "react";
import {
  BarChart3,
  BriefcaseBusiness,
  CircleUserRound,
  House,
  Plus,
} from "@/components/mobile/legacy-icons";
import styles from "./index.less";

function cx(...classNames: Array<string | undefined | false>) {
  return classNames.filter(Boolean).join(" ");
}

type BottomNavItemKey = "home" | "workbench" | "report" | "mine";

export interface LegacyBottomNavRef {
  focusActive: () => void;
}

interface LegacyBottomNavProps {
  activeKey?: BottomNavItemKey;
  className?: string;
  style?: CSSProperties;
}

const navItems: Array<{
  key: BottomNavItemKey;
  label: string;
  icon: typeof House;
}> = [
  { key: "home", label: "首页", icon: House },
  { key: "workbench", label: "工作台", icon: BriefcaseBusiness },
  { key: "report", label: "报表", icon: BarChart3 },
  { key: "mine", label: "我的", icon: CircleUserRound },
];

export const LegacyBottomNav = forwardRef<LegacyBottomNavRef, LegacyBottomNavProps>(
  function LegacyBottomNav({ activeKey = "report", className, style }, ref) {
    useImperativeHandle(ref, () => ({
      focusActive: () => {
        const element = document.querySelector(
          '[data-active-bottom-nav="true"]',
        ) as HTMLButtonElement | null;
        element?.focus();
      },
    }));

    return (
      <div className={cx(styles.bottomNav, className)} style={style}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.key === activeKey;

          return (
            <button
              key={item.key}
              type="button"
              className={cx(styles.item, isActive && styles.itemActive)}
              aria-current={isActive ? "page" : undefined}
              data-active-bottom-nav={isActive ? "true" : undefined}
            >
              <Icon className={styles.icon} />
              <span className={styles.label}>{item.label}</span>
            </button>
          );
        })}

        <div className={styles.center}>
          <button type="button" className={styles.centerButton}>
            <Plus className={styles.centerIcon} />
          </button>
        </div>
      </div>
    );
  },
);
