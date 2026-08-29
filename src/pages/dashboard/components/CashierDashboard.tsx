import { Link } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ROUTES } from "@/constants/routes"
import {
  ShoppingCart,
  Receipt,
  CreditCard,
  QrCode,
  CheckCircle2,
  ArrowRight,
  Clock,
  Sparkles,
} from "lucide-react"

export function CashierDashboard() {
  return (
    <div className="space-y-6">
      {/* Header Banner with BIG PROMINENT POS LAUNCHER BUTTON */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-emerald-500/10 via-primary/10 to-indigo-500/10 p-6 rounded-2xl border border-primary/20 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge className="text-xs font-bold bg-emerald-600 text-white border-0">
              Shift Active
            </Badge>
            <Badge variant="outline" className="text-xs font-semibold">
              Kasir / Counter POS
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Sesi Kasir Outlet Utama - Nusa Dua
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Siap melakukan transaksi checkout kasir, penerimaan pembayaran QRIS/Tunai, dan cetak struk.
          </p>
        </div>
        <div className="shrink-0">
          <Button
            render={<Link to={ROUTES.POS} />}
            size="lg"
            className="h-12 px-6 rounded-xl font-extrabold text-sm gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 cursor-pointer"
          >
            <ShoppingCart className="size-5" /> Buka Mesin Kasir (POS) <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>

      {/* Cashier Shift KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Shift Register Total */}
        <Card className="rounded-2xl border-border shadow-2xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Total Penjualan Shift
            </CardTitle>
            <div className="size-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <Receipt className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-foreground">Rp 3.450.000</div>
            <p className="text-xs font-medium text-muted-foreground mt-1">
              42 Transaksi hari ini
            </p>
          </CardContent>
        </Card>

        {/* Cash Payments */}
        <Card className="rounded-2xl border-border shadow-2xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Pembayaran Tunai
            </CardTitle>
            <div className="size-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <CreditCard className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-foreground">Rp 1.950.000</div>
            <p className="text-xs font-medium text-muted-foreground mt-1">
              26 Transaksi Tunai
            </p>
          </CardContent>
        </Card>

        {/* QRIS / Non-Tunai */}
        <Card className="rounded-2xl border-border shadow-2xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              QRIS / E-Wallet / Card
            </CardTitle>
            <div className="size-8 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
              <QrCode className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-foreground">Rp 1.500.000</div>
            <p className="text-xs font-medium text-muted-foreground mt-1">
              16 Transaksi Non-Tunai
            </p>
          </CardContent>
        </Card>

        {/* Rata-rata Kecepatan Kasir */}
        <Card className="rounded-2xl border-border shadow-2xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Kecepatan Transaksi
            </CardTitle>
            <div className="size-8 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <Clock className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-foreground">&lt; 45 Detik</div>
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
              <CheckCircle2 className="size-3.5" /> Sangat Cepat
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Section: Recent Cashier Transactions & Top Fast Items */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions (2 cols) */}
        <Card className="lg:col-span-2 rounded-2xl border-border shadow-2xs">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-foreground">
                  Riwayat Transaksi Terakhir di Kasir Ini
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground mt-0.5">
                  Daftar transaksi checkout yang baru saja diproses oleh Anda.
                </CardDescription>
              </div>
              <Button render={<Link to={ROUTES.POS} />} variant="outline" size="sm" className="text-xs font-semibold">
                + Transaksi Baru
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl border overflow-hidden text-xs">
              <div className="bg-muted/40 px-4 py-2.5 font-bold text-muted-foreground grid grid-cols-12 border-b">
                <span className="col-span-3">No. Struk</span>
                <span className="col-span-4">Metode Bayar</span>
                <span className="col-span-3 text-right">Total Bayar</span>
                <span className="col-span-2 text-right">Status</span>
              </div>
              <div className="divide-y divide-border bg-card font-medium">
                <div className="px-4 py-3 grid grid-cols-12 items-center">
                  <span className="col-span-3 font-bold text-foreground">#POS-8821</span>
                  <span className="col-span-4 text-muted-foreground flex items-center gap-1.5">
                    <QrCode className="size-3.5 text-indigo-500" /> QRIS ShopeePay
                  </span>
                  <span className="col-span-3 text-right font-bold text-foreground">Rp 145.000</span>
                  <span className="col-span-2 text-right">
                    <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-400">Lunas</Badge>
                  </span>
                </div>
                <div className="px-4 py-3 grid grid-cols-12 items-center">
                  <span className="col-span-3 font-bold text-foreground">#POS-8820</span>
                  <span className="col-span-4 text-muted-foreground flex items-center gap-1.5">
                    <CreditCard className="size-3.5 text-emerald-500" /> Tunai (Cash)
                  </span>
                  <span className="col-span-3 text-right font-bold text-foreground">Rp 50.000</span>
                  <span className="col-span-2 text-right">
                    <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-400">Lunas</Badge>
                  </span>
                </div>
                <div className="px-4 py-3 grid grid-cols-12 items-center">
                  <span className="col-span-3 font-bold text-foreground">#POS-8819</span>
                  <span className="col-span-4 text-muted-foreground flex items-center gap-1.5">
                    <QrCode className="size-3.5 text-indigo-500" /> QRIS BCA
                  </span>
                  <span className="col-span-3 text-right font-bold text-foreground">Rp 220.000</span>
                  <span className="col-span-2 text-right">
                    <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-400">Lunas</Badge>
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Fast Sellers at Checkout (1 col) */}
        <div className="space-y-6">
          <Card className="rounded-2xl border-border shadow-2xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Sparkles className="size-4 text-amber-500" /> Produk Terlaris Shift Ini
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b">
                <div>
                  <div className="font-bold text-foreground">Kopi Bali Arabica 250g</div>
                  <div className="text-[10px] text-muted-foreground">Rp 45.000</div>
                </div>
                <Badge variant="secondary" className="font-bold">14 Terjual</Badge>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b">
                <div>
                  <div className="font-bold text-foreground">Kaos Batik Souvenir L</div>
                  <div className="text-[10px] text-muted-foreground">Rp 75.000</div>
                </div>
                <Badge variant="secondary" className="font-bold">9 Terjual</Badge>
              </div>

              <div className="flex items-center justify-between py-1.5">
                <div>
                  <div className="font-bold text-foreground">Gantungan Kunci Kayu</div>
                  <div className="text-[10px] text-muted-foreground">Rp 15.000</div>
                </div>
                <Badge variant="secondary" className="font-bold">8 Terjual</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
