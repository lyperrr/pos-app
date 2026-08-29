import { Skeleton } from "@/components/ui/skeleton"
import { PageSkeleton } from "./PageSkeleton"

export function AppLayoutSkeleton() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Sidebar Skeleton */}
      <aside className="w-64 border-r bg-sidebar p-4 hidden md:flex flex-col space-y-6">
        {/* Brand Header */}
        <div className="flex items-center gap-3 p-2">
          <Skeleton className="size-8 rounded-lg" />
          <div className="space-y-1 flex-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>

        {/* Navigation Group Skeletons */}
        <div className="space-y-4 flex-1">
          {Array.from({ length: 4 }).map((_, groupIdx) => (
            <div key={groupIdx} className="space-y-2">
              <Skeleton className="h-3 w-20" />
              <div className="space-y-1">
                <Skeleton className="h-9 w-full rounded-md" />
                <Skeleton className="h-9 w-full rounded-md" />
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Footer User Profile */}
        <div className="flex items-center gap-3 border-t pt-4">
          <Skeleton className="size-8 rounded-lg" />
          <div className="space-y-1 flex-1">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      </aside>

      {/* Main Content Body */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navigation Header Skeleton */}
        <header className="h-16 border-b px-6 flex items-center justify-between bg-background">
          <div className="flex items-center gap-3">
            <Skeleton className="size-8 rounded-md md:hidden" />
            <Skeleton className="h-5 w-40" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="size-8 rounded-full" />
            <Skeleton className="size-8 rounded-full" />
          </div>
        </header>

        {/* Content Body Area */}
        <main className="flex-1 p-6 overflow-y-auto bg-muted/20">
          <PageSkeleton />
        </main>
      </div>
    </div>
  )
}
