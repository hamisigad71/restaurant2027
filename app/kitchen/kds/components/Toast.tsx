"use client"
import { toast as sonnerToast } from "sonner"
export const toast = {
  success: (title: string, msg?: string) => sonnerToast.success(title, { description: msg }),
  info:    (title: string, msg?: string) => sonnerToast.info(title, { description: msg }),
  error:   (title: string, msg?: string) => sonnerToast.error(title, { description: msg }),
  order:   (title: string, msg?: string) => sonnerToast(title, { description: msg, icon: "🔥", duration: 6000 }),
}
