import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { cn } from "@/lib/utils"
import { Loader2, X } from "lucide-react"

export type IconVariant = "destructive" | "warning" | "primary" | "info"

export interface ConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  icon?: React.ComponentType<{ className?: string }>
  iconVariant?: IconVariant
  confirmText?: string
  cancelText?: string
  confirmIcon?: React.ComponentType<{ className?: string }>
  confirmVariant?: "destructive" | "default" | "outline" | "secondary"
  onConfirm: () => void | Promise<void>
  isLoading?: boolean
}

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = React.useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(min-width: 640px)").matches
    }
    return false
  })

  React.useEffect(() => {
    const media = window.matchMedia("(min-width: 640px)")
    const onChange = () => setIsDesktop(media.matches)
    media.addEventListener("change", onChange)
    return () => media.removeEventListener("change", onChange)
  }, [])

  return isDesktop
}

const iconVariantStyles: Record<
  IconVariant,
  { bg: string; text: string; buttonBg: string; buttonText: string; buttonBorder: string }
> = {
  destructive: {
    bg: "bg-red-100/90 dark:bg-red-950/40",
    text: "text-red-500 dark:text-red-400",
    buttonBg: "bg-red-100/90 hover:bg-red-200 dark:bg-red-950/60 dark:hover:bg-red-900/80",
    buttonText: "text-red-600 dark:text-red-400 font-extrabold",
    buttonBorder: "border border-red-200/80 dark:border-red-900/50",
  },
  warning: {
    bg: "bg-amber-100/90 dark:bg-amber-950/40",
    text: "text-amber-600 dark:text-amber-400",
    buttonBg: "bg-amber-100/90 hover:bg-amber-200 dark:bg-amber-950/60 dark:hover:bg-amber-900/80",
    buttonText: "text-amber-700 dark:text-amber-400 font-extrabold",
    buttonBorder: "border border-amber-200/80 dark:border-amber-900/50",
  },
  primary: {
    bg: "bg-primary/10 dark:bg-primary/20",
    text: "text-primary",
    buttonBg: "bg-primary hover:bg-primary/90",
    buttonText: "text-primary-foreground font-extrabold",
    buttonBorder: "border border-primary/20",
  },
  info: {
    bg: "bg-blue-100/90 dark:bg-blue-950/40",
    text: "text-blue-600 dark:text-blue-400",
    buttonBg: "bg-blue-100/90 hover:bg-blue-200 dark:bg-blue-950/60 dark:hover:bg-blue-900/80",
    buttonText: "text-blue-700 dark:text-blue-400 font-extrabold",
    buttonBorder: "border border-blue-200/80 dark:border-blue-900/50",
  },
}

export function ConfirmationDialog({
  open,
  onOpenChange,
  title,
  description,
  icon: HeaderIcon,
  iconVariant = "destructive",
  confirmText = "Ya, Lanjutkan",
  cancelText = "Batal",
  confirmIcon: ConfirmIcon,
  confirmVariant = "destructive",
  onConfirm,
  isLoading = false,
}: ConfirmationDialogProps) {
  const isDesktop = useIsDesktop()
  const variantStyle = iconVariantStyles[iconVariant]

  const handleConfirm = async () => {
    await onConfirm()
  }

  const ContentBody = (
    <div className="flex flex-col items-center text-center space-y-4 py-1">
      {/* Top Centered Soft Circle Icon Badge */}
      {HeaderIcon && (
        <div
          className={cn(
            "size-16 rounded-full flex items-center justify-center transition-all shadow-2xs",
            variantStyle.bg,
            variantStyle.text
          )}
        >
          <HeaderIcon className="size-8 stroke-2" />
        </div>
      )}

      {/* Title & Description */}
      <div className="space-y-2 max-w-xs mx-auto">
        <h3 className="text-xl font-extrabold text-foreground tracking-tight leading-tight">{title}</h3>
        {description && (
          <p className="text-xs text-muted-foreground leading-relaxed font-medium">
            {description}
          </p>
        )}
      </div>
    </div>
  )

  const ActionButtons = (
    <div className="grid grid-cols-2 gap-3 w-full pt-2">
      <Button
        type="button"
        variant="outline"
        size="lg"
        onClick={() => onOpenChange(false)}
        disabled={isLoading}
      >
        <X className="size-4 text-muted-foreground" />
        {cancelText}
      </Button>
      <Button
        type="button"
        onClick={handleConfirm}
        disabled={isLoading}
        size="lg"
        className={cn(
          confirmVariant === "destructive"
            ? `${variantStyle.buttonBg} ${variantStyle.buttonText} ${variantStyle.buttonBorder}`
            : ""
        )}
      >
        {isLoading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          ConfirmIcon && <ConfirmIcon className="size-4" />
        )}
        {confirmText}
      </Button>
    </div>
  )

  // DESKTOP VIEW: Centered Modal Dialog
  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md p-6 sm:p-8 gap-6 border border-border shadow-2xl bg-popover">
          <DialogHeader className="p-0">
            <DialogTitle className="sr-only">{title}</DialogTitle>
            <DialogDescription className="sr-only">{description}</DialogDescription>
          </DialogHeader>

          {ContentBody}

          <DialogFooter className="p-0 sm:justify-stretch bg-background">
            {ActionButtons}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  // MOBILE VIEW: Bottom Sheet Drawer (Slides up from bottom matching reference image)
  return (
    <Drawer open={open} onOpenChange={onOpenChange} showSwipeHandle>
      <DrawerContent className="rounded-t-4xl! p-6 pb-8 gap-6 border-t border-border bg-popover max-h-[85vh]">
        <DrawerHeader className="p-0">
          <DrawerTitle className="sr-only">{title}</DrawerTitle>
          <DrawerDescription className="sr-only">{description}</DrawerDescription>
        </DrawerHeader>

        {ContentBody}

        <DrawerFooter className="p-0">
          {ActionButtons}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
