export type ScanPrecheckVerdict = {
  isPlant: boolean;
  isRiceLikely: boolean;
  isUsable: boolean;
  confidence: number;
  reason?: string;
};

export type ScanPrecheckLabel =
  | 'rice_clear'
  | 'rice_unclear'
  | 'plant_not_rice'
  | 'non_plant'
  | 'unusable_image';
