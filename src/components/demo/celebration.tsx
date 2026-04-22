"use client";

import { Sparkles } from "lucide-react";
import { useEffect, type CSSProperties } from "react";

type CelebrationProps = {
  visible: boolean;
  title: string;
  subtitle?: string;
  durationMs?: number;
  onDone?: () => void;
};

const CONFETTI_PARTICLES = [
  { tx: "-120px", ty: "-82px", r: "-20deg", color: "bg-fuchsia-400", delay: 0 },
  { tx: "-84px", ty: "-102px", r: "-8deg", color: "bg-indigo-400", delay: 30 },
  { tx: "-44px", ty: "-110px", r: "10deg", color: "bg-cyan-400", delay: 60 },
  { tx: "2px", ty: "-120px", r: "22deg", color: "bg-amber-300", delay: 90 },
  { tx: "44px", ty: "-108px", r: "14deg", color: "bg-fuchsia-300", delay: 30 },
  { tx: "88px", ty: "-94px", r: "24deg", color: "bg-cyan-300", delay: 100 },
  { tx: "112px", ty: "-54px", r: "18deg", color: "bg-indigo-300", delay: 120 },
  { tx: "-102px", ty: "-44px", r: "-24deg", color: "bg-amber-400", delay: 130 },
] as const;

export function Celebration({
  visible,
  title,
  subtitle,
  durationMs = 1800,
  onDone,
}: CelebrationProps) {
  useEffect(() => {
    if (!visible) return;

    const audioContext = new window.AudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(740, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(
      1200,
      audioContext.currentTime + 0.12
    );

    gainNode.gain.setValueAtTime(0.0001, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.15, audioContext.currentTime + 0.03);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.22);

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.22);

    const timerId = window.setTimeout(() => {
      onDone?.();
    }, durationMs);

    return () => {
      window.clearTimeout(timerId);
      audioContext.close().catch(() => undefined);
    };
  }, [durationMs, onDone, visible]);

  if (!visible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[90] flex items-center justify-center">
      <div className="absolute inset-0 bg-slate-950/15" />
      <div className="relative z-10 rounded-3xl border border-white/70 bg-white/96 px-6 py-5 text-center shadow-[0_24px_44px_-26px_rgba(30,41,59,0.8)] backdrop-blur-sm">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-fuchsia-100 text-fuchsia-600">
          <Sparkles className="h-6 w-6" />
        </div>
        <p className="mt-3 text-xl font-extrabold tracking-tight text-slate-900">{title}</p>
        {subtitle && (
          <p className="mt-1 text-sm font-semibold text-indigo-600">{subtitle}</p>
        )}
      </div>

      <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
        {CONFETTI_PARTICLES.map((particle, index) => (
          <span
            key={index}
            className={`absolute h-2.5 w-2.5 rounded-full ${particle.color} animate-particle-burst`}
            style={
              {
                "--tx": particle.tx,
                "--ty": particle.ty,
                "--r": particle.r,
                animationDelay: `${particle.delay}ms`,
              } as CSSProperties
            }
          />
        ))}
      </div>
    </div>
  );
}
