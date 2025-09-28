"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Edit } from "lucide-react";

type PendingAdjustment = {
    id: string;
    date: string;
    reason: string;
    requester: string;
};

interface PendingAdjustmentsProps {
    adjustments: PendingAdjustment[];
    onJustify: (adjustment: PendingAdjustment) => void;
}

export function PendingAdjustments({ adjustments, onJustify }: PendingAdjustmentsProps) {
  return (
    <Card className="border-primary/50 bg-primary/5">
        <CardHeader>
            <div className="flex items-center gap-3">
                <AlertTriangle className="h-6 w-6 text-primary" />
                <div>
                    <CardTitle className="text-xl">Ajustes de Ponto Pendentes</CardTitle>
                    <CardDescription className="text-primary/90">Seu gestor solicitou os seguintes ajustes. Por favor, corrija-os.</CardDescription>
                </div>
            </div>
        </CardHeader>
        <CardContent>
            <ul className="space-y-3">
              {adjustments.map((adj) => (
                <li key={adj.id} className="flex items-center justify-between p-4 border rounded-lg bg-background">
                  <div>
                    <p className="font-semibold text-sm">
                      Data: <span className="font-mono">{new Date(adj.date).toLocaleDateString('pt-BR')}</span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-semibold">Motivo:</span> {adj.reason}
                    </p>
                     <p className="text-xs text-muted-foreground">Solicitado por: {adj.requester}</p>
                  </div>
                  <Button onClick={() => onJustify(adj)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Justificar
                  </Button>
                </li>
              ))}
            </ul>
        </CardContent>
    </Card>
  );
}
