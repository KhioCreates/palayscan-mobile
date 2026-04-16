import { ScanCategory, ScanPrediction, ScanResult } from '../types';

type CandidatePrediction = {
  name: string;
  confidence: number;
  category: ScanCategory;
};

type CropSuggestion = {
  label: string;
  scientificName?: string;
  confidence: number;
};

const pestKeywords = [
  'bug',
  'bugs',
  'snail',
  'snails',
  'hopper',
  'hoppers',
  'weevil',
  'weevils',
  'worm',
  'worms',
  'borer',
  'borers',
  'mite',
  'mites',
  'beetle',
  'beetles',
  'aphid',
  'aphids',
  'fly',
  'flies',
  'locust',
  'thrips',
];

function asNumber(value: unknown) {
  if (typeof value === 'number') {
    return value;
  }

  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function normalizeConfidence(value: unknown) {
  const numeric = asNumber(value);

  if (numeric === null) {
    return null;
  }

  return numeric > 1 ? numeric / 100 : numeric;
}

function readName(entry: Record<string, unknown>) {
  const directName =
    (typeof entry.name === 'string' && entry.name) ||
    (typeof entry.common_name === 'string' && entry.common_name) ||
    (typeof entry.commonName === 'string' && entry.commonName);

  if (directName) {
    return directName;
  }

  if (Array.isArray(entry.common_names) && typeof entry.common_names[0] === 'string') {
    return entry.common_names[0];
  }

  if (Array.isArray(entry.commonNames) && typeof entry.commonNames[0] === 'string') {
    return entry.commonNames[0];
  }

  if (typeof entry.scientific_name === 'string') {
    return entry.scientific_name;
  }

  if (typeof entry.scientificName === 'string') {
    return entry.scientificName;
  }

  return null;
}

function isHealthyName(name: string) {
  return name.trim().toLowerCase() === 'healthy';
}

function looksLikePestName(name: string) {
  const normalized = name.trim().toLowerCase();
  return pestKeywords.some((keyword) => normalized.includes(keyword));
}

function readScientificName(entry: Record<string, unknown>) {
  if (typeof entry.scientific_name === 'string') {
    return entry.scientific_name;
  }

  if (typeof entry.scientificName === 'string') {
    return entry.scientificName;
  }

  return undefined;
}

function inferCategory(entry: Record<string, unknown>, fallback: ScanCategory): ScanCategory {
  const name = readName(entry);
  const categoryValue = typeof entry.category === 'string' ? entry.category.toLowerCase() : null;
  const typeValue = typeof entry.type === 'string' ? entry.type.toLowerCase() : null;
  const rawCategory = categoryValue ?? typeValue;

  if (rawCategory?.includes('pest')) {
    return 'pest';
  }

  if (rawCategory?.includes('disease')) {
    return 'disease';
  }

  if (name && looksLikePestName(name)) {
    return 'pest';
  }

  return fallback;
}

function toPrediction(
  entry: unknown,
  fallbackCategory: ScanCategory,
): CandidatePrediction | null {
  if (!entry || typeof entry !== 'object') {
    return null;
  }

  const record = entry as Record<string, unknown>;
  const name = readName(record);
  const confidence = normalizeConfidence(
    record.probability ?? record.confidence ?? record.score ?? record.similarity,
  );

  if (!name || confidence === null) {
    return null;
  }

  return {
    name,
    confidence,
    category: isHealthyName(name) ? 'healthy' : inferCategory(record, fallbackCategory),
  };
}

function collectFromPath(
  response: Record<string, unknown>,
  path: string[],
  fallbackCategory: ScanCategory,
): CandidatePrediction[] {
  let current: unknown = response;

  for (const key of path) {
    if (!current || typeof current !== 'object') {
      return [];
    }

    current = (current as Record<string, unknown>)[key];
  }

  if (!Array.isArray(current)) {
    return [];
  }

  return current
    .map((entry) => toPrediction(entry, fallbackCategory))
    .filter((entry): entry is CandidatePrediction => Boolean(entry));
}

function dedupeAndSort(predictions: CandidatePrediction[]) {
  const byName = new Map<string, CandidatePrediction>();

  for (const prediction of predictions) {
    const existing = byName.get(prediction.name);

    if (!existing || prediction.confidence > existing.confidence) {
      byName.set(prediction.name, prediction);
    }
  }

  return [...byName.values()].sort((a, b) => b.confidence - a.confidence);
}

function collectCropSuggestions(response: Record<string, unknown>) {
  const candidatePaths = [
    ['result', 'classification', 'suggestions'],
    ['result', 'crop', 'suggestions'],
    ['classification', 'suggestions'],
    ['crop', 'suggestions'],
  ];

  const suggestions: CropSuggestion[] = [];

  for (const path of candidatePaths) {
    let current: unknown = response;

    for (const key of path) {
      if (!current || typeof current !== 'object') {
        current = null;
        break;
      }

      current = (current as Record<string, unknown>)[key];
    }

    if (!Array.isArray(current)) {
      continue;
    }

    for (const entry of current) {
      if (!entry || typeof entry !== 'object') {
        continue;
      }

      const record = entry as Record<string, unknown>;
      const label = readName(record);
      const confidence = normalizeConfidence(
        record.probability ?? record.confidence ?? record.score ?? record.similarity,
      );

      if (!label || confidence === null) {
        continue;
      }

      suggestions.push({
        label,
        scientificName: readScientificName(record),
        confidence,
      });
    }
  }

  return suggestions.sort((a, b) => b.confidence - a.confidence);
}

function isRiceCrop(suggestion: CropSuggestion | undefined) {
  if (!suggestion) {
    return true;
  }

  const combined = `${suggestion.label} ${suggestion.scientificName ?? ''}`.toLowerCase();
  return combined.includes('rice') || combined.includes('oryza sativa');
}

function readIsPlantBinary(response: Record<string, unknown>) {
  const result = response.result;

  if (!result || typeof result !== 'object') {
    return null;
  }

  const isPlant = (result as Record<string, unknown>).is_plant;

  if (!isPlant || typeof isPlant !== 'object') {
    return null;
  }

  const binary = (isPlant as Record<string, unknown>).binary;
  return typeof binary === 'boolean' ? binary : null;
}

function logMapperDebug(label: string, value: unknown) {
  if (__DEV__) {
    console.log(`[Kindwise Mapper] ${label}:`, value);
  }
}

export function mapKindwiseResponseToScanResult({
  imageUri,
  notes,
  response,
}: {
  imageUri: string;
  notes?: string;
  response: unknown;
}): ScanResult | null {
  if (!response || typeof response !== 'object') {
    return null;
  }

  const record = response as Record<string, unknown>;
  const isPlantBinary = readIsPlantBinary(record);
  const diseasePredictions = collectFromPath(record, ['result', 'disease', 'suggestions'], 'disease');
  const pestPredictions = collectFromPath(record, ['result', 'pest', 'suggestions'], 'pest');
  const resultPredictions = collectFromPath(record, ['result', 'suggestions'], 'disease');
  const rootPredictions = collectFromPath(record, ['suggestions'], 'disease');
  const predictions = dedupeAndSort([
    ...diseasePredictions,
    ...pestPredictions,
    ...resultPredictions,
    ...rootPredictions,
  ]).slice(0, 3);
  const cropSuggestions = collectCropSuggestions(record);
  const topCrop = cropSuggestions[0];

  logMapperDebug('path counts', {
    isPlantBinary,
    diseaseSuggestions: diseasePredictions.length,
    pestSuggestions: pestPredictions.length,
    resultSuggestions: resultPredictions.length,
    rootSuggestions: rootPredictions.length,
    cropSuggestions: cropSuggestions.length,
  });

  if (isPlantBinary === false) {
    return {
      imageUri,
      topResultName: 'Non-Plant Image',
      predictions: [],
      category: 'healthy',
      scannedAt: new Date().toISOString(),
      notes,
      nonPlantWarning:
        'This image does not appear to be a plant. Please use a clear rice leaf, stem, or field photo.',
    };
  }

  if (predictions.length === 0) {
    logMapperDebug('no usable matches found in response', record);
    return null;
  }

  const topPrediction: ScanPrediction = predictions[0];

  return {
    imageUri,
    topResultName: topPrediction.name,
    predictions,
    category: topPrediction.category,
    scannedAt: new Date().toISOString(),
    notes,
    cropLabel: topCrop?.label,
    cropScientificName: topCrop?.scientificName,
    riceMismatchWarning: isRiceCrop(topCrop)
      ? undefined
      : 'The returned crop classification does not clearly look like rice. Use caution and verify the image before relying on this diagnosis.',
  };
}
