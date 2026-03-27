"use client";

export function Header() {
  return (
    <header
      className="h-14 flex items-center justify-between px-6 shrink-0"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div>
        <h1 className="text-[20px] font-semibold text-[#e8f5e9]">
          Systems Intelligence
        </h1>
        <p className="text-[13px] text-[#a7c4b5] -mt-0.5">
          Full plant monitoring by circuit
        </p>
      </div>
      <div className="flex items-center gap-2 text-[13px] text-[#a7c4b5]">
        <span className="w-2 h-2 rounded-full bg-[#52b788] animate-pulse" />
        Live &bull; 2 min ago
      </div>
    </header>
  );
}
