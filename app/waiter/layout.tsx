import { PortalLayout } from "@/components/layout/portal-layout"

export default function WaiterLayout({ children }: { children: React.ReactNode }) {
  return <PortalLayout portal="waiter">{children}</PortalLayout>
}
