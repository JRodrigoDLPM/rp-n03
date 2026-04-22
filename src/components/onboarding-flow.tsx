"use client";

import {
  ArrowRight,
  BookOpenCheck,
  CircleDashed,
  Rocket,
  Sparkles,
  Target,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const ONBOARDING_STORAGE_KEY = "creadores_en_potencia_onboarding_seen_v1";

type OnboardingStep = {
  title: string;
  description: string;
  icon: ReactNode;
};

const onboardingSteps: OnboardingStep[] = [
  {
    title: "Bienvenido a tu transformacion",
    description:
      "Este espacio esta creado para que avances con foco, energia y resultados reales.",
    icon: <Sparkles className="h-7 w-7" />,
  },
  {
    title: "Aprendes por modulos y progreso",
    description:
      "Cada modulo suma a tu camino. Veras tu avance, tus puntos y el siguiente paso claro.",
    icon: <BookOpenCheck className="h-7 w-7" />,
  },
  {
    title: "Aqui vienes a actuar, no solo ver",
    description:
      "Completas lecciones, envias entregables y recibes feedback para mejorar rapido.",
    icon: <Target className="h-7 w-7" />,
  },
  {
    title: "Todo listo para comenzar",
    description:
      "Empieza ahora y desbloquea tu siguiente modulo con una experiencia guiada.",
    icon: <Rocket className="h-7 w-7" />,
  },
];

export function OnboardingFlow({ children }: { children: ReactNode }) {
  const [isDismissed, setIsDismissed] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  const hasSeenOnboarding = useSyncExternalStore(
    (onStoreChange) => {
      const handleStorage = () => onStoreChange();
      const handleManualTrigger = () => onStoreChange();

      window.addEventListener("storage", handleStorage);
      window.addEventListener("demo:show-onboarding", handleManualTrigger);

      return () => {
        window.removeEventListener("storage", handleStorage);
        window.removeEventListener("demo:show-onboarding", handleManualTrigger);
      };
    },
    () => window.localStorage.getItem(ONBOARDING_STORAGE_KEY) === "1",
    () => true
  );

  const currentStep = useMemo(() => onboardingSteps[stepIndex], [stepIndex]);
  const isLastStep = stepIndex === onboardingSteps.length - 1;
  const isVisible = !hasSeenOnboarding && !isDismissed;

  const completeOnboarding = () => {
    window.localStorage.setItem(ONBOARDING_STORAGE_KEY, "1");
    setIsDismissed(true);
  };

  const handlePrimaryAction = () => {
    if (isLastStep) {
      completeOnboarding();
      return;
    }

    setStepIndex((current) => current + 1);
  };

  const handleBack = () => {
    setStepIndex((current) => Math.max(0, current - 1));
  };

  useEffect(() => {
    const handleManualTrigger = () => {
      setIsDismissed(false);
      setStepIndex(0);
    };

    window.addEventListener("demo:show-onboarding", handleManualTrigger);
    return () =>
      window.removeEventListener("demo:show-onboarding", handleManualTrigger);
  }, []);

  return (
    <>
      {children}

      {isVisible && (
        <div className="fixed inset-0 z-[100] overflow-hidden bg-gradient-to-b from-indigo-100 via-white to-fuchsia-100 px-4 pt-8">
          <div className="pointer-events-none absolute -left-12 top-16 h-52 w-52 rounded-full bg-cyan-200/45 blur-3xl" />
          <div className="pointer-events-none absolute -right-14 top-28 h-56 w-56 rounded-full bg-fuchsia-200/40 blur-3xl" />

          <main className="relative mx-auto flex min-h-full w-full max-w-sm flex-col justify-between pb-10">
            <div className="animate-fade-up">
              <div className="inline-flex items-center rounded-full bg-white/85 px-3 py-1 text-xs font-semibold text-indigo-700 shadow-sm">
                <CircleDashed className="mr-1.5 h-3.5 w-3.5" />
                Onboarding guiado
              </div>
            </div>

            <Card className="animate-card-pop rounded-3xl border-white/70 bg-white/90 shadow-[0_18px_34px_-22px_rgba(30,41,59,0.62)] backdrop-blur-sm [animation-delay:100ms]">
              <CardContent className="p-6">
                <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 transition-transform duration-200 hover:scale-105">
                  {currentStep.icon}
                </div>

                <h1 className="mt-5 text-center text-2xl leading-tight font-extrabold text-slate-900">
                  {currentStep.title}
                </h1>
                <p className="mt-3 text-center text-sm leading-relaxed text-slate-600">
                  {currentStep.description}
                </p>

                <div className="mt-5 flex items-center justify-center gap-2">
                  {onboardingSteps.map((_, index) => (
                    <span
                      key={index}
                      className={`h-2.5 rounded-full transition-all ${
                        index === stepIndex
                          ? "w-7 bg-indigo-600 shadow-[0_0_0_4px_rgba(99,102,241,0.15)]"
                          : "w-2.5 bg-slate-300"
                      }`}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="animate-fade-up space-y-3 [animation-delay:170ms]">
              <Button
                onClick={handlePrimaryAction}
                className="group h-14 w-full rounded-2xl bg-indigo-600 text-base font-extrabold tracking-tight text-white shadow-[0_22px_34px_-18px_rgba(79,70,229,0.95)] transition-all duration-200 hover:scale-[1.02] hover:bg-indigo-500 active:scale-[0.99]"
              >
                <span className="inline-flex items-center">
                  {isLastStep ? "Comenzar" : "Continuar"}
                  <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Button>

              <div className="flex items-center justify-between px-1">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={stepIndex === 0}
                  className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-700 disabled:opacity-40"
                >
                  Atras
                </button>
                <button
                  type="button"
                  onClick={completeOnboarding}
                  className="text-sm font-medium text-slate-500 underline-offset-4 transition-colors hover:text-slate-700 hover:underline"
                >
                  Saltar
                </button>
              </div>
            </div>
          </main>
        </div>
      )}
    </>
  );
}
