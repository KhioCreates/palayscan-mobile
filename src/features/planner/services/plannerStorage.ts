import AsyncStorage from '@react-native-async-storage/async-storage';

import { storageKeys } from '../../../lib/storage/keys';
import { DEFAULT_CROP_DURATION_DAYS, plantingMethodOptions } from '../data/plannerRules';
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

export async function getPlannerById(recordId: string): Promise<SavedPlannerRecord | null> {
  const history = await getPlannerHistory();
  return history.find((record) => record.id === recordId) ?? null;
}

export async function savePlannerSchedule(schedule: PlannerSchedule): Promise<SavedPlannerRecord> {
  const history = await getPlannerHistory();
  const methodMeta = plantingMethodOptions.find((option) => option.id === schedule.method);
  const scheduleDurationDays = schedule.cropDurationDays ?? DEFAULT_CROP_DURATION_DAYS;
  const existingRecord = history.find(
    (record) =>
      record.method === schedule.method &&
      record.plantingDate === schedule.plantingDate &&
      (record.cropDurationDays ?? DEFAULT_CROP_DURATION_DAYS) === scheduleDurationDays,
  );

  if (existingRecord) {
    const activities = schedule.activities.map((activity) => {
      const previousActivity = existingRecord.activities.find(
        (savedActivity) => savedActivity.ruleId === activity.ruleId,
      );

      return previousActivity?.completedAt
        ? {
            ...activity,
            completedAt: previousActivity.completedAt,
          }
        : activity;
    });
    const updatedRecord: SavedPlannerRecord = {
      ...existingRecord,
      cropDurationDays: scheduleDurationDays,
      cropDurationLabel: schedule.cropDurationLabel ?? existingRecord.cropDurationLabel,
      activityCount: activities.length,
      activities,
    };
    const nextHistory = history.map((record) =>
      record.id === existingRecord.id ? updatedRecord : record,
    );

    await AsyncStorage.setItem(storageKeys.plannerHistory, JSON.stringify(nextHistory));
    return updatedRecord;
  }

  const timestamp = new Date().toISOString();

  const record: SavedPlannerRecord = {
    id: `${schedule.method}-${schedule.plantingDate}-${timestamp}`,
    createdAt: timestamp,
    method: schedule.method,
    plantingDate: schedule.plantingDate,
    cropDurationDays: scheduleDurationDays,
    cropDurationLabel: schedule.cropDurationLabel ?? 'Medium variety',
    title: methodMeta ? `${methodMeta.title} Calendar` : 'Rice Crop Calendar',
    activityCount: schedule.activities.length,
    activities: schedule.activities,
  };

  const nextHistory = [record, ...history];
  await AsyncStorage.setItem(storageKeys.plannerHistory, JSON.stringify(nextHistory));

  return record;
}

export async function deletePlannerById(recordId: string): Promise<void> {
  const history = await getPlannerHistory();
  const nextHistory = history.filter((record) => record.id !== recordId);
  await AsyncStorage.setItem(storageKeys.plannerHistory, JSON.stringify(nextHistory));
}

export async function clearPlannerHistory(): Promise<void> {
  await AsyncStorage.removeItem(storageKeys.plannerHistory);
}

export async function updatePlannerRecord(updatedRecord: SavedPlannerRecord): Promise<SavedPlannerRecord> {
  const history = await getPlannerHistory();
  const nextHistory = history.map((record) =>
    record.id === updatedRecord.id
      ? {
          ...updatedRecord,
          activityCount: updatedRecord.activities.length,
        }
      : record,
  );

  await AsyncStorage.setItem(storageKeys.plannerHistory, JSON.stringify(nextHistory));
  return updatedRecord;
}
