"use client"
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export type FilterId = 'all' | 'pending' | 'cooking' | 'ready'

interface FilterBarProps {
  active: FilterId;
  counts: Record<FilterId, number>;
  search: string;
  onFilter: (id: any) => void;
  onSearch: (q: string) => void;
}

export function FilterBar({ active, counts, search, onFilter, onSearch }: FilterBarProps) {
  const FILTERS: { id: FilterId; label: string }[] = [
    { id: 'all',     label: 'All' },
    { id: 'pending', label: 'Pending' },
    { id: 'cooking', label: 'Cooking' },
    { id: 'ready',   label: 'Ready' },
  ]

  return (
    <div 
      className="px-5 py-3 border-b shrink-0 flex items-center justify-between gap-4" 
      style={{ background: "rgba(255,255,255,0.6)", backdropFilter: "blur(12px)", borderColor: "oklch(0.45 0.12 285 / 0.1)" }}
    >
      <div className="flex-1 max-w-sm relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "#736C83" }} />
        <input 
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search table, waiter, or dish..."
          className="w-full h-10 pl-10 pr-4 rounded-xl text-[12px] font-medium  placeholder:text-[var(--icon-primary)] transition-all bg-white/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[oklch(0.45_0.12_285_/_0.2)] border border-transparent focus:border-[oklch(0.45_0.12_285_/_0.15)]"
        />
      </div>

      <Tabs value={active} onValueChange={onFilter}>
        <TabsList className="h-auto p-1 gap-1" style={{ background: "rgba(255,255,255,0.7)", border: "1px solid oklch(0.45 0.12 285 / 0.15)", borderRadius: "14px" }}>
          {FILTERS.map(f => (
            <TabsTrigger 
              key={f.id} 
              value={f.id} 
              className="flex items-center gap-2 h-9 px-4 text-[11px] font-bold uppercase  rounded-xl transition-all"
              style={active === f.id ? { background: "oklch(0.42 0.14 285)", color: "white", boxShadow: "0 2px 8px oklch(0.45 0.12 285 / 0.25)" } : { color: "#736C83" }}
            >
              {f.label}
              <span className="min-w-[20px] h-[20px] rounded-full flex items-center justify-center text-[10px] font-bold px-1.5" style={active === f.id ? { background: "rgba(255,255,255,0.22)" } : { background: "oklch(0.45 0.12 285 / 0.08)" }}>
                {counts[f.id]}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  )
}
