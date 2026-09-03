import * as React from "react"
import { useNavigate, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { useAuth, type DevRole } from "@/context/AuthContext"
import { ROUTES } from "@/constants/routes"
import { showToast } from "@/components/ui/toast"
import {
  Eye,
  EyeOff,
  ShieldCheck,
  UserCheck,
  ShoppingCart,
  TrendingUp,
  Clock,
  PieChart as PieIcon,
  CheckCircle2,
} from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = React.useState("owner@nirapos.id")
  const [password, setPassword] = React.useState("password")
  const [showPassword, setShowPassword] = React.useState(false)
  const [rememberMe, setRememberMe] = React.useState(true)
  const { login, loginAsMockRole, isLoading } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await login({ email, password })
      showToast.success("Berhasil masuk ke akun Anda!")
      navigate(ROUTES.DASHBOARD)
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message || "Gagal masuk. Silakan periksa email & password Anda."
      showToast.error(msg, "Gagal Masuk")
    }
  }

  const handleDevQuickLogin = (role: DevRole) => {
    loginAsMockRole(role)
    showToast.success(`Masuk dalam Mode Developer sebagai ${role}`)
    navigate(ROUTES.DASHBOARD)
  }

  return (
    <div className="min-h-screen w-full bg-[#f6f8fa] text-slate-900 font-sans antialiased p-3 sm:p-6 lg:p-8 flex flex-col justify-between">
      {/* MAIN CONTAINER CARD */}
      <div className="max-w-[1240px] w-full mx-auto my-auto bg-white rounded-[28px] sm:rounded-[36px] border border-slate-200/80 shadow-2xl shadow-slate-200/70 p-3 sm:p-4 lg:p-5 min-h-[640px] grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        
        {/* LEFT COLUMN: Login Form & Branding */}
        <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-between p-6 sm:p-10 lg:p-12">
          {/* Top Brand Header */}
          <div className="flex items-center gap-3">
            <img src="/logo_nira.png" alt="NIRA POS" className="h-9 w-auto object-contain" />
            <span className="font-extrabold text-xl tracking-tight text-slate-900">NIRA POS</span>
          </div>

          {/* Form Content */}
          <div className="my-auto py-6 space-y-6 max-w-sm w-full mx-auto">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Selamat Datang Kembali</h1>
              <p className="text-sm text-slate-500 font-medium">
                Masukkan email dan kata sandi Anda untuk mengakses akun.
              </p>
            </div>

            {/* Developer Mode Role Selector */}
            <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider px-1">
                <span>Mode Developer (Quick Role):</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => handleDevQuickLogin("Owner")}
                  className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl bg-white border border-slate-200 text-[11px] font-bold text-slate-700 shadow-2xs hover:border-primary hover:text-primary transition-all cursor-pointer"
                >
                  <ShieldCheck className="size-3 text-primary" /> Owner
                </button>
                <button
                  type="button"
                  onClick={() => handleDevQuickLogin("Manager")}
                  className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl bg-white border border-slate-200 text-[11px] font-bold text-slate-700 shadow-2xs hover:border-primary hover:text-primary transition-all cursor-pointer"
                >
                  <UserCheck className="size-3 text-indigo-600" /> Manager
                </button>
                <button
                  type="button"
                  onClick={() => handleDevQuickLogin("Cashier")}
                  className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl bg-white border border-slate-200 text-[11px] font-bold text-slate-700 shadow-2xs hover:border-primary hover:text-primary transition-all cursor-pointer"
                >
                  <ShoppingCart className="size-3 text-emerald-600" /> Cashier
                </button>
              </div>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Email Input */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-bold text-slate-700">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="owner@nirapos.id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 rounded-xl border-slate-200 px-4 text-sm font-medium focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary"
                  required
                />
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs font-bold text-slate-700">Kata Sandi</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 rounded-xl border-slate-200 px-4 pr-10 text-sm font-medium focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              {/* Checkbox & Forgot Password Row */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(Boolean(checked))}
                    className="rounded-md border-slate-300 data-checked:bg-primary data-checked:border-primary"
                  />
                  <label
                    htmlFor="remember"
                    className="text-xs font-semibold text-slate-600 cursor-pointer"
                  >
                    Ingat Saya
                  </label>
                </div>
                <Link
                  to={ROUTES.FORGOT_PASSWORD}
                  className="text-xs font-bold text-primary hover:underline cursor-pointer"
                >
                  Lupa Kata Sandi?
                </Link>
              </div>

              {/* Log In Button */}
              <Button
                type="submit"
                className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm rounded-xl shadow-lg shadow-primary/25 transition-all mt-2 cursor-pointer"
                disabled={isLoading}
              >
                {isLoading ? "Memproses..." : "Masuk"}
              </Button>
            </form>

            {/* Register Link */}
            <div className="text-center pt-2 text-xs font-medium text-slate-500">
              Belum Memiliki Akun?{" "}
              <Link to={ROUTES.REGISTER} className="text-primary font-bold hover:underline">
                Daftar sebagai Tenant.
              </Link>
            </div>
          </div>

          {/* Footer Line */}
          <div className="flex items-center justify-between text-xs text-slate-400 pt-4 border-t border-slate-100 font-medium">
            <span>Hak Cipta &copy; {new Date().getFullYear()} NIRA POS Enterprises Ltd.</span>
            <span className="hover:underline cursor-pointer">Kebijakan Privasi</span>
          </div>
        </div>

        {/* RIGHT COLUMN: Theme Primary Hero Showcase Card (Desktop Only) */}
        <div className="hidden lg:col-span-6 xl:col-span-7 lg:flex flex-col justify-between p-10 lg:p-12 bg-primary text-primary-foreground rounded-[24px] sm:rounded-[28px] relative overflow-hidden shadow-2xl">
          {/* Subtle Abstract Concentric Circle Background Pattern */}
          <div className="absolute -top-24 -right-24 size-96 rounded-full border-[40px] border-white/10 pointer-events-none" />
          <div className="absolute -bottom-32 -left-32 size-[500px] rounded-full border-[60px] border-white/10 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[650px] rounded-full border-[80px] border-white/5 pointer-events-none" />

          {/* Top Hero Text Header */}
          <div className="relative z-10 space-y-3 max-w-lg">
            <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Kelola tim & operasional toko tanpa hambatan.
            </h2>
            <p className="text-white/90 text-sm font-medium leading-relaxed">
              Masuk untuk mengakses dashboard POS, memantau tren penjualan real-time, dan mengelola operasional outlet Anda.
            </p>
          </div>

          {/* Center POS Dashboard UI Mockup Cards Showcase */}
          <div className="relative z-10 my-auto py-8">
            {/* Main Mockup Dashboard Frame */}
            <div className="bg-white rounded-2xl p-4 text-slate-900 shadow-2xl shadow-black/20 border border-white/20 relative">
              {/* Mockup Header Row */}
              <div className="grid grid-cols-3 gap-3 mb-3">
                {/* Stat Card 1: Total Sales */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold">
                    <span>Total Penjualan</span>
                    <span className="text-slate-400">...</span>
                  </div>
                  <div className="text-lg font-extrabold text-slate-900">Rp 189.374.000</div>
                  <div className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                    <TrendingUp className="size-2.5" /> +7.5% vs bulan lalu
                  </div>
                </div>

                {/* Stat Card 2: Checkout Speed */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold">
                    <span>Rata-rata Waktu Kasir</span>
                    <span className="text-slate-400">...</span>
                  </div>
                  <div className="text-lg font-extrabold text-slate-900">00:01:30</div>
                  <div className="inline-flex items-center gap-1 text-[9px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded-md">
                    <Clock className="size-2.5" /> Transaksi Cepat
                  </div>
                </div>

                {/* Stat Card 3: Sales Overview Sparkline */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold">
                    <span>Ringkasan Omzet</span>
                    <Badge variant="outline" className="text-[9px] py-0 px-1">Bulanan</Badge>
                  </div>
                  <div className="h-6 flex items-end gap-1 pt-1">
                    <div className="w-1.5 h-3 bg-primary/30 rounded-t-sm" />
                    <div className="w-1.5 h-4 bg-primary/50 rounded-t-sm" />
                    <div className="w-1.5 h-5 bg-primary/70 rounded-t-sm" />
                    <div className="w-1.5 h-3 bg-primary/30 rounded-t-sm" />
                    <div className="w-1.5 h-6 bg-primary rounded-t-sm" />
                  </div>
                </div>
              </div>

              {/* Mockup Transaction Table Preview */}
              <div className="rounded-xl border border-slate-100 overflow-hidden text-[10px]">
                <div className="bg-slate-50/80 px-3 py-2 font-bold text-slate-500 grid grid-cols-12 border-b border-slate-100">
                  <span className="col-span-3">ID Transaksi</span>
                  <span className="col-span-4">Nama Produk</span>
                  <span className="col-span-3">Tanggal</span>
                  <span className="col-span-2 text-right">Status</span>
                </div>
                <div className="divide-y divide-slate-100 bg-white">
                  <div className="px-3 py-2 grid grid-cols-12 items-center font-medium">
                    <span className="col-span-3 font-semibold text-slate-700">#SLR98912-01</span>
                    <span className="col-span-4 truncate text-slate-900 font-bold">Apple iPad Gem 10</span>
                    <span className="col-span-3 text-slate-400">13 Feb 2026</span>
                    <span className="col-span-2 text-right">
                      <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">
                        <CheckCircle2 className="size-2.5" /> Lunas
                      </span>
                    </span>
                  </div>
                  <div className="px-3 py-2 grid grid-cols-12 items-center font-medium">
                    <span className="col-span-3 font-semibold text-slate-700">#SLR98912-02</span>
                    <span className="col-span-4 truncate text-slate-900 font-bold">Apple iPhone 15</span>
                    <span className="col-span-3 text-slate-400">13 Feb 2026</span>
                    <span className="col-span-2 text-right">
                      <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">
                        <CheckCircle2 className="size-2.5" /> Lunas
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              {/* FLOATING OVERLAY CARD: Sales Categories Donut Gauge */}
              <div className="absolute -top-6 -right-6 bg-white rounded-2xl p-4 shadow-xl border border-slate-200/80 w-44 text-slate-900 space-y-2">
                <div className="flex items-center justify-between text-[10px] font-bold">
                  <span className="text-slate-800">Kategori Terlaris</span>
                  <Badge variant="outline" className="text-[8px] py-0 px-1">Bulanan</Badge>
                </div>
                <div className="flex flex-col items-center justify-center py-1">
                  <div className="relative flex items-center justify-center">
                    <PieIcon className="size-10 text-primary" />
                  </div>
                  <div className="text-xs font-extrabold text-slate-900 mt-1">6,248 Unit</div>
                  <span className="text-[9px] text-slate-400 font-medium">Volume Penjualan</span>
                </div>
                <div className="space-y-1 text-[9px] font-medium border-t border-slate-100 pt-1.5">
                  <div className="flex justify-between text-slate-600">
                    <span className="flex items-center gap-1"><span className="size-1.5 rounded-full bg-primary inline-block" /> Smartphone</span>
                    <span className="font-bold">3,619</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span className="flex items-center gap-1"><span className="size-1.5 rounded-full bg-indigo-400 inline-block" /> Laptop</span>
                    <span className="font-bold">710</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Live System Indicator */}
          <div className="relative z-10 flex items-center justify-between text-xs text-white/80 font-medium">
            <span>Sistem Manajemen Kasir & Inventaris Real-Time</span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full text-white text-[11px] font-semibold">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" /> Status Online Active
            </span>
          </div>
        </div>

      </div>
    </div>
  )
}
