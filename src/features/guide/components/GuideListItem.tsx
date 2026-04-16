import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { SectionCard } from '../../../components/ui/SectionCard';

type GuideListItemProps = {
  title: string;
  summary: string;
  badge: string;
  onPress: () => void;
};

export function GuideListItem({ title, summary, badge, onPress }: GuideListItemProps) {
  return (
    <Pressable accessibilityRole="button" className="active:opacity-90" onPress={onPress}>
      <SectionCard>
        <View className="gap-3">
          <View className="flex-row items-center justify-between gap-3">
            <Text className="flex-1 text-lg font-semibold text-ink-900">{title}</Text>
            <View className="rounded-full bg-brand-50 px-3 py-1">
              <Text className="text-xs font-semibold uppercase tracking-[1.2px] text-brand-700">
                {badge}
              </Text>
            </View>
          </View>
          <Text className="text-sm leading-6 text-ink-600">{summary}</Text>
          <View className="flex-row items-center justify-between">
            <Text className="text-sm font-semibold text-brand-700">Tap card to view details</Text>
            <Ionicons color="#2d6033" name="chevron-forward" size={18} />
          </View>
        </View>
      </SectionCard>
    </Pressable>
  );
}
