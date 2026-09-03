import * as React from "react"
import { useNavigate, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ROUTES } from "@/constants/routes"
import { ArrowRight, CheckCircle2, Eye, EyeOff } from "lucide-react"

import { useAuth } from "@/context/AuthContext"
import { showToast } from "@/components/ui/toast"

export default function RegisterPage() {
  const navigate = useNavigate()
  const { registerOwner } = useAuth()
  const [businessName, setBusinessName] = React.useState("")
  const [fullName, setFullName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [showPassword, setShowPassword] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      showToast.error("Konfirmasi kata sandi tidak cocok. Silakan periksa kembali.", "Kata Sandi Tidak Cocok")
      return
    }

    try {
      await registerOwner({
        business_name: businessName,
        business_type: "retail",
        full_name: fullName,
        email,
        password,
        outlet_name: `Outlet ${businessName}`,
      })
      showToast.success("Pendaftaran tenant berhasil! Selamat datang di NIRA POS.", "Registrasi Berhasil")
      navigate(ROUTES.DASHBOARD)
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message || "Gagal mendaftar tenant."
      showToast.error(msg, "Gagal Registrasi")
      navigate(ROUTES.DASHBOARD)
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#f6f8fa] text-slate-900 font-sans antialiased p-3 sm:p-6 lg:p-8 flex flex-col justify-between">
      {/* MAIN CONTAINER CARD */}
      <div className="max-w-[1240px] w-full mx-auto my-auto bg-white rounded-[28px] sm:rounded-[36px] border border-slate-200/80 shadow-2xl shadow-slate-200/70 p-3 sm:p-4 lg:p-5 min-h-[640px] grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        
        {/* LEFT COLUMN: Register Form & Branding */}
        <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-between p-6 sm:p-10 lg:p-12">
          {/* Top Brand Header */}
          <div className="flex items-center gap-3">
            <img src="/logo_nira.png" alt="NIRA POS" className="h-9 w-auto object-contain" />
            <span className="font-extrabold text-xl tracking-tight text-slate-900">NIRA POS</span>
          </div>

          {/* Form Content */}
          <div className="my-auto py-4 space-y-5 max-w-sm w-full mx-auto">
            <div className="text-center space-y-1.5">
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Daftar sebagai Tenant</h1>
              <p className="text-xs text-slate-500 font-medium">
                Buat akun tenant bisnis dan owner baru NIRA POS.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">

              {/* Business Name Field */}
              <div className="space-y-1">
                <Label htmlFor="businessName" className="text-xs font-bold text-slate-700">Nama Bisnis / Toko</Label>
                <Input
                  id="businessName"
                  placeholder="Nusa Retail & Souvenir"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="h-10 rounded-xl border-slate-200 px-4 text-sm font-medium focus-visible:ring-2 focus-visible:ring-primary"
                  required
                />
              </div>

              {/* Owner Full Name Field */}
              <div className="space-y-1">
                <Label htmlFor="fullName" className="text-xs font-bold text-slate-700">Nama Lengkap Owner</Label>
                <Input
                  id="fullName"
                  placeholder="Willy Permana"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="h-10 rounded-xl border-slate-200 px-4 text-sm font-medium focus-visible:ring-2 focus-visible:ring-primary"
                  required
                />
              </div>

              {/* Email Field */}
              <div className="space-y-1">
                <Label htmlFor="email" className="text-xs font-bold text-slate-700">Alamat Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="owner@nirapos.id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-10 rounded-xl border-slate-200 px-4 text-sm font-medium focus-visible:ring-2 focus-visible:ring-primary"
                  required
                />
              </div>

              {/* Password Field with Hide/Show Toggle */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs font-bold text-slate-700">Kata Sandi</Label>
                  <span className="text-[10px] text-slate-400 font-medium">Min. 8 karakter</span>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={8}
                    className="h-10 rounded-xl border-slate-200 px-4 pr-10 text-sm font-medium focus-visible:ring-2 focus-visible:ring-primary"
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

              {/* Confirm Password Field with Hide/Show Toggle */}
              <div className="space-y-1">
                <Label htmlFor="confirmPassword" className="text-xs font-bold text-slate-700">Konfirmasi Kata Sandi</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    minLength={8}
                    className="h-10 rounded-xl border-slate-200 px-4 pr-10 text-sm font-medium focus-visible:ring-2 focus-visible:ring-primary"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    title={showPassword ? "Sembunyikan Kata Sandi" : "Tampilkan Kata Sandi"}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm rounded-xl shadow-lg shadow-primary/25 transition-all mt-2 cursor-pointer gap-2"
              >
                Daftarkan Tenant <ArrowRight className="size-4" />
              </Button>
            </form>

            <div className="text-center pt-1 text-xs font-medium text-slate-500">
              Sudah Memiliki Akun?{" "}
              <Link to={ROUTES.LOGIN} className="text-primary font-bold hover:underline">
                Masuk.
              </Link>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-100 font-medium">
            <span>Hak Cipta &copy; {new Date().getFullYear()} NIRA POS Enterprises Ltd.</span>
            <span className="hover:underline cursor-pointer">Kebijakan Privasi</span>
          </div>
        </div>

        {/* RIGHT COLUMN: Hero Showcase Card */}
        <div className="hidden lg:col-span-6 xl:col-span-7 lg:flex flex-col justify-between p-10 lg:p-12 bg-primary text-primary-foreground rounded-[24px] sm:rounded-[28px] relative overflow-hidden shadow-2xl">
          <div className="absolute -top-24 -right-24 size-96 rounded-full border-[40px] border-white/10 pointer-events-none" />
          <div className="absolute -bottom-32 -left-32 size-[500px] rounded-full border-[60px] border-white/10 pointer-events-none" />

          <div className="relative z-10 space-y-3 max-w-lg">
            <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Mulai masa uji coba gratis 14 hari Anda sekarang.
            </h2>
            <p className="text-white/90 text-sm font-medium leading-relaxed">
              Tanpa memerlukan kartu kredit. Atur katalog produk, akun staf kasir, dan stok toko Anda secara instan.
            </p>
          </div>

          <div className="relative z-10 my-auto py-8 space-y-4 max-w-md">
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
              <CheckCircle2 className="size-6 text-emerald-400 shrink-0" />
              <div>
                <h4 className="font-bold text-sm text-white">Akses Fitur Penuh</h4>
                <p className="text-xs text-white/80">Coba kasir POS, stok antar cabang outlet, dan hak akses staf dinamis.</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
              <CheckCircle2 className="size-6 text-emerald-400 shrink-0" />
              <div>
                <h4 className="font-bold text-sm text-white">Pendaftaran Instan</h4>
                <p className="text-xs text-white/80">Buat akun tenant bisnis dan mulai jualan dalam waktu kurang dari 2 menit.</p>
              </div>
            </div>
          </div>

          <div className="relative z-10 flex items-center justify-between text-xs text-white/80 font-medium">
            <span>Platform SaaS Multi-Tenant NIRA POS</span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full text-white text-[11px] font-semibold">
              Free Trial 14 Hari
            </span>
          </div>
        </div>

      </div>
    </div>
  )
}
