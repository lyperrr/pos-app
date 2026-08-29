import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, KeyRound, Save, Shield } from "lucide-react"
import { useAuth } from "@/context/AuthContext"

export default function ProfilePage() {
  const { user } = useAuth()

  const userDisplayName = user?.full_name || "Willy Permana"
  const userEmail = user?.email || "owner@nirapos.id"
  const userRole = user?.role?.name || "Owner"

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Account & Profile Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your personal account credentials, email, and password.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card Summary */}
        <Card className="md:col-span-1">
          <CardHeader className="text-center pb-2">
            <div className="size-16 rounded-full bg-primary/10 text-primary font-bold text-xl flex items-center justify-center mx-auto mb-2">
              {userDisplayName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .substring(0, 2)
                .toUpperCase()}
            </div>
            <CardTitle className="text-base font-semibold">{userDisplayName}</CardTitle>
            <CardDescription className="text-xs">{userEmail}</CardDescription>
          </CardHeader>
          <CardContent className="text-center pt-2 border-t mt-2">
            <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground pt-2">
              <Shield className="size-3.5 text-primary" /> Role:
              <Badge variant="outline" className="text-[10px]">{userRole}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Profile Form Details */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <User className="size-4 text-primary" /> Personal Information
            </CardTitle>
            <CardDescription>Update your display name and contact details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input defaultValue={userDisplayName} />
            </div>
            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input defaultValue={userEmail} type="email" />
            </div>

            <Separator className="my-4" />

            <div className="space-y-2">
              <Label className="flex items-center gap-1.5">
                <KeyRound className="size-4 text-primary" /> Change Password
              </Label>
              <Input placeholder="Current password" type="password" />
              <Input placeholder="New password" type="password" />
            </div>

            <Button className="gap-2 mt-2">
              <Save className="size-4" /> Save Profile Changes
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
