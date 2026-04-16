import AsyncStorage from '@react-native-async-storage/async-storage';

import { storageKeys } from '../../../lib/storage/keys';
import { plantingMethodOptions } from '../data/plannerRules';
import { PlannerSchedule, SavedPlannerRecord } from '../types';

export async function getPlannerHistory(): Promise<SavedPlannerRecord[]> {
  const raw = await AsyncStorage.getItem(storageKeys.plannerHistory);

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as SavedPlannerRecord[];
    return parsed.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch {
    return [];
  }
}

export async function savePlannerSchedule(schedule: PlannerSchedule): Promise<SavedPlannerRecord> {
  const history = await getPlannerHistory();
  const methodMeta = plantingMethodOptions.find((option) => option.id === schedule.method);
  const timestamp = new Date().toISOString();

  const record: SavedPlannerRecord = {
    id: `${schedule.method}-${schedule.plantingDate}-${timestamp}`,
    createdAt: timestamp,
    method: schedule.method,
    plantingDate: schedule.plantingDate,
    title: methodMeta ? methodMeta.title : 'Rice Planner Schedule',
    activityCount: schedule.activities.length,
    activities: schedule.activities,
  };

  const nextHistory = [record, ...history];
  await AsyncStorage.setItem(storageKeys.plannerHistory, JSON.stringify(nextHistory));

  return record;
}
