"use client"

import { 
  ClockIcon, 
  CheckCircleIcon, 
  FireIcon, 
  QueueListIcon, 
  UserGroupIcon, 
  ArrowUpRightIcon,
  BellIcon,
  ExclamationCircleIcon,
  ChartBarIcon, 
  BoltIcon
} from "@heroicons/react/24/outline"
import { 
  CheckCircleIcon as CheckCircleIconSolid, 
  ExclamationCircleIcon as ExclamationCircleIconSolid,
  FireIcon as FireIconSolid
} from "@heroicons/react/24/solid"
import { 
  ArrowUpRightIcon as ArrowUpRightIconMini 
} from "@heroicons/react/20/solid"

export default function IconDemo() {
  return (
    <div className="p-8 space-y-12 bg-slate-50 min-h-screen">
      <section>
        <h2 className="text-2xl font-bold mb-6 text-slate-800">Heroicons: Modern & Clean</h2>
        <p className="text-slate-600 mb-8">
          Optimized for Tailwind CSS. Clean, consistent, and highly readable.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Outline Style - Default */}
          <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold mb-4 text-indigo-600">24x24 Outline</h3>
            <div className="flex gap-4">
              <FireIcon className="h-10 w-10 text-orange-500" />
              <QueueListIcon className="h-10 w-10 text-slate-700" />
              <BellIcon className="h-10 w-10 text-yellow-500" />
              <ChartBarIcon className="h-10 w-10 text-emerald-500" />
            </div>
            <p className="mt-4 text-sm text-slate-500">Perfect for navigation and general UI layout.</p>
          </div>

          {/* Solid Style - Impact */}
          <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold mb-4 text-indigo-600">24x24 Solid</h3>
            <div className="flex gap-4">
              <CheckCircleIconSolid className="h-10 w-10 text-emerald-500" />
              <ExclamationCircleIconSolid className="h-10 w-10 text-rose-500" />
              <FireIconSolid className="h-10 w-10 text-orange-500" />
              <BoltIcon className="h-10 w-10 text-indigo-500" />
            </div>
            <p className="mt-4 text-sm text-slate-500">Great for badges, active states, and focus areas.</p>
          </div>

          {/* Mini/Micro - Dense UI */}
          <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold mb-4 text-indigo-600">20x20 Mini</h3>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-sm font-medium">
                View Details
                <ArrowUpRightIconMini className="h-4 w-4" />
              </button>
              <div className="flex gap-2">
                <UserGroupIcon className="h-6 w-6 text-slate-400" />
                <ClockIcon className="h-6 w-6 text-slate-400" />
              </div>
            </div>
            <p className="mt-4 text-sm text-slate-500">Optimized for small buttons and input icons.</p>
          </div>
        </div>
      </section>

      <section className="p-8 bg-slate-900 rounded-3xl text-white">
        <h2 className="text-xl font-bold mb-4">How to Use Heroicons</h2>
        <pre className="bg-black/20 p-4 rounded-xl text-sm overflow-x-auto text-indigo-200 border border-white/10">
          {`// Import from either outline or solid sets
import { BeakerIcon } from "@heroicons/react/24/outline"
import { BeakerIcon as BeakerIconSolid } from "@heroicons/react/24/solid"
import { BeakerIcon as BeakerIconMini } from "@heroicons/react/20/solid"

// Use with Tailwind classes
<BeakerIcon className="h-6 w-6 text-indigo-500" />`}
        </pre>
      </section>
    </div>
  )
}
