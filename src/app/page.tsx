
'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Icons } from '@/components/icons';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

function CollaboratorLoginForm() {
  const router = useRouter();
  const [accessCode, setAccessCode] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem('userRole', 'collaborator');
      // Simulação para diferenciar CLT e PJ
      if (accessCode === 'PJ') {
         window.sessionStorage.setItem('userContractType', 'PJ');
      } else {
         window.sessionStorage.setItem('userContractType', 'CLT');
      }
    }
    router.push('/clock');
  };

  return (
    <form onSubmit={handleLogin}>
      <div className="grid w-full items-center gap-4">
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="access-code">Código de Acesso</Label>
          <Input 
            id="access-code" 
            type="text" 
            placeholder="Insira seu código (ou 'PJ' para teste)"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value)}
           />
        </div>
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="password-collaborator">Senha</Label>
          <Input id="password-collaborator" type="password" placeholder="Sua senha" autoComplete="new-password" />
        </div>
      </div>
      <Button type="submit" className="w-full mt-6">
        Entrar
      </Button>
    </form>
  );
}

function AdminLoginForm() {
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem('userRole', 'admin');
    }
    router.push('/dashboard');
  };

  return (
    <form onSubmit={handleLogin}>
      <div className="grid w-full items-center gap-4">
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="nome@exemplo.com" />
        </div>
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="password">Senha</Label>
          <Input id="password" type="password" placeholder="Sua senha" />
        </div>
      </div>
      <Button type="submit" className="w-full mt-6">
        Entrar
      </Button>
    </form>
  );
}

const systemModules = [
    { id: 'payroll', label: 'Folha de Pagamento' },
    { id: 'time-tracking', label: 'Ponto Eletrônico' },
    { id: 'recruitment', label: 'Recrutamento (Assistente de Vagas)' },
    { id: 'esocial', label: 'eSocial e Fiscal' },
    { id: 'reports', label: 'Relatórios Gerenciais' },
    { id: 'absences', label: 'Gestão de Ausências' },
]

function SuperAdminPanel() {
    return (
        <Card className="border-red-500/50">
            <CardHeader>
                <CardTitle>Painel do Super Administrador</CardTitle>
                <CardDescription>Gerencie os administradores e os módulos do sistema.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <h3 className="font-semibold text-lg mb-2">Cadastrar Novo Administrador</h3>
                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="admin-name">Nome</Label>
                            <Input id="admin-name" placeholder="Nome do administrador" />
                        </div>
                         <div className="space-y-1.5">
                            <Label htmlFor="admin-email">Email</Label>
                            <Input id="admin-email" type="email" placeholder="email@empresa.com" />
                        </div>
                        <Button className="w-full">Cadastrar Novo Administrador</Button>
                    </div>
                </div>

                <Separator />

                <div>
                    <h3 className="font-semibold text-lg mb-2">Módulos do Sistema</h3>
                    <div className="space-y-3">
                        {systemModules.map(module => (
                            <div key={module.id} className="flex items-center space-x-2">
                                <Checkbox id={module.id} defaultChecked />
                                <Label htmlFor={module.id} className="font-normal">{module.label}</Label>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                 <Button className="w-full" variant="outline">Salvar Configurações de Módulos</Button>
            </CardFooter>
        </Card>
    );
}

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Icons.logo className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl font-headline">Bem-vindo ao RH-Full</CardTitle>
          <CardDescription>Faça login para acessar seu painel</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="collaborator" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="collaborator">Colaborador</TabsTrigger>
              <TabsTrigger value="admin">Administrador</TabsTrigger>
              <TabsTrigger value="super-admin">Super Admin</TabsTrigger>
            </TabsList>
            <TabsContent value="collaborator">
              <div className="p-4 pt-6">
                <CollaboratorLoginForm />
              </div>
            </TabsContent>
            <TabsContent value="admin">
              <div className="p-4 pt-6">
                <AdminLoginForm />
              </div>
            </TabsContent>
            <TabsContent value="super-admin">
              <div className="p-4 pt-6">
                <SuperAdminPanel />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-center text-sm">
          <p>
            Não tem uma conta?{' '}
            <a href="#" className="text-primary hover:underline">
              Cadastre-se
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
