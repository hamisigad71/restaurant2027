"use client"

import {
  ClockIcon,
  FireIcon,
  QueueListIcon,
  UserGroupIcon,
  BellIcon,
  ChartBarIcon,
  BoltIcon,
} from "@heroicons/react/24/outline"
import {
  CheckCircleIcon as CheckCircleIconSolid,
  ExclamationCircleIcon as ExclamationCircleIconSolid,
  FireIcon as FireIconSolid,
} from "@heroicons/react/24/solid"
import { ArrowUpRightIcon as ArrowUpRightIconMini } from "@heroicons/react/20/solid"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function IconDemo() {
  return (
    <div className="p-8 space-y-8 bg-background min-h-screen">
      <section>
        <h2 className="text-2xl font-bold mb-2">Heroicons: Modern &amp; Clean</h2>
        <p className="text-muted-foreground mb-6">
          Optimized for Tailwind CSS. Clean, consistent, and highly readable.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>24x24 Outline</CardTitle>
              <CardDescription>Perfect for navigation and general UI layout.</CardDescription>
            </CardHeader>
            <CardContent className="flex gap-4">
              <FireIcon className="size-10 text-orange-500" />
              <QueueListIcon className="size-10 text-foreground" />
              <BellIcon className="size-10 text-yellow-500" />
              <ChartBarIcon className="size-10 text-emerald-500" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>24x24 Solid</CardTitle>
              <CardDescription>Great for badges, active states, and focus areas.</CardDescription>
            </CardHeader>
            <CardContent className="flex gap-4">
              <CheckCircleIconSolid className="size-10 text-emerald-500" />
              <ExclamationCircleIconSolid className="size-10 text-rose-500" />
              <FireIconSolid className="size-10 text-orange-500" />
              <BoltIcon className="size-10 text-amber-500" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>20x20 Mini</CardTitle>
              <CardDescription>Optimized for small buttons and input icons.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center gap-4">
              <Button size="sm" className="gap-1.5">
                View Details
                <ArrowUpRightIconMini className="size-4" />
              </Button>
              <div className="flex gap-2 text-muted-foreground">
                <UserGroupIcon className="size-6" />
                <ClockIcon className="size-6" />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Card className="bg-primary text-primary-foreground border-primary">
        <CardHeader>
          <CardTitle>How to Use Heroicons</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-black/20 p-4 rounded-lg text-sm overflow-x-auto text-primary-foreground/90 border border-primary-foreground/10">
            {`// Import from either outline or solid sets
import { BeakerIcon } from "@heroicons/react/24/outline"
import { BeakerIcon as BeakerIconSolid } from "@heroicons/react/24/solid"
import { BeakerIcon as BeakerIconMini } from "@heroicons/react/20/solid"

// Use with Tailwind classes
<BeakerIcon className="h-6 w-6 text-primary" />`}
          </pre>
        </CardContent>
      </Card>
    </div>
  )
}
