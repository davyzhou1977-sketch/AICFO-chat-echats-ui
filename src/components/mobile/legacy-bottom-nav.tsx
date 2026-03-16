import { forwardRef, useImperativeHandle } from "react";
import type { CSSProperties } from "react";
import { BarChart3, BriefcaseBusiness, CircleUserRound, House, Plus } from "lucide-react";

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
          ".legacy-bottom-nav__item--active",
        ) as HTMLButtonElement | null;
        element?.focus();
      },
    }));

    return (
      <div className={cx("legacy-bottom-nav", className)} style={style}>
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = item.key === activeKey;

          return (
            <button
              key={item.key}
              type="button"
              className={cx(
                "legacy-bottom-nav__item",
                isActive && "legacy-bottom-nav__item--active",
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="legacy-bottom-nav__icon" />
              <span className="legacy-bottom-nav__label">{item.label}</span>
            </button>
          );
        })}

        <div className="legacy-bottom-nav__center">
          <button type="button" className="legacy-bottom-nav__center-button">
            <Plus className="legacy-bottom-nav__center-icon" />
          </button>
        </div>
      </div>
    );
  },
);
