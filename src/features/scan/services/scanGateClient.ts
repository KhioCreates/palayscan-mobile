import { ScanPrecheckVerdict } from './scanPrecheckTypes';

const scanGateConfig = {
  apiUrl: process.env.EXPO_PUBLIC_SCAN_GATE_URL,
  apiKey: process.env.EXPO_PUBLIC_SCAN_GATE_KEY,
};

export class ScanGateConfigError extends Error {}
export class ScanGateRequestError extends Error {}

function logScanGateDebug(label: string, value: unknown) {
  if (__DEV__) {
    console.log(`[Scan Gate] ${label}:`, value);
  }
}

function normalizeConfidence(value: unknown) {
  if (typeof value === 'number') {
    return value > 1 ? value / 100 : value;
  }

  if (typeof value === 'string') {
    const parsed = Number(value);

    if (Number.isFinite(parsed)) {
      return parsed > 1 ? parsed / 100 : parsed;
    }
  }

  return null;
}

function readBoolean(value: unknown) {
  return typeof value === 'boolean' ? value : null;
}

function mapGatePayload(payload: unknown): ScanPrecheckVerdict | null {
  if (!payload || typeof payload !== 'object') {
    return null;
  }

  const record = payload as Record<string, unknown>;
  const isPlant = readBoolean(record.isPlant);
  const isRiceLikely = readBoolean(record.isRiceLikely);
  const isUsable = readBoolean(record.isUsable);
  const confidence = normalizeConfidence(record.confidence);

  if (
    isPlant === null ||
    isRiceLikely === null ||
    isUsable === null ||
    confidence === null
  ) {
    return null;
  }

  return {
    isPlant,
    isRiceLikely,
    isUsable,
    confidence,
    reason: typeof record.reason === 'string' ? record.reason : undefined,
  };
}

export function validateScanGateConfig() {
  if (!scanGateConfig.apiUrl) {
    throw new ScanGateConfigError(
      'Scan pre-check is not configured. Add EXPO_PUBLIC_SCAN_GATE_URL before using online scan support.',
    );
  }

  return {
    apiUrl: scanGateConfig.apiUrl.trim(),
    apiKey: scanGateConfig.apiKey?.trim(),
  };
}

export async function runLiveScanGateFromBase64(base64Image: string): Promise<ScanPrecheckVerdict> {
  const { apiUrl, apiKey } = validateScanGateConfig();

  logScanGateDebug('request url', apiUrl);
  logScanGateDebug('api key present', Boolean(apiKey));
  logScanGateDebug('request body summary', {
    imageBase64Length: base64Image.length,
  });

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
    },
    body: JSON.stringify({
      imageBase64: base64Image,
      context: 'palayscan-live-precheck',
    }),
  });

  const rawText = await response.text();
  let payload: unknown = null;

  try {
    payload = rawText ? JSON.parse(rawText) : null;
  } catch {
    payload = rawText;
  }

  logScanGateDebug('response status', response.status);
  logScanGateDebug('raw response body', payload);

  if (!response.ok) {
    const errorRecord =
      payload && typeof payload === 'object' ? (payload as Record<string, unknown>) : null;
    const message =
      (errorRecord && typeof errorRecord.message === 'string' && errorRecord.message) ||
      (errorRecord && typeof errorRecord.error === 'string' && errorRecord.error) ||
      (typeof payload === 'string' && payload) ||
      `Scan gate request failed with status ${response.status}.`;

    throw new ScanGateRequestError(message);
  }

  const mapped = mapGatePayload(payload);

  if (!mapped) {
    throw new ScanGateRequestError(
      'Scan pre-check returned an invalid response shape. Expected isPlant, isRiceLikely, isUsable, and confidence.',
    );
  }

  return mapped;
}
