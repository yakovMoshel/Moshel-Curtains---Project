interface ProgressIndicatorProps {
  step: number;
  stepCount: number;
  stepLabel: string;
}

export function ProgressIndicator({ step, stepCount, stepLabel }: ProgressIndicatorProps) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-medium tracking-[0.2em] text-curtain-taupe uppercase">
        {stepLabel}
      </p>
      <div className="flex gap-2">
        {Array.from({ length: stepCount }, (_, index) => (
          <div
            key={index}
            className={`h-1 flex-1 rounded-full transition-colors duration-500 ease-out ${
              index <= step ? "bg-curtain-espresso" : "bg-curtain-tan/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
