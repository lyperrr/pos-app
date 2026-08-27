import * as React from "react"
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
  LogOut,
  Sparkles,
  Building2,
  Check,
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
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

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
  href: string
  isActive?: boolean
  badge?: string
  badgeAlert?: string
}

interface NavGroup {
  title: string
  items: NavItem[]
}

// Navigation groups & items aligned with PRD
const navGroups: NavGroup[] = [
  {
    title: "Utama",
    items: [
      { title: "Dashboard", icon: LayoutDashboard, href: "#dashboard", isActive: true },
      { title: "Kasir (POS)", icon: ShoppingCart, href: "#pos", badge: "Live" },
    ],
  },
  {
    title: "Katalog & Stok",
    items: [
      { title: "Daftar Produk", icon: Package, href: "#products" },
      { title: "Kategori & Varian", icon: Tag, href: "#categories" },
      { title: "Stok Outlet", icon: Boxes, href: "#stock", badgeAlert: "3 Low" },
    ],
  },
  {
    title: "Laporan & Transaksi",
    items: [
      { title: "Riwayat Transaksi", icon: Receipt, href: "#transactions" },
      { title: "Laporan Penjualan", icon: BarChart3, href: "#reports" },
    ],
  },
  {
    title: "Pengaturan & Akses",
    items: [
      { title: "Manajemen User", icon: Users, href: "#users" },
      { title: "Role & Hak Akses (RBAC)", icon: ShieldCheck, href: "#roles" },
      { title: "Pengaturan Outlet", icon: Store, href: "#settings" },
    ],
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [selectedOutlet, setSelectedOutlet] = React.useState<OutletItem>(outlets[0])
  const [activeItem, setActiveItem] = React.useState("Dashboard")

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
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold shadow-xs">
                  <Sparkles className="size-4" />
                </div>
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
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Sidebar Content: Navigation */}
      <SidebarContent>
        {navGroups.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1.5">
                {group.items.map((item) => {
                  const isActive = activeItem === item.title
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        tooltip={item.title}
                        isActive={isActive}
                        onClick={() => setActiveItem(item.title)}
                      >
                        <item.icon className="size-4" />
                        <span>{item.title}</span>
                        {item.badge && (
                          <Badge
                            className={cn(
                              "ml-auto text-[10px] px-1.5 py-0 font-semibold border-0",
                              isActive
                                ? "bg-sidebar-primary-foreground text-sidebar-primary"
                                : "bg-primary text-primary-foreground"
                            )}
                          >
                            {item.badge}
                          </Badge>
                        )}
                        {item.badgeAlert && (
                          <Badge
                            variant="destructive"
                            className="ml-auto text-[10px] px-1.5 py-0 font-semibold"
                          >
                            {item.badgeAlert}
                          </Badge>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* Sidebar Footer: User Profile */}
      <SidebarFooter>
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
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src="" alt="Owner User" />
                  <AvatarFallback className="rounded-lg bg-primary/10 text-primary font-semibold text-xs">
                    WP
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Willy Permana</span>
                  <span className="truncate text-xs text-muted-foreground flex items-center gap-1">
                    <Badge variant="outline" className="text-[10px] py-0 px-1 font-normal">
                      Owner
                    </Badge>
                  </span>
                </div>
                <ChevronsUpDown className="ml-auto size-4 opacity-50" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarFallback className="rounded-lg bg-primary/10 text-primary font-semibold text-xs">
                        WP
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">Willy Permana</span>
                      <span className="truncate text-xs text-muted-foreground">owner@nirapos.id</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2 cursor-pointer text-destructive focus:text-destructive">
                  <LogOut className="size-4" />
                  Keluar / Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
