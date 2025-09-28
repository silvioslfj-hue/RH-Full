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
  { href: '/absences', label: 'Minhas Ausências', icon: CalendarOff },
  { href: '/reports', label: 'Meus Relatórios', icon: BarChart3 },
]

const adminPaths = ['/dashboard', '/timecards'];
const collaboratorPaths = ['/clock'];

export function MainNav() {
  const pathname = usePathname()
  const { setOpenMobile } = useSidebar();

  const isAdminRoute = adminPaths.some(path => pathname.startsWith(path));
  // A rota de ausências e relatórios é compartilhada, então precisamos de uma lógica mais específica
  let menuItems;
  if (isAdminRoute) {
    menuItems = adminMenuItems;
  } else if (pathname.startsWith('/absences') || pathname.startsWith('/reports') || pathname.startsWith('/clock')) {
    // Se não for uma rota de admin E for uma rota de colaborador, mostre o menu do colaborador
    // Isso cobre o caso de /absences e /reports para ambos os perfis. A diferenciação de dados viria do backend.
    menuItems = collaboratorMenuItems;
  } else {
    // Default para admin se o usuário logado for admin e estiver em /absences ou /reports
    // Numa aplicação real, isso seria definido pelo perfil do usuário no estado global.
    // Como protótipo, vamos assumir que se não for uma rota específica de colaborador, é admin.
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
