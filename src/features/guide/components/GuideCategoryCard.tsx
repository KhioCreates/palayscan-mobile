import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { SectionCard } from '../../../components/ui/SectionCard';
import { GuideCategory } from '../types';

type GuideCategoryCardProps = {
  title: string;
  description: string;
  count: number;
  category: GuideCategory;
  onPress: () => void;
};

const categoryIcons: Record<GuideCategory, keyof typeof Ionicons.glyphMap> = {
  variety: 'leaf-outline',
  pest: 'bug-outline',
  disease: 'warning-outline',
};

const categoryActionLabels: Record<GuideCategory, string> = {
  variety: 'Browse palay varieties',
  pest: 'Browse pests',
  disease: 'Browse diseases',
};

export function GuideCategoryCard({
  title,
  description,
  count,
  category,
  onPress,
}: GuideCategoryCardProps) {
  return (
    <Pressable accessibilityRole="button" className="active:opacity-90" onPress={onPress}>
      <SectionCard>
        <View className="gap-3">
          <View className="flex-row items-center justify-between gap-3">
            <View className="flex-row flex-1 items-center gap-3">
              <View className="h-11 w-11 items-center justify-center rounded-2xl bg-brand-50">
                <Ionicons color="#2d6033" name={categoryIcons[category]} size={22} />
              </View>
              <Text className="flex-1 text-lg font-semibold text-ink-900">{title}</Text>
            </View>
            <View className="rounded-full bg-brand-50 px-3 py-1">
              <Text className="text-xs font-semibold text-brand-700">{count} entries</Text>
            </View>
          </View>
          <Text className="text-sm leading-6 text-ink-700">{description}</Text>
          <View className="flex-row items-center justify-between pt-1">
            <Text className="text-sm font-semibold text-brand-700">
              {categoryActionLabels[category]}
            </Text>
            <Ionicons color="#2d6033" name="chevron-forward" size={18} />
          </View>
        </View>
      </SectionCard>
    </Pressable>
  );
}
