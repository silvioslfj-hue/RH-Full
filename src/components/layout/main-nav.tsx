'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar'
import { LayoutDashboard, Clock, CalendarOff, BarChart3, BotMessageSquare } from 'lucide-react'

const menuItems = [
  { href: '/dashboard', label: 'Painel', icon: LayoutDashboard },
  { href: '/timecards', label: 'Cartões de Ponto', icon: Clock },
  { href: '/absences', label: 'Ausências', icon: CalendarOff },
  { href: '/reports', label: 'Relatórios', icon: BarChart3 },
]

export function MainNav() {
  const pathname = usePathname()

  return (
    <SidebarContent>
      <SidebarMenu>
        {menuItems.map((item) => (
          <SidebarMenuItem key={item.href}>
            <Link href={item.href} passHref legacyBehavior>
              <SidebarMenuButton
                isActive={pathname === item.href}
                tooltip={{ children: item.label }}
              >
                <item.icon />
                <span>{item.label}</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarContent>
  )
}
