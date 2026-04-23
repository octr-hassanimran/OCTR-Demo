import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: "OCTR — Energy Optimization Platform",
  description: "Building energy optimization and fault detection dashboard for facility managers",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body className="font-sans">
        <div className="flex h-screen min-h-0 overflow-hidden">
          <Sidebar />
          {/* min-h-0 + min-w-0: flex default min-size is content; without this, main cannot shrink and scroll breaks */}
          <main className="min-h-0 min-w-0 flex-1 overflow-y-auto">{children}</main>
        </div>
      </body>
    </html>
  );
}
