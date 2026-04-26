import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';

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
type HistoryTab = 'scans' | 'calendars';

function formatConfidence(value: number) {
  return `${Math.round(value * 100)}%`;
}

function HistoryTabButton({
  active,
  label,
  onPress,
}: {
  active: boolean;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      className={`flex-1 rounded-[18px] px-3 py-3 ${active ? 'bg-brand-600' : 'bg-transparent'}`}
      onPress={onPress}
    >
      <Text
        className={`text-center text-sm font-semibold ${active ? 'text-white' : 'text-brand-700'}`}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export function HistoryScreen({ navigation }: HistoryScreenProps) {
  const [scanHistory, setScanHistory] = useState<SavedScanRecord[]>([]);
  const [plannerHistory, setPlannerHistory] = useState<SavedPlannerRecord[]>([]);
  const [activeTab, setActiveTab] = useState<HistoryTab>('scans');

  useFocusEffect(
    useCallback(() => {
      let active = true;

      Promise.all([getScanHistory(), getPlannerHistory()]).then(([scanRecords, plannerRecords]) => {
        if (!active) {
          return;
        }

        setScanHistory(scanRecords);
        setPlannerHistory(plannerRecords);
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
        <View
          accessibilityRole="tablist"
          className="flex-row rounded-[22px] border border-brand-100 bg-brand-50 p-1"
        >
          <HistoryTabButton
            active={activeTab === 'scans'}
            label={`Scans (${scanHistory.length})`}
            onPress={() => setActiveTab('scans')}
          />
          <HistoryTabButton
            active={activeTab === 'calendars'}
            label={`Calendars (${plannerHistory.length})`}
            onPress={() => setActiveTab('calendars')}
          />
        </View>

        {activeTab === 'scans' ? (
          <>
            <SectionCard>
              <View className="gap-3">
                <Text className="text-lg font-semibold text-ink-900">Scan History</Text>
                <Text className="text-sm leading-6 text-ink-700">
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
                <Text className="text-base font-semibold text-ink-900">
                  No saved scan history yet
                </Text>
                <Text className="mt-2 text-sm leading-6 text-ink-700">
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
          </>
        ) : (
          <>
            <SectionCard>
              <Text className="text-lg font-semibold text-ink-900">Planner History</Text>
              <Text className="mt-2 text-sm leading-6 text-ink-700">
                Saved local crop calendars are listed here for offline review.
              </Text>
            </SectionCard>

            {plannerHistory.length === 0 ? (
              <SectionCard tone="muted">
                <Text className="text-base font-semibold text-ink-900">
                  No saved planner history yet
                </Text>
                <Text className="mt-2 text-sm leading-6 text-ink-700">
                  Generate a crop calendar and it will be saved locally here automatically.
                </Text>
              </SectionCard>
            ) : (
              plannerHistory.map((record) => (
                <PlannerHistoryCard
                  key={record.id}
                  activityCount={record.activityCount}
                  onPress={() =>
                    navigation.navigate('PlannerHistoryDetail', { recordId: record.id })
                  }
                  plantingDateLabel={formatDate(fromIsoDate(record.plantingDate))}
                  savedAtLabel={formatDate(fromIsoDate(record.createdAt.slice(0, 10)))}
                  title={record.title}
                />
              ))
            )}
          </>
        )}
      </View>
    </ScreenContainer>
  );
}
