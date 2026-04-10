import { PortalLayout } from "@/components/layout/portal-layout"

export default function KitchenLayout({ children }: { children: React.ReactNode }) {
  return <PortalLayout portal="kitchen">{children}</PortalLayout>
}
