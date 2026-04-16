import { Text, View } from 'react-native';

import { SectionCard } from '../../../components/ui/SectionCard';

type PlannerActivityCardProps = {
  title: string;
  description: string;
  dateLabel: string;
  notes: string[];
};

export function PlannerActivityCard({
  title,
  description,
  dateLabel,
  notes,
}: PlannerActivityCardProps) {
  return (
    <SectionCard>
      <View className="gap-3">
        <View className="flex-row items-center justify-between gap-3">
          <Text className="flex-1 text-lg font-semibold text-ink-900">{title}</Text>
          <View className="rounded-full bg-brand-50 px-3 py-1">
            <Text className="text-xs font-semibold text-brand-700">{dateLabel}</Text>
          </View>
        </View>

        <Text className="text-sm leading-6 text-ink-600">{description}</Text>

        {notes.length > 0 ? (
          <View className="gap-2 rounded-[18px] bg-brand-50/70 p-3">
            <Text className="text-sm font-semibold text-ink-900">Planner Notes</Text>
            {notes.map((note) => (
              <View key={note} className="flex-row gap-3">
                <Text className="pt-0.5 text-brand-700">-</Text>
                <Text className="flex-1 text-sm leading-6 text-ink-700">{note}</Text>
              </View>
            ))}
          </View>
        ) : null}
      </View>
    </SectionCard>
  );
}
