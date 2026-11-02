// Marker helper to determine if an app has been newly revised/updated

const REVISED_APP_PATHS = new Set([
  "/swot",
  "/bmc",
  "/ansoff",
  "/bcg",
  "/porter",
  "/lean-canvas",
  "/kano-model",
  "/pestel",
  "/value-chain",
]);

export function isNewlyRevisedApp(to: string, label?: string): boolean {
  if (!to) return false;
  return REVISED_APP_PATHS.has(to.split("?")[0]);
}
