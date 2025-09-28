
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
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
        <div className="md:col-span-3">
          <ClockWidget onClockEvent={handleClockEvent} />
        </div>
        <div className="md:col-span-2">
          <TodaysActivity activities={activity} />
        </div>
      </div>
    </AppLayout>
  );
}
