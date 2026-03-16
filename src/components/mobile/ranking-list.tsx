import type { CategoryItem, RankingItem } from "@/types/schoolFinance";

interface RankingListProps {
  items: Array<RankingItem | CategoryItem>;
  showUnit?: boolean;
}

export function RankingList({ items, showUnit = false }: RankingListProps) {
  const max = Math.max(...items.map((item) => item.value), 1);

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const ratio = Math.round((item.value / max) * 100);
        const unit = showUnit && "unit" in item ? item.unit : "%";
        const color = "color" in item ? item.color : "#2F6BFF";

        return (
          <div key={item.name} className="space-y-1.5">
            <div className="flex items-center justify-between gap-3 text-xs">
              <span className="truncate font-medium text-slate-800">{item.name}</span>
              <span className="shrink-0 text-slate-500">
                {item.value}
                {unit}
              </span>
            </div>
            <div className="h-2 rounded-full bg-slate-100">
              <div
                className="h-full rounded-full"
                style={{ width: `${ratio}%`, background: color }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
