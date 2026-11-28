"use client"

import { allMenuItems } from "./menu-data"
import { mockPayments, mockTables } from "./mock-data"
import { supabase } from "./supabase"
import type { MenuItem, Payment, PaymentMethod, PaymentStatus, Table, TableStatus } from "./types"

export const TAX_RATE = 0.16

export function normalizeTableId(raw: string | number): string {
  const cleaned = String(raw ?? "").trim().replace(/^t/i, "").replace(/^0+/, "")
  return cleaned || "0"
}

export function calculateBillTotals(subtotal: number, tip = 0) {
  const tax = Math.round(subtotal * TAX_RATE)
  return {
    subtotal,
    tax,
    tip,
    total: subtotal + tax + tip,
  }
}

const CHANNEL_NAME = "tabletap_sync"
let sharedChannel: BroadcastChannel | null = null

function getSyncChannel(): BroadcastChannel | null {
  if (typeof window === "undefined" || typeof BroadcastChannel === "undefined") return null
  if (!sharedChannel) {
    sharedChannel = new BroadcastChannel(CHANNEL_NAME)
  }
  return sharedChannel
}

function broadcastEvent(eventName: string) {
  if (typeof window === "undefined") return
  window.dispatchEvent(new CustomEvent(eventName))
  window.dispatchEvent(new Event("storage"))
  try {
    getSyncChannel()?.postMessage({ type: eventName })
  } catch {
    // Ignore channel errors on unsupported contexts
  }
}

function subscribeToKey<T>(
  storageKey: string,
  eventName: string,
  getter: () => T,
  callback: (data: T) => void,
) {
  if (typeof window === "undefined") return () => {}

  const emit = () => callback(getter())
  const onStorage = (e: StorageEvent) => {
    if (!e.key || e.key === storageKey) emit()
  }
  const onChannel = (e: MessageEvent) => {
    if (!e.data?.type || e.data.type === eventName) emit()
  }

  window.addEventListener("storage", onStorage)
  window.addEventListener(eventName, emit)
  const ch = getSyncChannel()
  ch?.addEventListener("message", onChannel)

  emit()

  return () => {
    window.removeEventListener("storage", onStorage)
    window.removeEventListener(eventName, emit)
    ch?.removeEventListener("message", onChannel)
  }
}

// ─── Table Service ───────────────────────────────────────────────────────────

const TABLES_KEY = "tabletap_tables"
const TABLES_EVENT = "tabletap:tables"

export const TableService = {
  getTables: (): Table[] => {
    if (typeof window === "undefined") return mockTables
    try {
      const raw = localStorage.getItem(TABLES_KEY)
      if (!raw) {
        localStorage.setItem(TABLES_KEY, JSON.stringify(mockTables))
        return mockTables
      }
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed) ? parsed : mockTables
    } catch {
      return mockTables
    }
  },

  saveTables: (tables: Table[]) => {
    if (typeof window === "undefined") return
    localStorage.setItem(TABLES_KEY, JSON.stringify(tables))
    broadcastEvent(TABLES_EVENT)
  },

  setTableStatus: (tableId: string | number, status: TableStatus): Table[] => {
    const normalized = normalizeTableId(tableId)
    const tables = TableService.getTables()
    const updated = tables.map((t) =>
      normalizeTableId(t.number) === normalized || normalizeTableId(t.id) === normalized
        ? { ...t, status }
        : t,
    )
    TableService.saveTables(updated)
    return updated
  },

  subscribe: (callback: (tables: Table[]) => void) =>
    subscribeToKey(TABLES_KEY, TABLES_EVENT, TableService.getTables, callback),
}

// ─── Cleaning Service ────────────────────────────────────────────────────────

export interface CleaningTask {
  id: string
  tableNumber: number
  tableLabel: string
  time: string
  createdAt: string
  urgency: "high" | "medium" | "low"
  reason: string
  zone: string
  guests: number
}

interface CleaningState {
  tasks: CleaningTask[]
  cleanedCount: number
}

const CLEANING_KEY = "tabletap_cleaning"
const CLEANING_EVENT = "tabletap:cleaning"

