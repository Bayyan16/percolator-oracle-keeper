export type PythPricePayload = {
  price: string;
  conf?: string;
  expo: number;
};

export type PythPriceQuality = {
  price: number;
  conf: number;
  confidencePct: number;
};

export function parsePythPriceQuality(payload: PythPricePayload): PythPriceQuality | null {
  const rawPrice = Number(payload.price);
  const rawConf = Number(payload.conf);
  const expo = Number(payload.expo);

  if (!Number.isFinite(rawPrice) || !Number.isFinite(rawConf) || !Number.isFinite(expo)) {
    return null;
  }

  if (rawPrice <= 0 || rawConf < 0) {
    return null;
  }

  const scale = Math.pow(10, expo);

  if (!Number.isFinite(scale) || scale === 0) {
    return null;
  }

  const price = rawPrice * scale;
  const conf = rawConf * scale;

  // Pyth uses the same exponent for price and confidence, so rawConf/rawPrice
  // gives the same percentage ratio without precision loss from scaling.
  const confidencePct = Math.abs(rawConf / rawPrice) * 100;

  if (
    !Number.isFinite(price) ||
    !Number.isFinite(conf) ||
    !Number.isFinite(confidencePct) ||
    price <= 0 ||
    conf < 0
  ) {
    return null;
  }

  return { price, conf, confidencePct };
}

export function isPythConfidenceAcceptable(
  payload: PythPricePayload,
  maxConfidencePct: number,
): boolean {
  const parsed = parsePythPriceQuality(payload);
  return parsed !== null && parsed.confidencePct <= maxConfidencePct;
}
