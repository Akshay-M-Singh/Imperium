// connection — shared slow-connection sniff, originally inlined in
// Hero.tsx for the (now-retired) video gate; the Silk Hero reuses the
// exact same heuristic for its own poster-vs-live decision.

export function isSlowConnection(): boolean {
  if (typeof navigator === "undefined") return false;
  const conn = (
    navigator as unknown as { connection?: { effectiveType?: string; saveData?: boolean } }
  ).connection;
  if (!conn) return false;
  return conn.effectiveType === "2g" || conn.effectiveType === "slow-2g" || Boolean(conn.saveData);
}
