
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
import { LayoutDashboard, Clock, CalendarOff, BarChart3, Hourglass, Receipt, FileCheck, Wallet, FileText, FileArchive, Settings } from 'lucide-react'
import { useEffect, useState } from 'react'

const adminMenuItems = [
  { href: '/dashboard', label: 'Resumo', icon: LayoutDashboard },
  { href: '/timecards', label: 'Cartões de Ponto', icon: Clock },
  { href: '/absences', label: 'Ausências', icon: CalendarOff },
  { href: '/reports', label: 'Relatórios', icon: BarChart3 },
  { href: '/fiscal-files', label: 'Arquivos Fiscais', icon: FileArchive },
  { href: '/settings', label: 'Configurações', icon: Settings },
]

const collaboratorMenuItems = [
  { href: '/clock', label: 'Registro de Ponto', icon: Hourglass },
  { href: '/justifications', label: 'Justificativas', icon: FileCheck },
  { href: '/my-reports', label: 'Meus Relatórios', icon: BarChart3 },
  { href: '/absences', label: 'Minhas Ausências', icon: CalendarOff },
  { href: '/proofs', label: 'Comprovantes', icon: Receipt },
  { href: '/payslips', label: 'Holerites', icon: Wallet },
  { href: '/income-reports', label: 'Informe de Rendimentos', icon: FileText },
]

const adminPaths = ['/dashboard', '/timecards', '/reports', '/fiscal-files', '/settings'];

export function MainNav() {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();
  const [isAdminView, setIsAdminView] = useState(false);

  useEffect(() => {
    // Lógica para determinar o contexto do usuário (admin vs. colaborador)
    // Para o protótipo, usaremos o sessionStorage para simular o estado de login
    if (pathname.startsWith('/dashboard') || pathname.startsWith('/timecards') || pathname.startsWith('/reports') || pathname.startsWith('/fiscal-files') || pathname.startsWith('/settings')) {
        window.sessionStorage.setItem('userRole', 'admin');
        setIsAdminView(true);
    } else if (pathname.startsWith('/clock') || pathname.startsWith('/justifications') || pathname.startsWith('/my-reports') || pathname.startsWith('/proofs') || pathname.startsWith('/payslips') || pathname.startsWith('/income-reports')) {
        window.sessionStorage.setItem('userRole', 'collaborator');
        setIsAdminView(false);
    } else if (pathname.startsWith('/absences')) {
        // A página de ausências é compartilhada. Mantém o contexto atual.
        const role = window.sessionStorage.getItem('userRole');
        setIsAdminView(role === 'admin');
    } else if (pathname === '/') {
        window.sessionStorage.removeItem('userRole');
    }
  }, [pathname]);

  const menuItems = isAdminView ? adminMenuItems : collaboratorMenuItems;

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
              isActive={pathname.startsWith(item.href)}
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
