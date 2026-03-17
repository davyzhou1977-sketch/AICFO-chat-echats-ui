import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef, useImperativeHandle } from "react";
import { BarChart3, BriefcaseBusiness, CircleUserRound, House, Plus, } from "@/components/mobile/legacy-icons";
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
            const element = document.querySelector(".legacy-bottom-nav__item--active");
            element?.focus();
        },
    }));
    return (_jsxs("div", { className: cx("legacy-bottom-nav", className), style: style, children: [navItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = item.key === activeKey;
                return (_jsxs("button", { type: "button", className: cx("legacy-bottom-nav__item", isActive && "legacy-bottom-nav__item--active"), "aria-current": isActive ? "page" : undefined, children: [_jsx(Icon, { className: "legacy-bottom-nav__icon" }), _jsx("span", { className: "legacy-bottom-nav__label", children: item.label })] }, item.key));
            }), _jsx("div", { className: "legacy-bottom-nav__center", children: _jsx("button", { type: "button", className: "legacy-bottom-nav__center-button", children: _jsx(Plus, { className: "legacy-bottom-nav__center-icon" }) }) })] }));
});
