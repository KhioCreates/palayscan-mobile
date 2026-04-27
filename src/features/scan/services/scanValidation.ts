import { ScanMode, ScanResult } from '../types';
import { ScanPrecheckVerdict } from './scanPrecheckTypes';

export type LocalScanGateResult =
  | {
      status: 'allowed';
    }
  | {
      status: 'confirm-required';
      message: string;
    };

export function getLocalScanGateResult({
  confirmedRiceImage,
  imageUri,
  validatedImageUri,
}: {
  confirmedRiceImage: boolean;
  imageUri: string;
  validatedImageUri: string | null;
}): LocalScanGateResult {
  if (!confirmedRiceImage) {
    return {
      status: 'confirm-required',
      message: 'Please confirm that these are clear rice leaf, stem, panicle, or field photos first.',
    };
  }

  if (validatedImageUri !== imageUri) {
    return {
      status: 'confirm-required',
      message:
        'PALAYSCAN works best with clear rice leaf, stem, panicle, or field photos. Continue only if this photo set is really rice-related.',
    };
  }

  return { status: 'allowed' };
}

export function hasStrongRiceMismatchWarning(result: Pick<ScanResult, 'riceMismatchWarning'>) {
  return Boolean(result.riceMismatchWarning?.trim());
}

export function shouldAllowLiveScanFromGate(
  gateResult: ScanPrecheckVerdict,
  minimumConfidence = 0.7,
) {
  if (!gateResult.isPlant) {
    return {
      allowed: false,
      reason:
        gateResult.reason ??
        'This image does not look like a plant. Please use a clear rice leaf, stem, or field photo.',
    };
  }

  if (!gateResult.isRiceLikely) {
    return {
      allowed: false,
      reason:
        gateResult.reason ??
        'This image does not clearly look like rice. Please choose a rice leaf, stem, or field photo.',
    };
  }

  if (!gateResult.isUsable) {
    return {
      allowed: false,
      reason:
        gateResult.reason ??
        'This image is not clear enough for scanning. Try a brighter, closer, and steadier photo.',
    };
  }

  if (gateResult.confidence < minimumConfidence) {
    return {
      allowed: false,
      reason:
        gateResult.reason ??
        'This image did not pass the pre-check with enough confidence. Please try a clearer rice photo.',
    };
  }

  return {
    allowed: true,
  };
}

export function shouldAutoSaveScanResult({
  result,
  mode,
  hasStrongLocalPass,
}: {
  result: ScanResult;
  mode: ScanMode;
  hasStrongLocalPass: boolean;
}) {
  if (result.nonPlantWarning) {
    return {
      allowed: false,
      reason: 'This result was not saved because the image does not appear to be a plant.',
    };
  }

  if (hasStrongRiceMismatchWarning(result)) {
    return {
      allowed: false,
      reason:
        result.riceMismatchWarning ??
        'This result was not saved because it was not reliable enough for rice scan history.',
    };
  }

  if (mode === 'mock' && !hasStrongLocalPass) {
    return {
      allowed: false,
      reason:
        'This result was not saved because manual confirmation alone is not enough to verify that the image is really rice-related.',
    };
  }

  return {
    allowed: true,
  };
}
