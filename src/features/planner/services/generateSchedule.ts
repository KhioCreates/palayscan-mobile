import { DEFAULT_CROP_DURATION_DAYS, plannerRules } from '../data/plannerRules';
import { addDays, buildWindowLabel, fromIsoDate, toIsoDate } from '../utils/date';
import { PlannedActivity, PlannerSchedule, PlannerRule, PlantingMethod } from '../types';

function sortRules(a: PlannerRule, b: PlannerRule) {
  if (a.offsetDays === b.offsetDays) {
    return a.title.localeCompare(b.title);
  }

  return a.offsetDays - b.offsetDays;
}

function resolveRuleOffset(rule: PlannerRule, cropDurationDays: number) {
  if (rule.id === 'harvest-window') {
    return Math.max(80, cropDurationDays - 7);
  }

  return rule.offsetDays;
}

export function generatePlannerSchedule(
  plantingMethod: PlantingMethod,
  plantingDate: string,
  cropDurationDays = DEFAULT_CROP_DURATION_DAYS,
  cropDurationLabel = 'Medium variety',
): PlannerSchedule {
  const baseDate = fromIsoDate(plantingDate);

  const activities: PlannedActivity[] = plannerRules
    .filter((rule) => rule.method === 'all' || rule.method === plantingMethod)
    .sort(sortRules)
    .map((rule) => {
      const offsetDays = resolveRuleOffset(rule, cropDurationDays);
      const startDate = addDays(baseDate, offsetDays);
      const endDate = addDays(startDate, rule.windowDays ?? 0);

      return {
        id: `${rule.id}-${plantingDate}`,
        ruleId: rule.id,
        type: rule.type,
        title: rule.title,
        description: rule.description,
        targetDate: toIsoDate(startDate),
        startDate: toIsoDate(startDate),
        endDate: toIsoDate(endDate),
        windowLabel: buildWindowLabel(startDate, endDate),
        notes: rule.notes ?? [],
        isEditableLater: true,
      };
    });

  return {
    method: plantingMethod,
    plantingDate,
    cropDurationDays,
    cropDurationLabel,
    activities,
  };
}
