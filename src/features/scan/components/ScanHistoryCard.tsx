import { Image, Pressable, Text, View } from 'react-native';

import { SectionCard } from '../../../components/ui/SectionCard';

type ScanHistoryCardProps = {
  imageUri: string;
  title: string;
  confidenceLabel: string;
  scannedAtLabel: string;
  mode: 'mock' | 'live';
  onPress: () => void;
};

export function ScanHistoryCard({
  imageUri,
  title,
  confidenceLabel,
  scannedAtLabel,
  mode,
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
              <Text className="flex-1 text-base font-semibold text-ink-900">{title}</Text>
              <View className={`rounded-full px-3 py-1 ${mode === 'live' ? 'bg-earth-100' : 'bg-brand-50'}`}>
                <Text className={`text-xs font-semibold uppercase ${mode === 'live' ? 'text-earth-500' : 'text-brand-700'}`}>
                  {mode}
                </Text>
              </View>
            </View>

            <Text className="text-sm text-ink-600">Confidence: {confidenceLabel}</Text>
            <Text className="text-sm text-ink-600">Scanned: {scannedAtLabel}</Text>
          </View>
        </View>
      </SectionCard>
    </Pressable>
  );
}
