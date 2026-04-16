import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { SectionCard } from '../../../components/ui/SectionCard';

type ScanActionCardProps = {
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
};

export function ScanActionCard({
  title,
  description,
  icon,
  onPress,
}: ScanActionCardProps) {
  return (
    <Pressable accessibilityRole="button" className="active:opacity-90" onPress={onPress}>
      <SectionCard>
        <View className="gap-3">
          <View className="flex-row items-center justify-between">
            <View className="rounded-full bg-brand-50 p-3">
              <Ionicons color="#2d6033" name={icon} size={22} />
            </View>
            <Ionicons color="#2d6033" name="chevron-forward" size={18} />
          </View>

          <View className="gap-2">
            <Text className="text-lg font-semibold text-ink-900">{title}</Text>
            <Text className="text-sm leading-6 text-ink-600">{description}</Text>
          </View>
        </View>
      </SectionCard>
    </Pressable>
  );
}
