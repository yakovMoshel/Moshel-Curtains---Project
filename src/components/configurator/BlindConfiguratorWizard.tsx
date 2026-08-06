"use client";

import { BlindColorSizeStep } from "@/components/configurator/BlindColorSizeStep";
import { BlindSummaryStep } from "@/components/configurator/BlindSummaryStep";
import { ProgressIndicator } from "@/components/configurator/ProgressIndicator";
import { TypeStep } from "@/components/configurator/TypeStep";
import {
  BLIND_STEP_COUNT,
  useBlindConfiguratorState,
} from "@/components/configurator/useBlindConfiguratorState";
import { useStepTransition } from "@/components/configurator/useStepTransition";
import { validateSize } from "@/components/configurator/validation";
import { blindTypes } from "@/lib/data/blind-products";

const STEP_LABELS = ["סוג", "צבע ומידות", "סיכום"];

export function BlindConfiguratorWizard() {
  const { step, selections, selectType, selectColor, setWidth, setHeight, goNext, goBack } =
    useBlindConfiguratorState();
  const contentRef = useStepTransition(step);

  const sizeErrors = validateSize(selections.width, selections.height);

  const canGoNext =
    (step === 0 && selections.typeId !== null) ||
    (step === 1 && selections.colorId !== null && Object.keys(sizeErrors).length === 0) ||
    step === 2;

  return (
    <main className="min-h-screen bg-curtain-cream">
      <div className="mx-auto flex max-w-3xl flex-col gap-10 px-8 py-16 sm:px-16">
        <ProgressIndicator
          step={step}
          stepCount={BLIND_STEP_COUNT}
          stepLabel={STEP_LABELS[step] ?? ""}
        />

        <div ref={contentRef}>
          {step === 0 && (
            <TypeStep items={blindTypes} selectedId={selections.typeId} onSelect={selectType} />
          )}
          {step === 1 && (
            <BlindColorSizeStep
              selectedColorId={selections.colorId}
              onSelectColor={selectColor}
              width={selections.width}
              height={selections.height}
              errors={sizeErrors}
              onWidthChange={setWidth}
              onHeightChange={setHeight}
            />
          )}
          {step === 2 && <BlindSummaryStep selections={selections} />}
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={goBack}
            disabled={step === 0}
            className="rounded-sm border border-curtain-tan px-6 py-3 text-sm font-medium text-curtain-espresso disabled:opacity-40"
          >
            הקודם
          </button>
          {step < BLIND_STEP_COUNT - 1 && (
            <button
              type="button"
              onClick={goNext}
              disabled={!canGoNext}
              className="rounded-sm bg-curtain-espresso px-6 py-3 text-sm font-medium text-curtain-cream disabled:opacity-40"
            >
              הבא
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
