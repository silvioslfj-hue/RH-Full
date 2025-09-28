
"use client";

import { useState, useTransition } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Wand2, ClipboardCopy, Check, FileText } from "lucide-react";
import { generateJobOpening } from "@/ai/flows/job-opening-flow";
import type { JobOpeningOutput, GeneratedJobOpening } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { jobOpeningsData } from "@/lib/data";
import { JobOpeningsTable } from "@/components/job-openings/job-openings-table";
import { marked } from "marked";

const CopyButton = ({ textToCopy }: { textToCopy: string }) => {
    const { toast } = useToast();
    const [copied, setCopied] = useState(false);
  
    const handleCopy = () => {
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      toast({ title: "Copiado!", description: "O conteúdo foi copiado para a área de transferência." });
      setTimeout(() => setCopied(false), 2000);
    };
  
    return (
      <Button variant="ghost" size="icon" onClick={handleCopy} className="h-7 w-7">
        {copied ? <Check className="h-4 w-4 text-green-500" /> : <ClipboardCopy className="h-4 w-4" />}
      </Button>
    );
};

export default function JobOpeningsPage() {
    const { toast } = useToast();
    const [isGenerating, startTransition] = useTransition();
    const [jobTitle, setJobTitle] = useState("");
    const [generatedContent, setGeneratedContent] = useState<JobOpeningOutput | null>(null);
    const [jobHistory, setJobHistory] = useState<GeneratedJobOpening[]>(jobOpeningsData);
    const [editingJobId, setEditingJobId] = useState<string | null>(null);

    const handleGenerate = () => {
        if (!jobTitle.trim()) {
        toast({
            variant: "destructive",
            title: "Campo Obrigatório",
            description: "Por favor, insira um título de cargo para gerar o material.",
        });
        return;
        }

        startTransition(async () => {
        setGeneratedContent(null);
        setEditingJobId(null);
        toast({
            title: "Gerando Material da Vaga...",
            description: "Aguarde enquanto a IA cria a descrição, perguntas e habilidades."
        });

        try {
            const result = await generateJobOpening({ role: jobTitle });
            
            const htmlDescription = marked.parse(result.description);
            const contentWithHtml = { ...result, description: htmlDescription };

            setGeneratedContent(contentWithHtml);

            const newJob: GeneratedJobOpening = {
                id: `VAGA${(jobHistory.length + 1).toString().padStart(3, '0')}`,
                role: jobTitle,
                createdAt: new Date().toISOString().split('T')[0],
                ...result,
            };
            setJobHistory(prev => [newJob, ...prev]);

            toast({
            title: "Material Gerado com Sucesso!",
            description: `O material para "${jobTitle}" foi criado e salvo no histórico.`
            });
        } catch (error) {
            console.error("Error generating job opening:", error);
            toast({
            variant: "destructive",
            title: "Erro na Geração",
            description: "Não foi possível gerar o material da vaga. Tente novamente.",
            });
        }
        });
    };

    const handleEdit = (job: GeneratedJobOpening) => {
        setJobTitle(job.role);
        
        const htmlDescription = marked.parse(job.description);
        const contentWithHtml = { ...job, description: htmlDescription };

        setGeneratedContent({
            description: contentWithHtml.description,
            interviewQuestions: job.interviewQuestions,
            requiredSkills: job.requiredSkills
        });
        setEditingJobId(job.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    const handleDelete = (id: string) => {
        setJobHistory(prev => prev.filter(job => job.id !== id));
        if (editingJobId === id) {
            setGeneratedContent(null);
            setEditingJobId(null);
            setJobTitle("");
        }
        toast({
            title: "Vaga Excluída",
            description: "A vaga foi removida do seu histórico.",
        });
    }
    
    const currentJobTitle = editingJobId ? jobHistory.find(j => j.id === editingJobId)?.role : jobTitle;
    
    return (
        <AppLayout>
            <div className="space-y-8 h-full flex flex-col">
                <div>
                    <h1 className="text-3xl font-bold font-headline tracking-tight">Assistente de Geração de Vagas</h1>
                    <p className="text-muted-foreground">Insira o título do cargo e a IA criará uma descrição completa, perguntas de entrevista e uma lista de habilidades.</p>
                </div>
                 <Card>
                    <CardHeader>
                        <div className="flex items-end space-x-2">
                            <div className="grid flex-1 gap-2">
                                <Label htmlFor="job-title">Título do Cargo</Label>
                                <Input
                                id="job-title"
                                value={jobTitle}
                                onChange={(e) => setJobTitle(e.target.value)}
                                placeholder="Ex: Desenvolvedor de IA Sênior"
                                disabled={isGenerating}
                                />
                            </div>
                            <Button onClick={handleGenerate} disabled={isGenerating}>
                                {isGenerating ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                <Wand2 className="mr-2 h-4 w-4" />
                                )}
                                {editingJobId ? "Salvar e Gerar Novo" : "Gerar"}
                            </Button>
                        </div>
                    </CardHeader>
                </Card>

                 <div className="flex-1 min-h-0">
                    {!generatedContent && !isGenerating && (
                        <div className="flex items-center justify-center h-full text-muted-foreground border rounded-lg bg-muted/50 flex-col">
                            <FileText className="h-12 w-12 mb-4" />
                            <p>O material gerado para a vaga aparecerá aqui.</p>
                            <p className="text-sm">Comece digitando um cargo acima e clicando em "Gerar".</p>
                        </div>
                    )}
                    {isGenerating && (
                        <div className="flex items-center justify-center h-full text-muted-foreground border rounded-lg">
                        <Loader2 className="mr-4 h-8 w-8 animate-spin" />
                        <p className="text-lg">A IA está trabalhando...</p>
                        </div>
                    )}
                    {generatedContent && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Material Gerado para "{currentJobTitle}"</CardTitle>
                                <CardDescription>Abaixo está o material gerado pela IA. Use as abas para navegar.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Tabs defaultValue="description" className="h-full flex flex-col">
                                    <TabsList className="grid w-full grid-cols-3">
                                        <TabsTrigger value="description">Descrição da Vaga</TabsTrigger>
                                        <TabsTrigger value="questions">Perguntas de Entrevista</TabsTrigger>
                                        <TabsTrigger value="skills">Habilidades</TabsTrigger>
                                    </TabsList>
                                    <ScrollArea className="flex-1 mt-4 h-96">
                                        <TabsContent value="description">
                                            <div className="prose prose-sm dark:prose-invert max-w-none relative p-4">
                                                 <div className="absolute top-0 right-0">
                                                    <CopyButton textToCopy={generatedContent.description} />
                                                 </div>
                                                <div dangerouslySetInnerHTML={{ __html: generatedContent.description }} />
                                            </div>
                                        </TabsContent>
                                        <TabsContent value="questions" className="p-4">
                                             <div className="relative">
                                                <div className="absolute top-0 right-0">
                                                    <CopyButton textToCopy={generatedContent.interviewQuestions.map(q => `[${q.category}] ${q.question}`).join('\n')} />
                                                </div>
                                                <ul className="space-y-4">
                                                {generatedContent.interviewQuestions.map((q, index) => (
                                                    <li key={index} className="flex items-start gap-3">
                                                        <span className="font-bold text-primary">{index + 1}.</span>
                                                        <div>
                                                            <p className="font-semibold">{q.question}</p>
                                                            <p className="text-xs text-muted-foreground uppercase">{q.category}</p>
                                                        </div>
                                                    </li>
                                                ))}
                                                </ul>
                                            </div>
                                        </TabsContent>
                                        <TabsContent value="skills" className="p-4">
                                            <div className="relative">
                                                <div className="absolute top-0 right-0">
                                                    <CopyButton textToCopy={generatedContent.requiredSkills.join(', ')} />
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {generatedContent.requiredSkills.map((skill, index) => (
                                                        <div key={index} className="bg-secondary text-secondary-foreground rounded-full px-3 py-1 text-sm">
                                                            {skill}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </TabsContent>
                                    </ScrollArea>
                                </Tabs>
                            </CardContent>
                        </Card>
                    )}
                </div>
                 <Card>
                    <CardHeader>
                        <CardTitle>Histórico de Vagas</CardTitle>
                        <CardDescription>Veja e gerencie as vagas que você já gerou com a IA.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <JobOpeningsTable
                            data={jobHistory}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    </CardContent>
                 </Card>
            </div>
        </AppLayout>
    );
}

    
