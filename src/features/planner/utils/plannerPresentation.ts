import { ComponentProps } from 'react';

import { Ionicons } from '@expo/vector-icons';

import { DEFAULT_CROP_DURATION_DAYS } from '../data/plannerRules';
import { PlannedActivity, PlannerActivityType } from '../types';
import { addDays, formatDate, fromIsoDate, toIsoDate } from './date';

export type PlannerActivityStatusTone = 'done' | 'late' | 'today' | 'upcoming';

export type PlannerActivityStatus = {
  label: string;
  tone: PlannerActivityStatusTone;
};

export type PlannerActivityDisplay = {
  label: string;
  icon: ComponentProps<typeof Ionicons>['name'];
  accentClassName: string;
  softClassName: string;
  textClassName: string;
};

export type PlannerStage = {
  id: string;
  title: string;
  subtitle: string;
  startDay: number;
  endDay: number;
};

export type PlannerTimelineSummary = {
  headline: string;
  stageTitle: string;
  badgeLabel: string;
  description: string;
};

type PlannerTranslator = (key: string, values?: Record<string, string | number>) => string;

const defaultPlannerTranslator: PlannerTranslator = (key, values) => {
  if (!values) {
    return key;
  }

  return key.replace(/\{(\w+)\}/g, (_match, token: string) => {
    const value = values[token];
    return value === undefined ? `{${token}}` : String(value);
  });
};

export const plannerActivityDisplay: Record<PlannerActivityType, PlannerActivityDisplay> = {
  'land-preparation': {
    label: 'Land',
    icon: 'trail-sign-outline',
    accentClassName: 'bg-earth-400',
    softClassName: 'bg-earth-50',
    textClassName: 'text-earth-500',
  },
  'seed-preparation': {
    label: 'Seed',
    icon: 'leaf-outline',
    accentClassName: 'bg-brand-500',
    softClassName: 'bg-brand-50',
    textClassName: 'text-brand-700',
  },
  'nursery-preparation': {
    label: 'Nursery',
    icon: 'flower-outline',
    accentClassName: 'bg-brand-400',
    softClassName: 'bg-brand-50',
    textClassName: 'text-brand-700',
  },
  planting: {
    label: 'Planting',
    icon: 'arrow-down-circle-outline',
    accentClassName: 'bg-brand-600',
    softClassName: 'bg-brand-50',
    textClassName: 'text-brand-700',
  },
  fertilizer: {
    label: 'Fertilizer',
    icon: 'flask-outline',
    accentClassName: 'bg-earth-500',
    softClassName: 'bg-earth-50',
    textClassName: 'text-earth-500',
  },
  'water-management': {
    label: 'Water',
    icon: 'water-outline',
    accentClassName: 'bg-blue-500',
    softClassName: 'bg-blue-50',
    textClassName: 'text-blue-700',
  },
  'pest-monitoring': {
    label: 'Scout',
    icon: 'bug-outline',
    accentClassName: 'bg-orange-500',
    softClassName: 'bg-orange-50',
    textClassName: 'text-orange-700',
  },
  harvest: {
    label: 'Harvest',
    icon: 'basket-outline',
    accentClassName: 'bg-yellow-500',
    softClassName: 'bg-yellow-50',
    textClassName: 'text-yellow-700',
  },
};

export const plannerActivityTypeOrder: PlannerActivityType[] = [
  'land-preparation',
  'seed-preparation',
  'nursery-preparation',
  'planting',
  'fertilizer',
  'water-management',
  'pest-monitoring',
  'harvest',
];

export function getPlannerStages(
  cropDurationDays = DEFAULT_CROP_DURATION_DAYS,
  t: PlannerTranslator = defaultPlannerTranslator,
): PlannerStage[] {
  const harvestStartDay = Math.max(76, cropDurationDays - 21);
  const panicleEndDay = Math.max(75, harvestStartDay - 1);

  return [
    {
      id: 'prepare',
      title: t('Prepare'),
      subtitle: t('Land and seed'),
      startDay: -14,
      endDay: -1,
    },
    {
      id: 'plant',
      title: t('Plant'),
      subtitle: t('Day 0'),
      startDay: 0,
      endDay: 7,
    },
    {
      id: 'tillering',
      title: t('Tillering'),
      subtitle: t('Scout and feed'),
      startDay: 8,
      endDay: 35,
    },
    {
      id: 'panicle',
      title: t('Panicle'),
      subtitle: t('Water and monitor'),
      startDay: 36,
      endDay: panicleEndDay,
    },
    {
      id: 'harvest',
      title: t('Harvest'),
      subtitle: t('Ripening'),
      startDay: harvestStartDay,
      endDay: cropDurationDays + 10,
    },
  ];
}

