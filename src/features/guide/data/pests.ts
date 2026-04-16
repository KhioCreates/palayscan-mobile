import { GuideInfoEntry } from '../types';

export const pests: GuideInfoEntry[] = [
  {
    id: 'brown-planthopper',
    category: 'pest',
    name: 'Brown Planthopper',
    shortDescription: 'A major rice pest that sucks sap and can cause hopperburn in severe cases.',
    scientificName: 'Nilaparvata lugens',
    symptoms: [
      'Yellowing and drying of rice plants',
      'Patchy burned-looking areas called hopperburn',
      'Weak plants due to heavy sap sucking',
    ],
    identification: [
      'Usually found near the lower part of the rice plant',
      'Small brown insects that gather in large numbers',
      'Damage often starts in patches and spreads outward',
    ],
    treatment: [
      'Use recommended pest management practices based on local agriculture guidance',
      'Avoid unnecessary spraying that can worsen pest outbreaks',
      'Remove heavily affected plants when practical and monitor surrounding areas closely',
    ],
    prevention: [
      'Practice regular field monitoring',
      'Avoid excessive nitrogen fertilizer use',
      'Maintain balanced farm management and follow local IPM guidance',
    ],
  },
  {
    id: 'rice-black-bug',
    category: 'pest',
    name: 'Rice Black Bug',
    shortDescription: 'A pest that feeds on rice plants and may reduce vigor and grain formation.',
    scientificName: 'Scotinophara coarctata',
    symptoms: [
      'Stunted growth and reduced tillering',
      'Wilting or poor grain filling in affected plants',
      'Visible pest activity near the base of plants, especially in the evening',
    ],
    identification: [
      'Dark-colored bugs hiding near plant bases or in cracks',
      'Often more active at night',
      'May be noticed through uneven crop performance and visible feeding pressure',
    ],
    treatment: [
      'Follow local pest control recommendations and monitor pest buildup carefully',
      'Keep field sanitation in mind during and after cropping',
      'Use control actions only when truly needed',
    ],
    prevention: [
      'Practice synchronized planting where possible',
      'Reduce hiding places through good field sanitation',
      'Monitor fields early to catch infestations before they spread',
    ],
  },
];
