export type PlantingMethod = 'transplanting' | 'direct-seeding';

export type PlannerActivityType =
  | 'land-preparation'
  | 'seed-preparation'
  | 'nursery-preparation'
  | 'planting'
  | 'fertilizer'
  | 'water-management'
  | 'pest-monitoring'
  | 'harvest';

export type PlannerRule = {
  id: string;
  method: PlantingMethod | 'all';
  type: PlannerActivityType;
  title: string;
  description: string;
  offsetDays: number;
  windowDays?: number;
  notes?: string[];
};

export type PlannedActivity = {
  id: string;
  ruleId: string;
  type: PlannerActivityType;
  title: string;
  description: string;
  targetDate: string;
  startDate: string;
  endDate: string;
  windowLabel: string;
  notes: string[];
  isEditableLater: true;
};

export type PlannerSchedule = {
  method: PlantingMethod;
  plantingDate: string;
  activities: PlannedActivity[];
};

export type SavedPlannerRecord = {
  id: string;
  createdAt: string;
  method: PlantingMethod;
  plantingDate: string;
  title: string;
  activityCount: number;
  activities: PlannedActivity[];
};

export type PlantingMethodMeta = {
  id: PlantingMethod;
  title: string;
  subtitle: string;
  shortLabel: string;
};
