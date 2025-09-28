import { AppLayout } from "@/components/layout/app-layout";
import { ClockWidget } from "@/components/dashboard/clock-widget";

export default function ClockPage() {
  return (
    <AppLayout>
      <div className="flex items-center justify-center h-[calc(100vh-120px)]">
        <div className="w-full max-w-2xl">
          <ClockWidget />
        </div>
      </div>
    </AppLayout>
  );
}
