import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Image, Pressable, Text, View, type ImageSourcePropType } from 'react-native';

import { HeaderBlock } from '../../../components/ui/HeaderBlock';
import { ScreenContainer } from '../../../components/ui/ScreenContainer';
import { SectionCard } from '../../../components/ui/SectionCard';
import { GuideStackHeader } from '../../guide/components/GuideStackHeader';
import { formatDate, fromIsoDate } from '../../planner/utils/date';
import {
  ScanDiagnosisDetails,
  ScanMode,
  ScanPhotoEvidence,
  ScanPrediction,
  ScanResult,
} from '../types';
import { toDiagnosisTitleCase } from '../utils/formatScanText';
import { findGuideEntryForPrediction } from '../utils/scanGuideMatch';
import { useAppLanguage, type Translator } from '../../../localization/appLanguage';

type ScanResultDetailScreenProps = {
  navigation: {
    goBack: () => void;
  };
  route: {
    params: {
      result: ScanResult;
      mode: ScanMode;
      initialPredictionIndex?: number;
    };
  };
};

function formatConfidence(value: number) {
  return `${Math.round(value * 100)}%`;
}

function getConfidenceStatus(value: number) {
  if (value >= 0.8) {
    return 'Strong';
  }

  if (value >= 0.55) {
    return 'Check';
  }

  return 'Unclear';
}

function shortenText(value: string | undefined, maxLength = 180) {
  if (!value || value.length <= maxLength) {
    return value;
  }

  const sentenceEnd = value.slice(0, maxLength).lastIndexOf('.');

  if (sentenceEnd > 80) {
    return value.slice(0, sentenceEnd + 1);
  }

  return `${value.slice(0, maxLength).trim()}...`;
}

function DetailList({ items, t }: { items: string[]; t: Translator }) {
  if (items.length === 0) {
    return (
      <Text className="text-sm leading-6 text-ink-700">{t('No detail text is available for this match yet.')}</Text>
    );
  }

  return (
    <View className="gap-2">
      {items.map((item) => (
        <View className="flex-row gap-3" key={item}>
          <View className="mt-2 h-1.5 w-1.5 rounded-full bg-brand-600" />
          <Text className="flex-1 text-sm leading-6 text-ink-700">{item}</Text>
        </View>
      ))}
    </View>
  );
}

function DetailPill({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View className="min-h-16 flex-1 justify-center rounded-[16px] bg-brand-50 px-3 py-3">
      <Text className="text-[11px] font-semibold uppercase tracking-[1px] text-brand-700">
        {label}
      </Text>
      <Text className="mt-1 text-sm font-semibold text-ink-900">{value}</Text>
    </View>
  );
}

function NextStepCard({ confidence, t }: { confidence: number; t: Translator }) {
  const nextSteps =
    confidence >= 0.8
      ? [
          t('Compare the photo with the field signs below.'),
          t('Check nearby plants to see if the same signs are spreading.'),
          t('Ask a local agri technician before using chemical control.'),
        ]
      : [
          t('Retake a clearer close photo if the field signs do not match.'),
          t('Compare manually with the Guide before deciding what to do.'),
          t('Ask a local agri technician when the problem is spreading fast.'),
        ];

  return (
    <SectionCard tone="muted">
      <View className="gap-3">
        <View className="flex-row items-center gap-3">
          <View className="h-10 w-10 items-center justify-center rounded-2xl bg-white">
            <Ionicons color="#2d6033" name="footsteps-outline" size={21} />
          </View>
          <View className="flex-1">
            <Text className="text-lg font-semibold text-ink-900">{t('Next steps')}</Text>
            <Text className="mt-1 text-sm leading-5 text-ink-700">
              {t('Use the scan as a guide, then check the field.')}
            </Text>
          </View>
        </View>
        <DetailList items={nextSteps} t={t} />
      </View>
    </SectionCard>
  );
}

