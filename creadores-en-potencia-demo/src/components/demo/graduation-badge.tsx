"use client";

import { Crown, Sparkles } from "lucide-react";

type GraduationBadgeProps = {
  compact?: boolean;
};

export function GraduationBadge({ compact = false }: GraduationBadgeProps) {
  if (compact) {
    return (
      <div className="animate-unlock-burst inline-flex items-center rounded-full border border-amber-300/80 bg-amber-100/80 px-3 py-1 text-xs font-bold text-amber-700">
        <Crown className="mr-1 h-3.5 w-3.5" />
        Graduado
      </div>
    );
  }

  return (
    <div className="animate-unlock-burst relative overflow-hidden rounded-3xl border-2 border-amber-300 bg-[linear-gradient(140deg,#fff7cc_10%,#fde68a_42%,#fef3c7_90%)] p-5 text-amber-800 shadow-[0_20px_34px_-20px_rgba(217,119,6,0.85)]">
      <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/45 blur-2xl" />
      <div className="flex items-center gap-3">
        <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/70">
          <Crown className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xl font-extrabold tracking-tight">Graduado</p>
          <p className="text-sm font-semibold text-amber-700/90">
            Completaste el programa
          </p>
        </div>
      </div>
      <div className="mt-3 inline-flex items-center rounded-full bg-white/65 px-3 py-1 text-xs font-semibold">
        <Sparkles className="mr-1.5 h-3.5 w-3.5" />
        Logro premium desbloqueado
      </div>
    </div>
  );
}
