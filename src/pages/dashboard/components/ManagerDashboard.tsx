import { Link } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ROUTES } from "@/constants/routes"
import {
  Package,
  Boxes,
  Tag,
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  TrendingUp,
} from "lucide-react"

export function ManagerDashboard() {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card p-6 rounded-2xl border border-border shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge className="text-xs font-bold bg-indigo-600 text-white border-0">
              Operations View
            </Badge>
            <Badge variant="outline" className="text-xs font-semibold">
              Manager Dashboard
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Operasional Toko, Katalog & Inventaris Stok
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Kelola produk, varian, dan inventaris stok outlet Nusa Dua agar operasional kasir tetap lancar.
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <Button render={<Link to={ROUTES.STOCK} />} size="sm" className="gap-1.5 font-bold shadow-xs">
            <Boxes className="size-4" /> Kelola Stok Outlet
          </Button>
          <Button render={<Link to={ROUTES.PRODUCTS} />} variant="outline" size="sm" className="gap-1.5 font-semibold">
            <Package className="size-4" /> Tambah Produk
          </Button>
        </div>
      </div>

      {/* Manager KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Produk */}
        <Card className="rounded-2xl border-border shadow-2xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Total Produk Katalog
            </CardTitle>
            <div className="size-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Package className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-foreground">48 SKU</div>
            <p className="text-xs font-medium text-muted-foreground mt-1">
              Aktif dijual di POS
            </p>
          </CardContent>
        </Card>

        {/* Peringatan Stok Menipis */}
        <Card className="rounded-2xl border-border shadow-2xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Stok Perlu Restock
            </CardTitle>
            <div className="size-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">3 Produk</div>
            <p className="text-xs font-medium text-muted-foreground mt-1">
              Di bawah minimum threshold (5 Pcs)
            </p>
          </CardContent>
        </Card>

        {/* Total Kategori */}
        <Card className="rounded-2xl border-border shadow-2xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Kategori Produk
            </CardTitle>
            <div className="size-8 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
              <Tag className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-foreground">8 Kategori</div>
            <p className="text-xs font-medium text-muted-foreground mt-1">
              Retail, Souvenir, Fashion, Food
            </p>
          </CardContent>
        </Card>

        {/* Omzet Shift Kasir */}
        <Card className="rounded-2xl border-border shadow-2xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Omzet Hari Ini
            </CardTitle>
            <div className="size-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-foreground">Rp 8.450.000</div>
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
              <CheckCircle2 className="size-3.5" /> Shift 1 Kasir Berjalan
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Section: Low Stock Restock Action Table & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Restock Table (2 cols) */}
        <Card className="lg:col-span-2 rounded-2xl border-border shadow-2xs">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-foreground">
                  Daftar Produk Perlu Restock Segera
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground mt-0.5">
                  Produk dengan stok fisik mendekati habis di outlet Nusa Dua.
                </CardDescription>
              </div>
              <Button render={<Link to={ROUTES.STOCK} />} variant="outline" size="sm" className="text-xs font-semibold">
                Buka Manajemen Stok
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl border overflow-hidden text-xs">
              <div className="bg-muted/40 px-4 py-2.5 font-bold text-muted-foreground grid grid-cols-12 border-b">
                <span className="col-span-5">Nama Produk / SKU</span>
                <span className="col-span-3">Kategori</span>
                <span className="col-span-2 text-center">Stok Saat Ini</span>
                <span className="col-span-2 text-right">Status</span>
              </div>
              <div className="divide-y divide-border bg-card font-medium">
                <div className="px-4 py-3 grid grid-cols-12 items-center">
                  <span className="col-span-5 font-bold text-foreground">Kaos Batik Souvenir L</span>
                  <span className="col-span-3 text-muted-foreground">Fashion Souvenir</span>
                  <span className="col-span-2 text-center font-bold text-rose-600">2 Pcs</span>
                  <span className="col-span-2 text-right">
                    <Badge variant="destructive" className="text-[10px]">Kritis</Badge>
                  </span>
                </div>
                <div className="px-4 py-3 grid grid-cols-12 items-center">
                  <span className="col-span-5 font-bold text-foreground">Kopi Bali Arabica 250g</span>
                  <span className="col-span-3 text-muted-foreground">Food & Beverage</span>
                  <span className="col-span-2 text-center font-bold text-amber-600">4 Pcs</span>
                  <span className="col-span-2 text-right">
                    <Badge variant="outline" className="text-[10px] text-amber-600 border-amber-400">Menipis</Badge>
                  </span>
                </div>
                <div className="px-4 py-3 grid grid-cols-12 items-center">
                  <span className="col-span-5 font-bold text-foreground">Topi Anyaman Bali</span>
                  <span className="col-span-3 text-muted-foreground">Aksesoris</span>
                  <span className="col-span-2 text-center font-bold text-rose-600">1 Pcs</span>
                  <span className="col-span-2 text-right">
                    <Badge variant="destructive" className="text-[10px]">Kritis</Badge>
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Manager Quick Navigation Links (1 col) */}
        <div className="space-y-6">
          <Card className="rounded-2xl border-border shadow-2xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Boxes className="size-4 text-indigo-500" /> Navigasi Operasional Manager
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button render={<Link to={ROUTES.PRODUCTS} />} variant="outline" className="w-full justify-start text-xs font-semibold gap-2">
                <Package className="size-4 text-primary" /> Kelola Katalog & Harga Produk
              </Button>
              <Button render={<Link to={ROUTES.CATEGORIES} />} variant="outline" className="w-full justify-start text-xs font-semibold gap-2">
                <Tag className="size-4 text-indigo-500" /> Atur Kategori & Varian
              </Button>
              <Button render={<Link to={ROUTES.STOCK} />} variant="outline" className="w-full justify-start text-xs font-semibold gap-2">
                <Boxes className="size-4 text-amber-500" /> Update Jumlah Stok Fisik
              </Button>
              <Button render={<Link to={ROUTES.REPORTS} />} variant="outline" className="w-full justify-start text-xs font-semibold gap-2">
                <BarChart3 className="size-4 text-emerald-500" /> Cek Laporan Penjualan
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
