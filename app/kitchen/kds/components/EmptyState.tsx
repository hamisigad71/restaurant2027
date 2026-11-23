"use client"


interface EmptyStateProps {
  filter: string;
  search: string;
}

export function EmptyState({ filter, search }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div 
        className="w-20 h-20 rounded-[2.5rem] flex items-center justify-center border"
        style={{ background: "rgba(255,255,255,0.8)", borderColor: "rgba(11, 59, 54,  0.15)", boxShadow: "0 8px 32px rgba(13,3,27,0.06)" }}
      >
        <div
          className="h-8 w-8"
          style={{
            backgroundColor: "var(--icon-primary)",
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
      </div>
      <div className="text-center">
        <p className="font-bold text-xl" style={{ color: "#082420" }}>All caught up!</p>
        <p className="text-sm mt-1.5 font-medium" style={{ color: "#4B6E67" }}>
          {search ? `No results for "${search}"` : `No ${filter === "all" ? "active" : filter} orders right now.`}
        </p>
      </div>
    </div>
  )
}