function buildInitialCleaningState(): CleaningState {
  const t6 = mockTables.find((t) => t.number === 6)
  const t4 = mockTables.find((t) => t.number === 4)
  const nowIso = new Date().toISOString()
  const tasks: CleaningTask[] = []

  if (t6) {
    tasks.push({
      id: "clean-t6",
      tableNumber: t6.number,
      tableLabel: `T${String(t6.number).padStart(2, "0")}`,
      time: "10m ago",
      createdAt: new Date(Date.now() - 10 * 60000).toISOString(),
      urgency: "high",
      reason: "Guests just left — full clean required",
      zone: `Zone ${t6.zone || "B"}`,
      guests: t6.seats,
    })
  }
  if (t4) {
    tasks.push({
      id: "clean-t4",
      tableNumber: t4.number,
      tableLabel: `T${String(t4.number).padStart(2, "0")}`,
      time: "18m ago",
      createdAt: nowIso,
      urgency: "medium",
      reason: "Routine table sanitization",
      zone: `Zone ${t4.zone || "A"}`,
      guests: t4.seats,
    })
  }

  return { tasks, cleanedCount: 0 }
}

export const CleaningService = {
  getState: (): CleaningState => {
    if (typeof window === "undefined") return buildInitialCleaningState()
    try {
      const raw = localStorage.getItem(CLEANING_KEY)
      if (!raw) {
        const initial = buildInitialCleaningState()
        localStorage.setItem(CLEANING_KEY, JSON.stringify(initial))
        return initial
      }
      const parsed = JSON.parse(raw)
      if (parsed && Array.isArray(parsed.tasks)) {
        return { tasks: parsed.tasks, cleanedCount: Number(parsed.cleanedCount || 0) }
      }
      return buildInitialCleaningState()
    } catch {
      return buildInitialCleaningState()
    }
  },

  saveState: (state: CleaningState) => {
    if (typeof window === "undefined") return
    localStorage.setItem(CLEANING_KEY, JSON.stringify(state))
    broadcastEvent(CLEANING_EVENT)
  },

  enqueueTable: (
    tableId: string | number,
    reason = "Guests departed — full clean required",
    urgency: "high" | "medium" | "low" = "high",
  ) => {
    const num = Number(normalizeTableId(tableId))
    if (!Number.isFinite(num) || num <= 0) return

    const tables = TableService.getTables()
    const table = tables.find((t) => t.number === num)
    const state = CleaningService.getState()
    const exists = state.tasks.some((t) => t.tableNumber === num)

    if (!exists) {
      const task: CleaningTask = {
        id: `clean-t${num}-${Date.now()}`,
        tableNumber: num,
        tableLabel: `T${String(num).padStart(2, "0")}`,
        time: "Just now",
        createdAt: new Date().toISOString(),
        urgency,
        reason,
        zone: `Zone ${table?.zone || "A"}`,
        guests: table?.seats || 4,
      }
      CleaningService.saveState({
        ...state,
        tasks: [task, ...state.tasks],
      })
    }

    TableService.setTableStatus(num, "cleaning")
  },

  markCleaned: (taskId: string) => {
    const state = CleaningService.getState()
    const target = state.tasks.find((t) => t.id === taskId)
    const nextTasks = state.tasks.filter((t) => t.id !== taskId)
    CleaningService.saveState({
      tasks: nextTasks,
      cleanedCount: state.cleanedCount + (target ? 1 : 0),
    })
    if (target) {
      TableService.setTableStatus(target.tableNumber, "available")
    }
  },

  subscribe: (callback: (state: CleaningState) => void) =>
    subscribeToKey(CLEANING_KEY, CLEANING_EVENT, CleaningService.getState, callback),
}

// ─── Payment Service ─────────────────────────────────────────────────────────

const PAYMENTS_KEY = "tabletap_payments"
const PAYMENTS_EVENT = "tabletap:payments"

