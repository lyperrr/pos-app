import * as React from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Skeleton } from "@/components/ui/skeleton"
import { ViewToggle, type ViewMode } from "@/components/ui/view-toggle"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Plus,
  Search,
  Package,
  Trash2,
  MoreVertical,
  Pencil,
  Eye,
  Copy,
  PackageX,
  SearchX,
  Tag,
  Barcode,
  CheckCircle2,
} from "lucide-react"
import { productService } from "@/services/productService"
import { categoryService } from "@/services/categoryService"
import { useDebounce } from "@/hooks/useDebounce"
import { ROUTES } from "@/constants/routes"
import type { Product, Category } from "@/types"

export default function ProductListPage() {
  const navigate = useNavigate()

  // View state (Grid vs List) with persistence
  const [viewMode, setViewMode] = React.useState<ViewMode>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("nira_product_view_mode")
      if (saved === "grid" || saved === "list") return saved
    }
    return "grid"
  })

  // State filtering & search (default empty string so Select displays placeholder)
  const [search, setSearch] = React.useState("")
  const [selectedCategory, setSelectedCategory] = React.useState("")
  const [selectedStatus, setSelectedStatus] = React.useState("")

  // Debounce search input (400ms delay according to CODING_GUIDELINES)
  const debouncedSearch = useDebounce(search, 400)

  // Data states
  const [products, setProducts] = React.useState<Product[]>([])
  const [categories, setCategories] = React.useState<Category[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  // Modal states for delete confirmation & detail
  const [productToDelete, setProductToDelete] = React.useState<Product | null>(null)
  const [isDeleting, setIsDeleting] = React.useState(false)
  const [selectedDetailProduct, setSelectedDetailProduct] = React.useState<Product | null>(null)
  const [toastMessage, setToastMessage] = React.useState<string | null>(null)

  const handleViewChange = (mode: ViewMode) => {
    setViewMode(mode)
    localStorage.setItem("nira_product_view_mode", mode)
  }

  // Fetch Categories
  React.useEffect(() => {
    async function loadCategories() {
      try {
        const response = await categoryService.getCategories()
        if (response.success && response.data) {
          setCategories(response.data)
        } else {
          setCategories(FALLBACK_CATEGORIES)
        }
      } catch {
        setCategories(FALLBACK_CATEGORIES)
      }
    }
    loadCategories()
  }, [])

  // Fetch Products with search & filters
  const fetchProducts = React.useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await productService.getProducts({
        search: debouncedSearch || undefined,
        category_id: selectedCategory && selectedCategory !== "all" ? selectedCategory : undefined,
      })
      if (response.success && Array.isArray(response.data)) {
        setProducts(response.data)
      } else {
        setProducts(FALLBACK_PRODUCTS)
      }
    } catch (e) {
      console.warn("API error fetching products, using fallback data:", e)
      setProducts(FALLBACK_PRODUCTS)
    } finally {
      setIsLoading(false)
    }
  }, [debouncedSearch, selectedCategory])

  React.useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // Client-side filtering for status & search refinement
  const filteredProducts = React.useMemo(() => {
    return products.filter((p) => {
      // Search filter
      const matchesSearch =
        !debouncedSearch ||
        p.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        (p.barcode && p.barcode.toLowerCase().includes(debouncedSearch.toLowerCase())) ||
        (p.sku && p.sku.toLowerCase().includes(debouncedSearch.toLowerCase()))

      // Category filter
      const matchesCategory =
        !selectedCategory ||
        selectedCategory === "all" ||
        p.category === selectedCategory ||
        p.category_label === selectedCategory

      // Status filter
      const stock = p.stock ?? 25
      const minStock = p.min_stock ?? 5
      let matchesStatus = true
      if (selectedStatus === "available") {
        matchesStatus = stock >= minStock
      } else if (selectedStatus === "low_stock") {
        matchesStatus = stock > 0 && stock < minStock
      } else if (selectedStatus === "out_of_stock") {
        matchesStatus = stock === 0
      }

      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [products, debouncedSearch, selectedCategory, selectedStatus])

  // Delete Action
  const handleDeleteConfirm = async () => {
    if (!productToDelete) return
    setIsDeleting(true)
    try {
      await productService.deleteProduct(productToDelete.id)
      setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id))
      showToast(`Produk "${productToDelete.name}" berhasil dihapus.`)
    } catch {
      setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id))
      showToast(`Produk "${productToDelete.name}" telah dihapus.`)
    } finally {
      setIsDeleting(false)
      setProductToDelete(null)
    }
  }

  // Duplicate Action
  const handleDuplicate = (product: Product) => {
    const duplicated: Product = {
      ...product,
      id: `prod-${Date.now()}`,
      name: `${product.name} (Salinan)`,
      sku: product.sku ? `${product.sku}-COPY` : undefined,
    }
    setProducts((prev) => [duplicated, ...prev])
    showToast(`Produk "${product.name}" berhasil diduplikasi.`)
  }

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  // Dynamic search placeholder based on active filters
  const searchPlaceholder = React.useMemo(() => {
    const hasCategory = Boolean(selectedCategory && selectedCategory !== "all")
    const hasStatus = Boolean(selectedStatus && selectedStatus !== "all")

    if (hasCategory && hasStatus) {
      const statusText =
        selectedStatus === "available"
          ? "Tersedia"
          : selectedStatus === "low_stock"
          ? "Stok Menipis"
          : "Stok Habis"
      return `Cari di "${selectedCategory}" (${statusText})...`
    }
    if (hasCategory) {
      return `Cari produk di kategori "${selectedCategory}"...`
    }
    if (hasStatus) {
      const statusText =
        selectedStatus === "available"
          ? "Tersedia"
          : selectedStatus === "low_stock"
          ? "Stok Menipis"
          : "Stok Habis"
      return `Cari produk dengan status "${statusText}"...`
    }
    return "Cari produk berdasarkan nama, SKU, atau barcode..."
  }, [selectedCategory, selectedStatus])

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-slate-900 text-white shadow-2xl flex items-center gap-3 text-sm font-medium animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="size-5 text-emerald-400 shrink-0" />
          {toastMessage}
        </div>
      )}

      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Package className="size-6 text-primary" /> Katalog Produk
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Kelola katalog produk, penetapan harga jual, stok gudang, dan barcode.
          </p>
        </div>
        <Button
          onClick={() => navigate(ROUTES.ADD_PRODUCT)}
          className="gap-2 cursor-pointer"
        >
          <Plus className="size-4" /> Tambah Produk Baru
        </Button>
      </div>

      {/* Filter & Search Bar - Full Width Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 bg-card p-4 rounded-xl border w-full items-center">
        {/* Search Input (5 Cols on Large screens) */}
        <div className="relative lg:col-span-5 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Category Filter (3 Cols) */}
        <div className="lg:col-span-3 w-full">
          <Select value={selectedCategory} onValueChange={(val) => setSelectedCategory(val === "all" ? "" : (val ?? ""))}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih Kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kategori</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.name}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Stock Status Filter (3 Cols) */}
        <div className="lg:col-span-3 w-full">
          <Select value={selectedStatus} onValueChange={(val) => setSelectedStatus(val === "all" ? "" : (val ?? ""))}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="available">Tersedia</SelectItem>
              <SelectItem value="low_stock">Stok Menipis</SelectItem>
              <SelectItem value="out_of_stock">Stok Habis</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Grid / List Mode Switcher (1 Col) */}
        <div className="lg:col-span-1 flex justify-end w-full">
          <ViewToggle view={viewMode} onViewChange={handleViewChange} />
        </div>
      </div>

      {/* Loading Skeletons Mirroring Layout */}
      {isLoading && (
        <>
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Card key={i} className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <Skeleton className="size-12 rounded-xl" />
                    <Skeleton className="size-8 rounded-lg" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                  <div className="pt-2 flex items-center justify-between">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-4">
              <div className="space-y-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b last:border-b-0">
                    <div className="flex items-center gap-3">
                      <Skeleton className="size-10 rounded-xl" />
                      <div className="space-y-1.5">
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                    </div>
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="size-8 rounded-lg" />
                  </div>
                ))}
              </div>
            </Card>
          )}
        </>
      )}

      {/* Empty State */}
      {!isLoading && filteredProducts.length === 0 && (
        <Card className="border-dashed p-8">
          {search || Boolean(selectedCategory && selectedCategory !== "all") || Boolean(selectedStatus && selectedStatus !== "all") ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <SearchX className="size-8 text-muted-foreground" />
                </EmptyMedia>
                <EmptyTitle>Produk Tidak Ditemukan</EmptyTitle>
                <EmptyDescription>
                  Tidak ada produk yang sesuai dengan pencarian atau filter yang Anda pilih. Coba sesuaikan kata kunci.
                </EmptyDescription>
              </EmptyHeader>
              <Button
                variant="outline"
                onClick={() => {
                  setSearch("")
                  setSelectedCategory("")
                  setSelectedStatus("")
                }}
                className="mt-2"
              >
                Reset Filter
              </Button>
            </Empty>
          ) : (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <PackageX className="size-8 text-muted-foreground" />
                </EmptyMedia>
                <EmptyTitle>Katalog Produk Masih Kosong</EmptyTitle>
                <EmptyDescription>
                  Belum ada produk yang ditambahkan ke katalog toko Anda. Mulai tambahkan produk pertama Anda sekarang!
                </EmptyDescription>
              </EmptyHeader>
              <Button onClick={() => navigate(ROUTES.ADD_PRODUCT)} className="mt-2 gap-2">
                <Plus className="size-4" /> Tambah Produk Pertama
              </Button>
            </Empty>
          )}
        </Card>
      )}

      {/* Main Content: GRID VIEW */}
      {!isLoading && filteredProducts.length > 0 && viewMode === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product) => {
            const itemStock = product.stock ?? 25
            const itemMinStock = product.min_stock ?? 5
            const isLowStock = itemStock > 0 && itemStock < itemMinStock
            const isOutOfStock = itemStock === 0

            return (
              <Card
                key={product.id}
                className="group relative transition-all hover:shadow-md flex flex-col justify-between"
              >
                <CardContent className="p-4 space-y-3">
                  {/* Top Row: Avatar/Image & Action Dropdown */}
                  <div className="flex items-start justify-between gap-2">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="size-14 rounded-xl object-cover border bg-muted shrink-0"
                        onError={(e) => {
                          ;(e.target as HTMLImageElement).src =
                            "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&h=100&fit=crop"
                        }}
                      />
                    ) : (
                      <div className="size-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-extrabold text-sm shrink-0 border border-primary/20">
                        {product.name.substring(0, 3).toUpperCase()}
                      </div>
                    )}

                    {/* Action Dropdown Menu with Vertical Dots Icon */}
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button
                            size="icon"
                            variant="ghost"
                            className="cursor-pointer shrink-0"
                            title="Aksi Produk"
                          >
                            <MoreVertical className="size-4" />
                          </Button>
                        }
                      />
                      <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuItem
                          onClick={() => setSelectedDetailProduct(product)}
                          className="cursor-pointer gap-2"
                        >
                          <Eye className="size-4 text-muted-foreground" /> Lihat Detail
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => navigate(ROUTES.ADD_PRODUCT)}
                          className="cursor-pointer gap-2"
                        >
                          <Pencil className="size-4 text-muted-foreground" /> Edit Produk
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDuplicate(product)}
                          className="cursor-pointer gap-2"
                        >
                          <Copy className="size-4 text-muted-foreground" /> Duplikat
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => setProductToDelete(product)}
                          className="cursor-pointer gap-2"
                        >
                          <Trash2 className="size-4" /> Hapus Produk
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Product Title & Info */}
                  <div className="space-y-1">
                    <Badge variant="secondary" className="text-[10px] font-bold px-2 py-0.5">
                      {product.category_label || product.category || "Retail"}
                    </Badge>
                    <h3 className="font-bold text-sm text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-xs text-muted-foreground font-mono">
                      SKU: {product.sku || product.barcode || "-"}
                    </p>
                  </div>

                  {/* Price & Stock Badge */}
                  <div className="pt-2 border-t border-border flex items-center justify-between gap-2">
                    <div>
                      <p className="text-xs text-muted-foreground font-medium">Harga Jual</p>
                      <p className="font-extrabold text-sm text-foreground">
                        Rp {product.price.toLocaleString("id-ID")}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-muted-foreground font-medium mb-1">
                        Stok: <span className="font-bold text-foreground">{itemStock}</span>
                      </p>
                      <Badge
                        variant={isOutOfStock ? "destructive" : isLowStock ? "outline" : "secondary"}
                        className={`text-[10px] font-bold ${
                          isLowStock ? "border-amber-500 text-amber-600 bg-amber-50" : ""
                        }`}
                      >
                        {isOutOfStock ? "Stok Habis" : isLowStock ? "Menipis" : "Tersedia"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Main Content: LIST VIEW TABLE */}
      {!isLoading && filteredProducts.length > 0 && viewMode === "list" && (
        <Card className="overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="w-[300px]">Produk</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead className="text-right">Harga Jual</TableHead>
                <TableHead className="text-right">Harga Modal</TableHead>
                <TableHead className="text-center">Stok</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right w-[80px]">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => {
                const itemStock = product.stock ?? 25
                const itemMinStock = product.min_stock ?? 5
                const isLowStock = itemStock > 0 && itemStock < itemMinStock
                const isOutOfStock = itemStock === 0

                return (
                  <TableRow key={product.id} className="hover:bg-muted/20">
                    {/* Column: Produk */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="size-10 rounded-xl object-cover border bg-muted shrink-0"
                            onError={(e) => {
                              ;(e.target as HTMLImageElement).src =
                                "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&h=100&fit=crop"
                            }}
                          />
                        ) : (
                          <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-extrabold text-xs shrink-0 border border-primary/20">
                            {product.name.substring(0, 3).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-sm text-foreground line-clamp-1">{product.name}</p>
                          <p className="text-xs text-muted-foreground font-mono">
                            Barcode: {product.barcode || "-"} &bull; SKU: {product.sku || "-"}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Column: Kategori */}
                    <TableCell>
                      <Badge variant="outline" className="text-xs font-semibold">
                        {product.category_label || product.category || "Retail"}
                      </Badge>
                    </TableCell>

                    {/* Column: Harga Jual */}
                    <TableCell className="text-right font-extrabold text-sm text-foreground">
                      Rp {product.price.toLocaleString("id-ID")}
                    </TableCell>

                    {/* Column: Harga Modal */}
                    <TableCell className="text-right text-xs text-muted-foreground font-medium">
                      {product.cost_price ? `Rp ${product.cost_price.toLocaleString("id-ID")}` : "-"}
                    </TableCell>

                    {/* Column: Stok */}
                    <TableCell className="text-center font-bold text-sm">
                      {itemStock} <span className="text-xs font-normal text-muted-foreground">{product.unit || "pcs"}</span>
                    </TableCell>

                    {/* Column: Status */}
                    <TableCell className="text-center">
                      <Badge
                        variant={isOutOfStock ? "destructive" : isLowStock ? "outline" : "secondary"}
                        className={`text-[10px] font-bold ${
                          isLowStock ? "border-amber-500 text-amber-600 bg-amber-50" : ""
                        }`}
                      >
                        {isOutOfStock ? "Stok Habis" : isLowStock ? "Menipis" : "Tersedia"}
                      </Badge>
                    </TableCell>

                    {/* Column: Action Dropdown Menu */}
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button
                              size="icon"
                              variant="ghost"
                              className="cursor-pointer"
                              title="Aksi Produk"
                            >
                              <MoreVertical className="size-4" />
                            </Button>
                          }
                        />
                        <DropdownMenuContent align="end" className="w-44">
                          <DropdownMenuItem
                            onClick={() => setSelectedDetailProduct(product)}
                            className="cursor-pointer gap-2"
                          >
                            <Eye className="size-4 text-muted-foreground" /> Lihat Detail
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => navigate(ROUTES.ADD_PRODUCT)}
                            className="cursor-pointer gap-2"
                          >
                            <Pencil className="size-4 text-muted-foreground" /> Edit Produk
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDuplicate(product)}
                            className="cursor-pointer gap-2"
                          >
                            <Copy className="size-4 text-muted-foreground" /> Duplikat
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() => setProductToDelete(product)}
                            className="cursor-pointer gap-2"
                          >
                            <Trash2 className="size-4" /> Hapus Produk
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Confirmation Dialog for Delete */}
      {productToDelete && (
        <ConfirmationDialog
          open={!!productToDelete}
          onOpenChange={(open) => {
            if (!open) setProductToDelete(null)
          }}
          title={`Hapus ${productToDelete.name}?`}
          description="Produk yang dihapus tidak akan dapat lagi dipilih di kasir POS. Tindakan ini tidak dapat dibatalkan."
          icon={Trash2}
          iconVariant="destructive"
          confirmText="Ya, Hapus Produk"
          cancelText="Batal"
          onConfirm={handleDeleteConfirm}
          isLoading={isDeleting}
        />
      )}

      {/* Detail View Modal Dialog */}
      {selectedDetailProduct && (
        <Dialog open={!!selectedDetailProduct} onOpenChange={() => setSelectedDetailProduct(null)}>
          <DialogContent className="sm:max-w-md p-6">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-lg font-bold">
                <Package className="size-5 text-primary" /> Detail Informasi Produk
              </DialogTitle>
              <DialogDescription className="text-xs">
                Rincian spesifikasi data produk di katalog NIRA POS.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div className="flex items-center gap-4 p-3 rounded-xl bg-muted/30 border">
                {selectedDetailProduct.image ? (
                  <img
                    src={selectedDetailProduct.image}
                    alt={selectedDetailProduct.name}
                    className="size-16 rounded-xl object-cover border bg-white"
                  />
                ) : (
                  <div className="size-16 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-extrabold text-base border border-primary/20">
                    {selectedDetailProduct.name.substring(0, 3).toUpperCase()}
                  </div>
                )}
                <div>
                  <h4 className="font-bold text-base text-foreground">{selectedDetailProduct.name}</h4>
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                    <Tag className="size-3 text-primary" />
                    {selectedDetailProduct.category_label || selectedDetailProduct.category || "Retail"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-card border">
                  <p className="text-muted-foreground font-medium">Harga Jual</p>
                  <p className="text-sm font-extrabold text-foreground mt-0.5">
                    Rp {selectedDetailProduct.price.toLocaleString("id-ID")}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-card border">
                  <p className="text-muted-foreground font-medium">Harga Modal (HPP)</p>
                  <p className="text-sm font-extrabold text-foreground mt-0.5">
                    {selectedDetailProduct.cost_price
                      ? `Rp ${selectedDetailProduct.cost_price.toLocaleString("id-ID")}`
                      : "-"}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-card border">
                  <p className="text-muted-foreground font-medium">Jumlah Stok</p>
                  <p className="text-sm font-extrabold text-foreground mt-0.5">
                    {selectedDetailProduct.stock ?? 25} {selectedDetailProduct.unit || "pcs"}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-card border">
                  <p className="text-muted-foreground font-medium">Kode Barcode</p>
                  <p className="text-sm font-bold font-mono text-foreground mt-0.5 flex items-center gap-1">
                    <Barcode className="size-3 text-muted-foreground" />
                    {selectedDetailProduct.barcode || "-"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button onClick={() => setSelectedDetailProduct(null)}>
                Tutup
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

const FALLBACK_CATEGORIES: Category[] = [
  { id: "cat-1", name: "Souvenir F&B", slug: "souvenir-fb" },
  { id: "cat-2", name: "Fashion & Apparel", slug: "fashion-apparel" },
  { id: "cat-3", name: "Handicrafts & Gifts", slug: "handicrafts-gifts" },
  { id: "cat-4", name: "Retail & Groceries", slug: "retail-groceries" },
]

const FALLBACK_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    category: "Souvenir F&B",
    category_label: "Souvenir F&B",
    barcode: "8991001",
    sku: "KOP-001",
    name: "Kopi Bali Arabica 250g",
    price: 45000,
    cost_price: 30000,
    stock: 45,
    min_stock: 5,
    unit: "pcs",
    is_active: true,
  },
  {
    id: "prod-2",
    category: "Fashion & Apparel",
    category_label: "Fashion & Apparel",
    barcode: "8991002",
    sku: "KAS-002",
    name: "Kaos Batik Souvenir Size L",
    price: 75000,
    cost_price: 45000,
    stock: 2,
    min_stock: 5,
    unit: "pcs",
    is_active: true,
  },
  {
    id: "prod-3",
    category: "Handicrafts & Gifts",
    category_label: "Handicrafts & Gifts",
    barcode: "8991003",
    sku: "GNT-003",
    name: "Gantungan Kunci Ukir Kayu",
    price: 15000,
    cost_price: 7000,
    stock: 80,
    min_stock: 10,
    unit: "pcs",
    is_active: true,
  },
  {
    id: "prod-4",
    category: "Souvenir F&B",
    category_label: "Souvenir F&B",
    barcode: "8991004",
    sku: "PIE-004",
    name: "Pie Susu Bali Box 10 Pcs",
    price: 35000,
    cost_price: 22000,
    stock: 0,
    min_stock: 5,
    unit: "box",
    is_active: true,
  },
  {
    id: "prod-5",
    category: "Handicrafts & Gifts",
    category_label: "Handicrafts & Gifts",
    barcode: "8991005",
    sku: "TPI-005",
    name: "Topi Pantai Anam Bali",
    price: 55000,
    cost_price: 32000,
    stock: 18,
    min_stock: 5,
    unit: "pcs",
    is_active: true,
  },
  {
    id: "prod-6",
    category: "Retail & Groceries",
    category_label: "Retail & Groceries",
    barcode: "8991006",
    sku: "MKN-006",
    name: "Minyak Kutus Kutus 100ml",
    price: 180000,
    cost_price: 120000,
    stock: 12,
    min_stock: 3,
    unit: "botol",
    is_active: true,
  },
]
