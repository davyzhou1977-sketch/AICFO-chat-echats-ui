import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef, useEffect, useImperativeHandle, useMemo, useState, } from "react";
import { Bot, ReceiptText, ShieldCheck, UsersRound, X } from "@/components/mobile/legacy-icons";
function cx(...classNames) {
    return classNames.filter(Boolean).join(" ");
}
export const LegacyFirstUseCoachmark = forwardRef(function LegacyFirstUseCoachmark({ visible, defaultVisible = false, onVisibleChange, className, style }, ref) {
    const [innerVisible, setInnerVisible] = useState(defaultVisible);
    const isControlled = useMemo(() => visible !== undefined, [visible]);
    const currentVisible = isControlled ? visible : innerVisible;
    const setVisible = (nextVisible) => {
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
    return (_jsxs("div", { className: cx("legacy-coachmark", className), style: style, children: [_jsx("div", { className: "legacy-coachmark__arrow" }), _jsxs("div", { className: "legacy-coachmark__head", children: [_jsx("div", { className: "legacy-coachmark__eyebrow", children: "\u65B0\u589E\u5206\u6790\u4E3B\u9898" }), _jsx("button", { type: "button", className: "legacy-coachmark__close", onClick: () => setVisible(false), "aria-label": "\u5173\u95ED\u63D0\u793A", children: _jsx(X, { className: "legacy-coachmark__close-icon" }) })] }), _jsx("div", { className: "legacy-coachmark__title", children: "\u5DF2\u65B0\u589E 3 \u4E2A\u4E3B\u9898\u548C AI \u89E3\u8BFB" }), _jsx("div", { className: "legacy-coachmark__desc", children: "\u9664\u4E86\u9884\u7B97\u6267\u884C\u5206\u6790\uFF0C\u73B0\u5728\u8FD8\u53EF\u4EE5\u67E5\u770B\u62A5\u9500\u884C\u4E3A\u3001\u4EBA\u5458\u8D39\u7528\u548C\u57FA\u672C\u4FDD\u969C\u8D39\u7528\uFF0C\u5E76\u5728\u6BCF\u4E2A\u4E3B\u9898\u91CC\u5FEB\u901F\u770B\u5230 AI \u89E3\u8BFB\u3002" }), _jsxs("div", { className: "legacy-coachmark__chips", children: [_jsxs("span", { className: "legacy-coachmark__chip", children: [_jsx(ReceiptText, { className: "legacy-coachmark__chip-icon" }), "\u62A5\u9500\u884C\u4E3A\u5206\u6790"] }), _jsxs("span", { className: "legacy-coachmark__chip", children: [_jsx(UsersRound, { className: "legacy-coachmark__chip-icon" }), "\u4EBA\u5458\u8D39\u7528\u5206\u6790"] }), _jsxs("span", { className: "legacy-coachmark__chip", children: [_jsx(ShieldCheck, { className: "legacy-coachmark__chip-icon" }), "\u57FA\u672C\u4FDD\u969C\u8D39\u7528\u5206\u6790"] }), _jsxs("span", { className: "legacy-coachmark__chip legacy-coachmark__chip--accent", children: [_jsx(Bot, { className: "legacy-coachmark__chip-icon" }), "AI \u89E3\u8BFB"] })] }), _jsxs("div", { className: "legacy-coachmark__tips", children: [_jsx("div", { className: "legacy-coachmark__tip", children: "\u70B9\u6309\u4E0A\u65B9\u4E3B\u9898\uFF0C\u5207\u6362\u4E0D\u540C\u5206\u6790\u89C6\u89D2" }), _jsx("div", { className: "legacy-coachmark__tip", children: "\u6BCF\u4E2A\u4E3B\u9898\u5E95\u90E8\u90FD\u6709 AI \u89E3\u8BFB\u5361\uFF0C\u5E2E\u52A9\u5FEB\u901F\u6293\u4F4F\u91CD\u70B9" })] }), _jsx("div", { className: "legacy-coachmark__actions", children: _jsx("button", { type: "button", className: "legacy-coachmark__button", onClick: () => setVisible(false), children: "\u6211\u77E5\u9053\u4E86" }) })] }));
});
