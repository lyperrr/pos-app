import { useNavigate } from "react-router-dom"
import { Bell, Store, ShieldCheck, UserCheck, ShoppingCart, LogOut, ChevronsUpDown, User } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useAuth, type DevRole } from "@/context/AuthContext"
import { ROUTES } from "@/constants/routes"

interface AppHeaderProps {
  currentTitle?: string
}

export function AppHeader({ currentTitle = "Dashboard Laporan" }: AppHeaderProps) {
  const { user, logout, loginAsMockRole, isApiConnected } = useAuth()
  const navigate = useNavigate()

  const currentRole = (user?.role?.name as DevRole) || "Owner"
  const userDisplayName = user?.full_name || "Willy Permana"
  const userInitials = userDisplayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase()

  const handleLogout = async () => {
    await logout()
    navigate(ROUTES.LOGIN)
  }

  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 transition-all ease-linear">
      {/* Left section: Sidebar trigger & Breadcrumb */}
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="#">NIRA POS</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-semibold text-foreground">
                {currentTitle}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Right section: API Status, Developer Role Switcher, Active Outlet & Avatar */}
      <div className="flex items-center gap-2.5">
        {/* Backend API Connection Status Badge */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border bg-background shadow-2xs">
          <span
            className={`size-2 rounded-full ${
              isApiConnected ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
            }`}
          />
          <span className="text-muted-foreground">
            {isApiConnected ? "API Sanctum Connected" : "Dev Mock Mode"}
          </span>
        </div>

        {/* Developer Role Switcher Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex items-center h-8 gap-1.5 px-2.5 rounded-lg border border-primary/40 bg-background text-xs font-semibold hover:bg-muted cursor-pointer transition-colors outline-none">
            <ShieldCheck className="size-3.5 text-primary" />
            <span className="hidden sm:inline">Role Dev:</span>
            <Badge className="px-1.5 py-0 text-[10px]">{currentRole}</Badge>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Switch Dev Role (RBAC Test)
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => loginAsMockRole("Owner")}
                className="flex items-center justify-between cursor-pointer"
              >
                <span className="flex items-center gap-2 text-xs font-semibold">
                  <ShieldCheck className="size-4 text-primary" /> Owner
                </span>
                <span className="text-[10px] text-muted-foreground">Full Access</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => loginAsMockRole("Manager")}
                className="flex items-center justify-between cursor-pointer"
              >
                <span className="flex items-center gap-2 text-xs font-semibold">
                  <UserCheck className="size-4 text-indigo-500" /> Manager
                </span>
                <span className="text-[10px] text-muted-foreground">Catalog & Stock</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => loginAsMockRole("Cashier")}
                className="flex items-center justify-between cursor-pointer"
              >
                <span className="flex items-center gap-2 text-xs font-semibold">
                  <ShoppingCart className="size-4 text-emerald-500" /> Cashier
                </span>
                <span className="text-[10px] text-muted-foreground">POS & Sales</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Active Outlet Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold shadow-xs">
          <Store className="size-3.5" />
          <span>Outlet Utama - Nusa Dua</span>
        </div>

        {/* Notification Alert Badge */}
        <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-lg" aria-label="Notifikasi">
          <Bell className="size-4 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive"></span>
          </span>
        </Button>

        {/* User Profile Avatar Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex items-center h-9 px-2 gap-2 rounded-lg hover:bg-accent cursor-pointer transition-colors outline-none">
            <Avatar className="h-7 w-7 rounded-lg">
              <AvatarFallback className="rounded-lg bg-primary/10 text-primary font-bold text-xs">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:flex flex-col items-start text-left">
              <span className="text-xs font-semibold leading-none">{userDisplayName}</span>
              <span className="text-[10px] text-muted-foreground mt-0.5">{currentRole}</span>
            </div>
            <ChevronsUpDown className="size-3.5 opacity-50 hidden md:block" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-lg">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-2 font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-xs font-semibold">{userDisplayName}</p>
                  <p className="text-[11px] text-muted-foreground">{user?.email}</p>
                  <Badge variant="outline" className="w-fit text-[10px] mt-1">{currentRole}</Badge>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => navigate(ROUTES.PROFILE)}
              className="gap-2 cursor-pointer text-xs font-medium"
            >
              <User className="size-4 text-muted-foreground" />
              Pengaturan Akun / Profil
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="gap-2 cursor-pointer text-destructive focus:text-destructive text-xs font-medium"
            >
              <LogOut className="size-4 text-destructive" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
