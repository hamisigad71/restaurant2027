import { PortalLayout } from "@/components/layout/portal-layout"

export default function ManagerLayout({ children }: { children: React.ReactNode }) {
  return <PortalLayout portal="manager">{children}</PortalLayout>
}
