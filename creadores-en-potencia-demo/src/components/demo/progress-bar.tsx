"use client";

import { Progress } from "@/components/ui/progress";

type DemoProgressBarProps = {
  value: number;
  label?: string;
  emphasize?: boolean;
};

export function DemoProgressBar({
  value,
  label,
  emphasize = false,
}: DemoProgressBarProps) {
  return (
    <div className="space-y-2">
      {label && (
        <p
          className={`text-xs font-semibold tracking-wide ${
            emphasize ? "text-indigo-600" : "text-slate-500"
          }`}
        >
          {label}
        </p>
      )}
      <Progress
        value={value}
        className="h-2.5 rounded-full bg-slate-100 [&>div]:bg-[linear-gradient(90deg,#4f46e5_10%,#06b6d4_48%,#4f46e5_90%)] [&>div]:animate-shimmer-sweep"
      />
    </div>
  );
}
