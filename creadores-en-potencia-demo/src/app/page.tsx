"use client";

import {
  ArrowRight,
  CalendarCheck2,
  Check,
  Flame,
  Gem,
  Lock,
  MessageCirclePlus,
  Play,
} from "lucide-react";
import type { ReactNode } from "react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { DemoProgressBar } from "@/components/demo/progress-bar";
import { GraduationBadge } from "@/components/demo/graduation-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useCourseDemo } from "@/components/course-demo-provider";

type ModuleStatus = "completed" | "active" | "locked";

const nodeStyles: Record<
  ModuleStatus,
  { circle: string; badge: string; icon: ReactNode; label: string }
> = {
  completed: {
    circle:
      "bg-emerald-500 text-white shadow-[0_10px_22px_-12px_rgba(16,185,129,0.9)]",
    badge: "bg-emerald-100 text-emerald-700",
    icon: <Check className="h-5 w-5" />,
    label: "Completado",
  },
  active: {
    circle:
      "bg-indigo-500 text-white ring-8 ring-indigo-200/80 shadow-[0_14px_28px_-10px_rgba(99,102,241,0.9)] animate-float-y",
    badge: "bg-indigo-100 text-indigo-700",
    icon: <Play className="h-5 w-5 fill-current" />,
    label: "Siguiente",
  },
  locked: {
    circle:
      "bg-slate-200 text-slate-500 shadow-[0_8px_20px_-12px_rgba(100,116,139,0.5)]",
    badge: "bg-slate-100 text-slate-500",
    icon: <Lock className="h-5 w-5" />,
    label: "Bloqueado",
  },
};

