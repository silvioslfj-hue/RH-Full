
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

const modules = [
    { id: "payroll", label: "Folha de Pagamento" },
    { id: "time-tracking", label: "Ponto Eletrônico e Banco de Horas" },
    { id: "recruitment", label: "Recrutamento (Assistente de Vagas)" },
    { id: "compliance", label: "Conformidade Fiscal (eSocial, Arquivos)" },
    { id: "reports", label: "Relatórios Gerenciais" },
    { id: "disciplinary", label: "Ações Disciplinares" },
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
            title: "Administrador Convidado",
            description: "Um convite foi enviado para o email informado para que o novo administrador configure sua senha."
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

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <UserPlus className="h-5 w-5" />
                                Cadastro de Administradores
                            </CardTitle>
                            <CardDescription>Adicione novos usuários administradores ao sistema.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="admin-name">Nome Completo</Label>
                                <Input id="admin-name" placeholder="Nome do novo administrador" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="admin-email">Email</Label>
                                <Input id="admin-email" type="email" placeholder="email@empresa.com" />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button onClick={handleCreateAdmin}>
                                <UserPlus className="mr-2 h-4 w-4" />
                                Convidar Administrador
                            </Button>
                        </CardFooter>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <SlidersHorizontal className="h-5 w-5" />
                                Gerenciamento de Módulos
                            </CardTitle>
                            <CardDescription>Habilite ou desabilite os módulos principais do sistema para todos os usuários.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {modules.map((module) => (
                                <div key={module.id} className="flex items-center space-x-2">
                                    <Checkbox id={module.id} defaultChecked />
                                    <Label htmlFor={module.id} className="font-normal">
                                        {module.label}
                                    </Label>
                                </div>
                            ))}
                        </CardContent>
                         <CardFooter>
                            <Button onClick={handleModulesChange}>Salvar Configuração de Módulos</Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </SuperAdminLayout>
    )
}
