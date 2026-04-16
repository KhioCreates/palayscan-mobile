export type ScanCategory = 'pest' | 'disease' | 'healthy';
export type ScanMode = 'mock' | 'live';

export type SelectedScanImage = {
  uri: string;
  base64: string;
};

export type ScanPrediction = {
  name: string;
  confidence: number;
  category: ScanCategory;
};

export type ScanResult = {
  imageUri: string;
  topResultName: string;
  predictions: ScanPrediction[];
  category: ScanCategory;
  scannedAt: string;
  notes?: string;
  cropLabel?: string;
  cropScientificName?: string;
  riceMismatchWarning?: string;
  nonPlantWarning?: string;
};

export type ScanApiState = 'idle' | 'loading' | 'success' | 'error' | 'empty';

export type SavedScanRecord = {
  id: string;
  createdAt: string;
  scannedAt: string;
  imageUri: string;
  mode: ScanMode;
  topResultName: string;
  category: ScanCategory;
  confidence: number;
  predictions: ScanPrediction[];
  notes?: string;
  nonPlantWarning?: string;
  riceMismatchWarning?: string;
  result: ScanResult;
};
