interface SectionHeaderProps {
  title: string;
  caption?: string;
}

export function SectionHeader({ title, caption }: SectionHeaderProps) {
  return (
    <div className="mb-3 flex items-end justify-between gap-3">
      <h2 className="text-lg font-semibold tracking-tight text-slate-900">{title}</h2>
      {caption ? <span className="text-xs text-slate-500">{caption}</span> : null}
    </div>
  );
}
