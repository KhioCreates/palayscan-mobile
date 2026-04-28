import { View } from 'react-native';

import { HeaderBlock } from '../components/ui/HeaderBlock';
import { InfoSectionCard } from '../components/ui/InfoSectionCard';
import { ScreenContainer } from '../components/ui/ScreenContainer';
import { useAppLanguage } from '../localization/appLanguage';

export function ReferencesScreen() {
  const { t } = useAppLanguage();

  return (
    <ScreenContainer bottomSpacing="comfortable">
      <HeaderBlock
        eyebrow={t('References and Basis')}
        title={t('Basis used for guide and crop calendar content')}
        description={t('Sources used for guide wording and crop calendar logic.')}
      />

      <View className="gap-4">
        <InfoSectionCard
          body={t('The Guide module content was reviewed and written using rice-focused references for varieties, pests, and diseases.')}
          bullets={[
            t('PinoyRice Knowledge Bank rice varieties information.'),
            t('PhilRice rice variety and crop management materials.'),
            t('IRRI Rice Knowledge Bank pest and disease references.'),
          ]}
          title={t('Guide module basis')}
        />

        <InfoSectionCard
          body={t('The Planner module follows a planting-to-harvest crop calendar structure based on broad rice management stages rather than exact prescription dates.')}
          bullets={[
            t('PinoyRice PalayCheck crop management guidance.'),
            t('IRRI Rice Knowledge Bank step-by-step rice production references.'),
            t('Rice crop-stage practices such as land preparation, crop establishment, water management, pest monitoring, and harvest timing.'),
          ]}
          title={t('Planner / crop calendar basis')}
        />

        <InfoSectionCard
          body={t('Some Guide visuals are local copies from reusable Wikimedia Commons, Bugwood, and open-access research pages. When exact reusable variety photos were not verified, PALAYSCAN uses real rice reference photos without claiming they show the exact NSIC variety.')}
          bullets={[
            t('Disease visuals added for Rice Blast, Bacterial Leaf Blight, Sheath Blight, Brown Spot, False Smut, Tungro, Bacterial Leaf Streak, Bakanae, Sheath Rot, Stem Rot, Narrow Brown Spot, Leaf Scald, Red Stripe, Rice Grassy Stunt, and Rice Ragged Stunt.'),
            t('Pest visuals added for Brown Planthopper, Rice Black Bug, Stem Borer, Rice Leaffolder, Golden Apple Snail, Rice Bug, Green Leafhopper, Whitebacked Planthopper, Rice Whorl Maggot, Rice Caseworm, Rice Gall Midge, Rice Hispa, Rice Thrips, Armyworm, and Cutworm.'),
            t('Rice variety visuals use real rice reference photos from Wikimedia Commons and local crops of those photos. They are not exact NSIC variety photos and can be replaced later with team-owned or otherwise authorized variety photos.'),
          ]}
          title={t('Guide image credits')}
        />
      </View>
    </ScreenContainer>
  );
}
