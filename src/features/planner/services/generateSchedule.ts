import { plannerRules } from '../data/plannerRules';
import { addDays, buildWindowLabel, fromIsoDate, toIsoDate } from '../utils/date';
import { PlannedActivity, PlannerSchedule, PlannerRule, PlantingMethod } from '../types';

function sortRules(a: PlannerRule, b: PlannerRule) {
  if (a.offsetDays === b.offsetDays) {
    return a.title.localeCompare(b.title);
  }

  return a.offsetDays - b.offsetDays;
}

export function generatePlannerSchedule(
  plantingMethod: PlantingMethod,
  plantingDate: string,
): PlannerSchedule {
  const baseDate = fromIsoDate(plantingDate);

  const activities: PlannedActivity[] = plannerRules
    .filter((rule) => rule.method === 'all' || rule.method === plantingMethod)
    .sort(sortRules)
    .map((rule) => {
      const startDate = addDays(baseDate, rule.offsetDays);
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
    activities,
  };
}
