import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View, type DimensionValue } from 'react-native';

import { SectionCard } from '../../../components/ui/SectionCard';
import { formatDate, fromIsoDate } from '../../planner/utils/date';
import { ScanMode, ScanPrediction, ScanResult } from '../types';
import { toDiagnosisTitleCase } from '../utils/formatScanText';

function formatConfidence(value: number) {
  return `${Math.round(value * 100)}%`;
}

function getResultSummary(result: ScanResult) {
  if (result.category === 'healthy') {
    return {
      title: 'Plant appears healthy',
      subtitle: 'No major disease detected',
    };
  }

  return {
    title: toDiagnosisTitleCase(result.topResultName),
    subtitle: `Type: ${toDiagnosisTitleCase(result.category)}`,
  };
}

function formatPredictionLabel(prediction: ScanPrediction) {
  if (prediction.category === 'healthy') {
    return 'healthy';
  }

  return prediction.category;
}

function formatScanPhotoSummary(scanPhotos: NonNullable<ScanResult['scanPhotos']>) {
  const focusList = scanPhotos.map((photo, index) => `${index + 1}. ${photo.focus}`).join(', ');
  return `${scanPhotos.length} ${scanPhotos.length === 1 ? 'photo' : 'photos'}: ${focusList}`;
}

function shouldShowConfidenceHelper(result: ScanResult) {
  return (result.predictions[0]?.confidence ?? 0) < 0.75;
}

function getConfidenceMeta(value: number, mode: ScanMode) {
  if (mode === 'mock') {
    return {
      label: 'Demo confidence',
      helper: 'Mock mode is for UI testing only. Real users should use live scan mode.',
      badgeClassName: 'bg-earth-50',
      textClassName: 'text-earth-500',
      fillColor: '#c48a2c',
      icon: 'flask-outline' as keyof typeof Ionicons.glyphMap,
    };
  }

  if (value >= 0.8) {
    return {
      label: 'High confidence',
      helper: 'The top match is strong. Still compare visible field signs before acting.',
      badgeClassName: 'bg-brand-100',
      textClassName: 'text-brand-700',
      fillColor: '#2d6033',
      icon: 'checkmark-circle-outline' as keyof typeof Ionicons.glyphMap,
    };
  }

  if (value >= 0.55) {
    return {
      label: 'Needs review',
      helper: 'The result is useful, but the field signs should be checked closely.',
      badgeClassName: 'bg-earth-50',
      textClassName: 'text-earth-500',
      fillColor: '#c48a2c',
      icon: 'alert-circle-outline' as keyof typeof Ionicons.glyphMap,
    };
  }

  return {
    label: 'Low confidence',
    helper: 'Retake a clearer photo or compare manually with the Guide.',
    badgeClassName: 'bg-earth-50',
    textClassName: 'text-earth-500',
    fillColor: '#9b5d2f',
    icon: 'refresh-circle-outline' as keyof typeof Ionicons.glyphMap,
  };
}

function getCategoryIcon(category: ScanPrediction['category']) {
  if (category === 'pest') {
    return 'bug-outline' as keyof typeof Ionicons.glyphMap;
  }

  if (category === 'healthy') {
    return 'leaf-outline' as keyof typeof Ionicons.glyphMap;
  }

  return 'medical-outline' as keyof typeof Ionicons.glyphMap;
}

function PredictionRow({
  prediction,
  index,
  onPress,
}: {
  prediction: ScanPrediction;
  index: number;
  onPress?: () => void;
}) {
  const progressWidth: DimensionValue = `${Math.round(prediction.confidence * 100)}%`;
  const Container = onPress ? Pressable : View;

  return (
    <Container
      accessibilityRole={onPress ? 'button' : undefined}
      className="gap-3 rounded-[18px] bg-brand-50/70 px-4 py-3 active:bg-brand-100"
      onPress={onPress}
    >
      <View className="flex-row items-center justify-between gap-3">
        <View className="flex-1 flex-row items-center gap-3">
          <View className="h-9 w-9 items-center justify-center rounded-full bg-white">
            <Ionicons color="#2d6033" name={getCategoryIcon(prediction.category)} size={17} />
          </View>
          <View className="flex-1">
            <Text className="text-sm font-semibold text-ink-900">
              {index + 1}. {toDiagnosisTitleCase(prediction.name)}
            </Text>
            <Text className="mt-1 text-xs uppercase tracking-[1.2px] text-ink-600">
              {toDiagnosisTitleCase(formatPredictionLabel(prediction))}
            </Text>
          </View>
        </View>
        <Text className="text-sm font-semibold text-brand-700">
          {formatConfidence(prediction.confidence)}
        </Text>
      </View>
      <View className="h-2 overflow-hidden rounded-full bg-white">
        <View
          className="h-full rounded-full"
          style={{ backgroundColor: '#2d6033', width: progressWidth }}
        />
      </View>
    </Container>
  );
}

