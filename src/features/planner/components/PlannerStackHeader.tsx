import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

type PlannerStackHeaderProps = {
  title: string;
  onBack: () => void;
  backLabel?: string;
};

export function PlannerStackHeader({
  title,
  onBack,
  backLabel = 'Back',
}: PlannerStackHeaderProps) {
  return (
    <View className="mb-4 flex-row items-center gap-3">
      <Pressable
        accessibilityRole="button"
        className="h-11 w-11 items-center justify-center rounded-full bg-white shadow-soft active:bg-brand-50"
        onPress={onBack}
      >
        <Ionicons color="#2d6033" name="arrow-back" size={20} />
      </Pressable>

      <View className="flex-1">
        <Text className="text-sm font-medium text-ink-600">{backLabel}</Text>
        <Text className="text-lg font-semibold text-ink-900">{title}</Text>
      </View>
    </View>
  );
}
