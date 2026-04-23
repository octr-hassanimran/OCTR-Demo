import { DashboardChrome } from "@/components/layout/DashboardChrome";
import { Header } from "@/components/layout/Header";
import { SystemsTabs } from "@/components/layout/SystemsTabs";

export default function SystemsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardChrome maxWidth="1700px">
      <div className="min-h-screen flex flex-col">
        <div className="w-full max-w-[1400px] mx-auto shrink-0">
          <Header />
          <SystemsTabs />
        </div>
        <div className="w-full max-w-[1400px] mx-auto flex-1 pb-8 pt-2">
          {children}
        </div>
      </div>
    </DashboardChrome>
  );
}
