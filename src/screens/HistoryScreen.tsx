import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { Alert, Text, View } from 'react-native';

import { HeaderBlock } from '../components/ui/HeaderBlock';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { ScreenContainer } from '../components/ui/ScreenContainer';
import { SectionCard } from '../components/ui/SectionCard';
import { PlannerHistoryCard } from '../features/planner/components/PlannerHistoryCard';
import { getPlannerHistory } from '../features/planner/services/plannerStorage';
import { ScanHistoryCard } from '../features/scan/components/ScanHistoryCard';
import { clearScanHistory, getScanHistory } from '../features/scan/services/scanStorage';
import { SavedScanRecord } from '../features/scan/types';
import { fromIsoDate, formatDate } from '../features/planner/utils/date';
import { SavedPlannerRecord } from '../features/planner/types';
import { RootStackParamList } from '../navigation/RootNavigator';

type HistoryScreenProps = NativeStackScreenProps<RootStackParamList, 'History'>;

function formatConfidence(value: number) {
  return `${Math.round(value * 100)}%`;
}

export function HistoryScreen({ navigation }: HistoryScreenProps) {
  const [scanHistory, setScanHistory] = useState<SavedScanRecord[]>([]);
  const [plannerHistory, setPlannerHistory] = useState<SavedPlannerRecord[]>([]);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      getScanHistory().then((records) => {
        if (active) {
          setScanHistory(records);
        }
      });

      getPlannerHistory().then((records) => {
        if (active) {
          setPlannerHistory(records);
        }
      });

      return () => {
        active = false;
      };
    }, []),
  );

  const handleClearScanHistory = () => {
    if (scanHistory.length === 0) {
      return;
    }

    Alert.alert('Clear scan history', 'Remove all saved scan records from this device?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear all',
        style: 'destructive',
        onPress: async () => {
          await clearScanHistory();
          setScanHistory([]);
        },
      },
    ]);
  };

  return (
    <ScreenContainer bottomSpacing="comfortable">
      <HeaderBlock
        eyebrow="History Module"
        title="Review your saved records"
        description="Review saved scan and planner records stored locally on this device."
      />

      <View className="gap-4">
        <SectionCard>
          <View className="gap-3">
            <Text className="text-lg font-semibold text-ink-900">Scan History</Text>
            <Text className="text-sm leading-6 text-ink-600">
              Saved image checks, top result, confidence scores, and optional farmer notes.
            </Text>
            {scanHistory.length > 0 ? (
              <PrimaryButton
                hint="Remove all saved scan records from local history."
                label="Clear scan history"
                onPress={handleClearScanHistory}
              />
            ) : null}
          </View>
        </SectionCard>

        {scanHistory.length === 0 ? (
          <SectionCard tone="muted">
            <Text className="text-base font-semibold text-ink-900">No saved scan history yet</Text>
            <Text className="mt-2 text-sm leading-6 text-ink-600">
              Complete a scan in mock or live mode and it will be saved here automatically.
            </Text>
          </SectionCard>
        ) : (
          scanHistory.map((record) => (
            <ScanHistoryCard
              key={record.id}
              confidenceLabel={formatConfidence(record.confidence)}
              imageUri={record.imageUri}
              mode={record.mode}
              onPress={() => navigation.navigate('ScanHistoryDetail', { recordId: record.id })}
              scannedAtLabel={formatDate(fromIsoDate(record.scannedAt.slice(0, 10)))}
              title={record.nonPlantWarning ? 'Non-Plant Image' : record.topResultName}
            />
          ))
        )}

        <SectionCard>
          <Text className="text-lg font-semibold text-ink-900">Planner History</Text>
          <Text className="mt-2 text-sm leading-6 text-ink-600">
            Saved local rule-based schedules are listed here for offline review.
          </Text>
        </SectionCard>

        {plannerHistory.length === 0 ? (
          <SectionCard tone="muted">
            <Text className="text-base font-semibold text-ink-900">No saved planner history yet</Text>
            <Text className="mt-2 text-sm leading-6 text-ink-600">
              Generate a planner schedule and it will be saved locally here automatically.
            </Text>
          </SectionCard>
        ) : (
          plannerHistory.map((record) => (
            <PlannerHistoryCard
              key={record.id}
              activityCount={record.activityCount}
              plantingDateLabel={formatDate(fromIsoDate(record.plantingDate))}
              savedAtLabel={formatDate(fromIsoDate(record.createdAt.slice(0, 10)))}
              title={record.title}
            />
          ))
        )}
      </View>
    </ScreenContainer>
  );
}
