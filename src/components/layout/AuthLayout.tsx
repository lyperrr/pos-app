import { Outlet } from "react-router-dom"

export function AuthLayout() {
  return (
    <div className="min-h-screen w-full bg-background text-foreground antialiased selection:bg-primary selection:text-primary-foreground">
      <Outlet />
    </div>
  )
}