export default function Home() {
  const {
    userName,
    streakDays,
    points,
    modules,
    activeModule,
    completedCount,
    totalModules,
    progressPercentage,
    progressPulseKey,
    completedVideosCount,
    completedDeliverablesCount,
    isGraduated,
    dailyCommentsCount,
    weeklyStreakRewardClaimed,
    awardPoints,
    latestPointEvent,
    clearLatestPointEvent,
    pointsHistory,
    bannerMessage,
    clearBannerMessage,
    resetDemo,
  } = useCourseDemo();

  const handleResetDemo = () => {
    const confirmed = window.confirm("¿Reiniciar progreso?");
    if (!confirmed) return;

    resetDemo();
  };
  const [showGamificationModal, setShowGamificationModal] = useState(false);

  const handleCommentReward = () => {
    const awarded = awardPoints("COMMENT_CREATED");
    if (!awarded) {
      window.alert("Limite diario alcanzado (3 comentarios demo).");
    }
  };

  const handleWeeklyReward = () => {
    const awarded = awardPoints("WEEKLY_STREAK");
    if (!awarded) {
      window.alert("La recompensa semanal ya fue reclamada.");
    }
  };

  useEffect(() => {
    if (!bannerMessage) return;

    const timeoutId = window.setTimeout(() => {
      clearBannerMessage();
    }, 2500);

    return () => window.clearTimeout(timeoutId);
  }, [bannerMessage, clearBannerMessage]);

  useEffect(() => {
    if (!latestPointEvent) return;

    const timeoutId = window.setTimeout(() => {
      clearLatestPointEvent();
    }, 1800);

    return () => window.clearTimeout(timeoutId);
  }, [latestPointEvent, clearLatestPointEvent]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-indigo-50 via-white to-cyan-50 px-4 pb-32 pt-6 text-slate-800">
      <div className="pointer-events-none absolute -left-10 -top-8 h-44 w-44 rounded-full bg-fuchsia-200/45 blur-2xl" />
      <div className="pointer-events-none absolute -right-16 top-20 h-56 w-56 rounded-full bg-cyan-200/40 blur-2xl" />
      {showGamificationModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/35 p-4 sm:items-center">
          <div className="w-full max-w-sm animate-card-pop rounded-3xl border border-white/70 bg-white p-4 shadow-[0_24px_44px_-24px_rgba(30,41,59,0.85)]">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-semibold tracking-wide text-indigo-500 uppercase">
                Acciones gamificadas
              </p>
              <button
                type="button"
                onClick={() => setShowGamificationModal(false)}
                className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-700"
              >
                Cerrar
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleCommentReward}
                className="inline-flex items-center justify-center rounded-xl bg-cyan-50 px-3 py-2 text-xs font-semibold text-cyan-700 transition-all hover:translate-y-[-1px] hover:bg-cyan-100"
              >
                <MessageCirclePlus className="mr-1.5 h-3.5 w-3.5" />
                Comentar demo (+5)
              </button>
              <button
                type="button"
                onClick={handleWeeklyReward}
                className="inline-flex items-center justify-center rounded-xl bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700 transition-all hover:translate-y-[-1px] hover:bg-amber-100"
              >
                <CalendarCheck2 className="mr-1.5 h-3.5 w-3.5" />
                Semana completa (+10)
              </button>
            </div>
            <div className="mt-3 text-xs text-slate-500">
              Comentarios hoy: {dailyCommentsCount}/3 · Recompensa semanal:{" "}
              {weeklyStreakRewardClaimed ? "reclamada" : "pendiente"}
            </div>
          </div>
        </div>
      )}
      {latestPointEvent && (
        <div className="pointer-events-none fixed inset-0 z-40 flex items-center justify-center">
          <div className="animate-points-pop rounded-full bg-indigo-600 px-4 py-2 text-sm font-extrabold text-white shadow-[0_18px_28px_-16px_rgba(79,70,229,0.95)]">
            +{latestPointEvent.points} puntos · {latestPointEvent.label}
          </div>
        </div>
      )}

      <main className="mx-auto flex w-full max-w-sm flex-col gap-4">
        <header className="animate-card-pop rounded-3xl border border-white/70 bg-white/90 p-4 shadow-[0_14px_30px_-22px_rgba(30,41,59,0.6)] backdrop-blur-sm">
          <div className="flex items-start justify-between gap-3">
            <p className="text-xs font-semibold tracking-wide text-indigo-500 uppercase">
              Camino de aprendizaje
            </p>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setShowGamificationModal(true)}
                className="rounded-full bg-indigo-100 px-2.5 py-1 text-[11px] font-semibold text-indigo-700 transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-200 active:translate-y-0"
              >
                Acciones
              </button>
              <button
                type="button"
                onClick={handleResetDemo}
                className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500 transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-200 hover:text-slate-700 active:translate-y-0"
              >
                Reiniciar demo
              </button>
            </div>
          </div>
          <h1 className="mt-1 text-2xl leading-tight font-extrabold tracking-tight">
            Creadores en potencia
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Hola, {userName}. Tu siguiente paso ya esta listo.
          </p>

          <div className="mt-4 flex items-center gap-2 text-xs">
            <Badge className="rounded-full bg-cyan-100 text-cyan-700 transition-transform hover:scale-[1.03] hover:bg-cyan-100">
              {completedCount}/{totalModules} modulos
            </Badge>
            <Badge className="rounded-full bg-amber-100 text-amber-700 transition-transform hover:scale-[1.03] hover:bg-amber-100">
              <Flame className="mr-1 h-3.5 w-3.5" />
              {streakDays} dias
            </Badge>
            <Badge className="rounded-full bg-fuchsia-100 text-fuchsia-700 transition-transform hover:scale-[1.03] hover:bg-fuchsia-100">
              <Gem className="mr-1 h-3.5 w-3.5" />
              {points}
            </Badge>
          </div>

          <div key={progressPulseKey} className="mt-4">
            <DemoProgressBar value={progressPercentage} />
          </div>
        </header>

        {isGraduated && <GraduationBadge />}

        {bannerMessage && (
          <div className="animate-unlock-burst rounded-2xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm font-semibold text-indigo-700 shadow-[0_12px_24px_-20px_rgba(79,70,229,0.85)]">
            {bannerMessage}
          </div>
        )}

        <Card className="animate-card-pop rounded-3xl border-white/60 bg-white/88 shadow-[0_14px_30px_-22px_rgba(30,41,59,0.6)] [animation-delay:90ms]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold tracking-wide text-indigo-500 uppercase">
                  Perfil demo
                </p>
                <p className="text-base font-bold text-slate-800">{userName}</p>
              </div>
              {isGraduated ? (
                <GraduationBadge compact />
              ) : (
                <span className="rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                  En progreso
                </span>
              )}
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-xl bg-slate-50 p-2.5">
                <p className="font-semibold text-slate-800">Videos</p>
                <p className="text-slate-500">
                  {completedVideosCount}/{totalModules}
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-2.5">
                <p className="font-semibold text-slate-800">Entregables</p>
                <p className="text-slate-500">
                  {completedDeliverablesCount}/{totalModules}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="animate-card-pop rounded-3xl border-white/60 bg-white/85 shadow-[0_14px_30px_-22px_rgba(30,41,59,0.6)] [animation-delay:120ms]">
          <CardContent className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-700">Tu mapa de modulos</p>
              <p className="text-xs text-slate-500">Desliza y continua</p>
            </div>
            <div className="relative space-y-2 py-2">
              {modules.map((module, index) => {
                const sideClass =
                  index % 2 === 0 ? "translate-x-[-26px]" : "translate-x-[26px]";
                const isLast = index === modules.length - 1;
                const status = nodeStyles[module.state];

                return (
                  <div
                    key={module.id}
                    className={`relative flex flex-col items-center ${sideClass} animate-fade-up`}
                    style={{ animationDelay: `${170 + index * 90}ms` }}
                  >
                    <div
                      className={`relative z-10 flex h-[72px] w-[72px] items-center justify-center rounded-full border-4 border-white transition-all duration-200 hover:scale-[1.06] active:scale-[1.01] ${status.circle} ${
                        module.state === "active" ? "animate-soft-attention" : ""
                      }`}
                    >
                      {status.icon}
                      {module.state === "active" && (
                        <span className="absolute -inset-2 rounded-full border-2 border-indigo-300/80 animate-ping" />
                      )}
                    </div>

                    <div className="relative z-10 mt-2 flex max-w-[220px] flex-col items-center text-center transition-transform duration-200 hover:translate-y-[-1px]">
                      <Badge
                        className={`rounded-full px-3 py-1 text-[11px] font-semibold hover:opacity-100 ${status.badge}`}
                      >
                        {status.label}
                      </Badge>
                      <p className="mt-1 text-sm font-semibold text-slate-800">
                        {module.title}
                      </p>
                      <p className="text-xs text-slate-500">
                        {module.lessons} lecciones
                      </p>
                    </div>

                    {!isLast && (
                      <div className="mt-3 h-10 w-[2px] rounded-full bg-gradient-to-b from-cyan-200 via-indigo-200 to-fuchsia-200" />
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="animate-card-pop rounded-3xl border-white/60 bg-white/88 shadow-[0_14px_30px_-22px_rgba(30,41,59,0.6)] [animation-delay:112ms]">
          <CardContent className="space-y-2 p-4">
            <p className="text-xs font-semibold tracking-wide text-indigo-500 uppercase">
              Historial de puntos
            </p>
            {pointsHistory.length === 0 ? (
              <p className="text-xs text-slate-500">Aun no hay acciones registradas.</p>
            ) : (
              pointsHistory.slice(0, 4).map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-xs"
                >
                  <span className="font-semibold text-slate-700">{entry.label}</span>
                  <span className="font-bold text-indigo-600">+{entry.points}</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </main>

      <div className="pointer-events-none fixed inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white to-transparent" />
      <div className="fixed inset-x-0 bottom-5 mx-auto w-full max-w-sm px-4">
        {activeModule ? (
          <Link
            href="/lesson"
            className="animate-cta-breathe group relative inline-flex h-16 w-full flex-col items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-[0_22px_38px_-20px_rgba(79,70,229,0.95)] transition-all duration-200 hover:scale-[1.02] hover:bg-indigo-500 active:scale-[0.99]"
          >
            <span className="text-[11px] font-medium text-indigo-100">
              Siguiente modulo: {activeModule.title}
            </span>
            <span className="inline-flex items-center text-base font-extrabold tracking-tight">
              Continuar ahora
              <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        ) : (
          <div className="inline-flex h-16 w-full flex-col items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-[0_16px_28px_-14px_rgba(16,185,129,0.9)]">
            <span className="text-xs font-medium text-emerald-100">
              Curso finalizado
            </span>
            <span className="text-base font-bold">Todos los modulos completos</span>
          </div>
        )}
      </div>
    </div>
  );
}
