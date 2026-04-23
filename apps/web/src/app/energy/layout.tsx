import { DashboardChrome } from "@/components/layout/DashboardChrome";

export default function EnergyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardChrome maxWidth="1700px">{children}</DashboardChrome>;
}
