import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Platform, Pressable, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { PrimaryButton } from '../../../components/ui/PrimaryButton';
import { ScreenContainer } from '../../../components/ui/ScreenContainer';
import { SectionCard } from '../../../components/ui/SectionCard';
import { RootStackParamList } from '../../../navigation/RootNavigator';
import { plantingMethodOptions } from '../data/plannerRules';
import { PlannerActivityCard } from '../components/PlannerActivityCard';
import { PlannerCalendarSummary } from '../components/PlannerCalendarSummary';
import { PlannerStageTimeline } from '../components/PlannerStageTimeline';
import { PlannerWorkDashboard } from '../components/PlannerWorkDashboard';
import { deletePlannerById, getPlannerById, updatePlannerRecord } from '../services/plannerStorage';
import { PlannedActivity, SavedPlannerRecord } from '../types';
import { addDays, buildWindowLabel, formatDate, fromIsoDate, toIsoDate } from '../utils/date';
import { getPlannerActivityStatus } from '../utils/plannerPresentation';

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
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);
  const [selectedDateActivityIds, setSelectedDateActivityIds] = useState<string[]>([]);
  const [editorDate, setEditorDate] = useState<Date>(new Date());
  const [editorNotesText, setEditorNotesText] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

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

  const selectedActivity = useMemo(
    () => record?.activities.find((activity) => activity.id === selectedActivityId) ?? null,
    [record, selectedActivityId],
  );

  useEffect(() => {
    if (!selectedActivity) {
      return;
    }

    setEditorDate(fromIsoDate(selectedActivity.targetDate));
    setEditorNotesText(selectedActivity.notes.join('\n'));
  }, [selectedActivity]);

  const handleEditDateChange = (event: DateTimePickerEvent, nextDate?: Date) => {
    if (Platform.OS !== 'ios') {
      setShowDatePicker(false);
    }

    if (event.type === 'set' && nextDate) {
      setEditorDate(nextDate);
    }
  };

  const handleSaveActivityEdit = async () => {
    if (!record || !selectedActivity || isSavingEdit) {
      return;
    }

    setIsSavingEdit(true);

    try {
      const previousTargetDate = fromIsoDate(selectedActivity.targetDate);
      const nextTargetDate = editorDate;
      const dayOffset = Math.round(
        (fromIsoDate(toIsoDate(nextTargetDate)).getTime() - previousTargetDate.getTime()) /
          (1000 * 60 * 60 * 24),
      );
      const nextNotes = editorNotesText
        .split('\n')
        .map((note) => note.trim())
        .filter(Boolean);

      const nextActivities = record.activities.map((activity) => {
        if (activity.id !== selectedActivity.id) {
          return activity;
        }

        const nextStartDate = addDays(fromIsoDate(activity.startDate), dayOffset);
        const nextEndDate = addDays(fromIsoDate(activity.endDate), dayOffset);
        const nextTarget = addDays(fromIsoDate(activity.targetDate), dayOffset);

        const updatedActivity: PlannedActivity = {
          ...activity,
          targetDate: toIsoDate(nextTarget),
          startDate: toIsoDate(nextStartDate),
          endDate: toIsoDate(nextEndDate),
          windowLabel: buildWindowLabel(nextStartDate, nextEndDate),
          notes: nextNotes,
        };

        return updatedActivity;
      });

      const updatedRecord: SavedPlannerRecord = {
        ...record,
        activities: nextActivities,
        activityCount: nextActivities.length,
      };

      await updatePlannerRecord(updatedRecord);
      setRecord(updatedRecord);
      Alert.alert('Activity updated', 'This saved crop calendar activity was updated locally.');
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleToggleActivityComplete = async (activityId: string) => {
    if (!record) {
      return;
    }

    const nextActivities = record.activities.map((activity) =>
      activity.id === activityId
        ? {
            ...activity,
            completedAt: activity.completedAt ? undefined : new Date().toISOString(),
          }
        : activity,
    );
    const updatedRecord: SavedPlannerRecord = {
      ...record,
      activities: nextActivities,
      activityCount: nextActivities.length,
    };

    await updatePlannerRecord(updatedRecord);
    setRecord(updatedRecord);
  };

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
      <ScreenContainer bottomSpacing="comfortable" topSpacing="comfortable">
        <SectionCard tone="muted">
          <Text className="text-lg font-semibold text-ink-900">Planner record not found</Text>
          <Text className="mt-2 text-sm leading-6 text-ink-700">
            This saved planner schedule could not be loaded from local history.
          </Text>
        </SectionCard>
      </ScreenContainer>
    );
  }

  const methodMeta = plantingMethodOptions.find((option) => option.id === record.method);

  return (
    <ScreenContainer bottomSpacing="roomy" topSpacing="comfortable">
      <View className="gap-4">
        <PlannerWorkDashboard
          activities={record.activities}
          cropDurationDays={record.cropDurationDays}
          cropDurationLabel={record.cropDurationLabel}
          plantingDate={record.plantingDate}
          title="Saved planner progress"
        />

        <SectionCard>
          <View className="gap-4">
            <View className="gap-2">
              <Text className="text-sm font-semibold uppercase tracking-[2px] text-brand-700">
                Saved Crop Calendar
              </Text>
              <Text className="text-2xl font-semibold text-ink-900">{record.title}</Text>
              <Text className="text-sm leading-6 text-ink-700">
                Method: {methodMeta ? `${methodMeta.title} (${methodMeta.subtitle})` : record.title}
              </Text>
              <Text className="text-sm leading-6 text-ink-700">
                Planting date: {formatDate(fromIsoDate(record.plantingDate))}
              </Text>
              <Text className="text-sm leading-6 text-ink-700">
                Saved: {formatDate(fromIsoDate(record.createdAt.slice(0, 10)))}
              </Text>
              {record.cropDurationLabel ? (
                <Text className="text-sm leading-6 text-ink-700">
                  Variety duration: {record.cropDurationLabel}
                </Text>
              ) : null}
            </View>

            <PlannerStageTimeline
              cropDurationDays={record.cropDurationDays}
              plantingDate={record.plantingDate}
            />
          </View>
        </SectionCard>

        <PlannerCalendarSummary
          activities={record.activities}
          initialFocusDate={record.plantingDate}
          onSelectDate={() => setSelectedActivityId(null)}
          onSelectDateActivityIds={setSelectedDateActivityIds}
          onSelectActivity={setSelectedActivityId}
          selectedActivityId={selectedActivityId}
        />

        <SectionCard tone="muted">
          <View className="gap-3">
            <Text className="text-lg font-semibold text-ink-900">Edit selected activity</Text>
            {selectedActivity ? (
              <>
                <Text className="text-sm leading-6 text-ink-700">
                  Update the date or notes for this saved activity. Changes stay on this device and
                  refresh the crop calendar below.
                </Text>

                <View className="gap-2 rounded-[18px] bg-white p-4">
                  <Text className="text-base font-semibold text-ink-900">
                    {selectedActivity.title}
                  </Text>
                  <Text className="text-sm leading-6 text-ink-700">
                    Current window: {selectedActivity.windowLabel}
                  </Text>
                </View>

                <Pressable
                  accessibilityRole="button"
                  className="min-h-[58px] flex-row items-center justify-between rounded-[20px] bg-white px-4 py-4 active:bg-brand-50"
                  onPress={() => setShowDatePicker(true)}
                >
                  <View className="flex-1 pr-3">
                    <Text className="text-base font-semibold text-ink-900">
                      {formatDate(editorDate)}
                    </Text>
                    <Text className="mt-1 text-sm text-ink-700">
                      Tap to adjust this activity date. Multi-day windows move together.
                    </Text>
                  </View>
                  <Ionicons color="#2d6033" name="calendar-outline" size={22} />
                </Pressable>

                {showDatePicker ? (
                  <DateTimePicker
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    mode="date"
                    onChange={handleEditDateChange}
                    value={editorDate}
                  />
                ) : null}

                <View className="rounded-[20px] bg-white p-4">
                  <Text className="text-sm font-semibold text-ink-900">Activity notes</Text>
                  <TextInput
                    className="mt-3 min-h-[120px] rounded-[16px] bg-brand-50 px-4 py-3 text-sm leading-6 text-ink-900"
                    multiline
                    onChangeText={setEditorNotesText}
                    placeholder="Add one note per line for this saved activity."
                    placeholderTextColor="#6e7f73"
                    textAlignVertical="top"
                    value={editorNotesText}
                  />
                </View>

                <PrimaryButton
                  disabled={isSavingEdit}
                  hint="Save this date and note update to local planner history."
                  label={isSavingEdit ? 'Saving changes...' : 'Save activity changes'}
                  onPress={handleSaveActivityEdit}
                />
              </>
            ) : (
              <Text className="text-sm leading-6 text-ink-700">
                Tap an activity from the calendar or the list below to edit its saved date and
                notes.
              </Text>
            )}
          </View>
        </SectionCard>

        <View className="gap-4">
          {record.activities.map((activity) => (
            <PlannerActivityCard
              key={activity.id}
              completedAt={activity.completedAt}
              dateLabel={activity.windowLabel}
              description={activity.description}
              notes={activity.notes}
              onPress={() => setSelectedActivityId(activity.id)}
              onToggleComplete={() => handleToggleActivityComplete(activity.id)}
              selected={
                activity.id === selectedActivityId ||
                (!selectedActivityId && selectedDateActivityIds.includes(activity.id))
              }
              status={getPlannerActivityStatus(activity)}
              title={activity.title}
              type={activity.type}
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
