"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type ModuleState = "completed" | "active" | "locked";
export type DemoStep =
  | "idle"
  | "playing"
  | "completed"
  | "celebration"
  | "deliverable"
  | "submitting"
  | "feedback";
export type PointActionType =
  | "VIDEO_COMPLETED"
  | "DELIVERABLE_SUBMITTED"
  | "MODULE_COMPLETED"
  | "COMMENT_CREATED"
  | "WEEKLY_STREAK"
  | "GRADUATION";

type CourseModule = {
  id: number;
  title: string;
  lessons: number;
};

type ModuleWithState = CourseModule & {
  state: ModuleState;
};

type CompleteResult = {
  moduleTitle: string;
  nextModuleTitle: string | null;
  courseCompleted: boolean;
};

type VideoCompletionResult = {
  moduleTitle: string;
  pointsAwarded: number;
};

type PointHistoryEntry = {
  id: string;
  actionType: PointActionType;
  label: string;
  points: number;
  createdAt: string;
};

type PointEvent = {
  id: string;
  label: string;
  points: number;
};

type CourseDemoContextValue = {
  userName: string;
  streakDays: number;
  points: number;
  totalPoints: number;
  modules: ModuleWithState[];
  activeModule: CourseModule | null;
  completedCount: number;
  totalModules: number;
  progressPercentage: number;
  progressPulseKey: number;
  completedModules: number[];
  submittedDeliverables: number[];
  dailyCommentsCount: number;
  weeklyStreakRewardClaimed: boolean;
  graduationRewardClaimed: boolean;
  completedVideosCount: number;
  completedDeliverablesCount: number;
  hasCompletedActiveVideo: boolean;
  isGraduated: boolean;
  currentStep: DemoStep;
  setCurrentStep: (step: DemoStep) => void;
  awardPoints: (actionType: PointActionType, moduleId?: number) => number;
  latestPointEvent: PointEvent | null;
  clearLatestPointEvent: () => void;
  pointsHistory: PointHistoryEntry[];
  bannerMessage: string | null;
  clearBannerMessage: () => void;
  currentDeliverableModule: CourseModule | null;
  completeActiveVideo: () => VideoCompletionResult | null;
  openDeliverableForActiveModule: () => CourseModule | null;
  completeActiveModuleDeliverable: () => CompleteResult | null;
  submitDeliverable: () => CompleteResult | null;
  resetDemo: () => void;
};

const COURSE_MODULES: CourseModule[] = [
  { id: 1, title: "Fundamentos creativos", lessons: 5 },
  { id: 2, title: "Ideas con impacto", lessons: 6 },
  { id: 3, title: "Prototipo visual", lessons: 7 },
  { id: 4, title: "Storytelling de marca", lessons: 5 },
  { id: 5, title: "Copy que conecta", lessons: 6 },
  { id: 6, title: "Diseño de experiencia", lessons: 7 },
  { id: 7, title: "Validacion con usuarios", lessons: 4 },
  { id: 8, title: "Presentacion final", lessons: 8 },
];

const INITIAL_POINTS = 1240;
const INITIAL_STREAK_DAYS = 5;
const INITIAL_COMPLETED_MODULE_IDS = [1, 2, 3];
const INITIAL_COMPLETED_VIDEO_IDS = [1, 2, 3];
const INITIAL_COMPLETED_DELIVERABLE_IDS = [1, 2, 3];
const INITIAL_ACTIVE_INDEX = 3;
const MAX_DAILY_COMMENT_REWARDS = 3;

const POINT_RULES: Record<PointActionType, number> = {
  VIDEO_COMPLETED: 5,
  DELIVERABLE_SUBMITTED: 50,
  MODULE_COMPLETED: 25,
  COMMENT_CREATED: 5,
  WEEKLY_STREAK: 10,
  GRADUATION: 200,
};

const POINT_LABELS: Record<PointActionType, string> = {
  VIDEO_COMPLETED: "Leccion completada",
  DELIVERABLE_SUBMITTED: "Entregable publicado",
  MODULE_COMPLETED: "Modulo completo",
  COMMENT_CREATED: "Comentario realizado",
  WEEKLY_STREAK: "Streak semanal",
  GRADUATION: "Graduacion completada",
};

const CourseDemoContext = createContext<CourseDemoContextValue | null>(null);