export function ScanResultCard({
  onOpenDetail,
  result,
  mode = 'live',
}: {
  onOpenDetail?: (predictionIndex: number) => void;
  result: ScanResult;
  mode?: ScanMode;
}) {
  const summary = getResultSummary(result);
  const topConfidence = result.predictions[0]?.confidence ?? 0;
  const confidenceMeta = getConfidenceMeta(topConfidence, mode);
  const topProgressWidth: DimensionValue = `${Math.round(topConfidence * 100)}%`;
  const isMock = mode === 'mock';

  return (
    <SectionCard>
      <View className="gap-4">
        <View className="flex-row items-center justify-between gap-3">
          <View className="flex-1">
            <Text className="text-lg font-semibold text-ink-900">
              {isMock ? 'Demo scan result' : 'Scan result'}
            </Text>
            <Text className="mt-1 text-sm leading-5 text-ink-700">
              {isMock
                ? 'This shows the result layout only. It is not a real crop diagnosis.'
                : 'Review the best match and compare the field signs.'}
            </Text>
          </View>
          <View className="h-12 w-12 items-center justify-center rounded-full bg-brand-50">
            <Ionicons color="#2d6033" name={isMock ? 'flask-outline' : 'sparkles-outline'} size={22} />
          </View>
        </View>

        {isMock ? (
          <View className="rounded-[18px] bg-earth-50 px-4 py-3">
            <Text className="text-sm font-semibold text-ink-900">Mock mode only</Text>
            <Text className="mt-1 text-sm leading-6 text-ink-700">
              This demo output is fixed for development. Switch the scan mode to live before real users test diagnosis.
            </Text>
          </View>
        ) : null}

        {result.nonPlantWarning ? (
          <View className="rounded-[18px] bg-earth-50 px-4 py-3">
            <Text className="text-sm font-semibold text-ink-900">Non-plant image detected</Text>
            <Text className="mt-1 text-sm leading-6 text-ink-700">{result.nonPlantWarning}</Text>
          </View>
        ) : null}

        {!result.nonPlantWarning ? (
          <Pressable
            accessibilityRole={onOpenDetail ? 'button' : undefined}
            className="gap-4 rounded-[22px] bg-brand-50/70 px-4 py-4 active:bg-brand-100"
            onPress={onOpenDetail ? () => onOpenDetail(0) : undefined}
          >
            <View className="flex-row items-start justify-between gap-3">
              <View className="flex-1">
                <Text className="text-xs font-semibold uppercase tracking-[1.2px] text-ink-600">
                  Best match
                </Text>
                <Text className="mt-1 text-xl font-semibold text-ink-900">{summary.title}</Text>
                <Text className="mt-1 text-sm text-ink-700">{summary.subtitle}</Text>
              </View>
              <View className={`rounded-full px-3 py-1.5 ${confidenceMeta.badgeClassName}`}>
                <Text className={`text-xs font-semibold ${confidenceMeta.textClassName}`}>
                  {formatConfidence(topConfidence)}
                </Text>
              </View>
            </View>

            <View className="gap-2">
              <View className="h-3 overflow-hidden rounded-full bg-white">
                <View
                  className="h-full rounded-full"
                  style={{ backgroundColor: confidenceMeta.fillColor, width: topProgressWidth }}
                />
              </View>
              <View className="flex-row items-center gap-2">
                <Ionicons color={confidenceMeta.fillColor} name={confidenceMeta.icon} size={17} />
                <Text className={`text-sm font-semibold ${confidenceMeta.textClassName}`}>
                  {confidenceMeta.label}
                </Text>
              </View>
              <Text className="text-sm leading-5 text-ink-700">{confidenceMeta.helper}</Text>
            </View>

            <View className="gap-1.5">
              {result.category !== 'healthy' && result.cropLabel ? (
                <Text className="text-sm text-ink-700">
                  Crop: {toDiagnosisTitleCase(result.cropLabel)}
                  {result.cropScientificName ? ` (${result.cropScientificName})` : ''}
                </Text>
              ) : null}
              <Text className="text-sm text-ink-700">
                Scanned: {formatDate(fromIsoDate(result.scannedAt.slice(0, 10)))}
              </Text>
              {result.scanPhotos?.length ? (
                <Text className="text-sm text-ink-700">
                  Photo focus: {formatScanPhotoSummary(result.scanPhotos)}
                </Text>
              ) : null}
              {result.notes ? (
                <Text className="text-sm text-ink-700">Notes: {result.notes}</Text>
              ) : null}
              {onOpenDetail ? (
                <Text className="text-sm font-semibold text-brand-700">
                  Tap to compare symptoms and actions
                </Text>
              ) : null}
            </View>
          </Pressable>
        ) : null}

        {!result.nonPlantWarning && result.riceMismatchWarning ? (
          <View className="rounded-[18px] bg-earth-50 px-4 py-3">
            <Text className="text-sm font-semibold text-ink-900">Rice check warning</Text>
            <Text className="mt-1 text-sm leading-6 text-ink-700">{result.riceMismatchWarning}</Text>
          </View>
        ) : null}

        {!result.nonPlantWarning && shouldShowConfidenceHelper(result) ? (
          <View className="rounded-[18px] bg-brand-50/70 px-4 py-3">
            <Text className="text-sm leading-6 text-ink-700">
              Use this as a guide only. Check the field symptoms or ask your local agriculture office if needed.
            </Text>
          </View>
        ) : null}

        {!result.nonPlantWarning && result.predictions.length > 0 ? (
          <View className="gap-3">
            <Text className="text-sm font-semibold text-ink-900">Top 3 matches</Text>
            {result.predictions.map((prediction, index) => (
              <PredictionRow
                index={index}
                key={`${prediction.name}-${index}`}
                onPress={onOpenDetail ? () => onOpenDetail(index) : undefined}
                prediction={prediction}
              />
            ))}
          </View>
        ) : null}
      </View>
    </SectionCard>
  );
}
