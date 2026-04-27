import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { HeaderBlock } from '../../../components/ui/HeaderBlock';
import { ScreenContainer } from '../../../components/ui/ScreenContainer';
import { SectionCard } from '../../../components/ui/SectionCard';
import { GuideEntryVisual } from '../components/GuideEntryVisual';
import { GuideImageViewer } from '../components/GuideImageViewer';
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

function VarietyMetricTile({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View className="min-w-[130px] flex-1 rounded-[18px] bg-brand-50 px-4 py-4">
      <View className="mb-3 h-9 w-9 items-center justify-center rounded-full bg-white">
        <Ionicons color="#2d6033" name={icon} size={18} />
      </View>
      <Text className="text-xs font-semibold uppercase tracking-[1.2px] text-brand-700">
        {label}
      </Text>
      <Text className="mt-1 text-sm font-semibold leading-5 text-ink-900">{value}</Text>
    </View>
  );
}

function SectionChips({
  onSelectSection,
}: {
  onSelectSection: (section: GuideAnchorKey) => void;
}) {
  const chips = [
    { key: 'signs', label: 'What to see', icon: 'eye-outline' },
    { key: 'action', label: 'What to do', icon: 'construct-outline' },
    { key: 'prevent', label: 'Avoid it', icon: 'shield-checkmark-outline' },
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

function VarietyDetail({ entry, onOpenImage }: { entry: RiceVariety; onOpenImage: () => void }) {
  const plantingChecks = [
    'Confirm that certified or reliable seed is available in your area.',
    'Match the days to harvest with your water supply, season, and target harvest date.',
    'Ask your local agri technician if this variety fits common pest, disease, and weather risks in your area.',
  ];

  return (
    <View className="gap-4">
      <SectionCard>
        <View className="gap-3">
          <GuideEntryVisual
            badgeLabel="Palay variety"
            compactPlaceholder
            category={entry.category}
            imageAlt={entry.imageAlt}
            imageFit={entry.imageFit}
            imageSource={entry.imageSource}
            primaryDetail={entry.maturityDays}
            secondaryDetail={entry.grainType}
            size="detail"
            onOpenImage={onOpenImage}
            showZoomHint
            tertiaryDetail={entry.yieldPotential}
            title={entry.name}
            visualHint={entry.recommendedEnvironment}
          />
          <Text className="text-xs leading-5 text-ink-700">
            Reference palay photo only. Use the facts below for this variety.
          </Text>
        </View>
      </SectionCard>

      <SectionCard>
        <View className="gap-3">
          <Text className="text-lg font-semibold text-ink-900">Quick facts</Text>
          <Text className="text-sm leading-6 text-ink-700">
            Compare these before choosing seed for your field.
          </Text>
          <View className="flex-row flex-wrap gap-3">
            <VarietyMetricTile
              icon="time-outline"
              label="Days to harvest"
              value={entry.maturityDays}
            />
            <VarietyMetricTile
              icon="stats-chart-outline"
              label="Possible yield"
              value={entry.yieldPotential}
            />
            <VarietyMetricTile icon="ellipse-outline" label="Grain" value={entry.grainType} />
            <VarietyMetricTile
              icon="map-outline"
              label="Best field"
              value={entry.recommendedEnvironment}
            />
          </View>
        </View>
      </SectionCard>

      <SectionCard tone="muted">
        <View className="gap-3">
          <View className="flex-row items-center gap-3">
            <View className="h-10 w-10 items-center justify-center rounded-2xl bg-white">
              <Ionicons color="#2d6033" name="reader-outline" size={20} />
            </View>
            <View className="flex-1">
              <Text className="text-lg font-semibold text-ink-900">What this means</Text>
              <Text className="mt-1 text-sm leading-5 text-ink-700">
                Plain guide note for this variety.
              </Text>
            </View>
          </View>
          <Text className="text-sm leading-6 text-ink-700">{entry.shortDescription}</Text>
        </View>
      </SectionCard>

      <SectionCard>
        <View className="gap-3">
          <Text className="text-lg font-semibold text-ink-900">Why farmers check it</Text>
          <DetailList items={entry.notableCharacteristics} />
        </View>
      </SectionCard>

      <SectionCard>
        <View className="gap-3">
          <Text className="text-lg font-semibold text-ink-900">Check before planting</Text>
          <DetailChecklist items={plantingChecks} />
        </View>
      </SectionCard>
    </View>
  );
}

function GuideInfoDetail({
  entry,
  onContentLayout,
  onOpenImage,
  onSectionLayout,
  onSelectSection,
}: {
  entry: GuideInfoEntry;
  onContentLayout: (offsetY: number) => void;
  onOpenImage: () => void;
  onSectionLayout: (section: GuideAnchorKey, offsetY: number) => void;
  onSelectSection: (section: GuideAnchorKey) => void;
}) {
  const visualSigns = [...entry.identification.slice(0, 2), ...entry.symptoms.slice(0, 2)];

  return (
    <View className="gap-4" onLayout={(event) => onContentLayout(event.nativeEvent.layout.y)}>
      <SectionCard>
        <GuideEntryVisual
          badgeLabel={entry.category === 'pest' ? 'Pest photo' : 'Disease photo'}
          compactPlaceholder
          category={entry.category}
          imageAlt={entry.imageAlt}
          imageFit={entry.imageFit}
          imageSource={entry.imageSource}
          onOpenImage={onOpenImage}
          primaryDetail={entry.scientificName}
          secondaryDetail={visualSigns[0]}
          showZoomHint
          size="detail"
          tertiaryDetail={visualSigns[1]}
          title={entry.name}
          visualHint="Tap the image to zoom, then compare with the field signs below."
        />
        <Text className="mt-3 text-xs leading-5 text-ink-700">
          Use the photo as a visual guide only. Check the actual plant signs in your field.
        </Text>
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
          <Text className="text-lg font-semibold text-ink-900">Jump to what you need</Text>
          <Text className="text-sm leading-6 text-ink-700">
            Go straight to signs, field action, or prevention.
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
                <Text className="text-lg font-semibold text-ink-900">What you may see</Text>
                <Text className="mt-1 text-sm leading-6 text-ink-700">
                  Compare these first with the leaves, stem, panicle, or field patch.
                </Text>
              </View>
            </View>
            <DetailChecklist items={visualSigns} />
          </View>
        </SectionCard>
      </View>

      <SectionCard>
        <View className="gap-3">
          <Text className="text-lg font-semibold text-ink-900">Where to look</Text>
          <DetailList items={entry.identification} />
        </View>
      </SectionCard>

      <SectionCard>
        <View className="gap-3">
          <Text className="text-lg font-semibold text-ink-900">Damage or signs</Text>
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
            <Text className="text-lg font-semibold text-ink-900">How to avoid it</Text>
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
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);

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
          entry.category === 'variety' ? 'Palay Variety' : entry.category === 'pest' ? 'Pest' : 'Disease'
        }
        title={entry.name}
        description={entry.shortDescription}
      />

      {entry.category === 'variety' ? (
        <VarietyDetail entry={entry} onOpenImage={() => setIsImageViewerOpen(true)} />
      ) : (
        <GuideInfoDetail
          entry={entry}
          onContentLayout={handleContentLayout}
          onOpenImage={() => setIsImageViewerOpen(true)}
          onSectionLayout={handleSectionLayout}
          onSelectSection={handleSelectSection}
        />
      )}

      <GuideImageViewer
        caption={
          entry.category === 'variety'
            ? 'Reference palay photo only. Use the guide facts for this variety.'
            : 'Compare with actual field signs before making farm decisions.'
        }
        imageAlt={entry.imageAlt}
        imageSource={entry.imageSource}
        onClose={() => setIsImageViewerOpen(false)}
        title={entry.name}
        visible={isImageViewerOpen}
      />
    </ScreenContainer>
  );
}