export function CourseDemoProvider({ children }: { children: ReactNode }) {
  const [totalPoints, setTotalPoints] = useState(INITIAL_POINTS);
  const [streakDays, setStreakDays] = useState(INITIAL_STREAK_DAYS);
  const [completedModules, setCompletedModules] = useState<number[]>(
    [...INITIAL_COMPLETED_MODULE_IDS]
  );
  const [completedVideoIds, setCompletedVideoIds] = useState<number[]>(
    [...INITIAL_COMPLETED_VIDEO_IDS]
  );
  const [submittedDeliverables, setSubmittedDeliverables] = useState<number[]>(
    [...INITIAL_COMPLETED_DELIVERABLE_IDS]
  );
  const [dailyCommentsCount, setDailyCommentsCount] = useState(0);
  const [weeklyStreakRewardClaimed, setWeeklyStreakRewardClaimed] = useState(false);
  const [graduationRewardClaimed, setGraduationRewardClaimed] = useState(false);
  const [activeIndex, setActiveIndex] = useState(INITIAL_ACTIVE_INDEX);
  const [currentStep, setCurrentStepState] = useState<DemoStep>("idle");
  const [flowModuleId, setFlowModuleId] = useState<number | null>(null);
  const [progressPulseKey, setProgressPulseKey] = useState(0);
  const [bannerMessage, setBannerMessage] = useState<string | null>(null);
  const [latestPointEvent, setLatestPointEvent] = useState<PointEvent | null>(null);
  const [pointsHistory, setPointsHistory] = useState<PointHistoryEntry[]>([]);

  const totalModules = COURSE_MODULES.length;
  const completedCount = completedModules.length;
  const completedVideosCount = completedVideoIds.length;
  const completedDeliverablesCount = submittedDeliverables.length;
  const progressPercentage = Math.round((completedCount / totalModules) * 100);
  const courseCompleted = completedCount === totalModules;
  const isGraduated =
    completedCount === totalModules &&
    completedVideosCount === totalModules &&
    completedDeliverablesCount === totalModules &&
    graduationRewardClaimed;
  const activeModule = courseCompleted ? null : COURSE_MODULES[activeIndex];
  const currentDeliverableModule =
    COURSE_MODULES.find((module) => module.id === flowModuleId) ?? null;
  const hasCompletedActiveVideo = activeModule
    ? completedVideoIds.includes(activeModule.id)
    : true;

  const modules = useMemo<ModuleWithState[]>(() => {
    return COURSE_MODULES.map((module, index) => {
      if (completedModules.includes(module.id)) {
        return { ...module, state: "completed" };
      }

      if (!courseCompleted && index === activeIndex) {
        return { ...module, state: "active" };
      }

      return { ...module, state: "locked" };
    });
  }, [activeIndex, completedModules, courseCompleted]);

  const clearBannerMessage = () => setBannerMessage(null);
  const clearLatestPointEvent = () => setLatestPointEvent(null);
  const setCurrentStep = (step: DemoStep) => {
    if (step === "idle") {
      setFlowModuleId(null);
    }
    setCurrentStepState(step);
  };

  const awardPoints = (actionType: PointActionType, moduleId?: number): number => {
    const targetModuleId = moduleId ?? flowModuleId ?? activeModule?.id ?? null;
    const points = POINT_RULES[actionType];
    let canAward = false;

    if (actionType === "VIDEO_COMPLETED") {
      canAward = Boolean(targetModuleId && !completedVideoIds.includes(targetModuleId));
      if (canAward && targetModuleId) {
        setCompletedVideoIds((prev) => [...prev, targetModuleId]);
      }
    }

    if (actionType === "DELIVERABLE_SUBMITTED") {
      canAward = Boolean(
        targetModuleId && !submittedDeliverables.includes(targetModuleId)
      );
      if (canAward && targetModuleId) {
        setSubmittedDeliverables((prev) => [...prev, targetModuleId]);
      }
    }

    if (actionType === "MODULE_COMPLETED") {
      canAward = Boolean(targetModuleId && !completedModules.includes(targetModuleId));
      if (canAward && targetModuleId) {
        setCompletedModules((prev) => [...prev, targetModuleId]);
      }
    }

    if (actionType === "COMMENT_CREATED") {
      canAward = dailyCommentsCount < MAX_DAILY_COMMENT_REWARDS;
      if (canAward) {
        setDailyCommentsCount((prev) => prev + 1);
      }
    }

    if (actionType === "WEEKLY_STREAK") {
      canAward = !weeklyStreakRewardClaimed;
      if (canAward) {
        setWeeklyStreakRewardClaimed(true);
      }
    }

    if (actionType === "GRADUATION") {
      const completedSet = new Set(completedModules);
      const submittedSet = new Set(submittedDeliverables);
      if (targetModuleId) {
        completedSet.add(targetModuleId);
        submittedSet.add(targetModuleId);
      }

      canAward =
        !graduationRewardClaimed &&
        completedSet.size === totalModules &&
        submittedSet.size === totalModules;

      if (canAward) {
        setGraduationRewardClaimed(true);
      }
    }

    if (!canAward) return 0;

    setTotalPoints((prev) => prev + points);

    const eventId = `${actionType}-${Date.now()}`;
    const label = POINT_LABELS[actionType];
    setLatestPointEvent({ id: eventId, label, points });
    setPointsHistory((prev) =>
      [
        {
          id: eventId,
          actionType,
          label,
          points,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ].slice(0, 8)
    );

    return points;
  };

  const completeActiveVideo = (): VideoCompletionResult | null => {
    if (!activeModule) return null;
    const pointsAwarded = awardPoints("VIDEO_COMPLETED", activeModule.id);
    if (!pointsAwarded) return null;
    setCurrentStepState("completed");
    setBannerMessage("Leccion completada! +5 puntos");

    return {
      moduleTitle: activeModule.title,
      pointsAwarded,
    };
  };

  const openDeliverableForActiveModule = (): CourseModule | null => {
    if (!activeModule) return null;
    if (completedModules.includes(activeModule.id)) return null;
    if (!completedVideoIds.includes(activeModule.id)) return null;

    setFlowModuleId(activeModule.id);
    setCurrentStepState("deliverable");
    return activeModule;
  };

  const completeActiveModuleDeliverable = (): CompleteResult | null => {
    if (!currentDeliverableModule) return null;

    const targetModule = currentDeliverableModule;
    const targetIndex = COURSE_MODULES.findIndex(
      (module) => module.id === targetModule.id
    );
    if (targetIndex === -1) return null;

    const nextModule = COURSE_MODULES[targetIndex + 1] ?? null;
    const isLastModule = targetIndex >= COURSE_MODULES.length - 1;

    awardPoints("DELIVERABLE_SUBMITTED", targetModule.id);
    const moduleCompletedAward = awardPoints("MODULE_COMPLETED", targetModule.id);
    const graduationAward = awardPoints("GRADUATION", targetModule.id);

    if (moduleCompletedAward) {
      setProgressPulseKey((prev) => prev + 1);
    }
    setCurrentStepState("feedback");

    if (!isLastModule && moduleCompletedAward) {
      setActiveIndex(targetIndex + 1);
    }

    if (graduationAward) {
      setBannerMessage("Graduacion desbloqueada! +200 puntos");
    } else {
      setBannerMessage(
        isLastModule
          ? "Modulo final completado! Curso terminado."
          : "Nuevo modulo desbloqueado"
      );
    }

    return {
      moduleTitle: targetModule.title,
      nextModuleTitle: nextModule?.title ?? null,
      courseCompleted: isLastModule,
    };
  };

  const submitDeliverable = (): CompleteResult | null => {
    return completeActiveModuleDeliverable();
  };

  const resetDemo = () => {
    setTotalPoints(INITIAL_POINTS);
    setStreakDays(INITIAL_STREAK_DAYS);
    setCompletedModules([...INITIAL_COMPLETED_MODULE_IDS]);
    setCompletedVideoIds([...INITIAL_COMPLETED_VIDEO_IDS]);
    setSubmittedDeliverables([...INITIAL_COMPLETED_DELIVERABLE_IDS]);
    setDailyCommentsCount(0);
    setWeeklyStreakRewardClaimed(false);
    setGraduationRewardClaimed(false);
    setActiveIndex(INITIAL_ACTIVE_INDEX);
    setCurrentStepState("idle");
    setFlowModuleId(null);
    setLatestPointEvent(null);
    setPointsHistory([]);
    setBannerMessage("Progreso reiniciado");
    setProgressPulseKey((prev) => prev + 1);
  };

  return (
    <CourseDemoContext.Provider
      value={{
        userName: "Towa",
        streakDays,
        points: totalPoints,
        totalPoints,
        modules,
        activeModule,
        completedCount,
        totalModules,
        progressPercentage,
        progressPulseKey,
        completedModules,
        submittedDeliverables,
        dailyCommentsCount,
        weeklyStreakRewardClaimed,
        graduationRewardClaimed,
        completedVideosCount,
        completedDeliverablesCount,
        hasCompletedActiveVideo,
        isGraduated,
        currentStep,
        setCurrentStep,
        awardPoints,
        latestPointEvent,
        clearLatestPointEvent,
        pointsHistory,
        bannerMessage,
        clearBannerMessage,
        currentDeliverableModule,
        completeActiveVideo,
        openDeliverableForActiveModule,
        completeActiveModuleDeliverable,
        submitDeliverable,
        resetDemo,
      }}
    >
      {children}
    </CourseDemoContext.Provider>
  );
}

export function useCourseDemo() {
  const context = useContext(CourseDemoContext);

  if (!context) {
    throw new Error("useCourseDemo must be used within CourseDemoProvider");
  }

  return context;
}
