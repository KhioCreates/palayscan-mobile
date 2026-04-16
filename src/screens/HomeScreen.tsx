import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { HeaderBlock } from '../components/ui/HeaderBlock';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { ScreenContainer } from '../components/ui/ScreenContainer';
import { SectionCard } from '../components/ui/SectionCard';

type HomeScreenProps = {
  goToTab: (tabName: 'Guide' | 'Scan' | 'Planner' | 'More') => void;
};

const shortcuts: Array<{
  key: 'Guide' | 'Scan' | 'Planner';
  label: string;
  hint: string;
  icon: 'scan-outline' | 'book-outline' | 'calendar-outline';
}> = [
  {
    key: 'Scan',
    label: 'Scan rice concern',
    hint: 'Capture or upload a photo to check pests or diseases.',
    icon: 'scan-outline' as const,
  },
  {
    key: 'Guide',
    label: 'Browse rice guides',
    hint: 'Offline reference for varieties, pests, and diseases.',
    icon: 'book-outline' as const,
  },
  {
    key: 'Planner',
    label: 'Plan farm activities',
    hint: 'Set planting date and generate your first activity flow.',
    icon: 'calendar-outline' as const,
  },
];

export function HomeScreen({ goToTab }: HomeScreenProps) {
  return (
    <ScreenContainer>
      <HeaderBlock
        eyebrow="PALAYSCAN"
        title="Farmer-friendly rice support in one app"
        description="Simple tools for scanning, guiding, and planning your rice farming workflow."
      />

      <SectionCard tone="muted">
        <View className="gap-3">
          <Text className="text-lg font-semibold text-ink-900">Quick Start</Text>
          <Text className="text-sm leading-6 text-ink-600">
            This foundation keeps the app clean and simple first. Real scan results, guide data,
            and planner logic will be added in the next phases.
          </Text>
        </View>
      </SectionCard>

      <View className="mt-5 gap-4">
        {shortcuts.map((shortcut) => (
          <PrimaryButton
            key={shortcut.key}
            label={shortcut.label}
            hint={shortcut.hint}
            onPress={() => goToTab(shortcut.key)}
            icon={<Ionicons color="white" name={shortcut.icon} size={22} />}
          />
        ))}
      </View>

      <View className="mt-5 gap-4">
        <SectionCard>
          <View className="gap-2">
            <Text className="text-lg font-semibold text-ink-900">Built for mixed offline use</Text>
            <Text className="text-sm leading-6 text-ink-600">
              Guide content and saved records will work offline. Internet will only be needed later
              for the image identification feature.
            </Text>
          </View>
        </SectionCard>
      </View>
    </ScreenContainer>
  );
}
