
"use client";

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { LogOut, Shield, SlidersHorizontal, UserPlus } from 'lucide-react';
import { Icons } from '@/components/icons';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';


const collaboratorModules = [
    { id: "time-tracking-collab", label: "Registro de Ponto e Justificativas" },
    { id: "reports-collab", label: "Meus Relatórios e Holerites" },
    { id: "absences-collab", label: "Solicitação de Ausências" },
];

const adminModules = [
    { id: "people-management", label: "Gestão de Pessoas (Colaboradores, Ausências)" },
    { id: "recruitment", label: "Recrutamento (Assistente de Vagas)" },
    { id: "payroll", label: "Folha de Pagamento (Processamento, Histórico, Relatórios)" },
    { id: "time-management", label: "Ponto Eletrônico (Espelho de Ponto, Banco de Horas)" },
    { id: "compliance", label: "Conformidade Fiscal (eSocial, Arquivos Fiscais)" },
    { id: "management-reports", label: "Relatórios Gerenciais" },
    { id: "system-settings", label: "Configurações do Sistema" },
];

function SuperAdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    const handleLogout = () => {
        if (typeof window !== 'undefined') {
            window.sessionStorage.removeItem('userRole');
        }
        router.push('/');
    };

    return (
        <div className="flex flex-col min-h-screen bg-muted/40">
            <header className="sticky top-0 z-40 w-full border-b bg-background">
                <div className="container flex h-14 items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Icons.logo className="h-6 w-6 text-primary" />
                        <span className="font-bold">RH-Full</span>
                        <span className="text-sm text-muted-foreground font-mono">[Super Admin]</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Sair
                    </Button>
                </div>
            </header>
            <main className="flex-1 p-4 md:p-8">
                {children}
            </main>
        </div>
    );
}

export default function SuperAdminPage() {
    const { toast } = useToast();

    const handleCreateAdmin = () => {
        toast({
            title: "Administrador Criado com Sucesso!",
            description: "O novo administrador já pode acessar o sistema com as credenciais definidas."
        });
    }

    const handleModulesChange = () => {
        toast({
            title: "Módulos Atualizados",
            description: "A configuração de módulos do sistema foi salva com sucesso."
        });
    }
    
    return (
        <SuperAdminLayout>
             <div className="space-y-8">
                <div>
                  <h1 className="text-3xl font-bold font-headline tracking-tight">
                    Painel do Super Administrador
                  </h1>
                  <p className="text-muted-foreground">
                    Gerencie as configurações de mais alto nível do sistema.
                  </p>
                </div>

                <Tabs defaultValue="admins">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="admins"><UserPlus className="mr-2 h-4 w-4" /> Cadastro de Administradores</TabsTrigger>
                        <TabsTrigger value="modules"><SlidersHorizontal className="mr-2 h-4 w-4" /> Gerenciamento de Módulos</TabsTrigger>
                    </TabsList>
                    <TabsContent value="admins" className="pt-6">
                         <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    Cadastrar Novo Administrador
                                </CardTitle>
                                <CardDescription>Crie o primeiro acesso para um novo administrador do sistema.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="admin-name">Nome Completo</Label>
                                    <Input id="admin-name" placeholder="Nome do novo administrador" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="admin-email">Email (Login)</Label>
                                    <Input id="admin-email" type="email" placeholder="email@empresa.com" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="admin-password">Senha Inicial</Label>
                                    <Input id="admin-password" type="password" placeholder="Defina uma senha forte" />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button onClick={handleCreateAdmin}>
                                    <UserPlus className="mr-2 h-4 w-4" />
                                    Criar Administrador
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                    <TabsContent value="modules" className="pt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    Gerenciamento de Módulos
                                </CardTitle>
                                <CardDescription>Habilite ou desabilite os módulos principais do sistema para todos os usuários.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold mb-3">Módulos do Administrador</h3>
                                    <div className="space-y-3">
                                        {adminModules.map((module) => (
                                            <div key={module.id} className="flex items-center space-x-2">
                                                <Checkbox id={module.id} defaultChecked />
                                                <Label htmlFor={module.id} className="font-normal">
                                                    {module.label}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <Separator />
                                <div>
                                    <h3 className="text-lg font-semibold mb-3">Módulos do Colaborador</h3>
                                    <div className="space-y-3">
                                        {collaboratorModules.map((module) => (
                                            <div key={module.id} className="flex items-center space-x-2">
                                                <Checkbox id={module.id} defaultChecked />
                                                <Label htmlFor={module.id} className="font-normal">
                                                    {module.label}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button onClick={handleModulesChange}>Salvar Configuração de Módulos</Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </SuperAdminLayout>
    )
}
