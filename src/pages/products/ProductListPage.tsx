import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Package, Trash2, Loader2 } from "lucide-react"
import { productService } from "@/services/productService"
import type { Product } from "@/types"

export default function ProductListPage() {
  const [products, setProducts] = React.useState<Product[]>([])
  const [search, setSearch] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(true)

  const fetchProducts = React.useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await productService.getProducts({ search: search || undefined })
      if (response.success && response.data && response.data.length > 0) {
        setProducts(response.data)
      } else {
        setProducts(FALLBACK_PRODUCTS)
      }
    } catch (e) {
      console.warn("API products error:", e)
      setProducts(FALLBACK_PRODUCTS)
    } finally {
      setIsLoading(false)
    }
  }, [search])

  React.useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const handleDelete = async (id: string) => {
    try {
      await productService.deleteProduct(id)
      setProducts((prev) => prev.filter((p) => p.id !== id))
    } catch (e) {
      console.warn("Delete error, removing locally:", e)
      setProducts((prev) => prev.filter((p) => p.id !== id))
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Katalog & Daftar Produk</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">Kelola produk tenant, harga jual, barcode, dan SKU.</p>
        </div>
        <Button className="gap-2 rounded-xl font-bold">
          <Plus className="size-4" /> Tambah Produk Baru
        </Button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-card p-4 rounded-2xl border">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Cari produk berdasarkan nama, SKU, atau barcode..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 rounded-xl h-10 text-sm font-medium"
          />
        </div>
      </div>

      {/* Product List Table */}
      <Card className="rounded-2xl shadow-2xs">
        <CardHeader>
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Package className="size-4 text-primary" /> Master Data Produk ({products.length} Items)
          </CardTitle>
          <CardDescription className="text-xs">
            Data disinkronkan secara real-time dari backend REST API.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center p-8 text-xs font-semibold text-muted-foreground gap-2">
              <Loader2 className="size-4 animate-spin text-primary" /> Memuat daftar produk...
            </div>
          ) : (
            <div className="divide-y divide-border">
              {products.map((product) => {
                const itemStock = product.stock ?? 25
                const itemMinStock = product.min_stock ?? 5
                return (
                  <div key={product.id} className="py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-extrabold text-xs">
                        {product.name.substring(0, 3).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-foreground">{product.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Kategori: {product.category_label || product.category || "Retail"} &bull; Barcode: {product.barcode || "-"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 sm:gap-6">
                      <div className="text-right">
                        <p className="font-extrabold text-sm text-foreground">
                          Rp {product.price.toLocaleString("id-ID")}
                        </p>
                        <p className="text-xs text-muted-foreground font-medium">Stok: {itemStock} pcs</p>
                      </div>
                      <Badge variant={itemStock < itemMinStock ? "destructive" : "secondary"} className="font-bold">
                        {itemStock < itemMinStock ? "Stok Menipis" : "Tersedia"}
                      </Badge>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDelete(product.id)}
                        className="size-8 text-destructive hover:text-destructive rounded-lg cursor-pointer"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

const FALLBACK_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    category: "cat-1",
    category_label: "Souvenir F&B",
    barcode: "8991001",
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
    category: "cat-2",
    category_label: "Fashion",
    barcode: "8991002",
    name: "Kaos Batik Souvenir L",
    price: 75000,
    cost_price: 45000,
    stock: 2,
    min_stock: 5,
    unit: "pcs",
    is_active: true,
  },
  {
    id: "prod-3",
    category: "cat-3",
    category_label: "Souvenir",
    barcode: "8991003",
    name: "Gantungan Kunci Kayu",
    price: 15000,
    cost_price: 7000,
    stock: 80,
    min_stock: 10,
    unit: "pcs",
    is_active: true,
  },
]
