import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Text, View } from 'react-native';

import { ScreenContainer } from '../../../components/ui/ScreenContainer';
import { SectionCard } from '../../../components/ui/SectionCard';
import { PlannerCalendarSummary } from '../components/PlannerCalendarSummary';
import { plantingMethodOptions } from '../data/plannerRules';
import { PlannerActivityCard } from '../components/PlannerActivityCard';
import { PlannerStackHeader } from '../components/PlannerStackHeader';
import { PlannerStageTimeline } from '../components/PlannerStageTimeline';
import { PlannerWorkDashboard } from '../components/PlannerWorkDashboard';
import { getPlannerById, updatePlannerRecord } from '../services/plannerStorage';
import { formatDate, fromIsoDate } from '../utils/date';
import { getPlannerActivityStatus } from '../utils/plannerPresentation';
import { PlannerNavigatorParamList } from '../navigation/PlannerNavigator';

type PlannerScheduleScreenProps = NativeStackScreenProps<
  PlannerNavigatorParamList,
  'PlannerSchedule'
>;

export function PlannerScheduleScreen({
  navigation,
  route,
}: PlannerScheduleScreenProps) {
  const [schedule, setSchedule] = useState(route.params.schedule);
  const { recordId } = route.params;
  const methodMeta = plantingMethodOptions.find((option) => option.id === schedule.method);
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);
  const [selectedDateActivityIds, setSelectedDateActivityIds] = useState<string[]>([]);

  const handleToggleActivityComplete = async (activityId: string) => {
    const nextActivities = schedule.activities.map((activity) =>
      activity.id === activityId
        ? {
            ...activity,
            completedAt: activity.completedAt ? undefined : new Date().toISOString(),
          }
        : activity,
    );
    const nextSchedule = {
      ...schedule,
      activities: nextActivities,
    };

    setSchedule(nextSchedule);

    if (!recordId) {
      return;
    }

    const savedRecord = await getPlannerById(recordId);

    if (!savedRecord) {
      return;
    }

    await updatePlannerRecord({
      ...savedRecord,
      activities: nextActivities,
    });
  };

  return (
    <ScreenContainer bottomSpacing="roomy" topSpacing="comfortable">
      <PlannerStackHeader
        backLabel="Back to Planner"
        onBack={() => navigation.goBack()}
        title="Estimated Crop Calendar"
      />

      <PlannerWorkDashboard
        activities={schedule.activities}
        cropDurationDays={schedule.cropDurationDays}
        cropDurationLabel={schedule.cropDurationLabel}
        plantingDate={schedule.plantingDate}
      />

      <SectionCard>
        <View className="gap-4">
          <View>
            <Text className="text-sm font-semibold uppercase tracking-[2px] text-brand-700">
              Crop Calendar
            </Text>
            <Text className="mt-2 text-3xl font-bold text-ink-900">
              {methodMeta ? `${methodMeta.title} Calendar` : 'Rice Crop Calendar'}
            </Text>
            <Text className="mt-2 text-sm leading-6 text-ink-700">
              Planting date: {formatDate(fromIsoDate(schedule.plantingDate))}
            </Text>
            {schedule.cropDurationLabel ? (
              <Text className="text-sm leading-6 text-ink-700">
                Variety duration: {schedule.cropDurationLabel}
              </Text>
            ) : null}
          </View>

          <PlannerStageTimeline
            cropDurationDays={schedule.cropDurationDays}
            plantingDate={schedule.plantingDate}
          />
        </View>
      </SectionCard>

      <PlannerCalendarSummary
        activities={schedule.activities}
        initialFocusDate={schedule.plantingDate}
        onSelectDate={() => setSelectedActivityId(null)}
        onSelectDateActivityIds={setSelectedDateActivityIds}
        onSelectActivity={setSelectedActivityId}
        selectedActivityId={selectedActivityId}
      />

      <SectionCard tone="muted">
        <View className="gap-2">
          <Text className="text-lg font-semibold text-ink-900">Field task checklist</Text>
          <Text className="text-sm leading-6 text-ink-700">
            Mark work as done when finished. Saved calendars keep this progress locally for offline
            review.
          </Text>
        </View>
      </SectionCard>

      <View className="mt-5 gap-4">
        {schedule.activities.map((activity) => (
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
    </ScreenContainer>
  );
}
