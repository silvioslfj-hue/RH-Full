

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
import { LayoutDashboard, Clock, CalendarOff, BarChart3, Hourglass, Receipt, FileCheck, Wallet, FileText, FileArchive, Settings, Users, Calculator, History, PieChart, Briefcase, AlertTriangle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { absenceData, timeSheetData, timeBankData } from '@/lib/data'


const collaboratorMenuItems = [
  { href: '/clock', label: 'Registro de Ponto', icon: Hourglass, contract: ['CLT', 'PJ'] },
  { href: '/justifications', label: 'Justificativas', icon: FileCheck, contract: ['CLT'] },
  { href: '/my-reports', label: 'Meus Relatórios', icon: BarChart3, contract: ['CLT'] },
  { href: '/absences', label: 'Minhas Ausências', icon: CalendarOff, contract: ['CLT'] },
  { href: '/proofs', label: 'Comprovantes', icon: Receipt, contract: ['CLT'] },
  { href: '/payslips', label: 'Holerites', icon: Wallet, contract: ['CLT'] },
  { href: '/invoices', label: 'Notas Fiscais', icon: Receipt, contract: ['PJ'] },
  { href: '/income-reports', label: 'Informe de Rendimentos', icon: FileText, contract: ['CLT', 'PJ'] },
]

const adminPaths = ['/dashboard', '/timecards', '/reports', '/fiscal-files', '/settings', '/employees', '/payroll', '/payroll-history', '/payroll-reports', '/esocial', '/job-openings', '/time-bank', '/disciplinary'];

export function MainNav() {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();
  const [isAdminView, setIsAdminView] = useState(false);
  const [userContractType, setUserContractType] = useState<'CLT' | 'PJ'>('CLT'); // Default to CLT for demo

  // Simulação de contagem de pendências
  const pendingAbsencesCount = absenceData.filter(a => a.status === 'Pendente').length;
  const inconsistentEntriesCount = timeSheetData.filter(e => e.status === 'warning').length;
  const timeBankExpiringCount = timeBankData.filter(e => e.status === 'Crítico' || e.status === 'Atenção').length;

  useEffect(() => {
    // Lógica para determinar o contexto do usuário (admin vs. colaborador)
    // Para o protótipo, usaremos o sessionStorage para simular o estado de login
    const role = window.sessionStorage.getItem('userRole');
    const contract = window.sessionStorage.getItem('userContractType') as 'CLT' | 'PJ' | null;
    
    if (adminPaths.some(p => pathname.startsWith(p))) {
        window.sessionStorage.setItem('userRole', 'admin');
        setIsAdminView(true);
    } else {
        setIsAdminView(false);
        if (role === 'collaborator') {
             setUserContractType(contract || 'CLT');
        }
    }
    
    // Simulação de troca de usuário PJ
    if (pathname === '/clock') {
       // Suponha que um login específico defina isso.
       // Se o usuário 'Mariana Costa' (PJ) fizesse login, isso seria setado.
       // Para este demo, vamos simular que qualquer um pode ser PJ.
       // window.sessionStorage.setItem('userContractType', 'PJ');
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
             <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname.startsWith('/disciplinary')} tooltip={{ children: 'Ações Disciplinares' }}>
                    <Link href='/disciplinary' onClick={handleLinkClick}><AlertTriangle /><span>Ações Disciplinares</span></Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarGroup>

           <SidebarGroup>
            <SidebarGroupLabel>Recrutamento</SidebarGroupLabel>
             <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname.startsWith('/job-openings')} tooltip={{ children: 'Assistente de Vagas' }}>
                <Link href='/job-openings' onClick={handleLinkClick}><Briefcase /><span>Assistente de Vagas</span></Link>
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
              <SidebarMenuButton asChild isActive={pathname.startsWith('/timecards')} tooltip={{ children: 'Registro de Ponto' }}>
                <Link href='/timecards' onClick={handleLinkClick}>
                  <Clock />
                  <span>Registro de Ponto</span>
                  {inconsistentEntriesCount > 0 && <SidebarMenuBadge>{inconsistentEntriesCount}</SidebarMenuBadge>}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname.startsWith('/time-bank')} tooltip={{ children: 'Banco de Horas' }}>
                <Link href='/time-bank' onClick={handleLinkClick}>
                  <Hourglass />
                  <span>Banco de Horas</span>
                  {timeBankExpiringCount > 0 && <SidebarMenuBadge>{timeBankExpiringCount}</SidebarMenuBadge>}
                </Link>
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
        {collaboratorMenuItems
         .filter(item => item.contract.includes(userContractType))
         .map((item) => (
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
