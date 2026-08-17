import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const editMock = vi.fn();

vi.mock("openai", () => ({
  default: class MockOpenAI {
    images = { edit: editMock };
  },
}));

interface FakeRequestOptions {
  ip?: string;
  image?: File;
  category?: string;
  typeLabel?: string;
  colorLabel?: string;
}

// jsdom's Request/FormData body serialization corrupts binary File content
// (parsed files always come back 0 bytes), so tests build a minimal
// Request-like object directly rather than round-tripping through a real
// multipart body — route.ts only ever calls request.headers.get() and
// request.formData().
function buildRequest(options: FakeRequestOptions = {}): Request {
  const formData = new FormData();
  formData.set(
    "image",
    options.image ?? new File([new Uint8Array(10)], "photo.png", { type: "image/png" }),
  );
  formData.set("category", options.category ?? "curtains");
  formData.set("typeLabel", options.typeLabel ?? "וילון קלאסי");
  formData.set("colorLabel", options.colorLabel ?? "כחול נייבי");

  return {
    headers: {
      get: (name: string) => (name === "x-forwarded-for" ? (options.ip ?? "9.9.9.9") : null),
    },
    formData: async () => formData,
  } as unknown as Request;
}

describe("POST /api/visualize", () => {
  beforeEach(() => {
    process.env.OPENAI_API_KEY = "test-key";
    editMock.mockReset();
  });

  afterEach(() => {
    delete process.env.OPENAI_API_KEY;
  });

  it("returns 400 for an invalid category", async () => {
    const { POST } = await import("@/app/api/visualize/route");
    const response = await POST(buildRequest({ ip: "1.1.1.1", category: "sofas" }));
    expect(response.status).toBe(400);
  });

  it("returns 400 for an oversized file", async () => {
    const { POST } = await import("@/app/api/visualize/route");
    const oversized = new File([new Uint8Array(10 * 1024 * 1024 + 1)], "big.png", {
      type: "image/png",
    });
    const response = await POST(buildRequest({ ip: "2.2.2.2", image: oversized }));
    expect(response.status).toBe(400);
  });

  it("returns the generated image on success", async () => {
    editMock.mockResolvedValue({ data: [{ b64_json: "base64data" }] });
    const { POST } = await import("@/app/api/visualize/route");
    const response = await POST(buildRequest({ ip: "3.3.3.3" }));
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toEqual({ image: "base64data", mimeType: "image/png" });
  });

  it("returns 500 when the OpenAI SDK throws", async () => {
    editMock.mockRejectedValue(new Error("boom"));
    const { POST } = await import("@/app/api/visualize/route");
    const response = await POST(buildRequest({ ip: "4.4.4.4" }));
    expect(response.status).toBe(500);
  });

  it("returns 429 after the rate limit is exceeded", async () => {
    editMock.mockResolvedValue({ data: [{ b64_json: "base64data" }] });
    const { POST } = await import("@/app/api/visualize/route");
    const ip = "5.5.5.5";
    let lastResponse: Response | undefined;
    for (let i = 0; i < 6; i++) {
      lastResponse = await POST(buildRequest({ ip }));
    }
    expect(lastResponse?.status).toBe(429);
  });
});
