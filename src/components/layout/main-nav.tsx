
'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenuBadge
} from '@/components/ui/sidebar'
import { LayoutDashboard, Clock, CalendarOff, BarChart3, Hourglass, Receipt, FileCheck, Wallet, FileText, FileArchive, Settings, Users, Calculator, History, PieChart, Briefcase, Building, LandPlot, Coins } from 'lucide-react'
import { useEffect, useState } from 'react'
import { absenceData } from '@/lib/data'


const collaboratorMenuItems = [
  { href: '/clock', label: 'Registro de Ponto', icon: Hourglass },
  { href: '/justifications', label: 'Justificativas', icon: FileCheck },
  { href: '/my-reports', label: 'Meus Relatórios', icon: BarChart3 },
  { href: '/absences', label: 'Minhas Ausências', icon: CalendarOff },
  { href: '/proofs', label: 'Comprovantes', icon: Receipt },
  { href: '/payslips', label: 'Holerites', icon: Wallet },
  { href: '/income-reports', label: 'Informe de Rendimentos', icon: FileText },
]

const adminPaths = ['/dashboard', '/timecards', '/reports', '/fiscal-files', '/settings', '/employees', '/payroll', '/payroll-history', '/payroll-reports', '/esocial'];

export function MainNav() {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();
  const [isAdminView, setIsAdminView] = useState(false);

  // Simulação de contagem de pendências
  const pendingAbsencesCount = absenceData.filter(a => a.status === 'Pendente').length;

  useEffect(() => {
    // Lógica para determinar o contexto do usuário (admin vs. colaborador)
    // Para o protótipo, usaremos o sessionStorage para simular o estado de login
    if (adminPaths.some(p => pathname.startsWith(p))) {
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


  const handleLinkClick = () => {
    setOpenMobile(false);
  }

  if (isAdminView) {
    return (
       <SidebarContent>
        <SidebarMenu>
          <SidebarGroup>
            <SidebarGroupLabel>Gestão de Pessoas</SidebarGroupLabel>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname.startsWith('/dashboard')} tooltip={{ children: 'Resumo' }}>
                <Link href='/dashboard' onClick={handleLinkClick}><LayoutDashboard /><span>Resumo</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname.startsWith('/employees')} tooltip={{ children: 'Colaboradores' }}>
                <Link href='/employees' onClick={handleLinkClick}><Users /><span>Colaboradores</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname.startsWith('/absences')} tooltip={{ children: 'Ausências' }}>
                <Link href='/absences' onClick={handleLinkClick}>
                  <CalendarOff />
                  <span>Ausências</span>
                  {pendingAbsencesCount > 0 && <SidebarMenuBadge>{pendingAbsencesCount}</SidebarMenuBadge>}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Folha de Pagamento</SidebarGroupLabel>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname.startsWith('/payroll')} tooltip={{ children: 'Processar Folha' }}>
                <Link href='/payroll' onClick={handleLinkClick}><Calculator /><span>Processar Folha</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname.startsWith('/payroll-history')} tooltip={{ children: 'Histórico' }}>
                <Link href='/payroll-history' onClick={handleLinkClick}><History /><span>Histórico</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname.startsWith('/payroll-reports')} tooltip={{ children: 'Relatórios da Folha' }}>
                <Link href='/payroll-reports' onClick={handleLinkClick}><PieChart /><span>Relatórios da Folha</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Ponto Eletrônico</SidebarGroupLabel>
             <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname.startsWith('/timecards')} tooltip={{ children: 'Cartões de Ponto' }}>
                <Link href='/timecards' onClick={handleLinkClick}><Clock /><span>Cartões de Ponto</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarGroup>
          
           <SidebarGroup>
            <SidebarGroupLabel>Relatórios e Análise</SidebarGroupLabel>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname.startsWith('/reports')} tooltip={{ children: 'Relatórios Gerenciais' }}>
                <Link href='/reports' onClick={handleLinkClick}><BarChart3 /><span>Relatórios Gerenciais</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Conformidade Fiscal</SidebarGroupLabel>
             <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname.startsWith('/esocial')} tooltip={{ children: 'eSocial' }}>
                <Link href='/esocial' onClick={handleLinkClick}><FileArchive /><span>eSocial</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname.startsWith('/fiscal-files')} tooltip={{ children: 'Arquivos Fiscais' }}>
                <Link href='/fiscal-files' onClick={handleLinkClick}><FileText /><span>Arquivos Fiscais</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Sistema</SidebarGroupLabel>
             <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname.startsWith('/settings')} tooltip={{ children: 'Configurações' }}>
                <Link href='/settings' onClick={handleLinkClick}><Settings /><span>Configurações</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarGroup>
        </SidebarMenu>
      </SidebarContent>
    )
  }

  return (
    <SidebarContent>
      <SidebarMenu>
        {collaboratorMenuItems.map((item) => (
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
