"use client";

import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { ClockWidget, ClockEvent } from "@/components/dashboard/clock-widget";
import { TodaysActivity } from "@/components/dashboard/todays-activity";
import { db } from "@/lib/firebaseClient";
import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";
import { startOfDay, endOfDay } from "date-fns";

export default function ClockPage() {
  const [activity, setActivity] = useState<ClockEvent[]>([]);
  const [lastEventType, setLastEventType] = useState<'Entrada' | 'Saída' | null>(null);

  // Assume logged in user for demo
  const employeeId = "user_jane_doe";

  useEffect(() => {
    const fetchTodaysActivity = async () => {
      const todayStart = startOfDay(new Date());
      const todayEnd = endOfDay(new Date());

      const q = query(
        collection(db, "clock_events"),
        where("employeeId", "==", employeeId),
        where("timestamp", ">=", todayStart),
        where("timestamp", "<=", todayEnd),
        orderBy("timestamp", "desc")
      );
      
      const querySnapshot = await getDocs(q);
      const todaysEvents = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ClockEvent));
      setActivity(todaysEvents);

      if (todaysEvents.length > 0) {
        setLastEventType(todaysEvents[0].type);
      }
    };
    
    fetchTodaysActivity();
  }, [employeeId]);

  const handleClockEvent = (newEvent: ClockEvent) => {
    setActivity(prev => [newEvent, ...prev]);
    setLastEventType(newEvent.type);
  }
  
  const isClockedIn = lastEventType === 'Entrada';

  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        <ClockWidget onClockEvent={handleClockEvent} initialIsClockedIn={isClockedIn} />
        <TodaysActivity activities={activity} />
      </div>
    </AppLayout>
  );
}
