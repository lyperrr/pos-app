import * as React from "react"
import { useLocation, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ROUTES } from "@/constants/routes"
import { authService } from "@/services/authService"
import { AlertTriangle, ArrowLeft, CheckCircle2, Eye, EyeOff, KeyRound, Loader2 } from "lucide-react"

export default function ResetPasswordPage() {
  const location = useLocation()
  
  const searchParams = React.useMemo(() => new URLSearchParams(location.search), [location.search])
  const token = searchParams.get("token") || ""
  const email = searchParams.get("email") || ""

  const [isVerifying, setIsVerifying] = React.useState(true)
  const [isValidToken, setIsValidToken] = React.useState(false)
  const [tokenError, setTokenError] = React.useState("")

  const [password, setPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [showPassword, setShowPassword] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [errorMsg, setErrorMsg] = React.useState("")
  const [isSuccess, setIsSuccess] = React.useState(false)

  // Verify email token on mount
  React.useEffect(() => {
    async function verifyToken() {
      if (!token || !email) {
        setIsVerifying(false)
        setIsValidToken(false)
        setTokenError("Tautan reset kata sandi tidak valid atau tidak memiliki parameter token.")
        return
      }

      try {
        await authService.verifyResetToken(email, token)
        setIsValidToken(true)
      } catch (err: any) {
        setIsValidToken(false)
        setTokenError(err?.message || "Tautan reset kata sandi dari email tidak valid atau telah kadaluarsa.")
      } finally {
        setIsVerifying(false)
      }
    }

    verifyToken()
  }, [email, token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg("")

    if (password.length < 8) {
      setErrorMsg("Kata sandi baru wajib berisi minimal 8 karakter.")
      return
    }

    if (password !== confirmPassword) {
      setErrorMsg("Konfirmasi kata sandi baru tidak cocok. Silakan periksa kembali.")
      return
    }

    setIsLoading(true)
    try {
      await authService.resetPassword({
        email,
        token,
        password,
      })
      setIsSuccess(true)
    } catch (err: any) {
      if (err?.message) {
        setErrorMsg(err.message)
      } else {
        setErrorMsg("Gagal memperbarui kata sandi. Silakan minta link reset baru dari email.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#f6f8fa] text-slate-900 font-sans antialiased p-3 sm:p-6 lg:p-8 flex flex-col justify-between">
      {/* MAIN CONTAINER CARD */}
      <div className="max-w-[1240px] w-full mx-auto my-auto bg-white rounded-[28px] sm:rounded-[36px] border border-slate-200/80 shadow-2xl shadow-slate-200/70 p-3 sm:p-4 lg:p-5 min-h-[600px] grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        
        {/* LEFT COLUMN: Reset Password Form & Branding */}
        <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-between p-6 sm:p-10 lg:p-12">
          {/* Top Brand Header */}
          <div className="flex items-center gap-3">
            <img src="/logo_nira.png" alt="NIRA POS" className="h-9 w-auto object-contain" />
            <span className="font-extrabold text-xl tracking-tight text-slate-900">NIRA POS</span>
          </div>

          {/* Form Content */}
          <div className="my-auto py-6 space-y-6 max-w-sm w-full mx-auto">
            {isVerifying ? (
              <div className="text-center space-y-3 py-8">
                <Loader2 className="size-10 animate-spin text-primary mx-auto" />
                <p className="text-sm font-extrabold text-slate-900">Memverifikasi Tautan Konfirmasi Email...</p>
                <p className="text-xs text-slate-500 font-medium">Mohon tunggu sebentar saat kami memeriksa validitas token email Anda.</p>
              </div>
            ) : !isValidToken ? (
              <div className="text-center space-y-4">
                <div className="size-16 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center shadow-xs">
                  <AlertTriangle className="size-8" />
                </div>
                <div className="space-y-1.5">
                  <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Tautan Tidak Valid</h1>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    {tokenError}
                  </p>
                </div>

                <Button
                  render={<Link to={ROUTES.FORGOT_PASSWORD} />}
                  className="w-full h-11 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-extrabold text-sm gap-2 cursor-pointer mt-4"
                >
                  <ArrowLeft className="size-4" /> Minta Link Reset Baru
                </Button>
              </div>
            ) : isSuccess ? (
              <div className="text-center space-y-4">
                <div className="size-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-xs">
                  <CheckCircle2 className="size-8" />
                </div>
                <div className="space-y-1.5">
                  <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Kata Sandi Diperbarui!</h1>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    Kata sandi akun NIRA POS Anda telah berhasil diperbarui. Silakan masuk menggunakan kata sandi baru Anda.
                  </p>
                </div>

                <Button
                  render={<Link to={ROUTES.LOGIN} />}
                  className="w-full h-12 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-extrabold text-sm gap-2 cursor-pointer shadow-lg shadow-primary/25 transition-all mt-4"
                >
                  Masuk ke NIRA POS <ArrowLeft className="size-4 rotate-180" />
                </Button>
              </div>
            ) : (
              <>
                <div className="text-center space-y-1.5">
                  <div className="size-12 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center mb-2">
                    <CheckCircle2 className="size-6" />
                  </div>
                  <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Konfirmasi Email Berhasil</h1>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    Email terkonfirmasi: <strong className="text-slate-800">{email}</strong>. Silakan masukkan kata sandi baru Anda.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMsg && (
                    <div className="p-3 text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200 rounded-xl">
                      {errorMsg}
                    </div>
                  )}

                  {/* New Password Field */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-xs font-bold text-slate-700">Kata Sandi Baru</Label>
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
                        title={showPassword ? "Sembunyikan Kata Sandi" : "Tampilkan Kata Sandi"}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm New Password Field */}
                  <div className="space-y-1">
                    <Label htmlFor="confirmPassword" className="text-xs font-bold text-slate-700">Konfirmasi Kata Sandi Baru</Label>
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
                        Simpan Kata Sandi Baru <KeyRound className="size-4" />
                      </>
                    )}
                  </Button>
                </form>

                <div className="text-center pt-2">
                  <Link
                    to={ROUTES.LOGIN}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-primary transition-colors"
                  >
                    <ArrowLeft className="size-3.5" /> Batal & Kembali ke Login
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

        {/* RIGHT COLUMN: POS Security Panel */}
        <div className="hidden lg:flex lg:col-span-6 xl:col-span-7 bg-slate-900 rounded-[24px] sm:rounded-[30px] p-8 lg:p-12 text-white flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="relative z-10 max-w-lg space-y-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold backdrop-blur-md">
              <CheckCircle2 className="size-3.5 text-emerald-400" /> Tautan Konfirmasi Email Terverifikasi
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight leading-tight">
              Langkah Terakhir Pembaruan Kata Sandi
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed font-medium">
              Email Anda telah terverifikasi. Masukkan kata sandi baru untuk mengamankan kembali akun outlet NIRA POS Anda.
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
