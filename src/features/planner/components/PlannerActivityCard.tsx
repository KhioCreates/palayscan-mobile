import { Pressable, Text, View } from 'react-native';

import { SectionCard } from '../../../components/ui/SectionCard';

type PlannerActivityCardProps = {
  title: string;
  description: string;
  dateLabel: string;
  notes: string[];
  onPress?: () => void;
  selected?: boolean;
};

export function PlannerActivityCard({
  title,
  description,
  dateLabel,
  notes,
  onPress,
  selected = false,
}: PlannerActivityCardProps) {
  return (
    <Pressable accessibilityRole="button" className="active:opacity-90" disabled={!onPress} onPress={onPress}>
      <View className={selected ? 'rounded-[24px] border border-brand-200 bg-brand-50/40 p-[1px]' : undefined}>
        <SectionCard tone="default">
          <View className="gap-3">
            <View className="flex-row items-center justify-between gap-3">
              <Text className="flex-1 text-lg font-semibold text-ink-900">{title}</Text>
              <View className={`rounded-full px-3 py-1 ${selected ? 'bg-brand-100' : 'bg-brand-50'}`}>
                <Text className={`text-xs font-semibold ${selected ? 'text-brand-800' : 'text-brand-700'}`}>
                  {dateLabel}
                </Text>
              </View>
            </View>

            <Text className="text-sm leading-6 text-ink-600">{description}</Text>

            {notes.length > 0 ? (
              <View className="gap-2 rounded-[18px] bg-brand-50/70 p-3">
                <Text className="text-sm font-semibold text-ink-900">Activity Notes</Text>
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
      </View>
    </Pressable>
  );
}
