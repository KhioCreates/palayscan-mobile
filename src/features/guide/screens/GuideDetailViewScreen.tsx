import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Image, Text, View } from 'react-native';

import { HeaderBlock } from '../../../components/ui/HeaderBlock';
import { ScreenContainer } from '../../../components/ui/ScreenContainer';
import { SectionCard } from '../../../components/ui/SectionCard';
import { GuideStackHeader } from '../components/GuideStackHeader';
import { getGuideEntryById } from '../data';
import { GuideStackParamList } from '../navigation/GuideNavigator';
import { GuideInfoEntry, RiceVariety } from '../types';

type GuideDetailViewScreenProps = NativeStackScreenProps<GuideStackParamList, 'GuideDetail'>;

function DetailList({ items }: { items: string[] }) {
  return (
    <View className="gap-2">
      {items.map((item) => (
        <View key={item} className="flex-row gap-3">
          <Text className="pt-0.5 text-brand-700">-</Text>
          <Text className="flex-1 text-sm leading-6 text-ink-700">{item}</Text>
        </View>
      ))}
    </View>
  );
}

function VarietyDetail({ entry }: { entry: RiceVariety }) {
  return (
    <View className="gap-4">
      {entry.imageSource ? (
        <SectionCard>
          <View className="overflow-hidden rounded-[20px] border border-brand-100">
            <Image
              accessibilityIgnoresInvertColors
              accessibilityLabel={entry.imageAlt ?? `${entry.name} guide image`}
              className="h-52 w-full"
              resizeMode="cover"
              source={entry.imageSource}
            />
          </View>
        </SectionCard>
      ) : null}

      <SectionCard>
        <View className="gap-3">
          <Text className="text-lg font-semibold text-ink-900">Basic Information</Text>
          <View className="gap-2">
            <Text className="text-sm text-ink-700">
              <Text className="font-semibold text-ink-900">Maturity Days: </Text>
              {entry.maturityDays}
            </Text>
            <Text className="text-sm text-ink-700">
              <Text className="font-semibold text-ink-900">Grain Type: </Text>
              {entry.grainType}
            </Text>
            <Text className="text-sm text-ink-700">
              <Text className="font-semibold text-ink-900">Yield Potential: </Text>
              {entry.yieldPotential}
            </Text>
            <Text className="text-sm text-ink-700">
              <Text className="font-semibold text-ink-900">Recommended Environment: </Text>
              {entry.recommendedEnvironment}
            </Text>
          </View>
        </View>
      </SectionCard>

      <SectionCard>
        <View className="gap-3">
          <Text className="text-lg font-semibold text-ink-900">Description</Text>
          <Text className="text-sm leading-6 text-ink-700">{entry.shortDescription}</Text>
        </View>
      </SectionCard>

      <SectionCard>
        <View className="gap-3">
          <Text className="text-lg font-semibold text-ink-900">Notable Characteristics</Text>
          <DetailList items={entry.notableCharacteristics} />
        </View>
      </SectionCard>
    </View>
  );
}

function GuideInfoDetail({ entry }: { entry: GuideInfoEntry }) {
  return (
    <View className="gap-4">
      {entry.imageSource ? (
        <SectionCard>
          <View className="overflow-hidden rounded-[20px] border border-brand-100">
            <Image
              accessibilityIgnoresInvertColors
              accessibilityLabel={entry.imageAlt ?? `${entry.name} guide image`}
              className="h-52 w-full"
              resizeMode="cover"
              source={entry.imageSource}
            />
          </View>
        </SectionCard>
      ) : null}

      {entry.scientificName ? (
        <SectionCard tone="muted">
          <View className="gap-2">
            <Text className="text-lg font-semibold text-ink-900">Scientific Name</Text>
            <Text className="text-sm leading-6 text-ink-700">{entry.scientificName}</Text>
          </View>
        </SectionCard>
      ) : null}

      <SectionCard>
        <View className="gap-3">
          <Text className="text-lg font-semibold text-ink-900">How to recognize it</Text>
          <DetailList items={entry.identification} />
        </View>
      </SectionCard>

      <SectionCard>
        <View className="gap-3">
          <Text className="text-lg font-semibold text-ink-900">Symptoms</Text>
          <DetailList items={entry.symptoms} />
        </View>
      </SectionCard>

      <SectionCard>
        <View className="gap-3">
          <Text className="text-lg font-semibold text-ink-900">What to do</Text>
          <DetailList items={entry.treatment} />
        </View>
      </SectionCard>

      <SectionCard>
        <View className="gap-3">
          <Text className="text-lg font-semibold text-ink-900">How to prevent it</Text>
          <DetailList items={entry.prevention} />
        </View>
      </SectionCard>
    </View>
  );
}

export function GuideDetailViewScreen({ navigation, route }: GuideDetailViewScreenProps) {
  const { categoryKey, entryId } = route.params;
  const entry = getGuideEntryById(categoryKey, entryId);

  if (!entry) {
    return (
      <ScreenContainer bottomSpacing="comfortable">
        <GuideStackHeader onBack={() => navigation.goBack()} title="Guide" />
        <HeaderBlock
          eyebrow="Guide"
          title="Entry not found"
          description="This local guide entry could not be found."
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer bottomSpacing="comfortable">
      <GuideStackHeader
        backLabel="Back to list"
        onBack={() => navigation.goBack()}
        title={entry.name}
      />
      <HeaderBlock
        eyebrow={
          entry.category === 'variety' ? 'Rice Variety' : entry.category === 'pest' ? 'Pest' : 'Disease'
        }
        title={entry.name}
        description={entry.shortDescription}
      />

      {entry.category === 'variety' ? (
        <VarietyDetail entry={entry} />
      ) : (
        <GuideInfoDetail entry={entry} />
      )}
    </ScreenContainer>
  );
}
