import type { PropsWithChildren, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EmbeddedAppShellProps extends PropsWithChildren {
  title: string;
  subtitle?: string;
  topBar?: ReactNode;
  actionSlot?: ReactNode;
  className?: string;
}

export function EmbeddedAppShell({
  title,
  subtitle,
  topBar,
  actionSlot,
  className,
  children,
}: EmbeddedAppShellProps) {
  return (
    <main className={cn("mx-auto min-h-screen max-w-[430px] px-4 pb-10 pt-4", className)}>
      <section className="mb-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="truncate text-[22px] font-semibold tracking-tight text-slate-950">
              {title}
            </h1>
            {subtitle ? (
              <p className="mt-1 text-xs leading-5 text-slate-500">{subtitle}</p>
            ) : null}
          </div>
          {actionSlot}
        </div>
        {topBar}
      </section>
      <section>{children}</section>
    </main>
  );
}
