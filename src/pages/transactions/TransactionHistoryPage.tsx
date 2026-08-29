import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Receipt, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function TransactionHistoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Transaction History & Receipts</h1>
        <p className="text-sm text-muted-foreground">View completed transactions, cashier receipts, and void order logs.</p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3 bg-background p-4 rounded-xl border">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input placeholder="Search invoice reference, cashier name, or payment status..." className="pl-9" />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Receipt className="size-4 text-primary" />
            Recent Sales Transactions
          </CardTitle>
          <CardDescription>
            Requires `transaction.view` permission. Void action requires `transaction.void` with reasoning.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            {[
              { id: "TRX-20260828-001", time: "10:42 AM", cashier: "Staff Kasir 1", total: "Rp 75,000", status: "Completed" },
              { id: "TRX-20260828-002", time: "11:15 AM", cashier: "Willy Permana", total: "Rp 150,000", status: "Completed" },
              { id: "TRX-20260828-003", time: "11:30 AM", cashier: "Staff Kasir 1", total: "Rp 45,000", status: "Voided" },
            ].map((trx) => (
              <div key={trx.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm">{trx.id}</p>
                  <p className="text-xs text-muted-foreground">
                    {trx.time} &bull; Cashier: {trx.cashier}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-sm">{trx.total}</span>
                  <Badge variant={trx.status === "Voided" ? "destructive" : "secondary"}>
                    {trx.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
