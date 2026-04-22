"use client";

import { DeliverableForm } from "@/components/demo/deliverable-form";
import type { DemoStep } from "@/components/course-demo-provider";

type DeliverableViewProps = {
  moduleTitle: string;
  step: DemoStep;
  onSubmitDeliverable: () => Promise<{ unlockMessage: string } | null>;
};

export function DeliverableView({
  moduleTitle,
  step,
  onSubmitDeliverable,
}: DeliverableViewProps) {
  return (
    <DeliverableForm
      moduleTitle={moduleTitle}
      step={step}
      onSubmitDeliverable={onSubmitDeliverable}
    />
  );
}
