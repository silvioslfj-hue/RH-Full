
"use client";

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Employee, Unit, Role, WorkShift } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface EmployeeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (employee: Partial<Employee>) => void;
  employee: Employee | null;
  units: Unit[];
  roles: Role[];
  workShifts: WorkShift[];
}

export function EmployeeDialog({ isOpen, onClose, onSave, employee, units, roles, workShifts }: EmployeeDialogProps) {
    const { toast } = useToast();
    const [isFetchingZip, setIsFetchingZip] = useState(false);
    
    // States for all form fields
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [unit, setUnit] = useState('');
    const [status, setStatus] = useState<Employee['status']>('Ativo');
    
    // Address states
    const [zip, setZip] = useState('');
    const [street, setStreet] = useState('');
    const [number, setNumber] = useState('');
    const [complement, setComplement] = useState('');
    const [neighborhood, setNeighborhood] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');

  useEffect(() => {
    if (employee) {
      setName(employee.name);
      setEmail(employee.email);
      setRole(employee.role);
      setUnit(employee.unit);
      setStatus(employee.status);
      // Populate other fields if they exist on the employee object
    } else {
      // Reset form for new employee
      setName('');
      setEmail('');
      setRole('');
      setUnit('');
      setStatus('Ativo');
      setZip('');
      setStreet('');
      setNumber('');
      setComplement('');
      setNeighborhood('');
      setCity('');
      setState('');
    }
  }, [employee, isOpen]);

  const handleZipBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const currentZip = e.target.value.replace(/\D/g, '');
    if (currentZip.length !== 8) {
      return;
    }

    setIsFetchingZip(true);
    toast({
      title: 'Buscando CEP...',
      description: 'Aguarde enquanto preenchemos o endereço.',
    });

    try {
      const response = await fetch(`https://viacep.com.br/ws/${currentZip}/json/`);
      const data = await response.json();

      if (data.erro) {
        toast({
          variant: 'destructive',
          title: 'CEP não encontrado',
          description: 'Por favor, verifique o CEP e tente novamente.',
        });
        setStreet('');
        setNeighborhood('');
        setCity('');
        setState('');
      } else {
        setStreet(data.logradouro);
        setNeighborhood(data.bairro);
        setCity(data.localidade);
        setState(data.uf);
        toast({
          title: 'Endereço Encontrado!',
          description: 'Os campos de endereço foram preenchidos.',
        });
        document.getElementById('number')?.focus();
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao buscar CEP',
        description: 'Não foi possível buscar o endereço. Tente novamente.',
      });
    } finally {
      setIsFetchingZip(false);
    }
  };

  const handleSubmit = () => {
    const employeeData: Partial<Employee> = {
      id: employee?.id,
      name,
      email,
      role,
      unit,
      status
    };
    onSave(employeeData);
  };

  const title = employee ? 'Editar Colaborador' : 'Adicionar Novo Colaborador';
  const description = employee ? 'Altere as informações do colaborador.' : 'Preencha os detalhes do novo colaborador.';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="personal" className="flex-grow flex flex-col min-h-0">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="personal">Pessoal</TabsTrigger>
            <TabsTrigger value="professional">Profissional</TabsTrigger>
            <TabsTrigger value="documents">Documentos</TabsTrigger>
            <TabsTrigger value="address">Endereço</TabsTrigger>
            <TabsTrigger value="contract">Contrato e Salário</TabsTrigger>
            <TabsTrigger value="access">Acesso</TabsTrigger>
          </TabsList>
          
          <div className="flex-grow overflow-y-auto p-1 py-4">
            <TabsContent value="personal" className="mt-0">
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nome Completo</Label>
                        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="email">Email Pessoal</Label>
                        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="birthDate">Data de Nascimento</Label>
                        <Input id="birthDate" type="date" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="phone">Telefone</Label>
                        <Input id="phone" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="gender">Gênero</Label>
                        <Select>
                            <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="male">Masculino</SelectItem>
                                <SelectItem value="female">Feminino</SelectItem>
                                <SelectItem value="other">Outro</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="maritalStatus">Estado Civil</Label>
                        <Select>
                            <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="single">Solteiro(a)</SelectItem>
                                <SelectItem value="married">Casado(a)</SelectItem>
                                <SelectItem value="divorced">Divorciado(a)</SelectItem>
                                <SelectItem value="widowed">Viúvo(a)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </TabsContent>

            <TabsContent value="professional" className="mt-0">
                 <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="role">Cargo</Label>
                         <Select value={role} onValueChange={setRole}>
                            <SelectTrigger><SelectValue placeholder="Selecione um cargo..." /></SelectTrigger>
                            <SelectContent>
                                {roles.map(r => <SelectItem key={r.id} value={r.name}>{r.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="unit">Unidade</Label>
                        <Select value={unit} onValueChange={setUnit}>
                            <SelectTrigger><SelectValue placeholder="Selecione uma unidade..." /></SelectTrigger>
                            <SelectContent>
                                {units.map(u => <SelectItem key={u.id} value={u.name}>{u.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="workShift">Jornada de Trabalho</Label>
                        <Select>
                            <SelectTrigger><SelectValue placeholder="Selecione uma jornada..." /></SelectTrigger>
                            <SelectContent>
                                {workShifts.map(ws => <SelectItem key={ws.id} value={ws.id}>{ws.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="manager">Gestor Direto</Label>
                        <Select>
                            <SelectTrigger><SelectValue placeholder="Selecione um gestor..." /></SelectTrigger>
                            <SelectContent>
                                {/* Populate with employees */}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="admissionDate">Data de Admissão</Label>
                        <Input id="admissionDate" type="date" />
                    </div>
                 </div>
            </TabsContent>
            
            <TabsContent value="documents" className="mt-0">
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="cpf">CPF</Label>
                        <Input id="cpf" placeholder="000.000.000-00" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="rg">RG</Label>
                        <Input id="rg" placeholder="00.000.000-0" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="ctps">CTPS (Carteira de Trabalho)</Label>
                        <Input id="ctps" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="pis">PIS/PASEP</Label>
                        <Input id="pis" />
                    </div>
                </div>
            </TabsContent>

            <TabsContent value="address" className="mt-0">
                 <div className="grid grid-cols-6 gap-x-6 gap-y-4">
                    <div className="space-y-2 col-span-2 relative">
                        <Label htmlFor="zip">CEP</Label>
                        <Input id="zip" value={zip} onChange={(e) => setZip(e.target.value)} onBlur={handleZipBlur} />
                        {isFetchingZip && <Loader2 className="absolute right-2 top-8 h-4 w-4 animate-spin" />}
                    </div>
                    <div className="space-y-2 col-span-4">
                        <Label htmlFor="street">Logradouro</Label>
                        <Input id="street" value={street} onChange={(e) => setStreet(e.target.value)} />
                    </div>
                    <div className="space-y-2 col-span-2">
                        <Label htmlFor="number">Número</Label>
                        <Input id="number" value={number} onChange={(e) => setNumber(e.target.value)} />
                    </div>
                    <div className="space-y-2 col-span-4">
                        <Label htmlFor="complement">Complemento</Label>
                        <Input id="complement" value={complement} onChange={(e) => setComplement(e.target.value)} />
                    </div>
                     <div className="space-y-2 col-span-3">
                        <Label htmlFor="neighborhood">Bairro</Label>
                        <Input id="neighborhood" value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} />
                    </div>
                    <div className="space-y-2 col-span-2">
                        <Label htmlFor="city">Cidade</Label>
                        <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} />
                    </div>
                    <div className="space-y-2 col-span-1">
                        <Label htmlFor="state">UF</Label>
                        <Input id="state" value={state} onChange={(e) => setState(e.target.value)} />
                    </div>
                 </div>
            </TabsContent>
            
            <TabsContent value="contract" className="mt-0">
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="salary">Salário Base</Label>
                        <Input id="salary" type="number" placeholder="Ex: 3500.00" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="contractType">Tipo de Contrato</Label>
                        <Select>
                            <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="clt">CLT</SelectItem>
                                <SelectItem value="pj">PJ</SelectItem>
                                <SelectItem value="intern">Estágio</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </TabsContent>
            
            <TabsContent value="access" className="mt-0">
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="system-email">Email de Acesso</Label>
                        <Input id="system-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="accessCode">Código de Acesso (Ponto)</Label>
                        <Input id="accessCode" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Senha Inicial</Label>
                        <Input id="password" type="password" placeholder="Será gerada automaticamente se deixado em branco" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="status">Status do Colaborador</Label>
                        <Select value={status} onValueChange={(value) => setStatus(value as Employee['status'])}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Ativo">Ativo</SelectItem>
                                <SelectItem value="Férias">Férias</SelectItem>
                                <SelectItem value="Inativo">Inativo</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </TabsContent>
          </div>
        </Tabs>
        
        <DialogFooter className="border-t pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>Salvar Colaborador</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

    