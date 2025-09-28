"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { teamStatusData } from "@/lib/data";

const getStatusVariant = (status: string) => {
    if (status.startsWith("Ausente")) return "destructive";
    if (status === "De folga") return "outline";
    if (status === "Em pausa") return "secondary";
    return "default";
};

const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('');
}


export function TeamStatus() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Equipe Hoje</CardTitle>
        <CardDescription>Status atual dos membros da sua equipe.</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {teamStatusData.map((member, index) => (
            <li key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-muted-foreground">{member.status}</p>
                </div>
              </div>
               <Badge variant={getStatusVariant(member.status)}>
                    {member.status === 'Trabalhando' ? 'Ativo' : 
                     member.status === 'Em pausa' ? 'Pausa' : 
                     member.status === 'De folga' ? 'Folga' : 
                     'Ausente'}
                </Badge>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
