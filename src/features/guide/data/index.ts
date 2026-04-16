import { diseases } from './diseases';
import { pests } from './pests';
import { riceVarieties } from './riceVarieties';
import { GuideCategoryMeta, GuideCollectionKey, GuideEntry } from '../types';

export const guideCategoryMeta: GuideCategoryMeta[] = [
  {
    key: 'varieties',
    category: 'variety',
    title: 'Rice Varieties',
    eyebrow: 'Varieties',
    description: 'Basic local variety information that is ready to expand up to 15 entries and beyond.',
  },
  {
    key: 'pests',
    category: 'pest',
    title: 'Pests',
    eyebrow: 'Pests',
    description: 'Identification details plus treatment and prevention guidance for common rice pests.',
  },
  {
    key: 'diseases',
    category: 'disease',
    title: 'Diseases',
    eyebrow: 'Diseases',
    description:
      'Offline disease references with symptoms, identification cues, treatment notes, and prevention guidance.',
  },
];

export const guideData = {
  varieties: riceVarieties,
  pests,
  diseases,
};

export function getGuideEntries(key: GuideCollectionKey): GuideEntry[] {
  return guideData[key];
}

export function getGuideEntryById(key: GuideCollectionKey, id: string): GuideEntry | undefined {
  return guideData[key].find((entry) => entry.id === id);
}

export function getGuideCategory(key: GuideCollectionKey): GuideCategoryMeta | undefined {
  return guideCategoryMeta.find((entry) => entry.key === key);
}
