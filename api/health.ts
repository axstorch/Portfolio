/**
 * GET /api/health
 *
 * A three-line probe that answers one question: is Vercel's function layer
 * actually running my code, or failing before it starts?
 *
 * This exists because /api/track once failed with FUNCTION_INVOCATION_FAILED
 * on every request and the dashboard could not say why. Comparing this
 * endpoint's response against /api/track's localises the fault in one shot:
 *
 *   both fail  -> the problem is project wide (runtime, ESM vs CJS, Node
 *                 version), not anything inside track.ts
 *   this works -> functions are fine, and the fault is in track.ts itself
 *
 * It deliberately imports nothing and reads no environment variable, so it
 * is the most vanilla function the project can produce.
 */

export default function handler(
  _req: unknown,
  res: {
    setHeader: (k: string, v: string) => void;
    statusCode: number;
    end: (body?: string) => void;
  }
): void {
  res.setHeader('Cache-Control', 'no-store');
  res.statusCode = 200;
  res.end('ok');
}