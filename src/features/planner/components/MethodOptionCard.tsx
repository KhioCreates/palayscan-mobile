import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { SectionCard } from '../../../components/ui/SectionCard';
import { useAppLanguage } from '../../../localization/appLanguage';

type MethodOptionCardProps = {
  title: string;
  subtitle: string;
  selected: boolean;
  onPress: () => void;
};

export function MethodOptionCard({
  title,
  subtitle,
  selected,
  onPress,
}: MethodOptionCardProps) {
  const { t } = useAppLanguage();

  return (
    <Pressable accessibilityRole="button" className="active:opacity-90" onPress={onPress}>
      <SectionCard tone={selected ? 'muted' : 'default'}>
        <View className="gap-3">
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-semibold text-ink-900">{t(title)}</Text>
            <View
              className={`rounded-full px-3 py-1 ${
                selected ? 'bg-brand-600' : 'bg-brand-50'
              }`}
            >
              <Text className={`text-xs font-semibold ${selected ? 'text-white' : 'text-brand-700'}`}>
                {selected ? t('Selected') : t('Choose')}
              </Text>
            </View>
          </View>
          <Text className="text-sm leading-6 text-ink-700">{t(subtitle)}</Text>
          <View className="flex-row items-center justify-between">
            <Text className="text-sm font-semibold text-brand-700">
              {selected ? t('This method is selected') : t('Tap card to select method')}
            </Text>
            <Ionicons color="#2d6033" name="chevron-forward" size={18} />
          </View>
        </View>
      </SectionCard>
    </Pressable>
  );
}
