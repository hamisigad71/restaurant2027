"use client"

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

interface EmptyStateProps {
  filter: string
  search: string
}

export function EmptyState({ filter, search }: EmptyStateProps) {
  return (
    <Empty className="py-20">
      <EmptyHeader>
        <EmptyMedia variant="icon" className="size-16 rounded-2xl bg-card border shadow-xs">
          <div
            className="size-8 bg-primary"
            style={{
              WebkitMaskImage: `url("/tray.png")`,
              WebkitMaskSize: "contain",
              WebkitMaskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
              maskImage: `url("/tray.png")`,
              maskSize: "contain",
              maskRepeat: "no-repeat",
              maskPosition: "center",
            }}
          />
        </EmptyMedia>
        <EmptyTitle>All caught up!</EmptyTitle>
        <EmptyDescription>
          {search
            ? `No results for "${search}"`
            : `No ${filter === "all" ? "active" : filter} orders right now.`}
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}
