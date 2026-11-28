"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  SquaresPlusIcon as QrCodeIcon,
  ArrowDownTrayIcon as DownloadIcon,
  ClipboardDocumentIcon as CopyIcon,
  ArrowTopRightOnSquareIcon as ExternalLinkIcon,
  EyeIcon,
  RectangleGroupIcon as TableIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline"
import { mockTables } from "@/lib/mock-data"
import { TableService } from "@/lib/restaurant-store"
import type { Table } from "@/lib/types"
import { cn } from "@/lib/utils"
import { QRCodeCanvas } from "qrcode.react"

function QRCardItem({
  table,
  baseUrl,
}: {
  table: { id: string; number: number; seats: number; status: string }
  baseUrl: string
}) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [copied, setCopied] = useState(false)
  const menuUrl = `${baseUrl}/${table.number}`

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(menuUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation()
    const canvasEl = canvasRef.current?.querySelector("canvas")
    if (!canvasEl) return

    const dataUrl = canvasEl.toDataURL("image/png")
    const link = document.createElement("a")
    link.download = `tabletap-table-${table.number}-qr.png`
    link.href = dataUrl
    link.click()
  }

  const statusConfig = {
    available: { label: "Available", class: "bg-success/10 text-success border-success/20" },
    occupied: { label: "Occupied", class: "bg-primary/10 text-primary border-primary/20" },
    reserved: { label: "Reserved", class: "bg-warning/10 text-warning border-warning/20" },
    cleaning: { label: "Cleaning", class: "bg-sky-500/10 text-sky-600 border-sky-500/20" },
  } as const

  const status = statusConfig[table.status as keyof typeof statusConfig] ?? statusConfig.available

  return (
    <Card size="sm" className="group transition-[border-color,box-shadow] duration-150 ease-(--ease-out) hover:shadow-md">
      <CardHeader>
        <CardTitle className="text-base">Table {table.number}</CardTitle>
        <CardAction className="flex items-center gap-1.5">
          <Badge variant="outline" className={cn("text-[10px] uppercase", status.class)}>
            {status.label}
          </Badge>
          <Badge variant="secondary" className="text-[10px] uppercase">
            {table.seats} seats
          </Badge>
        </CardAction>
      </CardHeader>

      <CardContent className="space-y-3">
        <div
          ref={canvasRef}
          className="flex items-center justify-center p-4 bg-white rounded-xl border"
        >
          <QRCodeCanvas
            value={menuUrl}
            size={160}
            level="H"
            marginSize={2}
            fgColor="#082420"
            bgColor="#FFFFFF"
            imageSettings={{
              src: "/qr-scanner-logo.png",
              height: 40,
              width: 40,
              excavate: true,
            }}
          />
        </div>

        <div className="p-2.5 bg-muted/50 rounded-lg flex items-center gap-2 border">
          <QrCodeIcon className="size-3.5 text-primary/60 shrink-0" />
          <p className="text-[10px] font-mono text-primary truncate">{menuUrl}</p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" onClick={handleCopy}>
            {copied ? (
              <>
                <CheckCircleIcon className="size-3.5 text-success" /> Copied!
              </>
            ) : (
              <>
                <CopyIcon className="size-3.5" /> Copy Link
              </>
            )}
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <DownloadIcon className="size-3.5" />
            Download
          </Button>
        </div>

        <Button asChild variant="ghost" size="sm" className="w-full">
          <Link href={`/customer/${table.number}`}>
            <ExternalLinkIcon className="size-3.5" />
            Preview Guest Menu
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}

export default function QRMenuPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [tables, setTables] = useState<Table[]>(mockTables)
  const [baseUrl, setBaseUrl] = useState("http://localhost:3000/customer")

  useEffect(() => {
    if (typeof window !== "undefined") {
      setBaseUrl(`${window.location.origin}/customer`)
    }
    return TableService.subscribe(setTables)
  }, [])

  const filteredTables = tables.filter((t) => t.number.toString().includes(searchQuery))

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        title="QR Ordering System"
        subtitle="Generate, download & deploy scannable QR codes per table"
      />

      <div className="flex-1 px-4 sm:px-6 py-6 space-y-6">
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {[
            { icon: QrCodeIcon, label: "Total QR Codes", value: tables.length, color: "bg-primary/10 text-primary" },
            { icon: TableIcon, label: "Active Tables", value: tables.filter((t) => t.status === "occupied").length, color: "bg-success/10 text-success" },
            { icon: EyeIcon, label: "Scans Today", value: 156, color: "bg-warning/10 text-warning" },
            { icon: ExternalLinkIcon, label: "QR Orders", value: 23, color: "bg-primary/10 text-primary" },
          ].map((stat) => (
            <Card key={stat.label} size="sm">
              <CardContent className="flex items-center gap-3">
                <div className={cn("p-2.5 rounded-lg shrink-0", stat.color)}>
                  <stat.icon className="size-5" />
                </div>
                <div>
                  <p className="text-2xl font-semibold tabular-nums">{stat.value}</p>
                  <p className="text-xs uppercase text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <InputGroup className="w-full sm:w-64 bg-card">
            <InputGroupAddon>
              <QrCodeIcon />
            </InputGroupAddon>
            <InputGroupInput
              type="search"
              placeholder="Filter by table number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>
          <Button asChild className="gap-2">
            <Link href="/customer/1">
              <ExternalLinkIcon className="size-4" />
              Preview Menu (Table 1)
            </Link>
          </Button>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredTables.map((table) => (
            <QRCardItem key={table.id} table={table} baseUrl={baseUrl} />
          ))}
        </div>

        <Card size="sm" className="bg-muted/30">
          <CardHeader>
            <CardTitle className="text-xs uppercase text-muted-foreground">
              How QR Ordering Works
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 sm:grid-cols-3">
              {[
                { step: "01", title: "Print QR Codes", desc: "Download and print QR codes for each table to display on table tents." },
                { step: "02", title: "Guest Scans", desc: "Customers scan the QR code with their phone — no app needed." },
                { step: "03", title: "Order Sent", desc: "Their order goes straight to the kitchen display with the correct table number." },
              ].map(({ step, title, desc }) => (
                <div key={step} className="flex gap-3">
                  <Badge variant="secondary" className="size-8 rounded-lg justify-center shrink-0">
                    {step}
                  </Badge>
                  <div>
                    <p className="font-semibold text-sm text-foreground">{title}</p>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
