import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Store, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function OutletSettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Outlet & Business Settings</h1>
        <p className="text-sm text-muted-foreground">Configure tenant profile, branch details, and receipt printing options.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Store className="size-4 text-primary" /> Active Branch Information
          </CardTitle>
          <CardDescription>Update outlet name, address, and contact details for printed receipts.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Outlet Name</Label>
            <Input defaultValue="Outlet Utama - Nusa Dua" />
          </div>
          <div className="space-y-2">
            <Label>Address</Label>
            <Input defaultValue="Jl. Bypass Ngurah Rai No. 88, Nusa Dua, Bali" />
          </div>
          <div className="space-y-2">
            <Label>Contact Phone</Label>
            <Input defaultValue="+62 812 3456 7890" />
          </div>
          <Button className="gap-2 mt-2">
            <Save className="size-4" /> Save Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
