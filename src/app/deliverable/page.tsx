"use client";

import Link from "next/link";
import { useEffect } from "react";
import { GraduationBadge } from "@/components/demo/graduation-badge";

import { DeliverableView } from "@/components/demo/deliverable-view";
import { useCourseDemo } from "@/components/course-demo-provider";
import { Card, CardContent } from "@/components/ui/card";

export default function DeliverablePage() {
  const {
    currentDeliverableModule,
    submitDeliverable,
    currentStep,
    setCurrentStep,
    isGraduated,
    completedCount,
    totalModules,
  } = useCourseDemo();

  const handleSubmit = () => {
    setCurrentStep("submitting");
    return new Promise<{ unlockMessage: string } | null>((resolve) => {
      window.setTimeout(() => {
        const result = submitDeliverable();
        if (!result) {
          resolve(null);
          return;
        }

        setCurrentStep("feedback");
        resolve({
          unlockMessage: result.courseCompleted
            ? "Curso completado. Ya no hay mas modulos por desbloquear."
            : `Nuevo modulo desbloqueado: ${result.nextModuleTitle ?? "siguiente modulo"}`,
        });
      }, 1600);
    });
  };

  useEffect(() => {
    if (!currentDeliverableModule) return;
    if (currentStep === "deliverable" || currentStep === "submitting" || currentStep === "feedback") return;

    setCurrentStep("deliverable");
  }, [currentDeliverableModule, currentStep, setCurrentStep]);

  if (!currentDeliverableModule) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-fuchsia-50 via-white to-indigo-50 px-4 pt-10 text-slate-800">
        <main className="mx-auto flex w-full max-w-sm flex-col gap-4">
          <Card className="animate-card-pop rounded-3xl border-fuchsia-100 bg-white/90 shadow-[0_14px_30px_-22px_rgba(30,41,59,0.6)]">
            <CardContent className="p-5 text-center">
              <p className="text-xs font-semibold tracking-wide text-fuchsia-500 uppercase">
                Entregable
              </p>
              <h1 className="mt-2 text-xl font-bold">Programa completado</h1>
              <p className="mt-2 text-sm text-slate-500">
                Ya no hay entregables pendientes. Tu progreso esta completo.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-indigo-100 bg-white/95 shadow-[0_14px_30px_-22px_rgba(30,41,59,0.6)]">
            <CardContent className="space-y-2 p-4 text-center">
              <p className="text-xs font-semibold tracking-wide text-indigo-500 uppercase">
                Estado global demo
              </p>
              <p className="text-base font-bold text-slate-800">
                {completedCount}/{totalModules} modulos completos
              </p>
              {isGraduated && <GraduationBadge compact />}
            </CardContent>
          </Card>

          <Link
            href="/"
            className="inline-flex h-14 w-full items-center justify-center rounded-2xl bg-indigo-600 text-base font-semibold text-white shadow-[0_18px_28px_-16px_rgba(79,70,229,0.95)] transition-transform duration-200 hover:scale-[1.01]"
          >
            Ir al dashboard
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-fuchsia-50 via-white to-indigo-50 px-4 pb-28 pt-6 text-slate-800">
      <div className="pointer-events-none absolute -left-10 top-10 h-40 w-40 rounded-full bg-fuchsia-200/45 blur-2xl" />
      <div className="pointer-events-none absolute -right-12 top-16 h-48 w-48 rounded-full bg-indigo-200/40 blur-2xl" />

      <main className="mx-auto flex w-full max-w-sm flex-col gap-4">
        <header className="animate-card-pop rounded-3xl border border-white/70 bg-white/90 p-4 shadow-[0_14px_30px_-22px_rgba(30,41,59,0.6)] backdrop-blur-sm">
          <p className="text-xs font-semibold tracking-wide text-fuchsia-500 uppercase">
            Entregable final del modulo
          </p>
          <h1 className="mt-1 text-2xl font-extrabold">
            {currentDeliverableModule.title}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Sube tu propuesta. Este paso desbloquea tu siguiente modulo.
          </p>
        </header>

        <DeliverableView
          key={currentDeliverableModule.id}
          moduleTitle={currentDeliverableModule.title}
          step={currentStep}
          onSubmitDeliverable={handleSubmit}
        />
      </main>

      <div className="pointer-events-none fixed inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white to-transparent" />
      <div className="fixed inset-x-0 bottom-5 mx-auto w-full max-w-sm px-4">
        <Link
          href="/"
          onClick={() => setCurrentStep("idle")}
          className="inline-flex h-14 w-full items-center justify-center rounded-2xl bg-indigo-600 text-base font-semibold text-white shadow-[0_20px_32px_-18px_rgba(79,70,229,0.95)] transition-all duration-200 hover:scale-[1.02] hover:bg-indigo-500 active:scale-[0.99]"
        >
          Volver al mapa de modulos
        </Link>
      </div>
    </div>
  );
}
