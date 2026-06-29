export type DynamicFirstPushSecondarySource = "jupiter-ca" | "dexscreener-ca";

export function getDynamicFirstPushSecondarySource(
  primarySource: string,
): DynamicFirstPushSecondarySource | null {
  if (primarySource === "jupiter-ca") return "dexscreener-ca";
  if (primarySource === "dexscreener-ca") return "jupiter-ca";
  return null;
}

export function isFirstPushSecondaryWithinTolerance(
  primaryPrice: number,
  secondaryPrice: number | null,
  maxMovePct: number,
): boolean {
  if (
    !Number.isFinite(primaryPrice) ||
    primaryPrice <= 0 ||
    secondaryPrice === null ||
    !Number.isFinite(secondaryPrice) ||
    secondaryPrice <= 0 ||
    !Number.isFinite(maxMovePct) ||
    maxMovePct < 0
  ) {
    return false;
  }

  const movePct = Math.abs((primaryPrice - secondaryPrice) / secondaryPrice) * 100;
  return movePct <= maxMovePct;
}
