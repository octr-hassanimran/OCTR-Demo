"use client";

import { prioritizedFaults, type PrioritizedFault } from "@/data/operations";
import { AlertCircle, AlertTriangle, Info, ChevronRight } from "lucide-react";

const severityConfig = {
  high: {
    icon: AlertCircle,
    color: "text-[#e57373]",
    border: "border-l-[#e57373]",
    label: "High",
  },
  med: {
    icon: AlertTriangle,
    color: "text-[#f6c344]",
    border: "border-l-[#f6c344]",
    label: "Med",
  },
  low: {
    icon: Info,
    color: "text-[#6cb2ff]",
    border: "border-l-[#6cb2ff]",
    label: "Low",
  },
};

const statusStyles = {
  open: "text-[#e57373] bg-[rgba(229,115,115,0.12)]",
  ack: "text-[#f6c344] bg-[rgba(246,195,68,0.12)]",
  in_progress: "text-[#52b788] bg-[rgba(82,183,136,0.12)]",
};

const statusLabels = {
  open: "OPEN",
  ack: "ACK",
  in_progress: "IN PROGRESS",
};

interface Props {
  onSelectFault: (fault: PrioritizedFault) => void;
}

export function PrioritizedActionList({ onSelectFault }: Props) {
  return (
    <div className="space-y-1.5">
      {prioritizedFaults.map((fault) => {
        const sev = severityConfig[fault.severity];
        const SevIcon = sev.icon;

        return (
          <button
            key={fault.id}
            onClick={() => onSelectFault(fault)}
            className={`
              w-full flex items-center gap-4 p-4 rounded-md text-left
              border-l-[3px] ${sev.border}
              bg-[var(--surface)]
              shadow-[0_0_0_1px_rgba(255,255,255,0.06)]
              cursor-pointer group
              transition-all duration-200 ease-[var(--ease-standard)]
              hover:shadow-[0_0_0_1px_rgba(82,183,136,0.35),0_8px_32px_rgba(64,145,108,0.2)]
              hover:-translate-y-px
            `}
          >
            <div className="flex-shrink-0 flex items-center gap-1.5 w-14">
              <SevIcon className={`w-4 h-4 ${sev.color}`} />
              <span className={`text-[11px] font-semibold ${sev.color}`}>
                {sev.label}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-medium text-[var(--text)] leading-tight">
                {fault.faultType}
              </div>
              <div className="flex items-center gap-1.5 mt-1 text-[11px] text-[var(--text-muted)]">
                <span>{fault.equipment}</span>
                <span className="text-[var(--text-faint)]">&middot;</span>
                <span>{fault.durationLabel}</span>
                <span className="text-[var(--text-faint)]">&middot;</span>
                <span className="text-[var(--primary-bright)]">
                  Opp.&nbsp;{fault.oehOpp}
                </span>
                <span className="text-[var(--text-faint)]">&mdash;</span>
                <span className="truncate">{fault.oehName}</span>
              </div>
            </div>

            <div className="flex-shrink-0 text-right mr-2">
              <div className="text-[15px] font-bold text-[var(--text)] leading-tight">
                ~{fault.estKwhPerDay}
              </div>
              <div className="text-[10px] text-[var(--text-faint)] mt-0.5">
                kWh/day
              </div>
            </div>

            <div className="flex-shrink-0 w-20 text-center">
              <span
                className={`inline-block px-2 py-0.5 text-[10px] font-semibold rounded-full ${statusStyles[fault.status]}`}
              >
                {statusLabels[fault.status]}
              </span>
            </div>

            <ChevronRight className="w-4 h-4 text-[var(--text-faint)] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
          </button>
        );
      })}
    </div>
  );
}
