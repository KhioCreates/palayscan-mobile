import { RiceVariety } from '../types';

export const riceVarieties: RiceVariety[] = [
  {
    id: 'nsic-rc-222',
    category: 'variety',
    name: 'NSIC Rc 222',
    shortDescription: 'A widely known inbred variety valued for stable performance and grain quality.',
    maturityDays: '110 to 114 days',
    grainType: 'Long and slender',
    yieldPotential: 'Around 6.0 to 10.0 tons per hectare in favorable conditions',
    recommendedEnvironment: 'Irrigated lowland, dry and wet season',
    notableCharacteristics: [
      'Popular among farmers because it is well known and adaptable',
      'Good eating quality and market acceptance',
      'Suitable as a reference sample while the full guide expands later',
    ],
  },
  {
    id: 'nsic-rc-160',
    category: 'variety',
    name: 'NSIC Rc 160',
    shortDescription: 'An irrigated lowland variety known for dependable field performance.',
    maturityDays: '110 to 115 days',
    grainType: 'Long slender grain',
    yieldPotential: 'Around 5.5 to 8.5 tons per hectare',
    recommendedEnvironment: 'Irrigated lowland areas',
    notableCharacteristics: [
      'Good benchmark variety for local guide expansion',
      'Useful for comparing maturity and grain type against other entries',
      'Can later be enriched with more exact agronomic notes',
    ],
  },
  {
    id: 'sl-8h',
    category: 'variety',
    name: 'SL-8H',
    shortDescription: 'Sample hybrid entry included to make the structure ready for more variety types.',
    maturityDays: 'Around 114 to 118 days',
    grainType: 'Long grain',
    yieldPotential: 'High yield potential under good management',
    recommendedEnvironment: 'Irrigated production areas with good crop management',
    notableCharacteristics: [
      'Included as a starter hybrid example',
      'Helps keep the data model flexible for future entries',
      'Can later include more localized recommendation details',
    ],
  },
];
