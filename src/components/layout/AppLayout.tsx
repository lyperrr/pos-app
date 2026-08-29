import * as React from "react"
import { Outlet, useLocation } from "react-router-dom"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/AppSidebar"
import { AppHeader } from "@/components/layout/AppHeader"
import { AppFooter } from "@/components/layout/AppFooter"
import { ROUTES } from "@/constants/routes"

interface AppLayoutProps {
  children?: React.ReactNode
  currentTitle?: string
}

const ROUTE_TITLES: Record<string, string> = {
  [ROUTES.DASHBOARD]: "Dashboard Laporan",
  [ROUTES.POS]: "Kasir (POS)",
  [ROUTES.PRODUCTS]: "Daftar Produk & Katalog",
  [ROUTES.CATEGORIES]: "Kategori & Varian Produk",
  [ROUTES.STOCK]: "Manajemen Stok Outlet",
  [ROUTES.TRANSACTIONS]: "Riwayat Transaksi",
  [ROUTES.REPORTS]: "Laporan Penjualan",
  [ROUTES.USERS]: "Manajemen User Staf",
  [ROUTES.ROLES]: "Role & Hak Akses (RBAC)",
  [ROUTES.SETTINGS]: "Pengaturan Outlet",
}

export function AppLayout({ children, currentTitle }: AppLayoutProps) {
  const location = useLocation()

  const resolvedTitle =
    currentTitle ?? ROUTE_TITLES[location.pathname] ?? "NIRA POS App"

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex flex-col min-h-screen">
        <AppHeader currentTitle={resolvedTitle} />
        <main className="flex-1 p-4 md:p-6 overflow-y-auto bg-background">
          {children ?? <Outlet />}
        </main>
        <AppFooter />
      </SidebarInset>
    </SidebarProvider>
  )
}
