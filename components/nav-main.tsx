import Link from "next/link"
import { ChevronRightIcon } from "@heroicons/react/24/outline"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarMenuBadge,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: any
    isActive?: boolean
    badge?: string
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const hasSubItems = item.items && item.items.length > 0

          const button = (
            <SidebarMenuButton tooltip={item.title} asChild={!hasSubItems} isActive={item.isActive}>
              {hasSubItems ? (
                <>
                  {item.icon && (typeof item.icon === 'string' ? (
                    <div className="size-4 shrink-0 transition-all duration-200" style={{ backgroundColor: "oklch(0.45 0.12 285)", WebkitMaskImage: `url(${item.icon})`, WebkitMaskSize: "contain", WebkitMaskRepeat: "no-repeat", WebkitMaskPosition: "center", opacity: item.isActive ? 1 : 0.7 }} />
                  ) : (
                    <item.icon className="size-4" />
                  ))}
                  <span>{item.title}</span>
                  {item.badge && <SidebarMenuBadge className="ml-auto">{item.badge}</SidebarMenuBadge>}
                  <ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 h-4 w-4" />
                </>
              ) : (
                <Link href={item.url}>
                  {item.icon && (typeof item.icon === 'string' ? (
                    <div className="size-4 shrink-0 transition-all duration-200" style={{ backgroundColor: "oklch(0.45 0.12 285)", WebkitMaskImage: `url(${item.icon})`, WebkitMaskSize: "contain", WebkitMaskRepeat: "no-repeat", WebkitMaskPosition: "center", opacity: item.isActive ? 1 : 0.7 }} />
                  ) : (
                    <item.icon className="size-4" />
                  ))}
                  <span>{item.title}</span>
                  {item.badge && <SidebarMenuBadge className="ml-auto">{item.badge}</SidebarMenuBadge>}
                </Link>
              )}
            </SidebarMenuButton>
          )

          if (!hasSubItems) {
            return (
              <SidebarMenuItem key={item.title}>
                {button}
              </SidebarMenuItem>
            )
          }

          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={item.isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  {button}
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild>
                          <Link href={subItem.url}>
                            <span>{subItem.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
