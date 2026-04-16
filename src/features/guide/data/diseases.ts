import { GuideInfoEntry } from '../types';

export const diseases: GuideInfoEntry[] = [
  {
    id: 'rice-blast',
    category: 'disease',
    name: 'Rice Blast',
    shortDescription: 'A serious fungal disease that affects leaves, nodes, and panicles.',
    scientificName: 'Magnaporthe oryzae',
    symptoms: [
      'Spindle-shaped leaf lesions with gray or whitish centers',
      'Neck and node infection in severe cases',
      'Reduced grain filling and weakened crop performance',
    ],
    identification: [
      'Leaf spots often have pointed ends and pale centers',
      'Symptoms may appear on leaves first and later affect reproductive parts',
      'More noticeable under conditions favorable to fungal development',
    ],
    treatment: [
      'Use locally recommended disease management practices',
      'Remove stress factors when possible and monitor spread carefully',
      'Consult approved local references before applying chemical controls',
    ],
    prevention: [
      'Use healthy seed and good crop management',
      'Avoid excessive nitrogen application',
      'Promote balanced nutrition and timely field monitoring',
    ],
  },
  {
    id: 'bacterial-leaf-blight',
    category: 'disease',
    name: 'Bacterial Leaf Blight',
    shortDescription: 'A bacterial disease that causes leaf drying and yield reduction.',
    scientificName: 'Xanthomonas oryzae pv. oryzae',
    symptoms: [
      'Yellow to whitish lesions spreading from the leaf tip or margins',
      'Leaf drying in more advanced cases',
      'Reduced plant vigor and possible yield loss',
    ],
    identification: [
      'Lesions often begin near the tip and move downward',
      'Affected leaves can look water-soaked before drying',
      'Field pattern may become more visible after rain or wind damage',
    ],
    treatment: [
      'Use disease management practices based on local agricultural advice',
      'Reduce additional crop stress and continue field observation',
      'Avoid practices that may worsen spread between plants',
    ],
    prevention: [
      'Use clean seed and good field sanitation',
      'Avoid excessive nitrogen use',
      'Support strong plant health through balanced nutrient and water management',
    ],
  },
];
