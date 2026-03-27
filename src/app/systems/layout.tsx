import { Header } from "@/components/layout/Header";
import { SystemsTabs } from "@/components/layout/SystemsTabs";

export default function SystemsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-full">
      <Header />
      <SystemsTabs />
      <div className="flex-1 overflow-auto p-6">{children}</div>
    </div>
  );
}
