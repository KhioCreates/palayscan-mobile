import { Text, View } from 'react-native';

import { HeaderBlock } from '../components/ui/HeaderBlock';
import { ScreenContainer } from '../components/ui/ScreenContainer';
import { SectionCard } from '../components/ui/SectionCard';
import { useAppLanguage } from '../localization/appLanguage';

const plannerCards = [
  'Choose planting method: Lipat-Tanim or Sabog-Tanim',
  'Pick planting date',
  'Generate a local rule-based activity schedule',
  'Prepare for editable dates and notes in later phases',
];

export function PlannerScreen() {
  const { t } = useAppLanguage();

  return (
    <ScreenContainer>
      <HeaderBlock
        eyebrow={t('Planner Module')}
        title={t('Set up your rice activity timeline')}
        description={t('Create a local rice activity schedule from planting to harvest.')}
      />

      <View className="gap-4">
        {plannerCards.map((item) => (
          <SectionCard key={item}>
            <Text className="text-base leading-7 text-ink-700">{t(item)}</Text>
          </SectionCard>
        ))}
      </View>
    </ScreenContainer>
  );
}
