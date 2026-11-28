"use client"

import { useEffect } from "react"
import { toast } from "sonner"
import { useAuth } from "@/lib/auth-context"
import { SummonService } from "@/lib/restaurant-store"
import { supabase } from "@/lib/supabase"

/** Listens for Supabase real-time summons across all authenticated portals. */
export function SummonsListener() {
  const { user } = useAuth()

  useEffect(() => {
    if (!user || user.role === "customer") return

    const channelName = `summons-global-${user.role}-${Date.now()}`
    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "summons" },
        (payload) => {
          const rawName = String(payload.new?.staff_name || "Staff Member").trim()
          const staffId = Number(payload.new?.staff_id ?? 0)
          const isZeroId = String(payload.new?.staff_id) === "0"
          const isTableIdentifier = /table/i.test(rawName)
          const hasTableId =
            payload.new?.table_id !== undefined && payload.new?.table_id !== null
          const isCustomerCall = isZeroId || isTableIdentifier || hasTableId
          const tableId = isCustomerCall
            ? String(payload.new?.table_id ?? rawName.replace(/table\s*/i, "").trim())
            : undefined

          const alertId = String(payload.new?.id || `sum-${Date.now()}`)

          SummonService.addSummon({
            id: alertId,
            staffId,
            staffName: rawName,
            tableId,
            isCustomerCall,
            status: "pending",
            createdAt: payload.new?.created_at || new Date().toISOString(),
          })

          if (isCustomerCall) {
            if (["waiter", "manager", "admin"].includes(user.role)) {
              try {
                new Audio("/mixkit-bike-notification-bell-590.wav").play().catch(() => {})
              } catch {}
              toast.warning("Table Assistance", {
                description: `${rawName} is requesting a waiter now.`,
                duration: 10000,
              })
            }
          } else {
            try {
              new Audio("/universfield-new-notification-022-370046.mp3").play().catch(() => {})
            } catch {}
            toast.error("STAFF ALERT: Manager Request", {
              description: `${rawName}, please report to the manager's office immediately.`,
              duration: 12000,
            })
          }
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user])

  return null
}
