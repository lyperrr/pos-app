import * as React from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel, FieldError, FieldGroup, FieldDescription } from "@/components/ui/field"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  ArrowLeft,
  PackagePlus,
  Save,
  Barcode,
  Hash,
  Image as ImageIcon,
  DollarSign,
  Layers,
  Loader2,
  Sparkles,
} from "lucide-react"
import { productService } from "@/services/productService"
import { categoryService } from "@/services/categoryService"
import { ROUTES } from "@/constants/routes"
import { showToast } from "@/components/ui/toast"
import type { Category } from "@/types"

export default function CreateProductPage() {
  const navigate = useNavigate()

  // Form State
  const [name, setName] = React.useState("")
  const [categoryId, setCategoryId] = React.useState("")
  const [price, setPrice] = React.useState("")
  const [costPrice, setCostPrice] = React.useState("")
  const [stock, setStock] = React.useState("10")
  const [minStock, setMinStock] = React.useState("5")
  const [unit, setUnit] = React.useState("pcs")
  const [barcode, setBarcode] = React.useState("")
  const [sku, setSku] = React.useState("")
  const [image, setImage] = React.useState("")
  const [isActive, setIsActive] = React.useState(true)

  // Meta state
  const [categories, setCategories] = React.useState<Category[]>([])
  const [isLoadingCategories, setIsLoadingCategories] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [errors, setErrors] = React.useState<Record<string, string>>({})

  // Fetch categories on mount
  React.useEffect(() => {
    async function loadCategories() {
      setIsLoadingCategories(true)
      try {
        const response = await categoryService.getCategories()
        if (response.success && response.data) {
          setCategories(response.data)
        } else {
          setCategories(FALLBACK_CATEGORIES)
        }
      } catch {
        setCategories(FALLBACK_CATEGORIES)
      } finally {
        setIsLoadingCategories(false)
      }
    }
    loadCategories()
  }, [])

  // Auto-generate SKU using POS Industry Structured Standard ([CAT]-[INITIALS]-[RANDOM])
  const generateSku = () => {
    const selectedCat = categories.find((c) => c.id === categoryId)
    const catPrefix = selectedCat
      ? selectedCat.name.replace(/[^A-Za-z]/g, "").substring(0, 3).toUpperCase()
      : "GEN"

    const cleanName = name.trim().toUpperCase()
    const nameInitials = cleanName
      ? cleanName
          .split(/\s+/)
          .map((w) => w[0])
          .join("")
          .substring(0, 4)
      : "PRD"

    const random = Math.floor(1000 + Math.random() * 9000)
    setSku(`${catPrefix}-${nameInitials}-${random}`)
  }

  // Auto-generate Barcode (GS1 Internal POS Retail Prefix 200)
  const generateBarcode = () => {
    const random = "200" + Math.floor(100000000 + Math.random() * 900000000).toString()
    setBarcode(random)
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!name.trim()) {
      newErrors.name = "Nama produk wajib diisi"
    }
    if (!price || isNaN(Number(price)) || Number(price) <= 0) {
      newErrors.price = "Harga jual harus berupa angka lebih dari 0"
    }
    if (costPrice && (isNaN(Number(costPrice)) || Number(costPrice) < 0)) {
      newErrors.costPrice = "Harga modal harus berupa angka valid"
    }
    if (stock && (isNaN(Number(stock)) || Number(stock) < 0)) {
      newErrors.stock = "Stok harus berupa angka non-negatif"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    setErrors({})

    try {
      const response = await productService.createProduct({
        name: name.trim(),
        category_id: categoryId && categoryId !== "cat-all" ? categoryId : undefined,
        price: Number(price),
        cost_price: costPrice ? Number(costPrice) : undefined,
        stock: stock ? Number(stock) : undefined,
        min_stock: minStock ? Number(minStock) : undefined,
        barcode: barcode.trim() || undefined,
        sku: sku.trim() || undefined,
        image: image.trim() || undefined,
        is_special: false,
      })

      if (response.success || response.data) {
        showToast.success("Produk berhasil ditambahkan ke katalog!", "Berhasil Ditambahkan")
        setTimeout(() => {
          navigate(ROUTES.PRODUCTS)
        }, 800)
      }
    } catch (err: unknown) {
      console.error("Gagal menambah produk:", err)
      const msg = (err as { message?: string })?.message || "Gagal menyimpan produk ke backend API."
      showToast.error(msg, "Gagal Menyimpan")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 w-full pb-12">
      {/* Top Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => navigate(ROUTES.PRODUCTS)}
            className="cursor-pointer shrink-0"
            title="Kembali ke Daftar Produk"
          >
            <ArrowLeft className="size-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <PackagePlus className="size-6 text-primary" /> Tambah Produk Baru
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Lengkapi data produk, atur harga, stok, dan barcode produk Anda.
            </p>
          </div>
        </div>

        {/* Action Buttons in Header for fast access */}
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(ROUTES.PRODUCTS)}
          >
            Batal
          </Button>
          <Button
            type="submit"
            form="create-product-form"
            disabled={isSubmitting}
            className="gap-2 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Menyimpan...
              </>
            ) : (
              <>
                <Save className="size-4" /> Simpan Produk
              </>
            )}
          </Button>
        </div>
      </div>

      <form id="create-product-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Information, Pricing, & Stock */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Informasi Utama Produk */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="size-4 text-primary" /> Informasi Utama
              </CardTitle>
              <CardDescription>
                Nama produk, kategori, dan satuan produk untuk katalog POS.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="product-name">Nama Produk *</FieldLabel>
                  <Input
                    id="product-name"
                    placeholder="Contoh: Kopi Bali Arabica 250g"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  {errors.name && <FieldError>{errors.name}</FieldError>}
                </Field>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="category-select">Kategori Produk</FieldLabel>
                    <Select value={categoryId} onValueChange={(val) => setCategoryId(val ?? "")} disabled={isLoadingCategories}>
                      <SelectTrigger id="category-select">
                        <SelectValue placeholder="Pilih Kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cat-all">-- Tanpa Kategori --</SelectItem>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="unit-select">Satuan Produk</FieldLabel>
                    <Select value={unit} onValueChange={(val) => setUnit(val ?? "pcs")}>
                      <SelectTrigger id="unit-select">
                        <SelectValue placeholder="Pilih Satuan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pcs">Pcs (Buah)</SelectItem>
                        <SelectItem value="kg">Kg (Kilogram)</SelectItem>
                        <SelectItem value="pack">Pack (Bungkus)</SelectItem>
                        <SelectItem value="box">Box (Dus)</SelectItem>
                        <SelectItem value="botol">Botol</SelectItem>
                        <SelectItem value="porsi">Porsi</SelectItem>
                        <SelectItem value="set">Set</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                </div>
              </FieldGroup>
            </CardContent>
          </Card>

          {/* Section 2: Harga & Stok */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="size-4 text-primary" /> Harga & Stok Inventaris
              </CardTitle>
              <CardDescription>
                Tentukan harga jual, modal (HPP), serta jumlah stok awal di outlet.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="price-input">Harga Jual (Rp) *</FieldLabel>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">
                      Rp
                    </span>
                    <Input
                      id="price-input"
                      type="number"
                      placeholder="0"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  {errors.price && <FieldError>{errors.price}</FieldError>}
                </Field>

                <Field>
                  <FieldLabel htmlFor="cost-price-input">Harga Modal / HPP (Rp)</FieldLabel>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">
                      Rp
                    </span>
                    <Input
                      id="cost-price-input"
                      type="number"
                      placeholder="0"
                      value={costPrice}
                      onChange={(e) => setCostPrice(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  {errors.costPrice && <FieldError>{errors.costPrice}</FieldError>}
                </Field>

                <Field>
                  <FieldLabel htmlFor="stock-input">Stok Awal</FieldLabel>
                  <Input
                    id="stock-input"
                    type="number"
                    placeholder="10"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                  />
                  {errors.stock && <FieldError>{errors.stock}</FieldError>}
                </Field>

                <Field>
                  <FieldLabel htmlFor="min-stock-input">Peringatan Minimal Stok</FieldLabel>
                  <Input
                    id="min-stock-input"
                    type="number"
                    placeholder="5"
                    value={minStock}
                    onChange={(e) => setMinStock(e.target.value)}
                  />
                  <FieldDescription>
                    Notifikasi "Stok Menipis" muncul jika stok &lt; nilai ini.
                  </FieldDescription>
                </Field>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (1 Col): Status & Barcode / SKU / Media */}
        <div className="lg:col-span-1 space-y-6">
          {/* Status Active Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-bold">Status Keaktifan</CardTitle>
              <CardDescription>Atur Visibilitas produk di POS</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-3 rounded-xl border bg-muted/30">
                <div>
                  <p className="text-sm font-semibold text-foreground">Aktif di Kasir</p>
                  <p className="text-xs text-muted-foreground">Tampil di menu POS</p>
                </div>
                <Switch checked={isActive} onCheckedChange={setIsActive} />
              </div>
            </CardContent>
          </Card>

          {/* Barcode, SKU & Media Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-bold">
                <Barcode className="size-4 text-primary" /> Kode & Media Produk
              </CardTitle>
              <CardDescription>
                Barcode, SKU, dan link foto produk.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Field>
                <FieldLabel htmlFor="barcode-input">Kode Barcode / EAN</FieldLabel>
                <div className="flex gap-2">
                  <Input
                    id="barcode-input"
                    placeholder="Contoh: 200849201948"
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                    className="font-mono"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={generateBarcode}
                    className="gap-1 shrink-0"
                    title="Generate barcode otomatis"
                  >
                    <Sparkles className="size-3.5 text-primary" /> Auto
                  </Button>
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Pindai kemasan produk atau kosongkan untuk generate barcode 13-digit otomatis.
                </p>
              </Field>

              <Field>
                <FieldLabel htmlFor="sku-input">Kode SKU Produk</FieldLabel>
                <div className="flex gap-2">
                  <Input
                    id="sku-input"
                    placeholder="Contoh: BEV-KSG-847"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="font-mono"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={generateSku}
                    className="gap-1 shrink-0"
                    title="Generate SKU otomatis"
                  >
                    <Hash className="size-3.5 text-primary" /> Auto
                  </Button>
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Format POS: <code className="font-mono text-[10px] bg-muted px-1 py-0.5 rounded">KAT-INIT-XXXX</code>. Kosongkan jika ingin sistem menerbitkan SKU unik otomatis.
                </p>
              </Field>

              <Field>
                <FieldLabel htmlFor="image-url">URL Gambar Produk (Opsional)</FieldLabel>
                <div className="relative">
                  <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="image-url"
                    placeholder="https://images.unsplash.com/..."
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </Field>

              {image && (
                <div className="p-3 rounded-xl border bg-muted/20 flex items-center gap-4">
                  <img
                    src={image}
                    alt="Preview"
                    className="size-16 object-cover rounded-lg border bg-white shrink-0"
                    onError={(e) => {
                      ;(e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&h=100&fit=crop"
                    }}
                  />
                  <div>
                    <p className="text-xs font-semibold text-foreground">Preview Gambar</p>
                    <p className="text-xs text-muted-foreground">Tampilan di katalog kasir POS.</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  )
}

const FALLBACK_CATEGORIES: Category[] = [
  { id: "cat-1", name: "Souvenir F&B", slug: "souvenir-fb" },
  { id: "cat-2", name: "Fashion & Apparel", slug: "fashion-apparel" },
  { id: "cat-3", name: "Handicrafts & Gifts", slug: "handicrafts-gifts" },
  { id: "cat-4", name: "Retail & Groceries", slug: "retail-groceries" },
]
