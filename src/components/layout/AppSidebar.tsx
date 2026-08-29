import * as React from "react"
import { NavLink, useLocation, useNavigate } from "react-router-dom"
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Tag,
  Boxes,
  Receipt,
  BarChart3,
  Users,
  ShieldCheck,
  Store,
  ChevronsUpDown,
  Building2,
  Check,
  LogOut,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"
import { ROUTES } from "@/constants/routes"
import { useAuth } from "@/context/AuthContext"

interface OutletItem {
  id: string
  name: string
  role: string
  active: boolean
}

const outlets: OutletItem[] = [
  { id: "1", name: "Outlet Utama - Nusa Dua", role: "Main Branch", active: true },
  { id: "2", name: "Outlet Jimbaran", role: "Branch 2", active: false },
]

interface NavItem {
  title: string
  icon: React.ComponentType<{ className?: string }>
  url: string
  requiredPermission?: string
  badgeAlert?: string
}

interface NavGroup {
  label: string
  items: NavItem[]
}

const navGroups: NavGroup[] = [
  {
    label: "Main",
    items: [
      {
        title: "Dashboard",
        icon: LayoutDashboard,
        url: ROUTES.DASHBOARD,
      },
      {
        title: "POS / Kasir",
        icon: ShoppingCart,
        url: ROUTES.POS,
        badgeAlert: "POS",
      },
    ],
  },
  {
    label: "Katalog & Inventaris",
    items: [
      {
        title: "Daftar Produk",
        icon: Package,
        url: ROUTES.PRODUCTS,
        requiredPermission: "product.view",
      },
      {
        title: "Kategori & Varian",
        icon: Tag,
        url: ROUTES.CATEGORIES,
        requiredPermission: "category.view",
      },
      {
        title: "Stok Management",
        icon: Boxes,
        url: ROUTES.STOCK,
        requiredPermission: "stock.view",
      },
    ],
  },
  {
    label: "Penjualan & Laporan",
    items: [
      {
        title: "Riwayat Transaksi",
        icon: Receipt,
        url: ROUTES.TRANSACTIONS,
        requiredPermission: "transaction.view",
      },
      {
        title: "Laporan Penjualan",
        icon: BarChart3,
        url: ROUTES.REPORTS,
        requiredPermission: "report.view",
      },
    ],
  },
  {
    label: "Manajemen & Izin",
    items: [
      {
        title: "User Management",
        icon: Users,
        url: ROUTES.USERS,
        requiredPermission: "user.manage",
      },
      {
        title: "Role & Permission",
        icon: ShieldCheck,
        url: ROUTES.ROLES,
        requiredPermission: "role.manage",
      },
      {
        title: "Pengaturan Outlet",
        icon: Store,
        url: ROUTES.SETTINGS,
        requiredPermission: "setting.manage",
      },
    ],
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [selectedOutlet, setSelectedOutlet] = React.useState<OutletItem>(outlets[0])
  const [showLogoutConfirm, setShowLogoutConfirm] = React.useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout, hasPermission } = useAuth()

  const handleLogout = async () => {
    await logout()
    setShowLogoutConfirm(false)
    navigate(ROUTES.LOGIN)
  }

  const userDisplayName = user?.full_name || "Willy Permana"
  const userEmail = user?.email || "owner@nirapos.id"
  const userInitials = userDisplayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase()

  return (
    <Sidebar collapsible="icon" {...props}>
      {/* Sidebar Header: Brand & Outlet Switcher */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  />
                }
              >
                <img src="/logo_nira.png" alt="NIRA POS" className="size-8 object-contain rounded-lg" />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold text-foreground">NIRA POS</span>
                  <span className="truncate text-xs text-muted-foreground">{selectedOutlet.name}</span>
                </div>
                <ChevronsUpDown className="ml-auto size-4 opacity-50" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                align="start"
                side="bottom"
                sideOffset={4}
              >
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="text-xs text-muted-foreground">
                    Pilih Outlet / Cabang
                  </DropdownMenuLabel>
                  {outlets.map((outlet) => (
                    <DropdownMenuItem
                      key={outlet.id}
                      onClick={() => setSelectedOutlet(outlet)}
                      className="flex items-center justify-between gap-2 p-2"
                    >
                      <div className="flex items-center gap-2">
                        <Building2 className="size-4 text-muted-foreground" />
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">{outlet.name}</span>
                          <span className="text-xs text-muted-foreground">{outlet.role}</span>
                        </div>
                      </div>
                      {selectedOutlet.id === outlet.id && (
                        <Check className="size-4 text-primary" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Sidebar Content: Navigation Groups */}
      <SidebarContent>
        {navGroups.map((group) => {
          const visibleItems = group.items.filter((item) => {
            if (!item.requiredPermission) return true
            return hasPermission(item.requiredPermission)
          })

          if (visibleItems.length === 0) return null

          return (
            <SidebarGroup key={group.label}>
              <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {visibleItems.map((item) => {
                    const isActive = location.pathname === item.url
                    const IconComponent = item.icon

                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          render={<NavLink to={item.url} />}
                          isActive={isActive}
                          tooltip={item.title}
                        >
                          <IconComponent />
                          <span>{item.title}</span>
                          {item.badgeAlert && (
                            <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-primary text-primary-foreground">
                              {item.badgeAlert}
                            </span>
                          )}
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )
        })}
      </SidebarContent>

      {/* Sidebar Footer: User Profile Info & Red Logout Button */}
      <SidebarFooter className="p-3 border-t">
        <div className="flex items-center gap-3 px-1 py-1 mb-2">
          <Avatar className="h-9 w-9 rounded-full shrink-0">
            <AvatarImage src="" alt={userDisplayName} />
            <AvatarFallback className="rounded-full bg-primary text-primary-foreground font-extrabold text-xs">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight overflow-hidden">
            <span className="truncate font-bold text-foreground text-sm">{userDisplayName}</span>
            <span className="truncate text-xs text-muted-foreground">{userEmail}</span>
          </div>
        </div>
        <Button
          onClick={() => setShowLogoutConfirm(true)}
          variant="destructive"
          className="w-full gap-2 font-bold cursor-pointer"
        >
          <span>Keluar</span>
          <LogOut className="size-4" />
        </Button>
      </SidebarFooter>

      {/* Dynamic Confirmation Dialog for Logout */}
      <ConfirmationDialog
        open={showLogoutConfirm}
        onOpenChange={setShowLogoutConfirm}
        title="Konfirmasi Keluar / Logout"
        description="Apakah Anda yakin ingin keluar dari sistem NIRA POS? Sesi kasir Anda akan diakhiri."
        icon={LogOut}
        iconVariant="destructive"
        confirmText="Ya, Keluar"
        cancelText="Batal"
        confirmIcon={LogOut}
        confirmVariant="destructive"
        onConfirm={handleLogout}
      />

      <SidebarRail />
    </Sidebar>
  )
}
