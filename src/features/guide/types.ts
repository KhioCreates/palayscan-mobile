export type GuideCategory = 'variety' | 'pest' | 'disease';

export type GuideCollectionKey = 'varieties' | 'pests' | 'diseases';

export type GuideEntryBase = {
  id: string;
  category: GuideCategory;
  name: string;
  shortDescription: string;
};

export type RiceVariety = GuideEntryBase & {
  category: 'variety';
  maturityDays: string;
  grainType: string;
  yieldPotential: string;
  recommendedEnvironment: string;
  notableCharacteristics: string[];
};

export type GuideInfoEntry = GuideEntryBase & {
  category: 'pest' | 'disease';
  scientificName?: string;
  symptoms: string[];
  identification: string[];
  treatment: string[];
  prevention: string[];
};

export type GuideEntry = RiceVariety | GuideInfoEntry;

export type GuideCategoryMeta = {
  key: GuideCollectionKey;
  category: GuideCategory;
  title: string;
  eyebrow: string;
  description: string;
};
