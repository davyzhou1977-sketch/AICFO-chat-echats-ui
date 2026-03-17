import React from "react";

type IconProps = {
  className?: string;
};

function Svg({
  className,
  children,
  viewBox = "0 0 24 24",
}: IconProps & { children: React.ReactNode; viewBox?: string }) {
  return (
    <svg
      className={className}
      viewBox={viewBox}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export function ChevronDown({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="m6 9 6 6 6-6" />
    </Svg>
  );
}

export function ArrowDownWideNarrow({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M7 4v14" />
      <path d="m4 15 3 3 3-3" />
      <path d="M14 7h6" />
      <path d="M14 11h4" />
      <path d="M14 15h2" />
    </Svg>
  );
}

export function ArrowUpWideNarrow({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M7 20V6" />
      <path d="m4 9 3-3 3 3" />
      <path d="M14 7h2" />
      <path d="M14 11h4" />
      <path d="M14 15h6" />
    </Svg>
  );
}

export function ReceiptText({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M7 3h10v18l-2-1-2 1-2-1-2 1-2-1-2 1V3Z" />
      <path d="M9 8h6" />
      <path d="M9 12h6" />
      <path d="M9 16h4" />
    </Svg>
  );
}

export function ShieldCheck({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="m12 3 7 3v5c0 4.5-2.5 8.2-7 10-4.5-1.8-7-5.5-7-10V6l7-3Z" />
      <path d="m9.5 12 1.8 1.8L15 10.5" />
    </Svg>
  );
}

export function UsersRound({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
      <path d="M15.5 9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
      <path d="M4 19a5 5 0 0 1 10 0" />
      <path d="M14 19a4 4 0 0 1 6 0" />
    </Svg>
  );
}

export function WalletCards({ className }: IconProps) {
  return (
    <Svg className={className}>
      <rect x="3" y="6" width="18" height="12" rx="2.5" />
      <path d="M3 10h18" />
      <path d="M15 14h2" />
    </Svg>
  );
}

export function BarChart3({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M5 19V9" />
      <path d="M12 19V5" />
      <path d="M19 19v-7" />
    </Svg>
  );
}

export function BriefcaseBusiness({ className }: IconProps) {
  return (
    <Svg className={className}>
      <rect x="3" y="7" width="18" height="12" rx="2" />
      <path d="M9 7V5h6v2" />
      <path d="M3 12h18" />
    </Svg>
  );
}

export function CircleUserRound({ className }: IconProps) {
  return (
    <Svg className={className}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="9" r="2.5" />
      <path d="M7.5 17a5.5 5.5 0 0 1 9 0" />
    </Svg>
  );
}

export function House({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="m4 11 8-6 8 6" />
      <path d="M6 10v9h12v-9" />
    </Svg>
  );
}

export function Plus({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </Svg>
  );
}

export function Bot({ className }: IconProps) {
  return (
    <Svg className={className}>
      <rect x="5" y="7" width="14" height="11" rx="3" />
      <path d="M12 3v4" />
      <path d="M9 12h.01" />
      <path d="M15 12h.01" />
      <path d="M9 15h6" />
    </Svg>
  );
}

export function X({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M6 6 18 18" />
      <path d="M18 6 6 18" />
    </Svg>
  );
}
