'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar
} from '@/components/ui/sidebar'
import { LayoutDashboard, Clock, CalendarOff, BarChart3, Hourglass } from 'lucide-react'

const adminMenuItems = [
  { href: '/dashboard', label: 'Resumo', icon: LayoutDashboard },
  { href: '/timecards', label: 'Cartões de Ponto', icon: Clock },
  { href: '/absences', label: 'Ausências', icon: CalendarOff },
  { href: '/reports', label: 'Relatórios', icon: BarChart3 },
]

const collaboratorMenuItems = [
  { href: '/clock', label: 'Registro de Ponto', icon: Hourglass },
]

const adminPaths = ['/dashboard', '/timecards', '/absences', '/reports'];

export function MainNav() {
  const pathname = usePathname()
  const { setOpenMobile } = useSidebar();

  const isAccessingAdminRoute = adminPaths.some(path => pathname.startsWith(path));
  const menuItems = isAccessingAdminRoute ? adminMenuItems : collaboratorMenuItems;

  const handleLinkClick = () => {
    setOpenMobile(false);
  }

  return (
    <SidebarContent>
      <SidebarMenu>
        {menuItems.map((item) => (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              asChild
              isActive={pathname === item.href}
              tooltip={{ children: item.label }}
            >
              <Link href={item.href!} onClick={handleLinkClick}>
                <item.icon />
                <span>{item.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarContent>
  )
}
