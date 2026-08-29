import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShieldCheck, Plus, Check } from "lucide-react"

export default function RoleManagementPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Roles & Permissions (Dynamic RBAC)</h1>
          <p className="text-sm text-muted-foreground">Configure custom roles and toggle fine-grained permission codes.</p>
        </div>
        <Button className="gap-2">
          <Plus className="size-4" /> Create Custom Role
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { name: "Owner", type: "System Default", permissions: "Full Control (Bypass)", users: 1 },
          { name: "Manager", type: "System Default", permissions: "product.*, stock.*, report.view", users: 2 },
          { name: "Cashier", type: "System Default", permissions: "pos.access, transaction.create", users: 5 },
        ].map((role, idx) => (
          <Card key={idx}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-base font-semibold">{role.name}</CardTitle>
              <ShieldCheck className="size-4 text-primary" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Badge variant="outline" className="text-[10px]">{role.type}</Badge>
              <p className="text-xs text-muted-foreground font-mono mt-1">{role.permissions}</p>
              <p className="text-xs font-semibold pt-2 text-foreground">{role.users} Active Users Assigned</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Check className="size-4 text-primary" /> Permission Matrix Draft
          </CardTitle>
          <CardDescription>
            Tenant owners can check/uncheck granular permissions (FR-1.3, FR-1.4, User Flow 7.2).
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  )
}
