import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, TrendingUp } from "lucide-react"

export default function SalesReportPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Sales & Revenue Reports</h1>
        <p className="text-sm text-muted-foreground">Daily sales performance summary and top-selling product statistics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <TrendingUp className="size-4 text-emerald-500" />
              Today's Gross Sales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">Rp 2,450,000</div>
            <p className="text-xs text-muted-foreground mt-1">+14.2% increase vs yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <BarChart3 className="size-4 text-primary" />
              Total Transactions Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">38 Orders</div>
            <p className="text-xs text-muted-foreground mt-1">Average order value: Rp 64,473</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-base">Top Selling Products Chart</CardTitle>
          <CardDescription>
            Requires `report.view` permission. Analytics charts will render here.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  )
}
