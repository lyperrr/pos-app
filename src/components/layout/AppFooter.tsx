import { Wifi } from "lucide-react"

export function AppFooter() {
  return (
    <footer className="mt-auto border-t bg-background/50 px-4 py-3 text-xs text-muted-foreground transition-all">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
        {/* Connection & System Status */}
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-medium text-foreground/80 flex items-center gap-1">
            <Wifi className="size-3 text-emerald-500" />
            Sistem Online
          </span>
          <span className="text-muted-foreground/40">•</span>
          <span>SaaS Multi-Tenant</span>
        </div>

        {/* Branding & Version */}
        <div className="flex items-center gap-3">
          <span>© {new Date().getFullYear()} NIRA POS — Niaga Indonesia Retail Assistant</span>
          <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted-foreground">
            v1.0.0 (MVP)
          </span>
        </div>
      </div>
    </footer>
  )
}
