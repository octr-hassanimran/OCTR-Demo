import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type DetailDrawerProps = {
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
};

export function DetailDrawer({ open, title, subtitle, onClose, children }: DetailDrawerProps) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-40 transition-all duration-200",
        open ? "pointer-events-auto" : "pointer-events-none"
      )}
      aria-hidden={!open}
    >
      {/* Backdrop */}
      <div
        className={cn(
          "absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-200",
          open ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={cn(
          "absolute top-0 right-0 h-full w-full max-w-[560px] bg-[var(--surface)] border-l border-[var(--border)] shadow-2xl",
          "transition-transform duration-250 ease-out",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-start justify-between gap-2 px-5 py-4 border-b border-[var(--border)]">
          <div>
            <div className="text-sm font-semibold text-[var(--text)]">{title}</div>
            {subtitle && (
              <div className="text-[12px] text-[var(--text-muted)] mt-0.5">{subtitle}</div>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-hover)] transition"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-y-auto h-[calc(100%-64px)] p-5">{children}</div>
      </div>
    </div>
  );
}
