import { View } from 'react-native';

import { HeaderBlock } from '../components/ui/HeaderBlock';
import { InfoSectionCard } from '../components/ui/InfoSectionCard';
import { ScreenContainer } from '../components/ui/ScreenContainer';
import { useAppLanguage } from '../localization/appLanguage';

export function PlannerDisclaimerScreen() {
  const { t } = useAppLanguage();

  return (
    <ScreenContainer bottomSpacing="comfortable">
      <HeaderBlock
        eyebrow={t('Planner Disclaimer')}
        title={t('Planner dates are estimated and adjustable')}
        description={t('The PALAYSCAN planner is a local rule-based crop calendar that helps users organize activities from planting to harvest using planting method, planting date, and rice crop-stage references.')}
      />

      <View className="gap-4">
        <InfoSectionCard
          body={t('Planner activities are estimated timing guides. They are not exact prescriptions for every field, season, variety, or irrigation condition.')}
          title={t('How to read the planner')}
        />

        <InfoSectionCard
          body={t('Users should adjust the saved activity dates and notes according to actual field conditions, local weather, variety used, irrigation schedule, and advice from local agricultural personnel.')}
          title={t('How to use the calendar responsibly')}
          bullets={[
            t('Use the planner as a crop calendar guide, not a fixed farm order.'),
            t('Review the schedule when planting conditions change.'),
            t('Edit saved activities locally when field needs differ from the estimate.'),
          ]}
        />

        <InfoSectionCard
          body={t('The planner stays fully offline and uses local schedule rules only. It is meant to support planning, learning, and field organization use.')}
          title={t('Current scope')}
        />
      </View>
    </ScreenContainer>
  );
}
