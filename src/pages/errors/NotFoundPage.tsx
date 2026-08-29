import { Link } from "react-router-dom"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileQuestion } from "lucide-react"
import { ROUTES } from "@/constants/routes"

export default function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="flex flex-col items-center">
          <div className="size-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-2">
            <FileQuestion className="size-8" />
          </div>
          <CardTitle className="text-2xl font-bold">404 - Page Not Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            The page or route you are looking for does not exist or has been moved.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button render={<Link to={ROUTES.DASHBOARD} />}>
            Back to Dashboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
