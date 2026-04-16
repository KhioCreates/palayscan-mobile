import { Text, View } from 'react-native';

import { SectionCard } from '../../../components/ui/SectionCard';

type PlannerHistoryCardProps = {
  title: string;
  plantingDateLabel: string;
  savedAtLabel: string;
  activityCount: number;
};

export function PlannerHistoryCard({
  title,
  plantingDateLabel,
  savedAtLabel,
  activityCount,
}: PlannerHistoryCardProps) {
  return (
    <SectionCard>
      <View className="gap-3">
        <View className="flex-row items-center justify-between gap-3">
          <Text className="flex-1 text-lg font-semibold text-ink-900">{title}</Text>
          <View className="rounded-full bg-brand-50 px-3 py-1">
            <Text className="text-xs font-semibold text-brand-700">{activityCount} activities</Text>
          </View>
        </View>

        <Text className="text-sm leading-6 text-ink-600">
          Planting date: {plantingDateLabel}
        </Text>
        <Text className="text-sm leading-6 text-ink-600">Saved locally: {savedAtLabel}</Text>
      </View>
    </SectionCard>
  );
}
