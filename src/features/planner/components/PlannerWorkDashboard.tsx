import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { PlannedActivity } from '../types';
import {
  getPlannerActivityStyle,
  getPlannerProgress,
  getPlannerTimelineSummary,
  getPlannerWorkSummary,
} from '../utils/plannerPresentation';
import { formatDate, fromIsoDate } from '../utils/date';

type PlannerWorkDashboardProps = {
  activities: PlannedActivity[];
  plantingDate: string;
  cropDurationDays?: number;
  cropDurationLabel?: string;
  title?: string;
};

export function PlannerWorkDashboard({
  activities,
  plantingDate,
  cropDurationDays,
  cropDurationLabel,
  title = 'Planner dashboard',
}: PlannerWorkDashboardProps) {
  const timelineSummary = getPlannerTimelineSummary(plantingDate, cropDurationDays);
  const progress = getPlannerProgress(activities);
  const summary = getPlannerWorkSummary(activities);
  const nextStyle = summary.nextActivity ? getPlannerActivityStyle(summary.nextActivity.type) : null;
  const lateTaskMessage =
    summary.lateCount === 1
      ? '1 task needs attention before the next field work.'
      : `${summary.lateCount} tasks need attention before the next field work.`;
  const dueTaskMessage =
    summary.dueNowCount === 1
      ? '1 task is ready to check today.'
      : `${summary.dueNowCount} tasks are ready to check today.`;

  return (
    <View className="rounded-[28px] border border-brand-200 bg-brand-100/75 p-5 shadow-soft">
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1">
          <Text className="text-sm font-semibold uppercase tracking-[2px] text-brand-700">
            {title}
          </Text>
          <Text className="mt-2 text-2xl font-semibold text-ink-900">{timelineSummary.headline}</Text>
          <Text className="mt-2 text-sm leading-6 text-ink-700">
            {summary.lateCount > 0
              ? lateTaskMessage
              : summary.dueNowCount > 0
                ? dueTaskMessage
                : timelineSummary.description}
          </Text>
        </View>

        <View className="h-14 w-14 items-center justify-center rounded-full bg-white">
          <Ionicons color="#2d6033" name="calendar-number-outline" size={25} />
        </View>
      </View>

      <View className="mt-5 h-3 overflow-hidden rounded-full bg-white">
        <View className="h-full rounded-full bg-brand-600" style={{ width: `${progress.percent}%` }} />
      </View>

      <View className="mt-4 flex-row gap-3">
        <View className="flex-1 rounded-[18px] bg-white/80 p-3">
          <Text className="text-xs font-semibold uppercase tracking-[1.4px] text-brand-700">
            Done
          </Text>
          <Text className="mt-2 text-lg font-semibold text-ink-900">
            {progress.completedCount}/{progress.totalCount}
          </Text>
        </View>
        <View className="flex-1 rounded-[18px] bg-white/80 p-3">
          <Text className="text-xs font-semibold uppercase tracking-[1.4px] text-brand-700">
            Due
          </Text>
          <Text className="mt-2 text-lg font-semibold text-ink-900">{summary.dueNowCount}</Text>
        </View>
        <View className="flex-1 rounded-[18px] bg-white/80 p-3">
          <Text className="text-xs font-semibold uppercase tracking-[1.4px] text-brand-700">
            Late
          </Text>
          <Text className="mt-2 text-lg font-semibold text-ink-900">{summary.lateCount}</Text>
        </View>
      </View>

      {summary.nextActivity && nextStyle ? (
        <View className="mt-4 flex-row items-center gap-3 rounded-[20px] bg-white p-4">
          <View className={`h-11 w-11 items-center justify-center rounded-full ${nextStyle.softClassName}`}>
            <Ionicons color="#2d6033" name={nextStyle.icon} size={21} />
          </View>
          <View className="flex-1">
            <Text className="text-sm font-semibold text-ink-900">{summary.nextActivity.title}</Text>
            <Text className="mt-1 text-xs leading-5 text-ink-700">
              {formatDate(fromIsoDate(summary.nextActivity.startDate))}
            </Text>
          </View>
          <View className={`rounded-full px-3 py-1 ${nextStyle.softClassName}`}>
            <Text className={`text-xs font-semibold ${nextStyle.textClassName}`}>{nextStyle.label}</Text>
          </View>
        </View>
      ) : null}

      {cropDurationLabel ? (
        <View className="mt-3 rounded-[18px] bg-white/70 px-4 py-3">
          <Text className="text-xs font-semibold uppercase tracking-[1.4px] text-brand-700">
            Variety Duration
          </Text>
          <Text className="mt-1 text-sm font-semibold text-ink-900">{cropDurationLabel}</Text>
        </View>
      ) : null}

      <View className="mt-3 flex-row gap-3 rounded-[18px] bg-white/70 px-4 py-3">
        <Ionicons color="#2d6033" name="time-outline" size={20} />
        <Text className="flex-1 text-xs leading-5 text-ink-700">
          <Text className="font-semibold text-ink-900">Stage follows crop age. </Text>
          Checked tasks update work progress only.
        </Text>
      </View>
    </View>
  );
}
