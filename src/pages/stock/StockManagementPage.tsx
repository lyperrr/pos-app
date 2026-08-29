import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Boxes, AlertTriangle } from "lucide-react"

export default function StockManagementPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Outlet Stock Inventory</h1>
        <p className="text-sm text-muted-foreground">Track inventory levels per branch and view low stock alerts.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-amber-500/20 bg-amber-500/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <AlertTriangle className="size-4 text-amber-500" />
              Low Stock Warnings
            </CardTitle>
            <Badge variant="destructive">3 Items Low</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Products below `min_stock_alert` threshold require stock replenishment.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-semibold">Current Branch Stock</CardTitle>
            <Boxes className="size-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,240 Pcs</div>
            <p className="text-xs text-muted-foreground">Outlet Utama - Nusa Dua</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Stock Audit & Transfer Log</CardTitle>
          <CardDescription>
            Stock updates decrease automatically on completed cashier checkout (FR-2.2).
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  )
}
