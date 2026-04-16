import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { Alert, Image, Text, View } from 'react-native';

import { PrimaryButton } from '../../../components/ui/PrimaryButton';
import { ScreenContainer } from '../../../components/ui/ScreenContainer';
import { SectionCard } from '../../../components/ui/SectionCard';
import { RootStackParamList } from '../../../navigation/RootNavigator';
import { ScanResultCard } from '../components/ScanResultCard';
import { deleteScanRecord, getScanRecordById } from '../services/scanStorage';
import { SavedScanRecord } from '../types';
import { formatDate, fromIsoDate } from '../../planner/utils/date';

type ScanHistoryDetailScreenProps = NativeStackScreenProps<RootStackParamList, 'ScanHistoryDetail'>;

export function ScanHistoryDetailScreen({ navigation, route }: ScanHistoryDetailScreenProps) {
  const [record, setRecord] = useState<SavedScanRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      getScanRecordById(route.params.recordId).then((savedRecord) => {
        if (active) {
          setRecord(savedRecord);
        }
      });

      return () => {
        active = false;
      };
    }, [route.params.recordId]),
  );

  const handleDelete = () => {
    if (!record || isDeleting) {
      return;
    }

    Alert.alert('Delete scan record', 'Remove this saved scan result from local history?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          setIsDeleting(true);
          await deleteScanRecord(record.id);
          navigation.goBack();
        },
      },
    ]);
  };

  if (!record) {
    return (
      <ScreenContainer bottomSpacing="comfortable">
        <SectionCard tone="muted">
          <Text className="text-lg font-semibold text-ink-900">Scan record not found</Text>
          <Text className="mt-2 text-sm leading-6 text-ink-600">
            This saved scan could not be loaded from local history.
          </Text>
        </SectionCard>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer bottomSpacing="roomy">
      <View className="gap-4">
        <SectionCard>
          <View className="gap-4">
            <Image
              source={{ uri: record.imageUri }}
              className="h-[240px] w-full rounded-[22px] bg-brand-100"
              resizeMode="cover"
            />

            <View className="gap-2">
              <Text className="text-lg font-semibold text-ink-900">Saved scan summary</Text>
              <Text className="text-sm leading-6 text-ink-600">
                Mode: {record.mode.toUpperCase()}
              </Text>
              <Text className="text-sm leading-6 text-ink-600">
                Saved: {formatDate(fromIsoDate(record.createdAt.slice(0, 10)))}
              </Text>
            </View>
          </View>
        </SectionCard>

        <ScanResultCard result={record.result} />

        <PrimaryButton
          disabled={isDeleting}
          label={isDeleting ? 'Deleting...' : 'Delete this scan'}
          hint="Remove this saved scan from local history."
          onPress={handleDelete}
        />
      </View>
    </ScreenContainer>
  );
}
