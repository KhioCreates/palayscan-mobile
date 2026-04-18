import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Text, View } from 'react-native';

import { HeaderBlock } from '../../../components/ui/HeaderBlock';
import { ScreenContainer } from '../../../components/ui/ScreenContainer';
import { SectionCard } from '../../../components/ui/SectionCard';
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

  return (
    <ScreenContainer bottomSpacing="roomy">
      <PlannerStackHeader
        backLabel="Back to Planner"
        onBack={() => navigation.goBack()}
        title="Generated Schedule"
      />

      <HeaderBlock
        eyebrow="Planner Result"
        title={methodMeta ? methodMeta.title : 'Rice Schedule'}
        description={`Planting date: ${formatDate(fromIsoDate(schedule.plantingDate))}`}
      />

      <SectionCard tone="muted">
        <View className="gap-2">
          <Text className="text-lg font-semibold text-ink-900">Generated local schedule</Text>
          <Text className="text-sm leading-6 text-ink-600">
            This schedule is based on local farming milestones using your selected method and
            planting date.
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
            title={activity.title}
          />
        ))}
      </View>
    </ScreenContainer>
  );
}
