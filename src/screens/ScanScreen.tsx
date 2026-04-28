import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { HeaderBlock } from '../components/ui/HeaderBlock';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { ScreenContainer } from '../components/ui/ScreenContainer';
import { SectionCard } from '../components/ui/SectionCard';

export function ScanScreen() {
  return (
    <ScreenContainer>
      <HeaderBlock
        eyebrow="Scan Module"
        title="Capture or upload a rice image"
        description="Take or upload clear palay photos for checking."
      />

      <View className="gap-4">
        <PrimaryButton
          label="Open camera"
          hint="Large touch target for easy image capture."
          icon={<Ionicons color="white" name="camera-outline" size={22} />}
        />
        <PrimaryButton
          label="Choose from gallery"
          hint="Use an existing photo from the device."
          icon={<Ionicons color="white" name="images-outline" size={22} />}
        />
      </View>

      <View className="mt-5 gap-4">
        <SectionCard>
          <Text className="text-lg font-semibold text-ink-900">Photo guide</Text>
          <Text className="mt-2 text-sm leading-6 text-ink-700">
            Use clear photos of rice leaves, stems, panicles, or field patches.
          </Text>
        </SectionCard>
      </View>
    </ScreenContainer>
  );
}
