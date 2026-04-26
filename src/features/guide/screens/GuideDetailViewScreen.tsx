import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useRef } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { HeaderBlock } from '../../../components/ui/HeaderBlock';
import { ScreenContainer } from '../../../components/ui/ScreenContainer';
import { SectionCard } from '../../../components/ui/SectionCard';
import { GuideEntryVisual } from '../components/GuideEntryVisual';
import { GuideStackHeader } from '../components/GuideStackHeader';
import { getGuideEntryById } from '../data';
import { GuideStackParamList } from '../navigation/GuideNavigator';
import { GuideInfoEntry, RiceVariety } from '../types';

type GuideDetailViewScreenProps = NativeStackScreenProps<GuideStackParamList, 'GuideDetail'>;
type GuideAnchorKey = 'signs' | 'action' | 'prevent';
type GuideAnchorOffsets = Partial<Record<GuideAnchorKey, number>>;

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

function DetailChecklist({ items }: { items: string[] }) {
  return (
    <View className="gap-2">
      {items.map((item) => (
        <View key={item} className="flex-row gap-3 rounded-[16px] bg-white px-3 py-3">
          <View className="mt-0.5 h-5 w-5 items-center justify-center rounded-full bg-brand-100">
            <Ionicons color="#2d6033" name="checkmark" size={13} />
          </View>
          <Text className="flex-1 text-sm leading-6 text-ink-700">{item}</Text>
        </View>
      ))}
    </View>
  );
}

function SectionChips({
  onSelectSection,
}: {
  onSelectSection: (section: GuideAnchorKey) => void;
}) {
  const chips = [
    { key: 'signs', label: 'Signs', icon: 'eye-outline' },
    { key: 'action', label: 'What to do', icon: 'construct-outline' },
    { key: 'prevent', label: 'Prevent', icon: 'shield-checkmark-outline' },
  ] as const;

  return (
    <View className="flex-row gap-2">
      {chips.map((chip) => (
        <Pressable
          accessibilityLabel={`Jump to ${chip.label}`}
          accessibilityRole="button"
          className="min-h-16 flex-1 items-center justify-center rounded-[16px] bg-brand-50 px-2 py-3 active:bg-brand-100"
          key={chip.label}
          onPress={() => onSelectSection(chip.key)}
        >
          <Ionicons color="#2d6033" name={chip.icon} size={17} />
          <Text className="mt-1 text-center text-[11px] font-semibold text-brand-800">
            {chip.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

function VarietyDetail({ entry }: { entry: RiceVariety }) {
  return (
    <View className="gap-4">
      <SectionCard>
        <GuideEntryVisual
          badgeLabel="Rice variety"
          compactPlaceholder
          category={entry.category}
          imageAlt={entry.imageAlt}
          imageFit={entry.imageFit}
          imageSource={entry.imageSource}
          primaryDetail={entry.maturityDays}
          secondaryDetail={entry.grainType}
          size="detail"
          tertiaryDetail={entry.yieldPotential}
          title={entry.name}
          visualHint={entry.recommendedEnvironment}
        />
      </SectionCard>

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

function GuideInfoDetail({
  entry,
  onContentLayout,
  onSectionLayout,
  onSelectSection,
}: {
  entry: GuideInfoEntry;
  onContentLayout: (offsetY: number) => void;
  onSectionLayout: (section: GuideAnchorKey, offsetY: number) => void;
  onSelectSection: (section: GuideAnchorKey) => void;
}) {
  const visualSigns = [...entry.identification.slice(0, 2), ...entry.symptoms.slice(0, 2)];

  return (
    <View className="gap-4" onLayout={(event) => onContentLayout(event.nativeEvent.layout.y)}>
      <SectionCard>
        <GuideEntryVisual
          badgeLabel={entry.category === 'pest' ? 'Pest signs' : 'Disease signs'}
          compactPlaceholder
          category={entry.category}
          imageAlt={entry.imageAlt}
          imageFit={entry.imageFit}
          imageSource={entry.imageSource}
          primaryDetail={entry.scientificName}
          secondaryDetail={visualSigns[0]}
          size="detail"
          tertiaryDetail={visualSigns[1]}
          title={entry.name}
          visualHint="Use these visual checks with the field signs below."
        />
      </SectionCard>

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
          <Text className="text-lg font-semibold text-ink-900">Quick guide</Text>
          <Text className="text-sm leading-6 text-ink-700">
            Tap a shortcut to jump to the section below.
          </Text>
          <SectionChips onSelectSection={onSelectSection} />
        </View>
      </SectionCard>

      <View onLayout={(event) => onSectionLayout('signs', event.nativeEvent.layout.y)}>
        <SectionCard tone="muted">
          <View className="gap-3">
            <View className="flex-row items-center gap-3">
              <View className="h-10 w-10 items-center justify-center rounded-2xl bg-white">
                <Ionicons color="#2d6033" name="eye-outline" size={21} />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-semibold text-ink-900">Visual signs to check</Text>
                <Text className="mt-1 text-sm leading-6 text-ink-700">
                  Use these quick checks before comparing with the full guide below.
                </Text>
              </View>
            </View>
            <DetailChecklist items={visualSigns} />
          </View>
        </SectionCard>
      </View>

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

      <View onLayout={(event) => onSectionLayout('action', event.nativeEvent.layout.y)}>
        <SectionCard>
          <View className="gap-3">
            <Text className="text-lg font-semibold text-ink-900">What to do</Text>
            <DetailList items={entry.treatment} />
          </View>
        </SectionCard>
      </View>

      <View onLayout={(event) => onSectionLayout('prevent', event.nativeEvent.layout.y)}>
        <SectionCard>
          <View className="gap-3">
            <Text className="text-lg font-semibold text-ink-900">How to prevent it</Text>
            <DetailList items={entry.prevention} />
          </View>
        </SectionCard>
      </View>
    </View>
  );
}

export function GuideDetailViewScreen({ navigation, route }: GuideDetailViewScreenProps) {
  const { categoryKey, entryId } = route.params;
  const entry = getGuideEntryById(categoryKey, entryId);
  const scrollRef = useRef<ScrollView | null>(null);
  const detailContentTopRef = useRef(0);
  const guideAnchorOffsetsRef = useRef<GuideAnchorOffsets>({});

  const handleContentLayout = (offsetY: number) => {
    detailContentTopRef.current = offsetY;
  };

  const handleSectionLayout = (section: GuideAnchorKey, offsetY: number) => {
    guideAnchorOffsetsRef.current[section] = detailContentTopRef.current + offsetY;
  };

  const handleSelectSection = (section: GuideAnchorKey) => {
    const offsetY = guideAnchorOffsetsRef.current[section];

    if (typeof offsetY === 'number') {
      scrollRef.current?.scrollTo({ animated: true, y: Math.max(offsetY - 12, 0) });
    }
  };

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
    <ScreenContainer bottomSpacing="comfortable" scrollRef={scrollRef}>
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
        <GuideInfoDetail
          entry={entry}
          onContentLayout={handleContentLayout}
          onSectionLayout={handleSectionLayout}
          onSelectSection={handleSelectSection}
        />
      )}
    </ScreenContainer>
  );
}
