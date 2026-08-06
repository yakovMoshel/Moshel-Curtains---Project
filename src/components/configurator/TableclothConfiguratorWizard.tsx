"use client";

import { ProgressIndicator } from "@/components/configurator/ProgressIndicator";
import { TableclothDetailStep } from "@/components/configurator/TableclothDetailStep";
import { TableclothSummaryStep } from "@/components/configurator/TableclothSummaryStep";
import { validateTableclothDimensions } from "@/components/configurator/tableclothDimensions";
import { TypeStep } from "@/components/configurator/TypeStep";
import {
  TABLECLOTH_STEP_COUNT,
  useTableclothConfiguratorState,
} from "@/components/configurator/useTableclothConfiguratorState";
import { useStepTransition } from "@/components/configurator/useStepTransition";
import { tableclothTypes } from "@/lib/data/tablecloth-products";

const STEP_LABELS = ["סוג", "צבע ומידות", "סיכום"];

export function TableclothConfiguratorWizard() {
  const {
    step,
    selections,
    selectType,
    selectColor,
    selectShape,
    setDiameter,
    setLength,
    setWidth,
    goNext,
    goBack,
  } = useTableclothConfiguratorState();
  const contentRef = useStepTransition(step);

  const dimensionErrors = validateTableclothDimensions(selections);

  const canGoNext =
    (step === 0 && selections.typeId !== null) ||
    (step === 1 &&
      selections.colorId !== null &&
      selections.shapeId !== null &&
      Object.keys(dimensionErrors).length === 0) ||
    step === 2;

  return (
    <main className="min-h-screen bg-curtain-cream">
      <div className="mx-auto flex max-w-3xl flex-col gap-10 px-8 py-16 sm:px-16">
        <ProgressIndicator
          step={step}
          stepCount={TABLECLOTH_STEP_COUNT}
          stepLabel={STEP_LABELS[step] ?? ""}
        />

        <div ref={contentRef}>
          {step === 0 && (
            <TypeStep
              items={tableclothTypes}
              selectedId={selections.typeId}
              onSelect={selectType}
            />
          )}
          {step === 1 && (
            <TableclothDetailStep
              selectedColorId={selections.colorId}
              onSelectColor={selectColor}
              selectedShapeId={selections.shapeId}
              onSelectShape={selectShape}
              diameter={selections.diameter}
              length={selections.length}
              width={selections.width}
              errors={dimensionErrors}
              onDiameterChange={setDiameter}
              onLengthChange={setLength}
              onWidthChange={setWidth}
            />
          )}
          {step === 2 && <TableclothSummaryStep selections={selections} />}
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
          {step < TABLECLOTH_STEP_COUNT - 1 && (
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
