// NOTE: this rate limiter is in-memory only. It resets whenever the server process
// restarts and is NOT shared across multiple server instances/replicas. That's
// acceptable for this project's current single-instance self-hosted deployment, but
// if traffic grows and the app moves to a multi-instance/serverless deployment, this
// needs to move to a shared store (e.g. Redis) to remain effective.

const WINDOW_MS = 60 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 5;

const requestLog = new Map<string, number[]>();

export function checkRateLimit(ip: string, now: number = Date.now()): { allowed: boolean } {
  const recentRequests = (requestLog.get(ip) ?? []).filter(
    (timestamp) => now - timestamp < WINDOW_MS,
  );

  if (recentRequests.length >= MAX_REQUESTS_PER_WINDOW) {
    requestLog.set(ip, recentRequests);
    return { allowed: false };
  }

  recentRequests.push(now);
  requestLog.set(ip, recentRequests);
  return { allowed: true };
}
