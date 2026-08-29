import * as React from "react"
import { useAuth } from "@/context/AuthContext"
import { outletService } from "@/services/outletService"
import type { Outlet } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Building2,
  CheckCircle2,
  Edit2,
  Loader2,
  MapPin,
  Phone,
  Plus,
  RefreshCw,
  Search,
  ShieldAlert,
  Store,
  Trash2,
  X,
} from "lucide-react"

export default function OutletManagementPage() {
  const { user } = useAuth()
  
  // Check if current authenticated user has Owner role
  const isOwner = React.useMemo(() => {
    const roleName = user?.role?.name?.toLowerCase() || ''
    return roleName === 'owner'
  }, [user])

  const [outlets, setOutlets] = React.useState<Outlet[]>([])
  const [search, setSearch] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(true)
  const [errorMsg, setErrorMsg] = React.useState("")
  const [successMsg, setSuccessMsg] = React.useState("")

  // Modal State
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [editingOutlet, setEditingOutlet] = React.useState<Outlet | null>(null)
  const [formData, setFormData] = React.useState({
    name: "",
    address: "",
    phone: "",
    is_active: true,
  })
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [modalError, setModalError] = React.useState("")

  // Fetch Outlets
  const fetchOutlets = React.useCallback(async (searchQuery = "") => {
    setIsLoading(true)
    setErrorMsg("")
    try {
      const res = await outletService.getOutlets(searchQuery)
      if (res.success && res.data) {
        setOutlets(res.data)
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "Gagal memuat daftar outlet cabang.")
    } finally {
      setIsLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchOutlets(search)
  }, [fetchOutlets, search])

  // Handle Open Create Modal
  const handleOpenCreateModal = () => {
    if (!isOwner) return
    setEditingOutlet(null)
    setFormData({
      name: "",
      address: "",
      phone: "",
      is_active: true,
    })
    setModalError("")
    setIsModalOpen(true)
  }

  // Handle Open Edit Modal
  const handleOpenEditModal = (outlet: Outlet) => {
    if (!isOwner) return
    setEditingOutlet(outlet)
    setFormData({
      name: outlet.name,
      address: outlet.address || "",
      phone: outlet.phone || "",
      is_active: outlet.is_active,
    })
    setModalError("")
    setIsModalOpen(true)
  }

  // Submit Modal Form
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isOwner) return
    setModalError("")

    if (!formData.name.trim()) {
      setModalError("Nama outlet cabang wajib diisi.")
      return
    }

    setIsSubmitting(true)
    try {
      if (editingOutlet) {
        // Update existing outlet
        await outletService.updateOutlet(editingOutlet.id, formData)
        setSuccessMsg(`Outlet "${formData.name}" berhasil diperbarui.`)
      } else {
        // Create new outlet
        await outletService.createOutlet(formData)
        setSuccessMsg(`Outlet cabang baru "${formData.name}" berhasil dibuat.`)
      }
      setIsModalOpen(false)
      fetchOutlets(search)
    } catch (err: any) {
      setModalError(err?.message || "Gagal menyimpan informasi outlet.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Delete / Soft Delete Outlet
  const handleDeleteOutlet = async (outlet: Outlet) => {
    if (!isOwner) return
    if (!window.confirm(`Apakah Anda yakin ingin menonaktifkan outlet "${outlet.name}"?`)) return

    try {
      await outletService.deleteOutlet(outlet.id)
      setSuccessMsg(`Outlet "${outlet.name}" telah dinonaktifkan (soft delete).`)
      fetchOutlets(search)
    } catch (err: any) {
      setErrorMsg(err?.message || "Gagal menonaktifkan outlet.")
    }
  }

  // Restore Soft Deleted Outlet
  const handleRestoreOutlet = async (outlet: Outlet) => {
    if (!isOwner) return
    try {
      await outletService.restoreOutlet(outlet.id)
      setSuccessMsg(`Outlet "${outlet.name}" berhasil dipulihkan kembali.`)
      fetchOutlets(search)
    } catch (err: any) {
      setErrorMsg(err?.message || "Gagal memulihkan outlet.")
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Store className="size-6 text-primary" />
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Pengelolaan Cabang Outlet</h1>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Kelola seluruh cabang lokasi toko retail & resto milik usaha Anda.
          </p>
        </div>

        {/* CREATE OUTLET BUTTON */}
        <Button
          onClick={handleOpenCreateModal}
          disabled={!isOwner}
          className={`h-11 px-5 rounded-2xl font-extrabold text-sm gap-2 shadow-lg transition-all ${
            isOwner
              ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary/25 cursor-pointer"
              : "bg-slate-200 text-slate-400 cursor-not-allowed opacity-70"
          }`}
          title={!isOwner ? "Hanya Pemilik Usaha (Owner) yang berhak menambah outlet baru" : ""}
        >
          <Plus className="size-4" /> Tambah Outlet Baru
        </Button>
      </div>

      {/* OWNER ONLY SECURITY NOTICE BANNER */}
      {!isOwner && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3 shadow-xs">
          <ShieldAlert className="size-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-bold text-amber-900">Hak Akses Terbatas (Khusus Role Owner)</p>
            <p className="text-amber-800 leading-relaxed font-medium">
              Anda masuk sebagai <strong>{user?.role?.name || 'Staf'}</strong>. Pengubahan, penambahan, dan penghapusan lokasi cabang outlet hanya dapat dilakukan oleh akun berhak akses <strong>Owner (Pemilik Usaha)</strong>.
            </p>
          </div>
        </div>
      )}

      {/* TOAST ALERTS */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5 text-xs font-bold">
            <CheckCircle2 className="size-4 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg("")} className="text-emerald-700 hover:text-emerald-900 cursor-pointer">
            <X className="size-4" />
          </button>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5 text-xs font-bold">
            <ShieldAlert className="size-4 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg("")} className="text-rose-700 hover:text-rose-900 cursor-pointer">
            <X className="size-4" />
          </button>
        </div>
      )}

      {/* FILTER & SEARCH BAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            type="text"
            placeholder="Cari nama, alamat, no hp outlet..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 rounded-xl border-slate-200 text-xs font-medium focus-visible:ring-primary"
          />
        </div>

        <div className="text-xs text-slate-500 font-bold self-end sm:self-auto">
          Total Cabang: <span className="text-slate-900 font-extrabold">{outlets.length}</span> Outlet
        </div>
      </div>

      {/* OUTLETS TABLE DATA CONTAINER */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center space-y-3">
            <Loader2 className="size-8 animate-spin text-primary mx-auto" />
            <p className="text-xs font-extrabold text-slate-700">Memuat Data Outlet Cabang...</p>
          </div>
        ) : outlets.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Building2 className="size-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-extrabold text-slate-800">Belum Ada Outlet Cabang</h3>
            <p className="text-xs text-slate-500 font-medium max-w-sm mx-auto">
              {search ? "Tidak ada outlet yang sesuai dengan kata kunci pencarian Anda." : "Klik tombol 'Tambah Outlet Baru' untuk mendaftarkan cabang toko pertama Anda."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-extrabold uppercase tracking-wider">
                  <th className="py-3.5 px-5">Nama Outlet Cabang</th>
                  <th className="py-3.5 px-5">Alamat Lokasi</th>
                  <th className="py-3.5 px-5">No. Telepon</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {outlets.map((outlet) => {
                  const isDeleted = Boolean(outlet.deleted_at)
                  return (
                    <tr key={outlet.id} className={`hover:bg-slate-50/60 transition-colors ${isDeleted ? 'bg-slate-50/50 opacity-60' : ''}`}>
                      
                      {/* Name */}
                      <td className="py-4 px-5 font-bold text-slate-900">
                        <div className="flex items-center gap-3">
                          <div className={`size-9 rounded-xl flex items-center justify-center font-extrabold text-xs shrink-0 ${isDeleted ? 'bg-slate-200 text-slate-600' : 'bg-emerald-50 text-emerald-600'}`}>
                            <Store className="size-4" />
                          </div>
                          <div>
                            <div className="font-extrabold text-slate-900 text-sm">{outlet.name}</div>
                            {outlet.id === user?.outlet_id && (
                              <span className="inline-block mt-0.5 px-2 py-0.5 rounded-md bg-primary/10 text-primary font-bold text-[10px]">
                                Outlet Aktif Anda
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Address */}
                      <td className="py-4 px-5 text-slate-600 font-medium max-w-xs truncate">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="size-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{outlet.address || 'Belum diatur'}</span>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="py-4 px-5 text-slate-600 font-medium">
                        <div className="flex items-center gap-1.5">
                          <Phone className="size-3.5 text-slate-400 shrink-0" />
                          <span>{outlet.phone || '-'}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-5">
                        {isDeleted ? (
                          <span className="px-2.5 py-1 rounded-full bg-slate-200 text-slate-600 font-bold text-[11px]">
                            Nonaktif (Terhapus)
                          </span>
                        ) : outlet.is_active ? (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 font-bold text-[11px] inline-flex items-center gap-1">
                            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Aktif
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-700 font-bold text-[11px]">
                            Tutup / Nonaktif
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right space-x-1">
                        {isDeleted ? (
                          <Button
                            size="sm"
                            variant="ghost"
                            disabled={!isOwner}
                            onClick={() => handleRestoreOutlet(outlet)}
                            className="h-8 px-2.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 font-bold text-xs gap-1 cursor-pointer"
                          >
                            <RefreshCw className="size-3.5" /> Pulihkan
                          </Button>
                        ) : (
                          <>
                            <Button
                              size="sm"
                              variant="ghost"
                              disabled={!isOwner}
                              onClick={() => handleOpenEditModal(outlet)}
                              className="h-8 px-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-bold text-xs gap-1 cursor-pointer"
                            >
                              <Edit2 className="size-3.5" /> Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              disabled={!isOwner}
                              onClick={() => handleDeleteOutlet(outlet)}
                              className="h-8 px-2.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 font-bold text-xs gap-1 cursor-pointer"
                            >
                              <Trash2 className="size-3.5" /> Hapus
                            </Button>
                          </>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE / EDIT MODAL DIALOG */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-extrabold">
                  <Store className="size-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">
                    {editingOutlet ? "Edit Cabang Outlet" : "Tambah Outlet Baru"}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">Khusus Otorisasi Pemilik Usaha (Owner)</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Modal Error */}
            {modalError && (
              <div className="p-3 text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200 rounded-xl">
                {modalError}
              </div>
            )}

            {/* Form Fields */}
            <form onSubmit={handleSubmitForm} className="space-y-4">
              
              {/* Outlet Name */}
              <div className="space-y-1">
                <Label htmlFor="name" className="text-xs font-bold text-slate-700">Nama Outlet Cabang *</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Contoh: Outlet Cabang Canggu"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-10 rounded-xl border-slate-200 text-xs font-medium focus-visible:ring-primary"
                  required
                />
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <Label htmlFor="phone" className="text-xs font-bold text-slate-700">No. Telepon / WhatsApp</Label>
                <Input
                  id="phone"
                  type="text"
                  placeholder="Contoh: 081234567890"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="h-10 rounded-xl border-slate-200 text-xs font-medium focus-visible:ring-primary"
                />
              </div>

              {/* Address */}
              <div className="space-y-1">
                <Label htmlFor="address" className="text-xs font-bold text-slate-700">Alamat Lengkap</Label>
                <textarea
                  id="address"
                  rows={3}
                  placeholder="Alamat fisik cabang outlet toko..."
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 p-3 text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                />
              </div>

              {/* Status Select */}
              <div className="space-y-1">
                <Label htmlFor="is_active" className="text-xs font-bold text-slate-700">Status Operasional</Label>
                <select
                  id="is_active"
                  value={formData.is_active ? "true" : "false"}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.value === "true" })}
                  className="w-full h-10 rounded-xl border border-slate-200 px-3 text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary bg-white"
                >
                  <option value="true">Aktif (Dapat Bertransaksi)</option>
                  <option value="false">Tutup / Nonaktif</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsModalOpen(false)}
                  className="h-10 rounded-xl font-bold text-xs"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-10 px-5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs gap-2 cursor-pointer"
                >
                  {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : "Simpan Outlet"}
                </Button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  )
}
