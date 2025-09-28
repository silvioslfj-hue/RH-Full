
"use client";

import { useState, useEffect } from 'react';
import { getFunctions, httpsCallable } from "firebase/functions";
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
import { KeyRound, Upload, Search, File as FileIcon, X, Loader2 } from 'lucide-react';
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
  const [isSaving, setIsSaving] = useState(false);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCertificateFile(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setCertificateFile(null);
    const fileInput = document.getElementById('certificate-file') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    const companyId = company ? company.id : `comp_${Date.now()}`; // Simplistic ID generation for new companies
    const companyData: Company = {
      id: companyId,
      name,
      cnpj,
      address,
      city,
      state,
      zip,
      certificateFile: certificateFile?.name || company?.certificateFile,
    };
    
    try {
        // Step 1: Save the main company data (this is passed to the parent component)
        onSave(companyData);

        // Step 2: If a new password was provided, call the Cloud Function to save it
        if (certificatePassword) {
            toast({ title: "Salvando senha do certificado..." });
            const functions = getFunctions();
            const setupSecrets = httpsCallable(functions, 'setupCompanySecrets');
            await setupSecrets({ companyId: companyId, certificatePassword: certificatePassword });
            toast({ title: "Senha do certificado salva com segurança!" });
        }

        toast({
            title: `Empresa ${company ? 'Atualizada' : 'Adicionada'}`,
            description: `A empresa ${name} foi salva com sucesso.`,
        });
        
    } catch(error) {
        console.error("Error saving company or secret:", error);
        toast({
            variant: "destructive",
            title: "Erro ao Salvar",
            description: "Não foi possível salvar a empresa ou a senha do certificado."
        });
    } finally {
        setIsSaving(false);
    }
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
                    O certificado e a senha são necessários para a assinatura de documentos e relatórios fiscais, como o eSocial. A senha será salva de forma segura no Secret Manager.
                    </AlertDescription>
                    <div className="mt-4 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="certificate-file">Arquivo do Certificado (.pfx, .p12)</Label>
                         {certificateFile ? (
                          <div className="flex items-center justify-between rounded-lg border bg-muted/50 p-3">
                            <div className="flex items-center gap-2">
                              <FileIcon className="h-5 w-5 text-muted-foreground" />
                              <span className="text-sm font-medium">{certificateFile.name}</span>
                            </div>
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleRemoveFile}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <label htmlFor="certificate-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted/70 transition-colors">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <Upload className="w-8 h-8 mb-3 text-muted-foreground" />
                              <p className="mb-2 text-sm text-center text-muted-foreground">
                                <span className="font-semibold">Clique para enviar</span> ou arraste e solte
                              </p>
                              <p className="text-xs text-muted-foreground">.pfx, .p12</p>
                            </div>
                            <Input id="certificate-file" type="file" className="hidden" onChange={handleFileChange} accept=".pfx,.p12" />
                          </label>
                        )}
                        {company?.certificateFile && !certificateFile && (
                            <p className="text-xs text-muted-foreground">Um certificado já está configurado ({company.certificateFile}). Envie um novo arquivo para substituí-lo.</p>
                        )}
                      </div>
                      <div className="space-y-2">
                          <Label htmlFor="certificate-password">Senha do Certificado</Label>
                          <Input id="certificate-password" type="password" value={certificatePassword} onChange={(e) => setCertificatePassword(e.target.value)} placeholder="Digite a senha para salvar" />
                      </div>
                    </div>
                </Alert>
            </TabsContent>
        </Tabs>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isSaving}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
            {isSaving ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
