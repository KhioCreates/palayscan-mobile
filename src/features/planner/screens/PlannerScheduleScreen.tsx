import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Text, View } from 'react-native';

import { HeaderBlock } from '../../../components/ui/HeaderBlock';
import { ScreenContainer } from '../../../components/ui/ScreenContainer';
import { SectionCard } from '../../../components/ui/SectionCard';
import { PlannerCalendarSummary } from '../components/PlannerCalendarSummary';
import { plantingMethodOptions } from '../data/plannerRules';
import { PlannerActivityCard } from '../components/PlannerActivityCard';
import { PlannerStackHeader } from '../components/PlannerStackHeader';
import { formatDate, fromIsoDate } from '../utils/date';
import { PlannerNavigatorParamList } from '../navigation/PlannerNavigator';

type PlannerScheduleScreenProps = NativeStackScreenProps<
  PlannerNavigatorParamList,
  'PlannerSchedule'
>;

export function PlannerScheduleScreen({
  navigation,
  route,
}: PlannerScheduleScreenProps) {
  const { schedule } = route.params;
  const methodMeta = plantingMethodOptions.find((option) => option.id === schedule.method);
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);
  const [selectedDateActivityIds, setSelectedDateActivityIds] = useState<string[]>([]);

  return (
    <ScreenContainer bottomSpacing="roomy" topSpacing="comfortable">
      <PlannerStackHeader
        backLabel="Back to Planner"
        onBack={() => navigation.goBack()}
        title="Estimated Crop Calendar"
      />

      <HeaderBlock
        eyebrow="Crop Calendar"
        title={methodMeta ? `${methodMeta.title} Calendar` : 'Rice Crop Calendar'}
        description={`Planting date: ${formatDate(fromIsoDate(schedule.plantingDate))}`}
      />

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
          <Text className="text-lg font-semibold text-ink-900">Estimated planting-to-harvest timeline</Text>
          <Text className="text-sm leading-6 text-ink-600">
            This calendar is based on local farming milestones using your selected planting method
            and planting date. Dates are estimates and can be adjusted later.
          </Text>
        </View>
      </SectionCard>

      <View className="mt-5 gap-4">
          {schedule.activities.map((activity) => (
            <PlannerActivityCard
              key={activity.id}
              dateLabel={activity.windowLabel}
              description={activity.description}
              notes={activity.notes}
              onPress={() => setSelectedActivityId(activity.id)}
              selected={
                activity.id === selectedActivityId ||
                (!selectedActivityId && selectedDateActivityIds.includes(activity.id))
              }
              title={activity.title}
            />
          ))}
      </View>
    </ScreenContainer>
  );
}
