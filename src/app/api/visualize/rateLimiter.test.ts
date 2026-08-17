import { describe, expect, it } from "vitest";
import { checkRateLimit } from "@/app/api/visualize/rateLimiter";

describe("checkRateLimit", () => {
  it("allows requests under the limit", () => {
    const ip = "1.1.1.1";
    for (let i = 0; i < 5; i++) {
      expect(checkRateLimit(ip, 1000 + i).allowed).toBe(true);
    }
  });

  it("blocks the 6th request within the window", () => {
    const ip = "2.2.2.2";
    for (let i = 0; i < 5; i++) {
      checkRateLimit(ip, 2000 + i);
    }
    expect(checkRateLimit(ip, 2005).allowed).toBe(false);
  });

  it("allows requests again once the window has expired", () => {
    const ip = "3.3.3.3";
    for (let i = 0; i < 5; i++) {
      checkRateLimit(ip, 3000 + i);
    }
    expect(checkRateLimit(ip, 3000 + 60 * 60 * 1000).allowed).toBe(true);
  });

  it("tracks separate IPs independently", () => {
    for (let i = 0; i < 5; i++) {
      checkRateLimit("4.4.4.4", 4000 + i);
    }
    expect(checkRateLimit("4.4.4.4", 4005).allowed).toBe(false);
    expect(checkRateLimit("5.5.5.5", 4005).allowed).toBe(true);
  });
});
