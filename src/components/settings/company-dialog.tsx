
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
import type { Company } from '@/lib/data';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { KeyRound, Upload, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CompanyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (company: Company) => void;
  company: Company | null;
}

export function CompanyDialog({ isOpen, onClose, onSave, company }: CompanyDialogProps) {
  const [name, setName] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  const [certificatePassword, setCertificatePassword] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (company) {
      setName(company.name);
      setCnpj(company.cnpj);
      setAddress(company.address);
      setCity(company.city);
      setState(company.state);
      setZip(company.zip);
      setCertificateFile(null);
      setCertificatePassword('');
    } else {
      // Reset form
      setName('');
      setCnpj('');
      setAddress('');
      setCity('');
      setState('');
      setZip('');
      setCertificateFile(null);
      setCertificatePassword('');
    }
  }, [company, isOpen]);

  const handleFetchData = () => {
    // Simulação de busca de dados pelo CNPJ
    toast({
      title: "Buscando dados...",
      description: `Buscando informações para o CNPJ: ${cnpj}`,
    });
    setTimeout(() => {
        setName("Empresa Exemplo (Via CNPJ)");
        setAddress("Avenida Faria Lima, 2954");
        setCity("São Paulo");
        setState("SP");
        setZip("01452-001");
        toast({
            title: "Dados Preenchidos",
            description: "Os dados da empresa foram preenchidos automaticamente.",
        });
    }, 1500);
  }

  const handleSubmit = () => {
    const companyData: Company = {
      id: company ? company.id : '', // ID será gerado no pai para novas empresas
      name,
      cnpj,
      address,
      city,
      state,
      zip,
      certificateFile: certificateFile?.name || company?.certificateFile,
    };
    onSave(companyData);
    toast({
        title: `Empresa ${company ? 'Atualizada' : 'Adicionada'}`,
        description: `A empresa ${name} foi salva com sucesso.`,
    });
  };

  const title = company ? 'Editar Empresa' : 'Adicionar Nova Empresa';
  const description = company
    ? 'Altere as informações da empresa abaixo.'
    : 'Preencha os detalhes da nova empresa.';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="data" className="py-4">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="data">Dados da Empresa</TabsTrigger>
                <TabsTrigger value="certificate">Certificado Digital</TabsTrigger>
            </TabsList>
            <TabsContent value="data" className="pt-6">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="cnpj">CNPJ</Label>
                        <div className="flex gap-2">
                        <Input id="cnpj" value={cnpj} onChange={(e) => setCnpj(e.target.value)} placeholder="00.000.000/0001-00" />
                        <Button variant="outline" onClick={handleFetchData}><Search className="mr-2 h-4 w-4" /> Consultar</Button>
                        </div>
                        <p className="text-xs text-muted-foreground">Preencha o CNPJ para buscar os dados automaticamente.</p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="company-name">Razão Social</Label>
                        <Input id="company-name" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                        <Label htmlFor="address">Endereço</Label>
                        <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                        <Label htmlFor="city">Cidade</Label>
                        <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                        <Label htmlFor="state">Estado</Label>
                        <Input id="state" value={state} onChange={(e) => setState(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                        <Label htmlFor="zip">CEP</Label>
                        <Input id="zip" value={zip} onChange={(e) => setZip(e.target.value)} />
                        </div>
                    </div>
                </div>
            </TabsContent>
            <TabsContent value="certificate" className="pt-6">
                 <Alert>
                    <KeyRound className="h-4 w-4" />
                    <AlertTitle>Certificado Digital (A1)</AlertTitle>
                    <AlertDescription>
                    O certificado é necessário para a assinatura de documentos e relatórios fiscais, como o eSocial.
                    </AlertDescription>
                    <div className="mt-4 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="certificate-file">Arquivo do Certificado (.pfx, .p12)</Label>
                        <Input id="certificate-file" type="file" onChange={(e) => setCertificateFile(e.target.files ? e.target.files[0] : null)} accept=".pfx,.p12" />
                        {company?.certificateFile && !certificateFile && (
                            <p className="text-xs text-muted-foreground">Um certificado já está configurado ({company.certificateFile}). Envie um novo arquivo para substituí-lo.</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="certificate-password">Senha do Certificado</Label>
                        <Input id="certificate-password" type="password" value={certificatePassword} onChange={(e) => setCertificatePassword(e.target.value)} />
                    </div>
                    </div>
                </Alert>
            </TabsContent>
        </Tabs>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
