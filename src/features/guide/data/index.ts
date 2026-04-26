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
    description: 'Compare maturity, grain type, field fit, and key traits for common rice varieties.',
  },
  {
    key: 'pests',
    category: 'pest',
    title: 'Pests',
    eyebrow: 'Pests',
    description: 'See common rice pests, visible damage signs, field actions, and prevention tips.',
  },
  {
    key: 'diseases',
    category: 'disease',
    title: 'Diseases',
    eyebrow: 'Diseases',
    description:
      'Check rice disease signs, symptoms, field actions, and prevention tips in one local guide.',
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
