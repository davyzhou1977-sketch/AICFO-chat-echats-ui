import type { PropsWithChildren } from "react";
import { Badge } from "@/components/ui/badge";

interface MobileShellProps extends PropsWithChildren {
  title: string;
  subtitle: string;
  periodLabel: string;
  tags: string[];
}

export function MobileShell({
  title,
  subtitle,
  periodLabel,
  tags,
  children,
}: MobileShellProps) {
  return (
    <main className="mx-auto min-h-screen max-w-[430px] bg-transparent">
      <section className="relative overflow-hidden rounded-b-[32px] bg-hero-mobile px-4 pb-6 pt-5 text-white shadow-soft">
        <div className="mb-4 flex items-center justify-between text-[11px] opacity-90">
          <span>9:41</span>
          <span>{title}</span>
          <span>100%</span>
        </div>
        <div className="space-y-2">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-blue-100/90">
            Mobile H5 Dashboard
          </p>
          <h1 className="text-[28px] font-semibold leading-tight">{title}</h1>
          <p className="max-w-[320px] text-sm leading-6 text-blue-50/95">{subtitle}</p>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge className="border-white/15 bg-white/12 text-white hover:bg-white/12">
            {periodLabel}
          </Badge>
          {tags.map((tag) => (
            <Badge
              key={tag}
              className="border-white/10 bg-white/10 text-white/95 hover:bg-white/10"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </section>
      <section className="px-4 pb-10 pt-4">{children}</section>
    </main>
  );
}
