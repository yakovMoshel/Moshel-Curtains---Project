import { buildVisualizationPrompt } from "@/components/configurator/ai-visualization/buildVisualizationPrompt";
import { validateImageFile } from "@/components/configurator/ai-visualization/fileValidation";
import type { ProductCategory } from "@/components/configurator/ai-visualization/types";
import { checkRateLimit } from "@/app/api/visualize/rateLimiter";

const KNOWN_CATEGORIES: ProductCategory[] = ["curtains", "blinds", "upholstery", "tablecloths"];

const RATE_LIMIT_MESSAGE = "יותר מדי בקשות. נא לנסות שוב בעוד כשעה";
const GENERIC_ERROR_MESSAGE = "אירעה שגיאה ביצירת ההדמיה. נא לנסות שוב";
const MISSING_FIELDS_MESSAGE = "חסרים פרטים נדרשים ליצירת ההדמיה";
const INVALID_CATEGORY_MESSAGE = "קטגוריית מוצר לא תקינה";

function jsonError(message: string, status: number): Response {
  return Response.json({ error: message }, { status });
}

function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  return forwardedFor?.split(",")[0]?.trim() ?? "unknown";
}

// Duck-typed rather than `instanceof File`: the File constructor that parses a
// multipart request body isn't guaranteed to be referentially the same class as the
// global `File` in every runtime/test environment, even though the resulting object
// is a fully compliant File.
function isFileEntry(value: FormDataEntryValue | null): value is File {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as File).size === "number" &&
    typeof (value as File).type === "string" &&
    typeof (value as File).name === "string"
  );
}

export async function POST(request: Request): Promise<Response> {
  const ip = getClientIp(request);
  if (!checkRateLimit(ip).allowed) {
    return jsonError(RATE_LIMIT_MESSAGE, 429);
  }

  const formData = await request.formData();
  const image = formData.get("image");
  const category = formData.get("category");
  const typeLabel = formData.get("typeLabel");
  const colorLabel = formData.get("colorLabel");
  const extraLabel = formData.get("extraLabel");

  if (
    !isFileEntry(image) ||
    typeof category !== "string" ||
    typeof typeLabel !== "string" ||
    typeof colorLabel !== "string"
  ) {
    return jsonError(MISSING_FIELDS_MESSAGE, 400);
  }

  if (!KNOWN_CATEGORIES.includes(category as ProductCategory)) {
    return jsonError(INVALID_CATEGORY_MESSAGE, 400);
  }

  const fileValidation = validateImageFile({ type: image.type, size: image.size });
  if (!fileValidation.ok) {
    return jsonError(fileValidation.error!.message, 400);
  }

  const prompt = buildVisualizationPrompt({
    category: category as ProductCategory,
    typeLabel,
    colorLabel,
    extraLabel: typeof extraLabel === "string" ? extraLabel : undefined,
  });

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error("OPENAI_API_KEY is not configured");
    return jsonError(GENERIC_ERROR_MESSAGE, 500);
  }

  try {
    const { default: OpenAI } = await import("openai");
    const client = new OpenAI({ apiKey });

    const response = await client.images.edit({
      model: "gpt-image-1",
      image,
      prompt,
      size: "1024x1024",
    });

    const generated = response.data?.[0]?.b64_json;
    if (!generated) {
      throw new Error("OpenAI response did not include an image");
    }

    return Response.json({ image: generated, mimeType: "image/png" }, { status: 200 });
  } catch (err) {
    console.error("Failed to generate AI visualization", err);
    return jsonError(GENERIC_ERROR_MESSAGE, 500);
  }
}
