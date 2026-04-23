import type { Metadata } from "next";
import { DashboardChrome } from "@/components/layout/DashboardChrome";

export const metadata: Metadata = {
  title: "Visuals Lab 1 — OCTR",
  description: "Visual experiments: motion, glass, and chart styling for the OCTR demo.",
};

export default function VisualsLab1Layout({ children }: { children: React.ReactNode }) {
  return <DashboardChrome maxWidth="1700px">{children}</DashboardChrome>;
}
