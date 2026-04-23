import { DashboardChrome } from "@/components/layout/DashboardChrome";

export default function DesignLabLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardChrome maxWidth="1700px">{children}</DashboardChrome>;
}
