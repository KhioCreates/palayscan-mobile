import { ScanResult } from '../types';

export function buildPlaceholderScanResult(imageUri: string): ScanResult {
  return {
    imageUri,
    topResultName: 'Rice Blast',
    category: 'disease',
    scannedAt: new Date().toISOString(),
    notes: '',
    predictions: [
      {
        name: 'Rice Blast',
        confidence: 0.89,
        category: 'disease',
      },
      {
        name: 'Bacterial Leaf Blight',
        confidence: 0.72,
        category: 'disease',
      },
      {
        name: 'Brown Planthopper',
        confidence: 0.41,
        category: 'pest',
      },
    ],
  };
}
