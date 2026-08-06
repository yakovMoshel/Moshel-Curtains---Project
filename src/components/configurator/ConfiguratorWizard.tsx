"use client";

import { ColorSizeStep } from "@/components/configurator/ColorSizeStep";
import { ProgressIndicator } from "@/components/configurator/ProgressIndicator";
import { SummaryStep } from "@/components/configurator/SummaryStep";
import { TypeStep } from "@/components/configurator/TypeStep";
import { STEP_COUNT, useConfiguratorState } from "@/components/configurator/useConfiguratorState";
import { useStepTransition } from "@/components/configurator/useStepTransition";
import { validateSize } from "@/components/configurator/validation";

const STEP_LABELS = ["סוג", "צבע ומידות", "סיכום"];

export function ConfiguratorWizard() {
  const { step, selections, selectType, selectColor, setWidth, setHeight, goNext, goBack } =
    useConfiguratorState();
  const contentRef = useStepTransition(step);

  const sizeErrors = validateSize(selections.width, selections.height);

  const canGoNext =
    (step === 0 && selections.typeId !== null) ||
    (step === 1 && selections.colorId !== null && Object.keys(sizeErrors).length === 0) ||
    step === 2;

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-10 px-8 py-16 sm:px-16">
      <ProgressIndicator step={step} stepCount={STEP_COUNT} stepLabel={STEP_LABELS[step] ?? ""} />

      <div ref={contentRef}>
        {step === 0 && <TypeStep selectedTypeId={selections.typeId} onSelect={selectType} />}
        {step === 1 && (
          <ColorSizeStep
            selectedColorId={selections.colorId}
            onSelectColor={selectColor}
            width={selections.width}
            height={selections.height}
            errors={sizeErrors}
            onWidthChange={setWidth}
            onHeightChange={setHeight}
          />
        )}
        {step === 2 && <SummaryStep selections={selections} />}
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={goBack}
          disabled={step === 0}
          className="rounded-sm border border-stone-300 px-6 py-3 text-sm font-medium text-stone-700 disabled:opacity-50"
        >
          הקודם
        </button>
        {step < STEP_COUNT - 1 && (
          <button
            type="button"
            onClick={goNext}
            disabled={!canGoNext}
            className="rounded-sm bg-stone-900 px-6 py-3 text-sm font-medium text-stone-50 disabled:opacity-50"
          >
            הבא
          </button>
        )}
      </div>
    </main>
  );
}
