import { useAuth, type DevRole } from "@/context/AuthContext"
import { OwnerDashboard } from "./components/OwnerDashboard"
import { ManagerDashboard } from "./components/ManagerDashboard"
import { CashierDashboard } from "./components/CashierDashboard"

export default function DashboardPage() {
  const { user } = useAuth()
  const currentRole = (user?.role?.name as DevRole) || "Owner"

  switch (currentRole) {
    case "Owner":
      return <OwnerDashboard />
    case "Manager":
      return <ManagerDashboard />
    case "Cashier":
      return <CashierDashboard />
    default:
      return <OwnerDashboard />
  }
}
