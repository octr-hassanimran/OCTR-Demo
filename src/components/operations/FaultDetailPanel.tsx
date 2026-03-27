"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  AlertCircle,
  AlertTriangle,
  Info,
  ExternalLink,
  ClipboardList,
  CheckCircle,
  AlertOctagon,
} from "lucide-react";
import type { PrioritizedFault } from "@/data/operations";

const severityConfig = {
  high: { icon: AlertCircle, color: "text-[#e57373]", bg: "bg-[rgba(229,115,115,0.12)]", label: "HIGH" },
  med: { icon: AlertTriangle, color: "text-[#f6c344]", bg: "bg-[rgba(246,195,68,0.12)]", label: "MEDIUM" },
  low: { icon: Info, color: "text-[#6cb2ff]", bg: "bg-[rgba(108,178,255,0.12)]", label: "LOW" },
};

interface Props {
  fault: PrioritizedFault | null;
  onClose: () => void;
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h4 className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-faint)] mb-1.5">
        {title}
      </h4>
      <p className="text-[13px] leading-relaxed text-[var(--text-muted)]">
        {children}
      </p>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 rounded-md bg-[var(--bg)] border border-[var(--border)]">
      <div className="text-[10px] text-[var(--text-faint)] uppercase tracking-wider mb-0.5">
        {label}
      </div>
      <div className="text-sm font-semibold text-[var(--text)]">{value}</div>
    </div>
  );
}

export function FaultDetailPanel({ fault, onClose }: Props) {
  return (
    <AnimatePresence mode="wait">
      {fault ? (
        <motion.div
          key="fault-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-40"
        >
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
            onClick={onClose}
          />

          <motion.div
            className="absolute right-0 top-0 bottom-0 w-[460px] bg-[var(--surface)] z-50 flex flex-col shadow-2xl border-l border-[var(--border)]"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            {/* Persistent header */}
            <div className="flex-shrink-0 p-5 border-b border-[var(--border)]">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <SeverityBadge severity={fault.severity} />
                    <span className="text-[11px] text-[var(--text-faint)]">
                      {fault.id}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-[var(--text)] leading-tight">
                    {fault.faultType}
                  </h3>
                  <p className="text-[13px] text-[var(--text-muted)] mt-0.5">
                    {fault.equipment}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-md hover:bg-[var(--surface-hover)] transition-colors"
                >
                  <X className="w-5 h-5 text-[var(--text-muted)]" />
                </button>
              </div>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              <Section title="Fault Description">{fault.description}</Section>

              <Section title="Affected Equipment">
                {fault.affectedEquipmentDetails}
              </Section>

              <Section title="Recommended Action">
                {fault.recommendedAction}
              </Section>

              <Section title="Energy Impact Calculation">
                {fault.energyImpactCalc}
              </Section>

              <div className="grid grid-cols-2 gap-2.5">
                <StatCard
                  label="Est. Daily Waste"
                  value={`~${fault.estKwhPerDay} kWh/day`}
                />
                <StatCard label="Duration" value={fault.durationLabel} />
                <StatCard
                  label="OEH Strategy"
                  value={`Opp. ${fault.oehOpp} — ${fault.oehName}`}
                />
                <StatCard
                  label="Status"
                  value={fault.status.replace("_", " ").toUpperCase()}
                />
              </div>

              <div className="space-y-2 pt-1">
                <LinkRow
                  label={`View in Systems Intelligence — ${
                    fault.relatedDb3Tab
                      ? fault.relatedDb3Tab.charAt(0).toUpperCase() +
                        fault.relatedDb3Tab.slice(1) +
                        " Side"
                      : "Overview"
                  }`}
                  href="/systems"
                />
                <LinkRow
                  label={`View Strategy Detail — Opp. ${fault.oehOpp}`}
                  href="/optimization"
                />
              </div>
            </div>

            {/* Sticky footer */}
            <div className="flex-shrink-0 p-4 border-t border-[var(--border)] flex gap-2.5">
              <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-md bg-[var(--primary)] text-white text-[13px] font-medium hover:bg-[var(--primary-soft)] transition-colors">
                <ClipboardList className="w-3.5 h-3.5" />
                Create Task
              </button>
              <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-md border border-[var(--border-strong)] text-[var(--text)] text-[13px] font-medium hover:bg-[var(--surface-hover)] transition-colors">
                <CheckCircle className="w-3.5 h-3.5" />
                Acknowledge
              </button>
              <button className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-md border border-[rgba(229,115,115,0.4)] text-[var(--danger)] text-[13px] font-medium hover:bg-[rgba(229,115,115,0.08)] transition-colors">
                <AlertOctagon className="w-3.5 h-3.5" />
                Escalate
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function SeverityBadge({ severity }: { severity: "high" | "med" | "low" }) {
  const cfg = severityConfig[severity];
  const Icon = cfg.icon;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${cfg.color} ${cfg.bg}`}
    >
      <Icon className="w-3 h-3" />
      {cfg.label}
    </span>
  );
}

function LinkRow({ label, href }: { label: string; href: string }) {
  return (
    <a
      href={href}
      className="flex items-center justify-between p-3 rounded-md bg-[var(--bg)] border border-[var(--border)] hover:border-[var(--primary-bright)] transition-colors group"
    >
      <span className="text-[13px] text-[var(--text-muted)] group-hover:text-[var(--text)] transition-colors">
        {label}
      </span>
      <ExternalLink className="w-3.5 h-3.5 text-[var(--text-faint)] group-hover:text-[var(--primary-bright)] transition-colors" />
    </a>
  );
}
