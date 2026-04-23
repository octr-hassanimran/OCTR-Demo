import type { ReactNode } from "react";

export type SectionCardProps = {
  title: string;
  description: string;
  children: ReactNode;
  badge?: string;
};

export function SectionCard({ title, description, children, badge }: SectionCardProps) {
  return (
    <section className="bg-surface border border-white/[0.06] rounded-lg p-5 md:p-6 shadow-[0_10px_40px_rgba(0,0,0,0.35)] transition-all duration-200 hover:border-[rgba(82,183,136,0.18)] hover:shadow-[0_0_0_1px_rgba(82,183,136,0.12),0_14px_44px_rgba(0,0,0,0.38)]">
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm md:text-base font-semibold text-foreground">{title}</h2>
            {badge ? (
              <span className="px-2 py-0.5 text-[11px] rounded-full bg-white/[0.06] text-foreground-muted border border-white/[0.08]">
                {badge}
              </span>
            ) : null}
          </div>
          <p className="text-[12px] md:text-[13px] text-foreground-faint mt-1 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
      {children}
    </section>
  );
}
