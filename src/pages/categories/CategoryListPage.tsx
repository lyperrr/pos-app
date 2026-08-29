import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Tag } from "lucide-react"

export default function CategoryListPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Categories & Variants</h1>
          <p className="text-sm text-muted-foreground">Manage product categories, attributes, and variant types.</p>
        </div>
        <Button className="gap-2">
          <Plus className="size-4" /> Add Category
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { name: "Souvenir F&B", itemsCount: 24, variants: "Single, Pack" },
          { name: "Fashion & Clothes", itemsCount: 42, variants: "Size (S, M, L, XL), Color" },
          { name: "Handicrafts & Gifts", itemsCount: 18, variants: "Default" },
        ].map((cat, idx) => (
          <Card key={idx}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-semibold">{cat.name}</CardTitle>
              <Tag className="size-4 text-primary" />
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-2xl font-bold">{cat.itemsCount} Products</div>
              <p className="text-xs text-muted-foreground">Variants: {cat.variants}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-base">Category Management Draft</CardTitle>
          <CardDescription>
            CRUD interfaces for categories and variant options will be rendered here.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  )
}
