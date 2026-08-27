import { Bell, Store, Search } from "lucide-react"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"

interface AppHeaderProps {
  currentTitle?: string
}

export function AppHeader({ currentTitle = "Dashboard Laporan" }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 transition-all ease-linear">
      {/* Left section: Sidebar trigger & Breadcrumb */}
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="#">NIRA POS</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-semibold text-foreground">
                {currentTitle}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Right section: Active Outlet, Alerts & Quick Search */}
      <div className="flex items-center gap-3">
        {/* Active Outlet Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold shadow-xs">
          <Store className="size-3.5" />
          <span>Outlet Utama - Nusa Dua</span>
        </div>

        {/* Low Stock Alert Badge / Button */}
        <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-lg" aria-label="Notifikasi">
          <Bell className="size-4 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive"></span>
          </span>
        </Button>

        {/* Quick Search Shortcut Placeholder */}
        <Button variant="outline" size="sm" className="hidden lg:flex items-center gap-2 text-muted-foreground h-9 px-3">
          <Search className="size-3.5" />
          <span className="text-xs">Cari transaksi / produk...</span>
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      </div>
    </header>
  )
}
