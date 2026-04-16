import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { SectionCard } from '../../../components/ui/SectionCard';

type GuideCategoryCardProps = {
  title: string;
  description: string;
  count: number;
  onPress: () => void;
};

export function GuideCategoryCard({
  title,
  description,
  count,
  onPress,
}: GuideCategoryCardProps) {
  return (
    <Pressable accessibilityRole="button" className="active:opacity-90" onPress={onPress}>
      <SectionCard>
        <View className="gap-3">
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-semibold text-ink-900">{title}</Text>
            <View className="rounded-full bg-brand-50 px-3 py-1">
              <Text className="text-xs font-semibold text-brand-700">{count} entries</Text>
            </View>
          </View>
          <Text className="text-sm leading-6 text-ink-600">{description}</Text>
          <View className="flex-row items-center justify-between pt-1">
            <Text className="text-sm font-semibold text-brand-700">Tap card to open section</Text>
            <Ionicons color="#2d6033" name="chevron-forward" size={18} />
          </View>
        </View>
      </SectionCard>
    </Pressable>
  );
}
