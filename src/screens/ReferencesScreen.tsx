import { View } from 'react-native';

import { HeaderBlock } from '../components/ui/HeaderBlock';
import { InfoSectionCard } from '../components/ui/InfoSectionCard';
import { ScreenContainer } from '../components/ui/ScreenContainer';

export function ReferencesScreen() {
  return (
    <ScreenContainer bottomSpacing="comfortable">
      <HeaderBlock
        eyebrow="References and Basis"
        title="Basis used for guide and crop calendar content"
        description="PALAYSCAN guide and planner wording were aligned to rice-focused agriculture references so the app stays practical, farmer-friendly, and grounded in established rice production guidance."
      />

      <View className="gap-4">
        <InfoSectionCard
          body="The Guide module content was reviewed and written using rice-focused references for varieties, pests, and diseases."
          bullets={[
            'PinoyRice Knowledge Bank rice varieties information.',
            'PhilRice rice variety and crop management materials.',
            'IRRI Rice Knowledge Bank pest and disease references.',
          ]}
          title="Guide module basis"
        />

        <InfoSectionCard
          body="The Planner module follows a planting-to-harvest crop calendar structure based on broad rice management stages rather than exact prescription dates."
          bullets={[
            'PinoyRice PalayCheck crop management guidance.',
            'IRRI Rice Knowledge Bank step-by-step rice production references.',
            'Rice crop-stage practices such as land preparation, crop establishment, water management, pest monitoring, and harvest timing.',
          ]}
          title="Planner / crop calendar basis"
        />

        <InfoSectionCard
          body="These references support the app’s local content structure and wording. Actual farm practice should still consider local season, variety, irrigation, soil condition, and advice from local agricultural personnel."
          title="Important use note"
        />
      </View>
    </ScreenContainer>
  );
}
