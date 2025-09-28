
'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Icons } from '@/components/icons';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';

function CollaboratorLoginForm() {
  const router = useRouter();
  const [accessCode, setAccessCode] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem('userRole', 'collaborator');
      // Simulação para diferenciar CLT e PJ
      if (accessCode === 'PJ') {
         window.sessionstorage.setItem('userContractType', 'PJ');
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

function SuperAdminLoginForm() {
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem('userRole', 'super-admin');
    }
    router.push('/super-admin');
  };

  return (
    <form onSubmit={handleLogin}>
      <div className="grid w-full items-center gap-4">
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="super-admin-email">Email</Label>
          <Input id="super-admin-email" type="email" placeholder="super.admin@empresa.com" />
        </div>
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="super-admin-password">Senha</Label>
          <Input id="super-admin-password" type="password" placeholder="Sua senha de Super Admin" />
        </div>
      </div>
      <Button type="submit" className="w-full mt-6">
        Entrar como Super Admin
      </Button>
    </form>
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
                <SuperAdminLoginForm />
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
