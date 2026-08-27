import * as React from "react"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/AppSidebar"
import { AppHeader } from "@/components/layout/AppHeader"
import { AppFooter } from "@/components/layout/AppFooter"

interface AppLayoutProps {
  children?: React.ReactNode
  currentTitle?: string
}

export function AppLayout({ children, currentTitle }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex flex-col min-h-screen">
        <AppHeader currentTitle={currentTitle} />
        <main className="flex-1 p-4 md:p-6 overflow-y-auto bg-muted/20">
          {children}
        </main>
        <AppFooter />
      </SidebarInset>
    </SidebarProvider>
  )
}
