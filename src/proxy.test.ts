import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { proxy } from "@/proxy";

describe("proxy", () => {
  it("redirects www to the apex host over https, stripping any internal port", () => {
    // Simulates request.url carrying the app's own internal listening port
    // (as it does in production behind the Nginx reverse proxy) rather than
    // the public :443 the visitor actually used.
    const request = new NextRequest("http://www.moshelhavilonot.co.il:3000/curtains?x=1", {
      headers: { host: "www.moshelhavilonot.co.il" },
    });

    const response = proxy(request);

    expect(response.status).toBe(301);
    expect(response.headers.get("location")).toBe("https://moshelhavilonot.co.il/curtains?x=1");
  });

  it("passes non-www requests through unchanged", () => {
    const request = new NextRequest("https://moshelhavilonot.co.il/", {
      headers: { host: "moshelhavilonot.co.il" },
    });

    const response = proxy(request);

    expect(response.headers.get("location")).toBeNull();
  });
});
