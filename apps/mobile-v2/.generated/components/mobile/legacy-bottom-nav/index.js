import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef, useImperativeHandle } from "react";
import { BarChart3, BriefcaseBusiness, CircleUserRound, House, Plus, } from "@/components/mobile/legacy-icons";
import styles from "./index.less";
function cx(...classNames) {
    return classNames.filter(Boolean).join(" ");
}
const navItems = [
    { key: "home", label: "首页", icon: House },
    { key: "workbench", label: "工作台", icon: BriefcaseBusiness },
    { key: "report", label: "报表", icon: BarChart3 },
    { key: "mine", label: "我的", icon: CircleUserRound },
];
export const LegacyBottomNav = forwardRef(function LegacyBottomNav({ activeKey = "report", className, style }, ref) {
    useImperativeHandle(ref, () => ({
        focusActive: () => {
            const element = document.querySelector('[data-active-bottom-nav="true"]');
            element?.focus();
        },
    }));
    return (_jsxs("div", { className: cx(styles.bottomNav, className), style: style, children: [navItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.key === activeKey;
                return (_jsxs("button", { type: "button", className: cx(styles.item, isActive && styles.itemActive), "aria-current": isActive ? "page" : undefined, "data-active-bottom-nav": isActive ? "true" : undefined, children: [_jsx(Icon, { className: styles.icon }), _jsx("span", { className: styles.label, children: item.label })] }, item.key));
            }), _jsx("div", { className: styles.center, children: _jsx("button", { type: "button", className: styles.centerButton, children: _jsx(Plus, { className: styles.centerIcon }) }) })] }));
});
