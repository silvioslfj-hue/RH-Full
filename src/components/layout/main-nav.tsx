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
import { LayoutDashboard, Clock, CalendarOff, BarChart3, Hourglass, Receipt, FileCheck } from 'lucide-react'

const adminMenuItems = [
  { href: '/dashboard', label: 'Resumo', icon: LayoutDashboard },
  { href: '/timecards', label: 'Cartões de Ponto', icon: Clock },
  { href: '/absences', label: 'Ausências', icon: CalendarOff },
  { href: '/reports', label: 'Relatórios', icon: BarChart3 },
]

const collaboratorMenuItems = [
  { href: '/clock', label: 'Registro de Ponto', icon: Hourglass },
  { href: '/absences', label: 'Minhas Ausências', icon: CalendarOff },
  { href: '/reports', label: 'Meus Relatórios', icon: BarChart3 },
  { href: '/proofs', label: 'Comprovantes', icon: Receipt },
  { href: '/justifications', label: 'Justificativas', icon: FileCheck },
]

const adminPaths = ['/dashboard', '/timecards'];
const collaboratorPaths = ['/clock', '/proofs', '/justifications'];

export function MainNav() {
  const pathname = usePathname()
  const { setOpenMobile } = useSidebar();

  const isAdminRoute = adminPaths.some(path => pathname.startsWith(path));
  let menuItems;
  
  if (isAdminRoute) {
    menuItems = adminMenuItems;
  } else if (collaboratorPaths.some(path => pathname.startsWith(path))) {
    menuItems = collaboratorMenuItems;
  } else if (pathname.startsWith('/absences') || pathname.startsWith('/reports')) {
    // Para rotas compartilhadas, precisaríamos de uma lógica de perfil de usuário real.
    // Como protótipo, assumimos que o menu do colaborador é o padrão aqui.
    menuItems = collaboratorMenuItems;
  } else {
    // Default para admin se nada corresponder (ex: página inicial do dashboard)
    menuItems = adminMenuItems;
  }


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
