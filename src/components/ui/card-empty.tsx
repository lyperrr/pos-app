import * as React from "react"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyMedia,
} from "@/components/ui/empty"

export interface CardEmptyProps {
  icon: React.ReactNode
  title: string
  description: string
  action?: React.ReactNode
  className?: string
}

export function CardEmpty({
  icon,
  title,
  description,
  action,
  className,
}: CardEmptyProps) {
  return (
    <Card className={cn("border-2 border-dashed border-border/80 ring-0 shadow-none p-8", className)}>
      <Empty>
        <EmptyHeader>
          <EmptyMedia>{icon}</EmptyMedia>
          <EmptyTitle>{title}</EmptyTitle>
          <EmptyDescription>{description}</EmptyDescription>
        </EmptyHeader>
        {action && <div className="mt-2">{action}</div>}
      </Empty>
    </Card>
  )
}
