
"use client";

import { useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Wand2, ClipboardCopy, Check } from "lucide-react";
import { generateJobOpening } from "@/ai/flows/job-opening-flow";
import type { JobOpeningOutput } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "../ui/scroll-area";

interface JobOpeningDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function JobOpeningDialog({ isOpen, onClose }: JobOpeningDialogProps) {
  const { toast } = useToast();
  const [isGenerating, startTransition] = useTransition();
  const [jobTitle, setJobTitle] = useState("");
  const [generatedContent, setGeneratedContent] = useState<JobOpeningOutput | null>(null);

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
      toast({
        title: "Gerando Material da Vaga...",
        description: "Aguarde enquanto a IA cria a descrição, perguntas e habilidades."
      });

      try {
        const result = await generateJobOpening({ role: jobTitle });
        setGeneratedContent(result);
        toast({
          title: "Material Gerado com Sucesso!",
          description: `O material para "${jobTitle}" foi criado pela IA.`
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

  const CopyButton = ({ textToCopy }: { textToCopy: string }) => {
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
  

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Assistente de Geração de Vaga com IA</DialogTitle>
          <DialogDescription>
            Insira o título do cargo e a IA criará uma descrição completa da vaga, perguntas de entrevista e uma lista de habilidades.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2 py-4">
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
          <Button onClick={handleGenerate} disabled={isGenerating} className="self-end">
            {isGenerating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-4 w-4" />
            )}
            Gerar
          </Button>
        </div>

        <div className="flex-1 min-h-0">
          {!generatedContent && !isGenerating && (
            <div className="flex items-center justify-center h-full text-muted-foreground border rounded-lg bg-muted/50">
              <p>O material gerado aparecerá aqui.</p>
            </div>
          )}
          {isGenerating && (
            <div className="flex items-center justify-center h-full text-muted-foreground border rounded-lg">
               <Loader2 className="mr-4 h-8 w-8 animate-spin" />
               <p className="text-lg">A IA está escrevendo...</p>
            </div>
          )}
          {generatedContent && (
             <Tabs defaultValue="description" className="h-full flex flex-col">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="description">Descrição da Vaga</TabsTrigger>
                    <TabsTrigger value="questions">Perguntas de Entrevista</TabsTrigger>
                    <TabsTrigger value="skills">Habilidades</TabsTrigger>
                </TabsList>
                <ScrollArea className="flex-1 mt-4">
                    <TabsContent value="description">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Descrição da Vaga</CardTitle>
                                <CopyButton textToCopy={generatedContent.description} />
                            </CardHeader>
                            <CardContent className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: generatedContent.description.replace(/\n/g, '<br />') }} />
                        </Card>
                    </TabsContent>
                    <TabsContent value="questions">
                        <Card>
                             <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Perguntas para Entrevista</CardTitle>
                                <CopyButton textToCopy={generatedContent.interviewQuestions.map(q => `[${q.category}] ${q.question}`).join('\n')} />
                            </CardHeader>
                            <CardContent>
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
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="skills">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Habilidades e Competências Essenciais</CardTitle>
                                <CopyButton textToCopy={generatedContent.requiredSkills.join(', ')} />
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                {generatedContent.requiredSkills.map((skill, index) => (
                                    <div key={index} className="bg-secondary text-secondary-foreground rounded-full px-3 py-1 text-sm">
                                        {skill}
                                    </div>
                                ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </ScrollArea>
            </Tabs>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
