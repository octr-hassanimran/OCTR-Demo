 "use client";

import { useMemo, useState } from "react";
import { BarChart3, Clock, MessageSquare, Send, Sparkles } from "lucide-react";

type Msg = { role: "user" | "assistant"; text: string };

const quickPrompts = [
  "Which floor has the highest energy use right now?",
  "Generate a daily energy report for yesterday.",
  "Summarize active faults and risk.",
];

const sampleNow = [
  { label: "Floor 18", kw: 182, delta: "+6%" },
  { label: "Floor 21", kw: 171, delta: "+3%" },
  { label: "Floor 12", kw: 158, delta: "+1%" },
];

function fabricateReply(prompt: string) {
  const p = prompt.toLowerCase();

  if (p.includes("highest") && p.includes("energy")) {
    return [
      "Highest load right now:",
      ...sampleNow.map((f, i) => `${i + 1}. ${f.label} — ${f.kw} kW (${f.delta} vs baseline)`),
      "Drivers: dense occupancy + AHU reheat on Floor 18. Suggest increasing supply temp 1.5°C and enabling dimming after 6pm.",
    ].join("\n");
  }

  if (p.includes("report")) {
    return [
      "Daily energy report — yesterday",
      "• Total: 11.4 MWh (−4.2% vs baseline, −2.1% vs last week)",
      "• Top savings: Chiller OPT +1.6 MWh; Lighting L3 schedule +0.8 MWh",
      "• Overruns: Floor 18 reheat +0.4 MWh (humidity spike 3–5pm)",
      "• Carbon: 4.7 tCO₂e (grid mix 32% renewable)",
      "Recommended: ease static pressure setpoint by 0.05 in.w.c. after 7pm; tighten setback to 24°C on low-occupancy floors.",
    ].join("\n");
  }

  if (p.includes("fault") || p.includes("risk")) {
    return [
      "Live issues:",
      "• Chiller-02 short cycling (High) — expected savings loss: 2.1 MWh/week",
      "• Boiler-01 draft fluctuation (Med) — loss: 0.7 MWh/week",
      "• AHU-03 filter delta-P rising (Low) — plan replacement in 48h",
      "Next actions: finalize PID tune on Chiller-02; recheck VFD ramp; confirm filter delivery ETA.",
    ].join("\n");
  }

  return "Got it. For the demo, I can answer about current energy hotspots, produce a daily energy report, or summarize active faults.";
}

export function FMChatDemo() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      text: "I’m your FM copilot. Ask me about energy hotspots, faults, or generate a quick report.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [reportUrl, setReportUrl] = useState<string | null>(null);
  const canSend = input.trim().length > 0;

  const buildPdf = (reply: string) => {
    const content = [
      "Facility Energy Report",
      "— Demo Output —",
      "",
      reply,
      "",
      "Generated: " + new Date().toLocaleString(),
    ].join("\n");
    const blob = new Blob([content], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    setReportUrl(url);
  };

  const handleSend = (text?: string) => {
    const prompt = (text ?? input).trim();
    if (!prompt) return;
    setReportUrl(null);
    setMessages((prev) => [...prev, { role: "user", text: prompt }]);
    setInput("");
    setIsThinking(true);
    const delay = 1400; // slow the reply for a more deliberate feel
    setTimeout(() => {
      const reply = fabricateReply(prompt);
      setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
      if (prompt.toLowerCase().includes("report")) buildPdf(reply);
      setIsThinking(false);
    }, delay);
  };

  const quickPills = useMemo(() => quickPrompts.slice(0, 3), []);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[var(--primary-bright)]" />
          <div>
            <div className="text-sm font-semibold text-[var(--text)]">FM Assistant</div>
            <div className="text-[11px] text-[var(--text-faint)]">
              Ask about load hotspots, faults, or generate quick reports.
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-[var(--text-muted)]">
          <BarChart3 className="w-4 h-4" />
          <span>Reads live/archived ops data (simulated)</span>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-[rgba(255,255,255,0.02)] p-3 h-[340px] overflow-auto space-y-3">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[78%] rounded-lg px-3 py-2 text-[13px] leading-relaxed whitespace-pre-line ${
                m.role === "user"
                  ? "bg-[rgba(101,212,161,0.12)] text-[var(--text)] border border-[rgba(101,212,161,0.35)] shadow-[0_0_0_1px_rgba(101,212,161,0.25)]"
                  : "bg-[rgba(255,255,255,0.04)] text-[var(--text)] border border-white/10"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        {isThinking && (
          <div className="flex justify-start">
            <div className="max-w-[78%] rounded-lg px-3 py-2 text-[13px] leading-relaxed bg-[rgba(255,255,255,0.04)] text-[var(--text)] border border-white/10">
              <span className="inline-flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white/70 animate-pulse" />
                Thinking...
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex flex-wrap gap-2">
          {quickPills.map((q) => (
            <button
              key={q}
              onClick={() => handleSend(q)}
              className="text-[11px] px-3 py-1.5 rounded-full border border-white/10 text-[var(--text-muted)] hover:border-[rgba(101,212,161,0.35)] hover:text-[var(--text)] transition-colors disabled:opacity-50"
              disabled={isThinking}
            >
              {q}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 rounded-lg border border-white/10 bg-[rgba(255,255,255,0.02)] px-3 py-2.5 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[var(--text-faint)]" />
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && canSend && !isThinking) handleSend();
              }}
              placeholder="Ask about energy, faults, or a daily report..."
              className="w-full bg-transparent outline-none text-sm text-[var(--text)] placeholder:text-[var(--text-faint)]"
            />
          </div>
          <button
            onClick={() => handleSend()}
            disabled={!canSend || isThinking}
            className={`flex items-center gap-1 px-3 py-2 rounded-md text-[13px] font-semibold transition-colors ${
              canSend && !isThinking
                ? "bg-[var(--primary)] text-white shadow-[0_0_0_1px_rgba(82,183,136,0.3),0_10px_30px_rgba(64,145,108,0.25)]"
                : "bg-white/5 text-[var(--text-faint)] cursor-not-allowed"
            }`}
          >
            <Send className="w-4 h-4" />
            Send
          </button>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-[var(--text-faint)]">
          <Clock className="w-3.5 h-3.5" />
          <span>Demo only — responses and reports are simulated summaries.</span>
          {reportUrl && (
            <a
              href={reportUrl}
              download="energy-report.pdf"
              className="text-[var(--primary-bright)] underline underline-offset-2"
            >
              Download PDF
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
