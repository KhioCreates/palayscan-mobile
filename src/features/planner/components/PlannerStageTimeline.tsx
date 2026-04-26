import { Text, View } from 'react-native';

import {
  getActivePlannerStage,
  getCropDay,
  getPlannerStages,
  getPlannerTimelineSummary,
} from '../utils/plannerPresentation';

type PlannerStageTimelineProps = {
  plantingDate: string;
  cropDurationDays?: number;
};

export function PlannerStageTimeline({
  plantingDate,
  cropDurationDays,
}: PlannerStageTimelineProps) {
  const cropDay = getCropDay(plantingDate);
  const activeStage = getActivePlannerStage(plantingDate, new Date(), cropDurationDays);
  const stages = getPlannerStages(cropDurationDays);
  const timelineSummary = getPlannerTimelineSummary(plantingDate, cropDurationDays);
  const isPrePlanning = cropDay < -14;

  return (
    <View className="rounded-[22px] border border-brand-100 bg-white p-4">
      <View className="flex-row items-center justify-between gap-3">
        <View className="flex-1">
          <Text className="text-sm font-semibold uppercase tracking-[2px] text-brand-700">
            Crop Stage
          </Text>
          <Text className="mt-1 text-xl font-semibold text-ink-900">
            {timelineSummary.stageTitle}
          </Text>
        </View>
        <View className="rounded-full bg-brand-50 px-3 py-2">
          <Text className="text-sm font-semibold text-brand-800">
            {timelineSummary.badgeLabel}
          </Text>
        </View>
      </View>

      <View className="mt-5 flex-row gap-2">
        {stages.map((stage) => {
          const isActive = !isPrePlanning && stage.id === activeStage.id;
          const isPast = cropDay > stage.endDay;

          return (
            <View className="flex-1" key={stage.id}>
              <View
                className={`h-2 rounded-full ${
                  isActive ? 'bg-brand-600' : isPast ? 'bg-brand-200' : 'bg-ink-100'
                }`}
              />
              <Text
                className={`mt-2 text-[11px] font-semibold ${
                  isActive ? 'text-brand-800' : 'text-ink-600'
                }`}
                numberOfLines={1}
              >
                {stage.title}
              </Text>
            </View>
          );
        })}
      </View>

      <Text className="mt-4 text-sm leading-6 text-ink-700">
        {timelineSummary.description}
      </Text>

      <View className="mt-3 rounded-[16px] bg-brand-50/70 px-4 py-3">
        <Text className="text-xs leading-5 text-ink-700">
          Crop stage changes by planting date and variety duration. Task checkmarks do not move
          the growth stage.
        </Text>
      </View>
    </View>
  );
}
