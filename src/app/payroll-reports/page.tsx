
"use client";

import { AppLayout } from "@/components/layout/app-layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Building,
  Factory,
  Search,
  Grape,
  Bus,
  Utensils,
  PlusCircle,
  LucideIcon
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SummaryCardProps {
    title: string;
    value: string;
    icon: LucideIcon;
}

function SummaryCard({ title, value, icon: Icon }: SummaryCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

export default function PayrollReportsPage() {
    const { toast } = useToast();

    const summaryData = [
        { title: "Total Vale Alimentação (VA)", value: "R$ 15.750,00", icon: Grape },
        { title: "Total Vale Transporte (VT)", value: "R$ 5.250,00", icon: Bus },
        { title: "Total Vale Refeição (VR)", value: "R$ 23.100,00", icon: Utensils },
        { title: "Total Horas Extras (R$)", value: "R$ 8.750,00", icon: PlusCircle },
    ];
    
    const handleApplyFilters = () => {
        toast({
            title: "Filtros Aplicados",
            description: "Os relatórios de folha de pagamento foram atualizados com os filtros selecionados.",
        });
    }

  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">
            Relatórios de Folha de Pagamento
          </h1>
          <p className="text-muted-foreground">
            Analise os custos e valores consolidados da sua folha de pagamento.
          </p>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Filtros de Análise</CardTitle>
                <CardDescription>
                Selecione o período e os filtros para visualizar os dados consolidados.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                     <div className="space-y-2">
                        <label className="text-sm font-medium">Competência</label>
                        <Input type="month" defaultValue="2024-07"/>
                    </div>
                     <div className="space-y-2">
                        <label className="text-sm font-medium">Empresa</label>
                        <Select defaultValue="all">
                            <SelectTrigger>
                                <div className="flex items-center gap-2">
                                <Building className="h-4 w-4 text-muted-foreground" />
                                <SelectValue />
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todas as Empresas</SelectItem>
                                <SelectItem value="cnpj1">01.234.567/0001-89 (Matriz)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <label className="text-sm font-medium">Unidade</label>
                        <Select defaultValue="all">
                            <SelectTrigger>
                                <div className="flex items-center gap-2">
                                <Factory className="h-4 w-4 text-muted-foreground" />
                                <SelectValue />
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todas as Unidades</SelectItem>
                                <SelectItem value="sp">São Paulo - SP</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-end">
                        <Button className="w-full" onClick={handleApplyFilters}>
                            <Search className="mr-2 h-4 w-4" />
                            Aplicar Filtros
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>

         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {summaryData.map((item) => (
                <SummaryCard key={item.title} {...item} />
            ))}
        </div>

        {/* Aqui podem entrar gráficos e tabelas detalhadas no futuro */}

      </div>
    </AppLayout>
  );
}
