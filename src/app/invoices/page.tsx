
"use client";

import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Upload, X, File as FileIcon } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/firebaseClient";
import { collection, addDoc, getDocs, query, orderBy } from "firebase/firestore";
import type { Invoice } from "@/lib/data";

export default function InvoicesPage() {
  const { toast } = useToast();
  const [competence, setCompetence] = useState("");
  const [amount, setAmount] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    const fetchInvoices = async () => {
        try {
            // Em um app real, seria filtrado pelo ID do usuário logado.
            const q = query(collection(db, "invoices"), orderBy("uploadDate", "desc"));
            const querySnapshot = await getDocs(q);
            const fetchedInvoices = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Invoice));
            setInvoices(fetchedInvoices);
        } catch (error) {
            console.error("Error fetching invoices:", error);
            toast({ variant: "destructive", title: "Erro ao buscar notas fiscais." });
        }
    };
    fetchInvoices();
  }, [toast]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!competence || !amount || !file) {
        toast({
            variant: "destructive",
            title: "Campos Obrigatórios",
            description: "Por favor, preencha a competência, o valor e anexe o arquivo da nota fiscal.",
        });
        return;
    }

    try {
        const newInvoiceData: Omit<Invoice, 'id'> = {
            // Em um app real, o ID viria do usuário autenticado
            employeeId: "user_pj_demo", 
            competence,
            amount: parseFloat(amount),
            fileName: file.name,
            uploadDate: new Date().toISOString().split('T')[0],
            status: "Enviado",
        };

        const docRef = await addDoc(collection(db, "invoices"), newInvoiceData);
        const newInvoice = { ...newInvoiceData, id: docRef.id };
        
        setInvoices(prev => [newInvoice, ...prev]);

        toast({
          title: "Nota Fiscal Enviada",
          description: "Sua nota fiscal foi enviada para processamento.",
        });
        // Reset form
        setCompetence("");
        setAmount("");
        setFile(null);

    } catch (error) {
        console.error("Error submitting invoice:", error);
        toast({ variant: "destructive", title: "Erro ao enviar nota fiscal." });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const getStatusVariant = (status: Invoice['status']) => {
    switch (status) {
      case 'Enviado':
        return 'secondary';
      case 'Processando':
        return 'default';
      case 'Pago':
        return 'default'; // `default` is green in this theme
      case 'Erro':
        return 'destructive';
      default:
        return 'outline';
    }
  };


  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">Minhas Notas Fiscais</h1>
          <p className="text-muted-foreground">Envie suas notas fiscais (NF) e acompanhe o status do pagamento.</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Enviar Nova Nota Fiscal</CardTitle>
            <CardDescription>Preencha os dados e anexe o arquivo da sua nota fiscal para pagamento.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="competence">Competência</Label>
                  <Input id="competence" type="month" value={competence} onChange={e => setCompetence(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Valor (R$)</Label>
                  <Input id="amount" type="number" placeholder="Ex: 8500.00" value={amount} onChange={e => setAmount(e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="file-upload">Arquivo da Nota Fiscal</Label>
                {file ? (
                  <div className="flex items-center justify-between rounded-lg border bg-muted/50 p-3">
                    <div className="flex items-center gap-2">
                      <FileIcon className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm font-medium">{file.name}</span>
                    </div>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleRemoveFile}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted/70 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-3 text-muted-foreground" />
                      <p className="mb-2 text-sm text-center text-muted-foreground">
                        <span className="font-semibold">Clique para enviar</span> ou arraste e solte
                      </p>
                      <p className="text-xs text-muted-foreground">PDF, XML</p>
                    </div>
                    <Input id="file-upload" type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.xml" />
                  </label>
                )}
              </div>
              <div className="flex justify-end">
                <Button type="submit">Enviar Nota Fiscal</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Histórico de Envios</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Competência</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Data de Envio</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Arquivo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.competence.split('-').reverse().join('/')}</TableCell>
                    <TableCell className="font-mono">R$ {invoice.amount.toFixed(2)}</TableCell>
                    <TableCell>{new Date(invoice.uploadDate).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(invoice.status)} className={invoice.status === 'Pago' ? 'bg-green-600' : ''}>
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="link" className="p-0 h-auto">{invoice.fileName}</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
