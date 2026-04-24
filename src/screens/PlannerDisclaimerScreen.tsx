import { View } from 'react-native';

import { HeaderBlock } from '../components/ui/HeaderBlock';
import { InfoSectionCard } from '../components/ui/InfoSectionCard';
import { ScreenContainer } from '../components/ui/ScreenContainer';

export function PlannerDisclaimerScreen() {
  return (
    <ScreenContainer bottomSpacing="comfortable">
      <HeaderBlock
        eyebrow="Planner Disclaimer"
        title="Planner dates are estimated and adjustable"
        description="The PALAYSCAN planner is a local rule-based crop calendar that helps users organize activities from planting to harvest using planting method, planting date, and rice crop-stage references."
      />

      <View className="gap-4">
        <InfoSectionCard
          body="Planner activities are estimated timing guides. They are not exact prescriptions for every field, season, variety, or irrigation condition."
          title="How to read the planner"
        />

        <InfoSectionCard
          body="Users should adjust the saved activity dates and notes according to actual field conditions, local weather, variety used, irrigation schedule, and advice from local agricultural personnel."
          title="How to use the calendar responsibly"
          bullets={[
            'Use the planner as a crop calendar guide, not a fixed farm order.',
            'Review the schedule when planting conditions change.',
            'Edit saved activities locally when field needs differ from the estimate.',
          ]}
        />

        <InfoSectionCard
          body="The current planner stays fully offline and uses local schedule rules only. It is meant to support planning and discussion, especially for demo, learning, and field organization use."
          title="Current scope"
        />
      </View>
    </ScreenContainer>
  );
}
