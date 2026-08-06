interface SizeField {
  name: string;
  label: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
}

interface SizeFieldsProps {
  fields: SizeField[];
  heading?: string;
}

export function SizeFields({ fields, heading = "מידות מדויקות" }: SizeFieldsProps) {
  return (
    <>
      <p className="mt-10 mb-4 text-sm font-medium tracking-[0.2em] text-curtain-taupe uppercase">
        {heading}
      </p>
      <div className="flex max-w-md flex-col gap-6">
        {fields.map((field) => (
          <div key={field.name} className="flex flex-col gap-2">
            <label htmlFor={field.name} className="text-sm font-medium text-curtain-espresso">
              {field.label}
            </label>
            <input
              id={field.name}
              type="number"
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
              className="rounded-sm border border-curtain-tan bg-curtain-cream px-4 py-2 text-curtain-espresso"
            />
            {field.error && (
              <p role="alert" className="text-sm text-red-700">
                {field.error}
              </p>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
