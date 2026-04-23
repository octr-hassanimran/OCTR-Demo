import type { ReactNode } from "react";
import { DashboardChrome } from "@/components/layout/DashboardChrome";

export default function OptimisationAlgosLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <DashboardChrome maxWidth="1700px">{children}</DashboardChrome>;
}
