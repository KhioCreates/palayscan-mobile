export type ScanCategory = 'pest' | 'disease' | 'healthy';
export type ScanMode = 'mock' | 'live';
export type ScanPhotoFocus = 'Leaf' | 'Stem' | 'Panicle' | 'Field';

export type SelectedScanImage = {
  id: string;
  uri: string;
  base64: string;
  focus: ScanPhotoFocus;
  source: 'camera' | 'gallery';
};

export type ScanPhotoEvidence = {
  imageUri: string;
  focus: ScanPhotoFocus;
};

export type ScanDiagnosisDetails = {
  commonNames?: string[];
  scientificName?: string;
  description?: string;
  treatment?: string[];
  symptoms?: string[];
  severity?: string;
  spreading?: string;
  type?: string;
  imageUrl?: string;
  imageUrls?: string[];
  wikiUrl?: string;
  sourceUrl?: string;
  eppoCode?: string;
  gbifId?: string;
  taxonomy?: string[];
};

export type ScanPrediction = {
  name: string;
  confidence: number;
  category: ScanCategory;
  scientificName?: string;
  details?: ScanDiagnosisDetails;
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
  scanPhotos?: ScanPhotoEvidence[];
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
  scanPhotos?: ScanPhotoEvidence[];
  nonPlantWarning?: string;
  riceMismatchWarning?: string;
  result: ScanResult;
};
