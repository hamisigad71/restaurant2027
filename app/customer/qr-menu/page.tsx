"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  SquaresPlusIcon as QrCodeIcon, 
  ArrowDownTrayIcon as DownloadIcon, 
  ClipboardDocumentIcon as CopyIcon, 
  ArrowTopRightOnSquareIcon as ExternalLinkIcon, 
  EyeIcon, 
  RectangleGroupIcon as TableIcon, 
  CheckCircleIcon 
} from "@heroicons/react/24/outline"
import { mockTables } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { QRCodeCanvas } from "qrcode.react"

// ── QR Download helper ────────────────────────────────────────────────────────
function QRCardItem({ table, baseUrl }: { table: { id: string; number: number; seats: number; status: string }, baseUrl: string }) {
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
    // Find the canvas element inside our ref'd div
    const canvasEl = canvasRef.current?.querySelector("canvas")
    if (!canvasEl) return

    const dataUrl = canvasEl.toDataURL("image/png")
    const link = document.createElement("a")
    link.download = `resto-table-${table.number}-qr.png`
    link.href = dataUrl
    link.click()
  }

  const statusConfig = {
    available: { label: "Available", class: "bg-success/10 text-success" },
    occupied:  { label: "Occupied",  class: "bg-primary/10 text-primary" },
    reserved:  { label: "Reserved",  class: "bg-warning/10 text-warning" },
  } as const

  const status = statusConfig[table.status as keyof typeof statusConfig] ?? statusConfig.available

  return (
    <Card className="group bg-card border-border/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 overflow-hidden rounded-2xl">
      <CardHeader className="pb-2 flex-row items-center justify-between">
        <CardTitle className="text-base font-heading  uppercase  text-secondary-foreground">
          Table {table.number}
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={cn("text-[8px]  uppercase  border-none px-2 py-0.5", status.class)}>
            {status.label}
          </Badge>
          <Badge variant="outline" className="text-[8px]  uppercase  border-primary/10 text-muted-foreground px-2 py-0.5">
            {table.seats} seats
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-5 space-y-4">
        {/* LIVE QR Code */}
        <div
          ref={canvasRef}
          className="flex items-center justify-center p-4 bg-white rounded-2xl shadow-inner"
        >
          <QRCodeCanvas
            value={menuUrl}
            size={160}
            level="H"
            includeMargin={false}
            imageSettings={{
              src: "/favicon.ico",
              height: 28,
              width: 28,
              excavate: true,
            }}
          />
        </div>

        {/* URL pill */}
        <div className="p-2.5 bg-primary/5 rounded-xl flex items-center gap-2">
          <QrCodeIcon className="h-3 w-3 text-primary/40 shrink-0" />
          <p className="text-[9px] font-mono text-primary truncate">{menuUrl}</p>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-9 text-[9px]  font-heading uppercase  text-primary hover:bg-primary/5 rounded-xl transition-all"
            onClick={handleCopy}
          >
            {copied ? (
              <><CheckCircleIcon className="h-3 w-3 mr-1.5 text-success" /> Copied!</>
            ) : (
              <><CopyIcon className="h-3 w-3 mr-1.5" /> Copy Link</>
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-9 text-[9px]  font-heading uppercase text-primary hover:bg-primary/5 rounded-xl transition-all"
            onClick={handleDownload}
          >
            <DownloadIcon className="h-3 w-3 mr-1.5" />
            Download
          </Button>
        </div>

        {/* Open menu link */}
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="w-full h-8 text-[9px]  font-heading uppercase  text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-xl"
        >
          <Link href={`/customer/${table.number}`}>
            <ExternalLinkIcon className="h-3 w-3 mr-1.5" />
            Preview Guest Menu
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function QRMenuPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [baseUrl, setBaseUrl] = useState("http://localhost:3000/customer")

  useEffect(() => {
    if (typeof window !== "undefined") {
      setBaseUrl(`${window.location.origin}/customer`)
    }
  }, [])

  const filteredTables = mockTables.filter(t =>
    t.number.toString().includes(searchQuery)
  )

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="QR Ordering System" subtitle="Generate, download & deploy scannable QR codes per table" />

      <div className="flex-1 px-[10px] py-6 space-y-6">

        {/* ── Stats ── */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {[
            { icon: QrCodeIcon,       label: "Total QR Codes", value: mockTables.length,                                                           color: "bg-primary/10 text-primary"  },
            { icon: TableIcon,    label: "Active Tables",   value: mockTables.filter(t => t.status === "occupied").length,                     color: "bg-success/10 text-success"  },
            { icon: EyeIcon,          label: "Scans Today",     value: 156,                                                                        color: "bg-warning/10 text-warning"  },
            { icon: ExternalLinkIcon, label: "QR Orders",       value: 23,                                                                         color: "bg-primary/10 text-primary"  },
          ].map(stat => (
            <Card key={stat.label} className="bg-card shadow-sm rounded-2xl group hover:shadow-xl hover:-translate-y-0.5 transition-all">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={cn("p-2.5 rounded-xl shrink-0 group-hover:scale-110 transition-transform", stat.color)}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-heading   text-secondary-foreground">{stat.value}</p>
                  <p className="text-[10px] font-heading uppercase  text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ── Toolbar ── */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative group">
            <QrCodeIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/30 group-focus-within:text-primary transition-colors" />
            <Input
              type="search"
              placeholder="Filter by table number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 pl-11 bg-card h-11 rounded-xl focus-visible:ring-primary/20"
            />
          </div>
          <Button
            asChild
            className="h-11 px-6 gap-2 bg-primary text-white font-heading uppercase  rounded-xl shadow-lg shadow-primary/20 hover:opacity-90"
          >
            <Link href="/customer/1">
              <ExternalLinkIcon className="h-4 w-4" />
              Preview Menu (Table 1)
            </Link>
          </Button>
        </div>

        {/* ── QR Grid ── */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredTables.map((table) => (
            <QRCardItem key={table.id} table={table} baseUrl={baseUrl} />
          ))}
        </div>

        {/* ── How-to ── */}
        <Card className="bg-gradient-to-r from-primary/5 via-primary/[0.02] to-transparent border-none rounded-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-[10px] font-heading   uppercase text-muted-foreground">How QR Ordering Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 sm:grid-cols-3">
              {[
                { step: "01", title: "Print QR Codes", desc: "Download and print QR codes for each table to display on table tents." },
                { step: "02", title: "Guest Scans", desc: "Customers scan the QR code with their phone — no app needed." },
                { step: "03", title: "Order Sent", desc: "Their order goes straight to the kitchen display with the correct table number." },
              ].map(({ step, title, desc }) => (
                <div key={step} className="flex gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-primary/10 text-primary font-heading  text-sm shrink-0">
                    {step}
                  </div>
                  <div>
                    <p className="font-heading  text-sm uppercase  text-foreground">{title}</p>
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
