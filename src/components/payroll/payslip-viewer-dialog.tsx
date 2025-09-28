
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PayslipViewerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
  employeeName: string;
  competence: string;
}

export function PayslipViewerDialog({
  isOpen,
  onClose,
  content,
  employeeName,
  competence,
}: PayslipViewerDialogProps) {
  const { toast } = useToast();
  
  const handleDownload = () => {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const fileName = `holerite_${employeeName.replace(/\s/g, '_')}_${competence.replace('/', '-')}.txt`;
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast({
      title: "Download Iniciado",
      description: `O arquivo ${fileName} foi salvo.`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Holerite de {employeeName} - {competence}</DialogTitle>
          <DialogDescription>
            Este é o recibo de pagamento gerado pela IA. Você pode copiar o conteúdo ou baixá-lo como um arquivo de texto.
          </DialogDescription>
        </DialogHeader>
        <div className="my-4 max-h-[60vh] overflow-y-auto rounded-md border bg-muted/50 p-4">
          <pre className="text-sm font-mono whitespace-pre-wrap">{content}</pre>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
          <Button onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Baixar Holerite (.txt)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
