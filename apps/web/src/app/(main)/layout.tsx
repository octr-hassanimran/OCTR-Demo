import { DashboardChrome } from "@/components/layout/DashboardChrome";

export default function ExecutiveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardChrome maxWidth="1400px">{children}</DashboardChrome>;
}
