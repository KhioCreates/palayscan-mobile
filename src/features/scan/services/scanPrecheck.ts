import {
  runLiveScanGateFromBase64,
  ScanGateConfigError,
  ScanGateRequestError,
} from './scanGateClient';
import { ScanPrecheckVerdict } from './scanPrecheckTypes';

export class ScanPrecheckConfigError extends Error {}
export class ScanPrecheckRequestError extends Error {}

function logScanPrecheckDebug(label: string, value: unknown) {
  if (__DEV__) {
    console.log(`[Scan Precheck] ${label}:`, value);
  }
}

export async function runLiveScanPrecheckFromBase64(
  base64Image: string,
): Promise<ScanPrecheckVerdict> {
  try {
    logScanPrecheckDebug('provider', 'remote-gate');
    return await runLiveScanGateFromBase64(base64Image);
  } catch (error) {
    if (error instanceof ScanGateConfigError) {
      logScanPrecheckDebug('provider skipped', error.message);
      return {
        isPlant: true,
        isRiceLikely: true,
        isUsable: true,
        confidence: 1,
        reason:
          'Remote scan gate is not configured, so PALAYSCAN will rely on the crop.health response and local user confirmation.',
      };
    }

    if (error instanceof ScanGateRequestError) {
      throw new ScanPrecheckRequestError(error.message);
    }

    throw error;
  }
}
