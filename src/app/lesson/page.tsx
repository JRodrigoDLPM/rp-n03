"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Celebration } from "@/components/demo/celebration";
import { VideoPlayer } from "@/components/demo/video-player";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCourseDemo } from "@/components/course-demo-provider";

export default function LessonPage() {
  const router = useRouter();
  const {
    activeModule,
    hasCompletedActiveVideo,
    completeActiveVideo,
    currentStep,
    setCurrentStep,
    openDeliverableForActiveModule,
  } = useCourseDemo();
  const [isHaptic, setIsHaptic] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const canContinueToDeliverable =
    currentStep === "deliverable" || hasCompletedActiveVideo;
  const lessonTitle = activeModule?.title ?? "Curso completo";

  const handleGoToDeliverable = () => {
    if (!activeModule || isTransitioning || !canContinueToDeliverable) return;

    setIsHaptic(true);
    setIsTransitioning(true);
    const opened = openDeliverableForActiveModule();
    if (!opened) {
      setIsTransitioning(false);
      return;
    }
    window.setTimeout(() => router.push("/deliverable"), 420);
  };

  const handlePlayStart = () => {
    if (hasCompletedActiveVideo) return;
    setCurrentStep("playing");
  };

  const handleVideoComplete = () => {
    const result = completeActiveVideo();
    if (!result) return;
    setCurrentStep("celebration");
  };

  useEffect(() => {
    if (!isHaptic) return;

    const timeoutId = window.setTimeout(() => {
      setIsHaptic(false);
    }, 320);

    return () => window.clearTimeout(timeoutId);
  }, [isHaptic]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-indigo-50 via-white to-cyan-50 px-4 pb-28 pt-6 text-slate-800">
      <Celebration
        visible={currentStep === "celebration"}
        title="Leccion completada!"
        subtitle="+5 puntos"
        onDone={() => setCurrentStep("deliverable")}
      />

      <div className="pointer-events-none absolute -left-8 top-10 h-36 w-36 rounded-full bg-fuchsia-200/45 blur-2xl" />
      <div className="pointer-events-none absolute -right-10 top-24 h-44 w-44 rounded-full bg-cyan-200/45 blur-2xl" />

      <main className="mx-auto flex w-full max-w-sm flex-col gap-4">
        <header className="animate-card-pop rounded-3xl border border-white/70 bg-white/90 p-4 shadow-[0_14px_30px_-22px_rgba(30,41,59,0.6)] backdrop-blur-sm">
          <p className="text-xs font-semibold tracking-wide text-indigo-500 uppercase">
            Leccion activa
          </p>
          <h1 className="mt-1 text-2xl font-extrabold">{lessonTitle}</h1>
          <p className="mt-1 text-sm text-slate-500">
            Mira el video y luego envia tu entregable para cerrar el modulo.
          </p>
        </header>

        <Card className="animate-card-pop overflow-hidden rounded-3xl border-white/60 bg-white/90 shadow-[0_14px_30px_-22px_rgba(30,41,59,0.6)] [animation-delay:90ms]">
          <CardContent className="p-4">
            <VideoPlayer
              key={activeModule?.id ?? "no-active-module"}
              completed={hasCompletedActiveVideo}
              onPlayStart={handlePlayStart}
              onComplete={handleVideoComplete}
            />

            <div className="relative mt-4 text-center">
              <p className="text-sm text-slate-500">
                Este modulo termina con un entregable evaluado por IA.
              </p>
              {canContinueToDeliverable && (
                <p className="mt-1 text-xs font-semibold text-emerald-600">
                  Video completado. Ya puedes continuar al entregable.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="animate-fade-up flex items-center justify-between rounded-2xl bg-white/85 px-4 py-3 shadow-[0_12px_24px_-20px_rgba(30,41,59,0.6)] [animation-delay:140ms]">
          <Badge className="rounded-full bg-cyan-100 text-cyan-700 hover:bg-cyan-100">
            Recompensa por modulo
          </Badge>
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-slate-700">
            <Sparkles className="h-4 w-4 text-fuchsia-500" />
            +5
          </span>
        </div>
      </main>

      <div className="pointer-events-none fixed inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white to-transparent" />
      <div className="fixed inset-x-0 bottom-5 mx-auto flex w-full max-w-sm justify-center px-4">
        <div className="relative w-full">
          <Button
            onClick={handleGoToDeliverable}
            disabled={!activeModule || isTransitioning || !canContinueToDeliverable}
            className={`group relative z-10 h-16 w-full rounded-2xl text-white transition-transform duration-200 hover:scale-[1.02] active:scale-[0.99] ${
              !activeModule
                ? "bg-indigo-500 shadow-[0_14px_26px_-14px_rgba(99,102,241,0.9)]"
                : "animate-cta-breathe bg-indigo-600 shadow-[0_22px_38px_-20px_rgba(99,102,241,0.95)] hover:bg-indigo-500"
            } ${isHaptic ? "animate-haptic-nudge" : ""}`}
            onPointerDown={() => {
              if (activeModule) setIsHaptic(true);
            }}
          >
            {!activeModule ? (
              <span className="inline-flex items-center text-base font-bold">
                Curso terminado
              </span>
            ) : (
              <span className="inline-flex items-center text-base font-bold">
                {isTransitioning
                  ? "Abriendo entregable..."
                  : canContinueToDeliverable
                    ? "Continuar al entregable"
                    : "Completa el video para continuar"}
                <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            )}
          </Button>
        </div>
      </div>

      <div className="mt-6 text-center">
        <Link
          href="/"
          className="text-sm font-medium text-slate-500 underline-offset-4 hover:text-slate-700 hover:underline"
        >
          Volver al mapa de modulos
        </Link>
      </div>
    </div>
  );
}
