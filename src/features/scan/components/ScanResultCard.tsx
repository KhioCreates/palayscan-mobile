import { Text, View } from 'react-native';

import { SectionCard } from '../../../components/ui/SectionCard';
import { formatDate, fromIsoDate } from '../../planner/utils/date';
import { ScanPrediction, ScanResult } from '../types';

function formatConfidence(value: number) {
  return `${Math.round(value * 100)}%`;
}

function toTitleCase(value: string) {
  return value.replace(/\w\S*/g, (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
}

function getResultSummary(result: ScanResult) {
  if (result.category === 'healthy') {
    return {
      title: 'Plant appears healthy',
      subtitle: 'No major disease detected',
    };
  }

  return {
    title: toTitleCase(result.topResultName),
    subtitle: `Category: ${toTitleCase(result.category)}`,
  };
}

function formatPredictionLabel(prediction: ScanPrediction) {
  if (prediction.category === 'healthy') {
    return 'healthy';
  }

  return prediction.category;
}

function shouldShowConfidenceHelper(result: ScanResult) {
  return (result.predictions[0]?.confidence ?? 0) < 0.75;
}

function PredictionRow({
  prediction,
  index,
}: {
  prediction: ScanPrediction;
  index: number;
}) {
  return (
    <View className="flex-row items-center justify-between gap-3 rounded-[18px] bg-brand-50/70 px-4 py-3">
      <View className="flex-1">
        <Text className="text-sm font-semibold text-ink-900">
          {index + 1}. {toTitleCase(prediction.name)}
        </Text>
        <Text className="mt-1 text-xs uppercase tracking-[1.2px] text-ink-500">
          {toTitleCase(formatPredictionLabel(prediction))}
        </Text>
      </View>
      <Text className="text-sm font-semibold text-brand-700">
        {formatConfidence(prediction.confidence)}
      </Text>
    </View>
  );
}

export function ScanResultCard({ result }: { result: ScanResult }) {
  const summary = getResultSummary(result);

  return (
    <SectionCard>
      <View className="gap-4">
        <Text className="text-lg font-semibold text-ink-900">Scan result</Text>

        {result.nonPlantWarning ? (
          <View className="rounded-[18px] bg-earth-50 px-4 py-3">
            <Text className="text-sm font-semibold text-ink-900">Non-plant image detected</Text>
            <Text className="mt-1 text-sm leading-6 text-ink-600">{result.nonPlantWarning}</Text>
          </View>
        ) : null}

        {!result.nonPlantWarning ? (
          <View className="rounded-[18px] bg-brand-50/70 px-4 py-3">
            <Text className="text-xs uppercase tracking-[1.2px] text-ink-500">Top result</Text>
            <Text className="mt-1 text-lg font-semibold text-ink-900">{summary.title}</Text>
            <Text className="mt-1 text-sm text-ink-600">{summary.subtitle}</Text>
            <Text className="mt-1 text-sm text-ink-600">
              Confidence: {formatConfidence(result.predictions[0]?.confidence ?? 0)}
            </Text>
            {result.category !== 'healthy' && result.cropLabel ? (
              <Text className="mt-1 text-sm text-ink-600">
                Crop: {toTitleCase(result.cropLabel)}
                {result.cropScientificName ? ` (${result.cropScientificName})` : ''}
              </Text>
            ) : null}
            <Text className="mt-1 text-sm text-ink-600">
              Scanned: {formatDate(fromIsoDate(result.scannedAt.slice(0, 10)))}
            </Text>
            {result.notes ? (
              <Text className="mt-1 text-sm text-ink-600">Notes: {result.notes}</Text>
            ) : null}
          </View>
        ) : null}

        {!result.nonPlantWarning && result.riceMismatchWarning ? (
          <View className="rounded-[18px] bg-earth-50 px-4 py-3">
            <Text className="text-sm font-semibold text-ink-900">Rice-only caution</Text>
            <Text className="mt-1 text-sm leading-6 text-ink-600">{result.riceMismatchWarning}</Text>
          </View>
        ) : null}

        {!result.nonPlantWarning && shouldShowConfidenceHelper(result) ? (
          <View className="rounded-[18px] bg-brand-50/70 px-4 py-3">
            <Text className="text-sm leading-6 text-ink-600">
              Use this as a guide only. Verify with field symptoms or local agricultural references.
            </Text>
          </View>
        ) : null}

        {!result.nonPlantWarning && result.predictions.length > 0 ? (
          <View className="gap-3">
            <Text className="text-sm font-semibold text-ink-900">Top 3 matches</Text>
            {result.predictions.map((prediction, index) => (
              <PredictionRow index={index} key={`${prediction.name}-${index}`} prediction={prediction} />
            ))}
          </View>
        ) : null}
      </View>
    </SectionCard>
  );
}
