import { Text, View } from 'react-native';

import { HeaderBlock } from '../components/ui/HeaderBlock';
import { ScreenContainer } from '../components/ui/ScreenContainer';
import { SectionCard } from '../components/ui/SectionCard';

const plannerCards = [
  'Choose planting method: Lipat-Tanim or Sabog-Tanim',
  'Pick planting date',
  'Generate a local rule-based activity schedule',
  'Prepare for editable dates and notes in later phases',
];

export function PlannerScreen() {
  return (
    <ScreenContainer>
      <HeaderBlock
        eyebrow="Planner Module"
        title="Set up your rice activity timeline"
        description="This foundation screen marks where the local planning workflow will live."
      />

      <View className="gap-4">
        {plannerCards.map((item) => (
          <SectionCard key={item}>
            <Text className="text-base leading-7 text-ink-700">{item}</Text>
          </SectionCard>
        ))}
      </View>
    </ScreenContainer>
  );
}
