"use client";

import { ArrowRight, LoaderCircle, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";

import { Celebration } from "@/components/demo/celebration";
import type { DemoStep } from "@/components/course-demo-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type DeliverableFormProps = {
  moduleTitle: string;
  step: DemoStep;
  onSubmitDeliverable: () => Promise<{ unlockMessage: string } | null>;
};

export function DeliverableForm({
  moduleTitle,
  step,
  onSubmitDeliverable,
}: DeliverableFormProps) {
  const [draft, setDraft] = useState("");
  const [unlockMessage, setUnlockMessage] = useState<string | null>(null);
  const [hasShownFeedbackCelebration, setHasShownFeedbackCelebration] = useState(false);

  const feedback = useMemo(() => {
    return {
      good: "Lo hiciste bien: identificaste el problema correctamente.",
      improve: "Puedes mejorar: profundizar en tus emociones.",
      nextStep: "Siguiente paso: aplica esto manana.",
    };
  }, []);

  const handleSubmitDeliverable = async () => {
    if (step === "submitting" || step === "feedback") return;
    const result = await onSubmitDeliverable();
    if (!result) return;
    setUnlockMessage(result.unlockMessage);
  };

  return (
    <>
      <Celebration
        visible={step === "feedback" && !hasShownFeedbackCelebration}
        title="Entregable enviado"
        subtitle="+50 puntos · Feedback IA listo"
        onDone={() => setHasShownFeedbackCelebration(true)}
      />

      {step === "deliverable" && (
        <Card className="animate-card-pop rounded-3xl border-fuchsia-100 bg-white/95 shadow-[0_16px_30px_-22px_rgba(30,41,59,0.62)]">
          <CardContent className="space-y-4 p-4">
            <div className="rounded-2xl bg-fuchsia-50 p-3 transition-transform duration-200 hover:translate-y-[-1px]">
              <p className="text-sm font-semibold text-fuchsia-700">
                Ejercicio: propuesta de valor en 5 lineas
              </p>
              <p className="mt-1 text-xs text-slate-600">
                Modulo: {moduleTitle}. Describe tu solucion, a quien ayuda y por que es
                relevante.
              </p>
            </div>

            <textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Escribe aqui tu entregable..."
              className="min-h-36 w-full resize-none rounded-2xl border border-fuchsia-100 bg-white px-4 py-3 text-sm text-slate-800 outline-none ring-fuchsia-200 transition duration-200 placeholder:text-slate-400 focus:border-fuchsia-300 focus:ring-4"
            />

            <Button
              onClick={handleSubmitDeliverable}
              className="group h-14 w-full rounded-2xl bg-fuchsia-600 text-base font-extrabold tracking-tight text-white shadow-[0_20px_34px_-18px_rgba(192,38,211,0.92)] transition-all duration-200 hover:scale-[1.02] hover:bg-fuchsia-500 active:scale-[0.99]"
            >
              <span className="inline-flex items-center">
                Enviar entregable
                <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Button>
          </CardContent>
        </Card>
      )}

      {step === "submitting" && (
        <Card className="animate-card-pop rounded-3xl border-indigo-100 bg-white/95 shadow-[0_16px_30px_-22px_rgba(30,41,59,0.62)]">
          <CardContent className="flex flex-col items-center justify-center gap-3 p-6 text-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
              <LoaderCircle className="h-6 w-6 animate-spin" />
            </div>
            <p className="text-base font-bold text-slate-800">Enviando entregable...</p>
            <p className="text-sm text-slate-500">
              Generando feedback y actualizando tu progreso.
            </p>
          </CardContent>
        </Card>
      )}

      {step === "feedback" && (
        <Card className="animate-unlock-burst rounded-3xl border-indigo-100 bg-white/95 shadow-[0_16px_30px_-22px_rgba(30,41,59,0.62)]">
          <CardContent className="space-y-4 p-4">
            <div className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
              <Sparkles className="mr-1 h-3.5 w-3.5" />
              Feedback generado por IA
            </div>

            <div className="rounded-2xl bg-emerald-50 p-3 transition-transform duration-200 hover:translate-x-0.5">
              <p className="text-sm font-semibold text-emerald-700">✅ Lo hiciste bien</p>
              <p className="mt-1 text-sm text-slate-700">{feedback.good}</p>
            </div>

            <div className="rounded-2xl bg-amber-50 p-3 transition-transform duration-200 hover:translate-x-0.5">
              <p className="text-sm font-semibold text-amber-700">
                ⚠️ Puedes mejorar en
              </p>
              <p className="mt-1 text-sm text-slate-700">{feedback.improve}</p>
            </div>

            <div className="rounded-2xl bg-cyan-50 p-3 transition-transform duration-200 hover:translate-x-0.5">
              <p className="text-sm font-semibold text-cyan-700">👉 Siguiente paso</p>
              <p className="mt-1 text-sm text-slate-700">{feedback.nextStep}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {unlockMessage && (
        <div className="animate-unlock-burst rounded-2xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm font-semibold text-indigo-700 shadow-[0_12px_24px_-20px_rgba(79,70,229,0.8)]">
          {unlockMessage}
        </div>
      )}
    </>
  );
}
