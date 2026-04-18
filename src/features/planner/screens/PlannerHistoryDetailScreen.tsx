import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { Alert, Text, View } from 'react-native';

import { PrimaryButton } from '../../../components/ui/PrimaryButton';
import { ScreenContainer } from '../../../components/ui/ScreenContainer';
import { SectionCard } from '../../../components/ui/SectionCard';
import { RootStackParamList } from '../../../navigation/RootNavigator';
import { plantingMethodOptions } from '../data/plannerRules';
import { PlannerActivityCard } from '../components/PlannerActivityCard';
import { deletePlannerById, getPlannerById } from '../services/plannerStorage';
import { SavedPlannerRecord } from '../types';
import { formatDate, fromIsoDate } from '../utils/date';

type PlannerHistoryDetailScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'PlannerHistoryDetail'
>;

export function PlannerHistoryDetailScreen({
  navigation,
  route,
}: PlannerHistoryDetailScreenProps) {
  const [record, setRecord] = useState<SavedPlannerRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      getPlannerById(route.params.recordId).then((savedRecord) => {
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

    Alert.alert('Delete planner record', 'Remove this saved planner schedule from local history?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          setIsDeleting(true);
          await deletePlannerById(record.id);
          navigation.goBack();
        },
      },
    ]);
  };

  if (!record) {
    return (
      <ScreenContainer bottomSpacing="comfortable">
        <SectionCard tone="muted">
          <Text className="text-lg font-semibold text-ink-900">Planner record not found</Text>
          <Text className="mt-2 text-sm leading-6 text-ink-600">
            This saved planner schedule could not be loaded from local history.
          </Text>
        </SectionCard>
      </ScreenContainer>
    );
  }

  const methodMeta = plantingMethodOptions.find((option) => option.id === record.method);

  return (
    <ScreenContainer bottomSpacing="roomy">
      <View className="gap-4">
        <SectionCard>
          <View className="gap-2">
            <Text className="text-lg font-semibold text-ink-900">Saved planner summary</Text>
            <Text className="text-sm leading-6 text-ink-600">
              Method: {methodMeta ? `${methodMeta.title} (${methodMeta.subtitle})` : record.title}
            </Text>
            <Text className="text-sm leading-6 text-ink-600">
              Planting date: {formatDate(fromIsoDate(record.plantingDate))}
            </Text>
            <Text className="text-sm leading-6 text-ink-600">
              Saved: {formatDate(fromIsoDate(record.createdAt.slice(0, 10)))}
            </Text>
            <Text className="text-sm leading-6 text-ink-600">
              Activities: {record.activityCount}
            </Text>
          </View>
        </SectionCard>

        <SectionCard tone="muted">
          <View className="gap-2">
            <Text className="text-lg font-semibold text-ink-900">Saved local schedule</Text>
            <Text className="text-sm leading-6 text-ink-600">
              This is the locally saved rule-based planner record for offline review.
            </Text>
          </View>
        </SectionCard>

        <View className="gap-4">
          {record.activities.map((activity) => (
            <PlannerActivityCard
              key={activity.id}
              dateLabel={activity.windowLabel}
              description={activity.description}
              notes={activity.notes}
              title={activity.title}
            />
          ))}
        </View>

        <PrimaryButton
          disabled={isDeleting}
          hint="Remove this saved planner record from local history."
          label={isDeleting ? 'Deleting...' : 'Delete this planner record'}
          onPress={handleDelete}
        />
      </View>
    </ScreenContainer>
  );
}
