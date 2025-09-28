
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, LogIn, LogOut } from "lucide-react";
import type { ClockEvent } from "./clock-widget";

interface TodaysActivityProps {
  activities: ClockEvent[];
}

export function TodaysActivity({ activities }: TodaysActivityProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Atividade de Hoje
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length > 0 ? (
          <ul className="space-y-4">
            {activities.map((activity, index) => (
              <li key={index} className="flex items-center gap-4">
                {activity.type === 'Entrada' ? (
                  <LogIn className="h-5 w-5 text-green-500" />
                ) : (
                  <LogOut className="h-5 w-5 text-red-500" />
                )}
                <div className="flex-grow">
                  <p className="font-medium">{activity.type}</p>
                </div>
                <p className="text-sm text-muted-foreground font-mono">{activity.time}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            Nenhuma atividade registrada hoje.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