export const PaymentService = {
  getPayments: (): Payment[] => {
    if (typeof window === "undefined") return mockPayments
    try {
      const raw = localStorage.getItem(PAYMENTS_KEY)
      if (!raw) {
        localStorage.setItem(PAYMENTS_KEY, JSON.stringify(mockPayments))
        return mockPayments
      }
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed) ? parsed : mockPayments
    } catch {
      return mockPayments
    }
  },

  savePayments: (payments: Payment[]) => {
    if (typeof window === "undefined") return
    localStorage.setItem(PAYMENTS_KEY, JSON.stringify(payments))
    broadcastEvent(PAYMENTS_EVENT)
  },

  recordPayment: (input: {
    orderId: string
    tableId?: string
    amount: number
    method: PaymentMethod
    status?: PaymentStatus
  }): Payment => {
    const payments = PaymentService.getPayments()
    const newPayment: Payment = {
      id: `PAY-${Math.floor(1000 + Math.random() * 9000)}`,
      orderId: input.orderId,
      amount: input.amount,
      method: input.method,
      status: input.status ?? "completed",
      createdAt: new Date().toISOString(),
    }
    PaymentService.savePayments([newPayment, ...payments])
    return newPayment
  },

  subscribe: (callback: (payments: Payment[]) => void) =>
    subscribeToKey(PAYMENTS_KEY, PAYMENTS_EVENT, PaymentService.getPayments, callback),
}

// ─── Menu Service ────────────────────────────────────────────────────────────

const MENU_KEY = "tabletap_menu"
const MENU_EVENT = "tabletap:menu"

export const MenuService = {
  getItems: (): MenuItem[] => {
    if (typeof window === "undefined") return allMenuItems
    try {
      const raw = localStorage.getItem(MENU_KEY)
      if (!raw) {
        localStorage.setItem(MENU_KEY, JSON.stringify(allMenuItems))
        return allMenuItems
      }
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : allMenuItems
    } catch {
      return allMenuItems
    }
  },

  saveItems: (items: MenuItem[]) => {
    if (typeof window === "undefined") return
    localStorage.setItem(MENU_KEY, JSON.stringify(items))
    broadcastEvent(MENU_EVENT)
  },

  toggleAvailability: (id: string): MenuItem | undefined => {
    const items = MenuService.getItems()
    let toggled: MenuItem | undefined
    const updated = items.map((item) => {
      if (item.id === id) {
        toggled = { ...item, available: !item.available }
        return toggled
      }
      return item
    })
    MenuService.saveItems(updated)
    return toggled
  },

  upsertItem: (item: MenuItem): MenuItem[] => {
    const items = MenuService.getItems()
    const exists = items.some((i) => i.id === item.id)
    const updated = exists
      ? items.map((i) => (i.id === item.id ? item : i))
      : [item, ...items]
    MenuService.saveItems(updated)
    return updated
  },

  deleteItem: (id: string): MenuItem[] => {
    const items = MenuService.getItems()
    const updated = items.filter((i) => i.id !== id)
    MenuService.saveItems(updated)
    return updated
  },

  subscribe: (callback: (items: MenuItem[]) => void) =>
    subscribeToKey(MENU_KEY, MENU_EVENT, MenuService.getItems, callback),
}

// ─── Summon Service ──────────────────────────────────────────────────────────

export interface SummonAlert {
  id: string
  staffId: number
  staffName: string
  tableId?: string
  isCustomerCall: boolean
  status: "pending" | "resolved"
  createdAt: string
}

const SUMMONS_KEY = "tabletap_summons"
const SUMMONS_EVENT = "tabletap:summons"

export const SummonService = {
  getSummons: (): SummonAlert[] => {
    if (typeof window === "undefined") return []
    try {
      const raw = localStorage.getItem(SUMMONS_KEY)
      const parsed = raw ? JSON.parse(raw) : []
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  },

  saveSummons: (alerts: SummonAlert[]) => {
    if (typeof window === "undefined") return
    localStorage.setItem(SUMMONS_KEY, JSON.stringify(alerts))
    broadcastEvent(SUMMONS_EVENT)
  },

  addSummon: (alert: SummonAlert) => {
    const existing = SummonService.getSummons()
    if (existing.some((a) => a.id === alert.id)) return
    SummonService.saveSummons([alert, ...existing].slice(0, 50))
  },

  resolveSummon: (id: string) => {
    const existing = SummonService.getSummons()
    const updated = existing.map((a) =>
      a.id === id ? { ...a, status: "resolved" as const } : a,
    )
    SummonService.saveSummons(updated)
    // Best-effort sync to Supabase if numeric/uuid id exists remotely
    supabase
      .from("summons")
      .update({ status: "resolved" })
      .eq("id", id)
      .then(() => {}, () => {})
  },

  subscribe: (callback: (alerts: SummonAlert[]) => void) =>
    subscribeToKey(SUMMONS_KEY, SUMMONS_EVENT, SummonService.getSummons, callback),
}
