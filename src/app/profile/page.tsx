import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";

const employeeData = {
    name: "Jane Doe",
    id: "EMP-4321",
    email: "jane.doe@example.com",
    position: "Desenvolvedora Front-end Sênior",
    department: "Tecnologia",
    admissionDate: "2021-03-15",
    manager: "Carlos Souza",
    workModel: "Híbrido",
};

export default function ProfilePage() {
    const userAvatar = PlaceHolderImages.find(p => p.id === 'user-avatar');

    return (
        <AppLayout>
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold font-headline tracking-tight">Meu Perfil</h1>
                    <p className="text-muted-foreground">Visualize e gerencie suas informações pessoais e profissionais.</p>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-4">
                            <Avatar className="h-20 w-20">
                                {userAvatar && (
                                    <AvatarImage src={userAvatar.imageUrl} alt="User Avatar" data-ai-hint={userAvatar.imageHint} />
                                )}
                                <AvatarFallback>JD</AvatarFallback>
                            </Avatar>
                            <div>
                                <CardTitle className="text-2xl">{employeeData.name}</CardTitle>
                                <CardDescription>{employeeData.position}</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="border-t pt-6">
                            <h3 className="text-lg font-semibold mb-4">Informações do Colaborador</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="employee-id">Matrícula</Label>
                                    <Input id="employee-id" value={employeeData.id} readOnly />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Corporativo</Label>
                                    <Input id="email" value={employeeData.email} readOnly />
                                </div>
                                 <div className="space-y-2">
                                    <Label htmlFor="admissionDate">Data de Admissão</Label>
                                    <Input id="admissionDate" value={new Date(employeeData.admissionDate).toLocaleDateString('pt-BR')} readOnly />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="department">Departamento</Label>
                                    <Input id="department" value={employeeData.department} readOnly />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="manager">Gestor Direto</Label>
                                    <Input id="manager" value={employeeData.manager} readOnly />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="workModel">Modelo de Trabalho</Label>
                                    <Input id="workModel" value={employeeData.workModel} readOnly />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="border-t pt-6 flex justify-end">
                        <Button variant="outline">Solicitar Alteração de Dados</Button>
                    </CardFooter>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Alterar Senha</CardTitle>
                        <CardDescription>Para sua segurança, escolha uma senha forte.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="current-password">Senha Atual</Label>
                            <Input id="current-password" type="password" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="new-password">Nova Senha</Label>
                            <Input id="new-password" type="password" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                            <Input id="confirm-password" type="password" />
                        </div>
                    </CardContent>
                    <CardFooter className="border-t pt-6 flex justify-end">
                        <Button>Salvar Alterações</Button>
                    </CardFooter>
                </Card>
            </div>
        </AppLayout>
    );
}
