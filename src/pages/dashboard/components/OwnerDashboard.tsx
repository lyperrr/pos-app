import { Link } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ROUTES } from "@/constants/routes"
import {
  TrendingUp,
  Store,
  DollarSign,
  Users,
  ShieldCheck,
  Package,
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  Settings,
  Receipt,
} from "lucide-react"

export function OwnerDashboard() {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card p-6 rounded-2xl border border-border shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge className="text-xs font-bold bg-primary text-primary-foreground border-0">
              Executive View
            </Badge>
            <Badge variant="outline" className="text-xs font-semibold">
              Owner Dashboard
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Ringkasan Eksekutif Bisnis & Outlet
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Pantau total omzet harian, performa cabang outlet, dan kesehatan keuangan bisnis NIRA POS Anda.
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <Button render={<Link to={ROUTES.REPORTS} />} size="sm" className="gap-1.5 font-bold shadow-xs">
            <BarChart3 className="size-4" /> Laporan Lengkap
          </Button>
          <Button render={<Link to={ROUTES.SETTINGS} />} variant="outline" size="sm" className="gap-1.5 font-semibold">
            <Settings className="size-4" /> Pengaturan
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Omzet */}
        <Card className="rounded-2xl border-border shadow-2xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Total Omzet Hari Ini
            </CardTitle>
            <div className="size-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <DollarSign className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-foreground">Rp 12.850.000</div>
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
              <TrendingUp className="size-3.5" /> +14.2% dibanding kemarin
            </p>
          </CardContent>
        </Card>

        {/* Total Transaksi */}
        <Card className="rounded-2xl border-border shadow-2xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Total Transaksi
            </CardTitle>
            <div className="size-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Receipt className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-foreground">184 Struk</div>
            <p className="text-xs font-medium text-muted-foreground mt-1">
              Rata-rata: Rp 69.800 / transaksi
            </p>
          </CardContent>
        </Card>

        {/* Total Cabang Outlet */}
        <Card className="rounded-2xl border-border shadow-2xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Cabang Outlet Aktif
            </CardTitle>
            <div className="size-8 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <Store className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-foreground">2 Cabang</div>
            <p className="text-xs font-medium text-muted-foreground mt-1">
              Nusa Dua (Utama) & Jimbaran
            </p>
          </CardContent>
        </Card>

        {/* Total Staf & Kasir */}
        <Card className="rounded-2xl border-border shadow-2xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Total Tim & Staf
            </CardTitle>
            <div className="size-8 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
              <Users className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-foreground">6 Personel</div>
            <p className="text-xs font-medium text-muted-foreground mt-1">
              1 Owner, 2 Manager, 3 Kasir
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Section: Outlet Performance & Low Stock Warning */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Outlet Performance List (2 cols) */}
        <Card className="lg:col-span-2 rounded-2xl border-border shadow-2xs">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-foreground">
                  Performa Penjualan Per Cabang Outlet
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground mt-0.5">
                  Kontribusi omzet dari setiap cabang hari ini.
                </CardDescription>
              </div>
              <Button render={<Link to={ROUTES.SETTINGS} />} variant="ghost" size="sm" className="text-xs gap-1">
                Kelola Outlet <ArrowUpRight className="size-3.5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Outlet 1 */}
            <div className="p-4 rounded-xl border bg-muted/20 space-y-2">
              <div className="flex items-center justify-between text-sm font-bold">
                <span className="flex items-center gap-2">
                  <Store className="size-4 text-primary" /> Outlet Utama - Nusa Dua
                </span>
                <span className="text-foreground">Rp 8.450.000 (65.7%)</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: "65.7%" }} />
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                <span>124 Transaksi Selesai</span>
                <span>Kasir Aktif: Sindy M.</span>
              </div>
            </div>

            {/* Outlet 2 */}
            <div className="p-4 rounded-xl border bg-muted/20 space-y-2">
              <div className="flex items-center justify-between text-sm font-bold">
                <span className="flex items-center gap-2">
                  <Store className="size-4 text-indigo-500" /> Outlet Jimbaran
                </span>
                <span className="text-foreground">Rp 4.400.000 (34.3%)</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-indigo-500 h-2 rounded-full" style={{ width: "34.3%" }} />
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                <span>60 Transaksi Selesai</span>
                <span>Kasir Aktif: Budi S.</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Executive Quick Actions & Alert Panel (1 col) */}
        <div className="space-y-6">
          {/* Quick Access Card */}
          <Card className="rounded-2xl border-border shadow-2xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <ShieldCheck className="size-4 text-primary" /> Menu Pintar Owner
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button render={<Link to={ROUTES.ROLES} />} variant="outline" className="w-full justify-start text-xs font-semibold gap-2">
                <ShieldCheck className="size-4 text-primary" /> Kelola Hak Akses Staf (RBAC)
              </Button>
              <Button render={<Link to={ROUTES.USERS} />} variant="outline" className="w-full justify-start text-xs font-semibold gap-2">
                <Users className="size-4 text-indigo-500" /> Manajemen Akun Pengguna
              </Button>
              <Button render={<Link to={ROUTES.STOCK} />} variant="outline" className="w-full justify-start text-xs font-semibold gap-2">
                <Package className="size-4 text-emerald-500" /> Cek Stok Seluruh Outlet
              </Button>
            </CardContent>
          </Card>

          {/* Low Stock Alert */}
          <Card className="rounded-2xl border-amber-500/30 bg-amber-500/5 shadow-2xs">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
                <AlertTriangle className="size-4" /> Peringatan Stok Menipis (3 Produk)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-amber-500/20">
                <span className="font-semibold text-foreground">Kaos Batik Souvenir L</span>
                <Badge variant="outline" className="text-[10px] text-amber-600 border-amber-400">Sisa 2 Pcs</Badge>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-amber-500/20">
                <span className="font-semibold text-foreground">Kopi Bali Arabica 250g</span>
                <Badge variant="outline" className="text-[10px] text-amber-600 border-amber-400">Sisa 4 Pcs</Badge>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="font-semibold text-foreground">Topi Anyaman Bali</span>
                <Badge variant="outline" className="text-[10px] text-amber-600 border-amber-400">Sisa 1 Pcs</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
