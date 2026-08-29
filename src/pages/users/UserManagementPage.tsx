import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, UserPlus } from "lucide-react"

export default function UserManagementPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Staff Account Management</h1>
          <p className="text-sm text-muted-foreground">Manage outlet staff, cashiers, and assigned RBAC roles.</p>
        </div>
        <Button className="gap-2">
          <UserPlus className="size-4" /> Add Staff Account
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="size-4 text-primary" /> Active User Accounts
          </CardTitle>
          <CardDescription>
            Requires `user.manage` permission (FR-1.2).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            {[
              { name: "Willy Permana", email: "owner@nirapos.id", role: "Owner", branch: "All Branches" },
              { name: "Siti Rahma", email: "siti@nirapos.id", role: "Manager", branch: "Nusa Dua" },
              { name: "Budi Santoso", email: "budi@nirapos.id", role: "Cashier", branch: "Nusa Dua" },
            ].map((usr, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm">{usr.name}</p>
                  <p className="text-xs text-muted-foreground">{usr.email} &bull; {usr.branch}</p>
                </div>
                <Badge variant={usr.role === "Owner" ? "default" : "secondary"}>
                  {usr.role}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
