export function VisualizationLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center gap-3 rounded-sm border border-curtain-tan bg-curtain-beige p-8 text-center"
    >
      <div className="flex gap-2">
        <span className="h-3 w-3 animate-bounce rounded-full bg-curtain-espresso [animation-delay:-0.3s]" />
        <span className="h-3 w-3 animate-bounce rounded-full bg-curtain-espresso [animation-delay:-0.15s]" />
        <span className="h-3 w-3 animate-bounce rounded-full bg-curtain-espresso" />
      </div>
      <p className="text-sm font-medium text-curtain-espresso">יוצרים עבורך הדמיה...</p>
      <p className="text-xs text-curtain-taupe">זה עשוי לקחת עד דקה וחצי</p>
    </div>
  );
}