function getDayDifference(fromDate: Date, toDate: Date) {
  const fromTime = fromIsoDate(toIsoDate(fromDate)).getTime();
  const toTime = fromIsoDate(toIsoDate(toDate)).getTime();
  return Math.round((toTime - fromTime) / (1000 * 60 * 60 * 24));
}

export function getCropDay(plantingDate: string, today = new Date()) {
  return getDayDifference(fromIsoDate(plantingDate), today);
}

export function getActivePlannerStage(
  plantingDate: string,
  today = new Date(),
  cropDurationDays = DEFAULT_CROP_DURATION_DAYS,
  t: PlannerTranslator = defaultPlannerTranslator,
) {
  const cropDay = getCropDay(plantingDate, today);
  const stages = getPlannerStages(cropDurationDays, t);
  const firstStage = stages[0];
  const finalStage = stages[stages.length - 1];

  if (cropDay < firstStage.startDay) {
    return firstStage;
  }

  return (
    stages.find((stage) => cropDay >= stage.startDay && cropDay <= stage.endDay) ??
    finalStage
  );
}

export function getPlannerTimelineSummary(
  plantingDate: string,
  cropDurationDays = DEFAULT_CROP_DURATION_DAYS,
  today = new Date(),
  t: PlannerTranslator = defaultPlannerTranslator,
): PlannerTimelineSummary {
  const cropDay = getCropDay(plantingDate, today);
  const daysBeforePlanting = Math.abs(cropDay);
  const activeStage = getActivePlannerStage(plantingDate, today, cropDurationDays, t);
  const landPrepDate = formatDate(addDays(fromIsoDate(plantingDate), -14));

  if (cropDay < -14) {
    return {
      headline: t('Planting in {days} days', { days: daysBeforePlanting }),
      stageTitle: t('Planning'),
      badgeLabel: t('{days} days left', { days: daysBeforePlanting }),
      description: t('Land preparation starts around {date}.', { date: landPrepDate }),
    };
  }

  if (cropDay < 0) {
    return {
      headline: t('{days} days before planting', { days: daysBeforePlanting }),
      stageTitle: t('Prepare'),
      badgeLabel: t('Day {day}', { day: cropDay }),
      description: t('Land and seed preparation window.'),
    };
  }

  if (cropDay === 0) {
    return {
      headline: t('Day 0 - Planting'),
      stageTitle: t('Plant'),
      badgeLabel: t('Day 0'),
      description: t('Planting date starts the crop calendar.'),
    };
  }

  if (cropDay > cropDurationDays + 10) {
    return {
      headline: t('Calendar completed'),
      stageTitle: t('Harvest'),
      badgeLabel: t('Day {day}', { day: cropDay }),
      description: t('Review harvest records and start a new plan when needed.'),
    };
  }

  return {
    headline: t('Day {day} - {stage}', { day: cropDay, stage: activeStage.title }),
    stageTitle: activeStage.title,
    badgeLabel: t('Day {day}', { day: cropDay }),
    description: activeStage.subtitle,
  };
}

export function getPlannerActivityStatus(
  activity: PlannedActivity,
  today = new Date(),
): PlannerActivityStatus {
  const todayTime = fromIsoDate(toIsoDate(today)).getTime();
  const startTime = fromIsoDate(activity.startDate).getTime();
  const endTime = fromIsoDate(activity.endDate).getTime();

  if (activity.completedAt) {
    const completedTime = fromIsoDate(activity.completedAt.slice(0, 10)).getTime();

    return {
      label: completedTime < startTime ? 'Done early' : 'Done',
      tone: 'done',
    };
  }

  if (todayTime > endTime) {
    return {
      label: 'Late',
      tone: 'late',
    };
  }

  if (todayTime >= startTime && todayTime <= endTime) {
    return {
      label: 'Due now',
      tone: 'today',
    };
  }

  return {
    label: 'Upcoming',
    tone: 'upcoming',
  };
}

export function getPlannerActivityStyle(type: PlannerActivityType) {
  return plannerActivityDisplay[type];
}

export function getPlannerProgress(activities: PlannedActivity[]) {
  const completedCount = activities.filter((activity) => !!activity.completedAt).length;
  const totalCount = activities.length;

  return {
    completedCount,
    totalCount,
    percent: totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0,
  };
}

export function getPlannerWorkSummary(activities: PlannedActivity[], today = new Date()) {
  const statuses = activities.map((activity) => ({
    activity,
    status: getPlannerActivityStatus(activity, today),
  }));
  const dueNow = statuses.filter(({ status }) => status.tone === 'today');
  const late = statuses.filter(({ status }) => status.tone === 'late');
  const nextActivity =
    late[0]?.activity ??
    statuses.find(({ status }) => status.tone === 'today')?.activity ??
    statuses.find(({ status }) => status.tone === 'upcoming')?.activity ??
    activities[activities.length - 1] ??
    null;

  return {
    dueNowCount: dueNow.length,
    lateCount: late.length,
    nextActivity,
  };
}
