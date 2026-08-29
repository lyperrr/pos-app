import * as React from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ROUTES } from "@/constants/routes"
import { authService } from "@/services/authService"
import { ArrowLeft, ArrowRight, CheckCircle2, ExternalLink, KeyRound, Loader2, Mail, Sparkles } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [errorMsg, setErrorMsg] = React.useState("")
  const [isSuccess, setIsSuccess] = React.useState(false)
  const [resetUrl, setResetUrl] = React.useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg("")
    setIsLoading(true)

    try {
      const response = await authService.forgotPassword(email)
      setIsSuccess(true)
      if (response.data?.reset_url) {
        setResetUrl(response.data.reset_url)
      }
    } catch (err: any) {
      if (err?.message) {
        setErrorMsg(err.message)
      } else {
        setErrorMsg("Gagal mengirim link reset kata sandi. Silakan periksa kembali email Anda.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#f6f8fa] text-slate-900 font-sans antialiased p-3 sm:p-6 lg:p-8 flex flex-col justify-between">
      {/* MAIN CONTAINER CARD */}
      <div className="max-w-[1240px] w-full mx-auto my-auto bg-white rounded-[28px] sm:rounded-[36px] border border-slate-200/80 shadow-2xl shadow-slate-200/70 p-3 sm:p-4 lg:p-5 min-h-[600px] grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        
        {/* LEFT COLUMN: Forgot Password Form & Branding */}
        <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-between p-6 sm:p-10 lg:p-12">
          {/* Top Brand Header */}
          <div className="flex items-center gap-3">
            <img src="/logo_nira.png" alt="NIRA POS" className="h-9 w-auto object-contain" />
            <span className="font-extrabold text-xl tracking-tight text-slate-900">NIRA POS</span>
          </div>

          {/* Form Content */}
          <div className="my-auto py-6 space-y-6 max-w-sm w-full mx-auto">
            {isSuccess ? (
              <div className="text-center space-y-4">
                <div className="size-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-xs">
                  <Mail className="size-8" />
                </div>
                <div className="space-y-2">
                  <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Cek Email Anda</h1>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    Link konfirmasi reset kata sandi telah diproses untuk akun <strong className="text-slate-900">{email}</strong>.
                  </p>
                </div>

                {/* Localhost Dev Mode Direct Link Card */}
                {resetUrl && (
                  <div className="p-4 bg-slate-900 text-white rounded-2xl text-left space-y-3 shadow-xl border border-slate-800 animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="size-3.5" /> Akses Cepat Localhost Dev
                      </span>
                      <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-mono">Local Env</span>
                    </div>
                    <p className="text-xs text-slate-300 font-medium leading-relaxed">
                      Karena aplikasi sedang dijalankan secara <strong>lokal (localhost)</strong>, Anda dapat langsung menekan tombol di bawah ini untuk membuka halaman ganti kata sandi:
                    </p>
                    <a
                      href={resetUrl}
                      className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                    >
                      Buka Halaman Reset Password <ExternalLink className="size-4" />
                    </a>
                  </div>
                )}

                <Button
                  render={<Link to={ROUTES.LOGIN} />}
                  className="w-full h-11 rounded-2xl font-extrabold text-sm gap-2 cursor-pointer mt-2"
                >
                  <ArrowLeft className="size-4" /> Kembali ke Halaman Masuk
                </Button>
              </div>
            ) : (
              <>
                <div className="text-center space-y-1.5">
                  <div className="size-12 rounded-2xl bg-primary/10 text-primary mx-auto flex items-center justify-center mb-2">
                    <KeyRound className="size-6" />
                  </div>
                  <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Lupa Kata Sandi?</h1>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    Masukkan email terdaftar akun NIRA POS Anda. Kami akan mengirimkan tautan konfirmasi reset kata sandi ke email Anda.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMsg && (
                    <div className="p-3 text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200 rounded-xl">
                      {errorMsg}
                    </div>
                  )}

                  {/* Email Input Field */}
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs font-bold text-slate-700">Alamat Email Terdaftar</Label>
                    <div className="relative">
                      <Input
                        id="email"
                        type="email"
                        placeholder="owner@nirapos.id"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-11 rounded-2xl border-slate-200 pl-10 pr-4 text-sm font-medium focus-visible:ring-2 focus-visible:ring-primary"
                        required
                      />
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    </div>
                  </div>

                  {/* Submit Action Button */}
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-extrabold text-sm gap-2 cursor-pointer shadow-lg shadow-primary/25 transition-all mt-2"
                  >
                    {isLoading ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <>
                        Kirim Konfirmasi Email <ArrowRight className="size-4" />
                      </>
                    )}
                  </Button>
                </form>

                <div className="text-center pt-2">
                  <Link
                    to={ROUTES.LOGIN}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-primary transition-colors"
                  >
                    <ArrowLeft className="size-3.5" /> Kembali ke Halaman Masuk
                  </Link>
                </div>
              </>
            )}
          </div>

          {/* Footer Copyright */}
          <div className="text-[11px] text-slate-400 font-medium flex items-center justify-between pt-6 border-t border-slate-100">
            <span>Hak Cipta &copy; {new Date().getFullYear()} NIRA POS</span>
            <span>Bantuan & Support</span>
          </div>
        </div>

        {/* RIGHT COLUMN: POS Security Showcase Panel */}
        <div className="hidden lg:flex lg:col-span-6 xl:col-span-7 bg-slate-900 rounded-[24px] sm:rounded-[30px] p-8 lg:p-12 text-white flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="relative z-10 max-w-lg space-y-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold backdrop-blur-md">
              <CheckCircle2 className="size-3.5 text-emerald-400" /> Konfirmasi Email Aman
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight leading-tight">
              Verifikasi Email Sebelum Pembaruan Kata Sandi
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed font-medium">
              Sistem verifikasi dua langkah kami memastikan bahwa hanya pemilik email terdaftar yang dapat mengubah kata sandi akun NIRA POS.
            </p>
          </div>
          <div className="relative z-10 pt-8 border-t border-slate-800 text-xs text-slate-400 flex justify-between">
            <span>NIRA POS v1.0.0</span>
            <span>Support: support@nirapos.id</span>
          </div>
        </div>

      </div>
    </div>
  )
}