function ScanPhotoStrip({ photos, t }: { photos: ScanPhotoEvidence[]; t: Translator }) {
  if (photos.length === 0) {
    return null;
  }

  return (
    <SectionCard>
      <View className="gap-3">
        <Text className="text-lg font-semibold text-ink-900">{t('Photos used for scan')}</Text>
        <View className="flex-row flex-wrap gap-2">
          {photos.map((photo, index) => (
            <View className="w-[96px] rounded-[16px] border border-brand-100 bg-brand-50 p-1.5" key={`${photo.imageUri}-${index}`}>
              <Image
                className="h-16 w-full rounded-[12px] bg-brand-100"
                resizeMode="cover"
                source={{ uri: photo.imageUri }}
              />
              <Text className="mt-1 text-[11px] font-semibold text-brand-800" numberOfLines={1}>
                {index + 1}. {photo.focus}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </SectionCard>
  );
}

function PredictionPicker({
  predictions,
  selectedIndex,
  onSelect,
  t,
}: {
  predictions: ScanPrediction[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  t: Translator;
}) {
  if (predictions.length <= 1) {
    return null;
  }

  return (
    <SectionCard>
      <View className="gap-3">
        <Text className="text-lg font-semibold text-ink-900">{t('Other possible matches')}</Text>
        <Text className="text-sm leading-6 text-ink-700">
          {t('Tap another match if the field signs look closer to it.')}
        </Text>
        <View className="gap-2">
          {predictions.map((prediction, index) => {
            const selected = index === selectedIndex;

            return (
              <Pressable
                accessibilityRole="button"
                className={`min-h-14 flex-row items-center justify-between gap-3 rounded-[16px] border px-3 py-3 ${
                  selected ? 'border-brand-600 bg-brand-50' : 'border-brand-100 bg-white'
                }`}
                key={`${prediction.name}-${index}`}
                onPress={() => onSelect(index)}
              >
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-ink-900">
                    {index + 1}. {toDiagnosisTitleCase(prediction.name)}
                  </Text>
                  <Text className="mt-1 text-xs uppercase tracking-[1px] text-ink-600">
                    {toDiagnosisTitleCase(prediction.category)}
                  </Text>
                </View>
                <Text className="text-sm font-semibold text-brand-700">
                  {formatConfidence(prediction.confidence)}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </SectionCard>
  );
}

function ReferenceImage({
  details,
  guideImageSource,
  title,
}: {
  details?: ScanDiagnosisDetails;
  guideImageSource?: ImageSourcePropType;
  title: string;
}) {
  if (details?.imageUrl) {
    return (
      <Image
        accessibilityIgnoresInvertColors
        accessibilityLabel={`${title} reference image`}
        className="h-48 w-full rounded-[22px] bg-brand-100"
        resizeMode="cover"
        source={{ uri: details.imageUrl }}
      />
    );
  }

  if (guideImageSource) {
    return (
      <Image
        accessibilityIgnoresInvertColors
        accessibilityLabel={`${title} guide image`}
        className="h-48 w-full rounded-[22px] bg-brand-100"
        resizeMode="cover"
        source={guideImageSource}
      />
    );
  }

  return null;
}

export function ScanResultDetailScreen({ navigation, route }: ScanResultDetailScreenProps) {
  const { t } = useAppLanguage();
  const { result } = route.params;
  const [selectedIndex, setSelectedIndex] = useState(route.params.initialPredictionIndex ?? 0);
  const prediction = result.predictions[selectedIndex] ?? result.predictions[0];
  const guideEntry = useMemo(
    () => (prediction ? findGuideEntryForPrediction(prediction) : undefined),
    [prediction],
  );
  const details = prediction?.details;
  const symptoms = details?.symptoms ?? guideEntry?.symptoms ?? [];
  const treatment = details?.treatment ?? guideEntry?.treatment ?? [];
  const identification = guideEntry?.identification ?? [];
  const prevention = guideEntry?.prevention ?? [];
  const description = details?.description ?? guideEntry?.shortDescription;
  const severity = details?.severity ?? 'Review';
  const typeLabel = details?.type ?? prediction?.category ?? result.category;
  const headerDescription =
    shortenText(description) ??
    'Review the uploaded photos, compare visible signs, and use the result as a field guide.';
  const scientificName =
    details?.scientificName ?? prediction?.scientificName ?? guideEntry?.scientificName;

  if (!prediction) {
    return (
      <ScreenContainer bottomSpacing="comfortable">
        <GuideStackHeader onBack={() => navigation.goBack()} title={t('Scan result')} />
        <HeaderBlock
          eyebrow={t('Scan Detail')}
          title={t('No match details')}
          description={t('This scan result did not include a usable diagnosis match.')}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer bottomSpacing="comfortable">
      <GuideStackHeader
        backLabel={t('Back to scan')}
        onBack={() => navigation.goBack()}
        title={toDiagnosisTitleCase(prediction.name)}
      />
      <HeaderBlock
        eyebrow={t('Possible Scan Issue')}
        title={toDiagnosisTitleCase(prediction.name)}
        description={headerDescription}
      />

      <View className="gap-4">
        <SectionCard>
          <View className="gap-4">
            <ReferenceImage
              details={details}
              guideImageSource={guideEntry?.imageSource}
              title={prediction.name}
            />

            <View className="flex-row gap-2">
              <DetailPill label={t('Confidence')} value={formatConfidence(prediction.confidence)} />
              <DetailPill label={t('Issue type')} value={toDiagnosisTitleCase(typeLabel)} />
              <DetailPill label={t('Review')} value={getConfidenceStatus(prediction.confidence)} />
            </View>

            <View className="gap-1">
              <Text className="text-sm text-ink-700">
                {t('Scanned')}: {formatDate(fromIsoDate(result.scannedAt.slice(0, 10)))}
              </Text>
              {scientificName ? (
                <Text className="text-sm text-ink-700">
                  {t('Scientific Name')}: {scientificName}
                </Text>
              ) : null}
            </View>
          </View>
        </SectionCard>

        <NextStepCard confidence={prediction.confidence} t={t} />

        <ScanPhotoStrip photos={result.scanPhotos ?? []} t={t} />

        {description ? (
          <SectionCard>
            <View className="gap-3">
              <Text className="text-lg font-semibold text-ink-900">
                {t('About this possible issue')}
              </Text>
              <Text className="text-sm leading-6 text-ink-700">{description}</Text>
            </View>
          </SectionCard>
        ) : null}

        <SectionCard tone="muted">
          <View className="gap-3">
            <View className="flex-row items-center gap-3">
              <View className="h-10 w-10 items-center justify-center rounded-2xl bg-white">
                <Ionicons color="#2d6033" name="eye-outline" size={21} />
              </View>
              <Text className="flex-1 text-lg font-semibold text-ink-900">{t('What you may see')}</Text>
            </View>
            <DetailList items={identification.length > 0 ? identification : symptoms} t={t} />
          </View>
        </SectionCard>

        <SectionCard>
          <View className="gap-3">
            <Text className="text-lg font-semibold text-ink-900">{t('Damage or signs')}</Text>
            <DetailList items={symptoms} t={t} />
          </View>
        </SectionCard>

        <SectionCard>
          <View className="gap-3">
            <Text className="text-lg font-semibold text-ink-900">{t('What to do next')}</Text>
            <DetailList items={treatment} t={t} />
          </View>
        </SectionCard>

        {prevention.length > 0 ? (
          <SectionCard>
            <View className="gap-3">
              <Text className="text-lg font-semibold text-ink-900">{t('How to avoid it')}</Text>
              <DetailList items={prevention} t={t} />
            </View>
          </SectionCard>
        ) : null}

        {details?.severity ||
        details?.spreading ||
        details?.taxonomy?.length ||
        details?.eppoCode ||
        details?.gbifId ? (
          <SectionCard tone="muted">
            <View className="gap-2">
              <Text className="text-lg font-semibold text-ink-900">{t('Reference details')}</Text>
              {details.severity ? (
                <Text className="text-sm leading-6 text-ink-700">
                  <Text className="font-semibold text-ink-900">{t('Severity')}: </Text>
                  {details.severity}
                </Text>
              ) : null}
              {details.spreading ? (
                <Text className="text-sm leading-6 text-ink-700">
                  <Text className="font-semibold text-ink-900">{t('Spreading')}: </Text>
                  {details.spreading}
                </Text>
              ) : null}
              {details.taxonomy?.length ? (
                <Text className="text-sm leading-6 text-ink-700">
                  <Text className="font-semibold text-ink-900">{t('Taxonomy')}: </Text>
                  {details.taxonomy.join(' > ')}
                </Text>
              ) : null}
              {details.eppoCode ? (
                <Text className="text-sm leading-6 text-ink-700">
                  <Text className="font-semibold text-ink-900">{t('EPPO')}: </Text>
                  {details.eppoCode}
                </Text>
              ) : null}
              {details.gbifId ? (
                <Text className="text-sm leading-6 text-ink-700">
                  <Text className="font-semibold text-ink-900">{t('GBIF')}: </Text>
                  {details.gbifId}
                </Text>
              ) : null}
            </View>
          </SectionCard>
        ) : null}

        <PredictionPicker
          onSelect={setSelectedIndex}
          predictions={result.predictions}
          selectedIndex={selectedIndex}
          t={t}
        />
      </View>
    </ScreenContainer>
  );
}
