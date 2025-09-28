
'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Icons } from '@/components/icons';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';

export default function ChangePasswordPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    useEffect(() => {
        const requiresChange = window.sessionStorage.getItem('requiresPasswordChange');
        if (requiresChange !== 'true') {
            router.push('/');
        }
    }, [router]);

    const handleChangePassword = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (newPassword !== confirmPassword) {
            toast({
                variant: 'destructive',
                title: 'As senhas não coincidem',
                description: 'Por favor, verifique e tente novamente.',
            });
            return;
        }

        if (newPassword.length < 8) {
             toast({
                variant: 'destructive',
                title: 'Senha muito curta',
                description: 'Sua nova senha deve ter pelo menos 8 caracteres.',
            });
            return;
        }

        // Logic to save the new password would go here

        toast({
            title: 'Senha alterada com sucesso!',
            description: 'Você será redirecionado para o seu painel.',
        });

        const userRole = window.sessionStorage.getItem('userRole');
        window.sessionStorage.removeItem('requiresPasswordChange');

        setTimeout(() => {
            if (userRole === 'admin' || userRole === 'super-admin') {
                router.push('/dashboard');
            } else {
                router.push('/clock');
            }
        }, 1500);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-background p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <Icons.logo className="h-10 w-10 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-headline">Crie uma Nova Senha</CardTitle>
                    <CardDescription>Por segurança, você deve alterar sua senha no primeiro acesso.</CardDescription>
                </CardHeader>
                <form onSubmit={handleChangePassword}>
                    <CardContent>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="new-password">Nova Senha</Label>
                                <Input 
                                    id="new-password" 
                                    type="password" 
                                    placeholder="••••••••"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                                <Input 
                                    id="confirm-password" 
                                    type="password" 
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full">
                            Definir Nova Senha e Continuar
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
