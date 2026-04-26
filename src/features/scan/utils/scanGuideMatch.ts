import { guideData } from '../../guide/data';
import { GuideInfoEntry } from '../../guide/types';
import { ScanPrediction } from '../types';

function normalizeName(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

const guideInfoEntries: GuideInfoEntry[] = [...guideData.diseases, ...guideData.pests];

export function findGuideEntryForPrediction(
  prediction: Pick<ScanPrediction, 'category' | 'name'>,
): GuideInfoEntry | undefined {
  const normalizedPrediction = normalizeName(prediction.name);
  const categoryEntries =
    prediction.category === 'healthy'
      ? guideInfoEntries
      : guideInfoEntries.filter((entry) => entry.category === prediction.category);

  return (
    categoryEntries.find((entry) => normalizeName(entry.name) === normalizedPrediction) ??
    categoryEntries.find((entry) => {
      const normalizedGuideName = normalizeName(entry.name);
      return (
        normalizedGuideName.includes(normalizedPrediction) ||
        normalizedPrediction.includes(normalizedGuideName)
      );
    })
  );
}
