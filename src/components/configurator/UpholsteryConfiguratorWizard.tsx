"use client";

import { ProgressIndicator } from "@/components/configurator/ProgressIndicator";
import { TypeStep } from "@/components/configurator/TypeStep";
import { UpholsteryColorPieceStep } from "@/components/configurator/UpholsteryColorPieceStep";
import { UpholsterySummaryStep } from "@/components/configurator/UpholsterySummaryStep";
import {
  UPHOLSTERY_STEP_COUNT,
  useUpholsteryConfiguratorState,
} from "@/components/configurator/useUpholsteryConfiguratorState";
import { useStepTransition } from "@/components/configurator/useStepTransition";
import { upholsteryTypes } from "@/lib/data/upholstery-products";

const STEP_LABELS = ["סוג", "צבע ופריט", "סיכום"];

export function UpholsteryConfiguratorWizard() {
  const { step, selections, selectType, selectColor, selectPiece, goNext, goBack } =
    useUpholsteryConfiguratorState();
  const contentRef = useStepTransition(step);

  const canGoNext =
    (step === 0 && selections.typeId !== null) ||
    (step === 1 && selections.colorId !== null && selections.furniturePieceId !== null) ||
    step === 2;

  return (
    <main className="min-h-screen bg-curtain-cream">
      <div className="mx-auto flex max-w-3xl flex-col gap-10 px-8 py-16 sm:px-16">
        <ProgressIndicator
          step={step}
          stepCount={UPHOLSTERY_STEP_COUNT}
          stepLabel={STEP_LABELS[step] ?? ""}
        />

        <div ref={contentRef}>
          {step === 0 && (
            <TypeStep
              items={upholsteryTypes}
              selectedId={selections.typeId}
              onSelect={selectType}
            />
          )}
          {step === 1 && (
            <UpholsteryColorPieceStep
              selectedColorId={selections.colorId}
              onSelectColor={selectColor}
              selectedPieceId={selections.furniturePieceId}
              onSelectPiece={selectPiece}
            />
          )}
          {step === 2 && <UpholsterySummaryStep selections={selections} />}
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
          {step < UPHOLSTERY_STEP_COUNT - 1 && (
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
