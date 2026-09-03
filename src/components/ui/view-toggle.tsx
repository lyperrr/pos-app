
import { LayoutGrid, List } from "lucide-react"
import { cn } from "@/lib/utils"

export type ViewMode = "grid" | "list"

interface ViewToggleProps {
  view: ViewMode
  onViewChange: (view: ViewMode) => void
  className?: string
}

export function ViewToggle({ view, onViewChange, className }: ViewToggleProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200/80 shrink-0",
        className
      )}
      role="group"
      aria-label="Mode Tampilan"
    >
      <button
        type="button"
        onClick={() => onViewChange("grid")}
        className={cn(
          "flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
          view === "grid"
            ? "bg-white text-primary shadow-xs font-extrabold"
            : "text-slate-500 hover:text-slate-900"
        )}
        title="Tampilan Grid Kartu Visual"
      >
        <LayoutGrid className="size-3.5" />
        {/* <span className="hidden sm:inline">Grid</span> */}
      </button>

      <button
        type="button"
        onClick={() => onViewChange("list")}
        className={cn(
          "flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
          view === "list"
            ? "bg-white text-primary shadow-xs font-extrabold"
            : "text-slate-500 hover:text-slate-900"
        )}
        title="Tampilan Tabel Data"
      >
        <List className="size-3.5" />
        {/* <span className="hidden sm:inline">Tabel</span> */}
      </button>
    </div>
  )
}

export default ViewToggle
