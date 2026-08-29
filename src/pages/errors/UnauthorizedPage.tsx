import { Link } from "react-router-dom"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShieldAlert } from "lucide-react"
import { ROUTES } from "@/constants/routes"

export default function UnauthorizedPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center border-destructive/30 bg-destructive/5">
        <CardHeader className="flex flex-col items-center">
          <div className="size-16 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-2">
            <ShieldAlert className="size-8" />
          </div>
          <CardTitle className="text-2xl font-bold text-destructive">403 - Access Forbidden</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Your user role does not have the required RBAC permissions to access this page. Please contact your tenant owner if you need elevated access.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button render={<Link to={ROUTES.DASHBOARD} />}>
            Return to Dashboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
