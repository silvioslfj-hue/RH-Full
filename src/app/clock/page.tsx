"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { ClockWidget, ClockEvent } from "@/components/dashboard/clock-widget";
import { TodaysActivity } from "@/components/dashboard/todays-activity";
import { todaysActivityData as initialActivity } from "@/lib/data";

export default function ClockPage() {
  const [activity, setActivity] = useState<ClockEvent[]>(initialActivity);

  const handleClockEvent = (newEvent: ClockEvent) => {
    setActivity(prev => [...prev, newEvent]);
  }

  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        <ClockWidget onClockEvent={handleClockEvent} />
        <TodaysActivity activities={activity} />
      </div>
    </AppLayout>
  );
}
