"use client";

import { PlayCircle, Video } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { DemoProgressBar } from "@/components/demo/progress-bar";

type VideoPlayerProps = {
  completed: boolean;
  onPlayStart?: () => void;
  onComplete: () => void;
};

export function VideoPlayer({
  completed,
  onPlayStart,
  onComplete,
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(() => (completed ? 100 : 0));
  const hasTriggeredCompletion = useRef(completed);
  const displayedProgress = completed ? 100 : progress;

  useEffect(() => {
    hasTriggeredCompletion.current = completed;
  }, [completed]);

  useEffect(() => {
    if (!isPlaying || completed) return;

    const intervalId = window.setInterval(() => {
      setProgress((current) => {
        const next = Math.min(100, current + 2.2);

        if (next >= 100) {
          window.clearInterval(intervalId);
        }

        return next;
      });
    }, 90);

    return () => window.clearInterval(intervalId);
  }, [completed, isPlaying, onComplete]);

  useEffect(() => {
    if (!isPlaying || completed) return;
    if (progress < 100) return;
    if (hasTriggeredCompletion.current) return;

    hasTriggeredCompletion.current = true;
    setIsPlaying(false);
    onComplete();
  }, [completed, isPlaying, onComplete, progress]);

  const handlePlay = () => {
    if (completed || isPlaying) return;
    setProgress(0);
    setIsPlaying(true);
    onPlayStart?.();
  };

  return (
    <div className="space-y-3">
      <div className="relative h-56 overflow-hidden rounded-2xl bg-slate-900">
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(99,102,241,0.24)_15%,rgba(14,165,233,0.2)_40%,rgba(232,121,249,0.2)_60%,rgba(99,102,241,0.24)_85%)] animate-shimmer-sweep" />
        <div className="relative flex h-full flex-col items-center justify-center text-center text-white">
          <Video className="h-11 w-11 text-white/90" />
          <p className="mt-2 text-sm font-semibold text-white/90">Video de la leccion</p>
          <p className="text-xs text-white/70">Duracion simulada: 00:04</p>
        </div>
      </div>

      <DemoProgressBar
        value={displayedProgress}
        label={isPlaying ? "Reproduciendo..." : completed ? "Completado" : "Listo para reproducir"}
        emphasize={isPlaying || completed}
      />

      <Button
        onClick={handlePlay}
        disabled={isPlaying || completed}
        className={`group h-12 w-full rounded-2xl text-sm font-bold text-white transition-all duration-200 active:scale-[0.99] ${
          completed
            ? "bg-emerald-500 shadow-[0_14px_26px_-16px_rgba(16,185,129,0.9)]"
            : "bg-indigo-600 shadow-[0_16px_28px_-18px_rgba(79,70,229,0.95)] hover:scale-[1.01] hover:bg-indigo-500"
        }`}
      >
        {completed ? (
          "Video completado"
        ) : isPlaying ? (
          "Reproduciendo..."
        ) : (
          <span className="inline-flex items-center">
            <PlayCircle className="mr-1.5 h-4 w-4 transition-transform group-hover:scale-110" />
            Reproducir
          </span>
        )}
      </Button>
    </div>
  );
}
