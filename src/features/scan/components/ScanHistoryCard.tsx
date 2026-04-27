import { Image, Pressable, Text, View } from 'react-native';

import { SectionCard } from '../../../components/ui/SectionCard';
import { toDiagnosisTitleCase } from '../utils/formatScanText';

type ScanHistoryCardProps = {
  imageUri: string;
  title: string;
  confidenceLabel: string;
  scannedAtLabel: string;
  onPress: () => void;
};

export function ScanHistoryCard({
  imageUri,
  title,
  confidenceLabel,
  scannedAtLabel,
  onPress,
}: ScanHistoryCardProps) {
  return (
    <Pressable accessibilityRole="button" className="active:opacity-90" onPress={onPress}>
      <SectionCard>
        <View className="flex-row gap-4">
          <Image
            source={{ uri: imageUri }}
            className="h-[72px] w-[72px] rounded-[18px] bg-brand-100"
            resizeMode="cover"
          />

          <View className="flex-1 gap-2">
            <View className="flex-row items-center justify-between gap-3">
              <Text className="flex-1 text-base font-semibold text-ink-900">
                {toDiagnosisTitleCase(title)}
              </Text>
            </View>

            <Text className="text-sm text-ink-700">Confidence: {confidenceLabel}</Text>
            <Text className="text-sm text-ink-700">Scanned: {scannedAtLabel}</Text>
            <Text className="text-sm font-semibold text-brand-700">Tap card to view details</Text>
          </View>
        </View>
      </SectionCard>
    </Pressable>
  );
}
