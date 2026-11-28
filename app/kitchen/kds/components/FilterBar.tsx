"use client"

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import { motion } from "motion/react"
import { SPRING_SNAPPY } from "@/lib/motion"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"

export type FilterId = "all" | "pending" | "cooking" | "ready"

interface FilterBarProps {
  active: FilterId
  counts: Record<FilterId, number>
  search: string
  onFilter: (id: FilterId) => void
  onSearch: (q: string) => void
}

export function FilterBar({ active, counts, search, onFilter, onSearch }: FilterBarProps) {
  const FILTERS: { id: FilterId; label: string }[] = [
    { id: "all", label: "All" },
    { id: "pending", label: "Pending" },
    { id: "cooking", label: "Cooking" },
    { id: "ready", label: "Ready" },
  ]

  return (
    <div className="px-5 py-3 border-b bg-card/80 backdrop-blur-sm shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <InputGroup className="flex-1 max-w-sm bg-background">
        <InputGroupAddon>
          <MagnifyingGlassIcon />
        </InputGroupAddon>
        <InputGroupInput
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search table, waiter, or dish..."
        />
      </InputGroup>

      <Tabs value={active} onValueChange={(v) => onFilter(v as FilterId)}>
        <TabsList>
          {FILTERS.map((f) => {
            const isActive = active === f.id
            return (
              <TabsTrigger
                key={f.id}
                value={f.id}
                className="relative gap-1.5 px-3 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                {isActive && (
                  <motion.span
                    layoutId="kds-filter-pill"
                    transition={SPRING_SNAPPY}
                    aria-hidden="true"
                    className="absolute inset-0 rounded-md bg-background shadow-sm"
                  />
                )}
                <span className="relative z-10">{f.label}</span>
                <Badge variant="secondary" className="relative z-10 h-5 min-w-5 px-1.5 text-[10px]">
                  {counts[f.id]}
                </Badge>
              </TabsTrigger>
            )
          })}
        </TabsList>
      </Tabs>
    </div>
  )
}
