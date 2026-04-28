import { View } from 'react-native';

import { HeaderBlock } from '../components/ui/HeaderBlock';
import { InfoSectionCard } from '../components/ui/InfoSectionCard';
import { ScreenContainer } from '../components/ui/ScreenContainer';
import { useAppLanguage } from '../localization/appLanguage';

export function ScanDisclaimerScreen() {
  const { t } = useAppLanguage();

  return (
    <ScreenContainer bottomSpacing="comfortable">
      <HeaderBlock
        eyebrow={t('Scan Disclaimer')}
        title={t('Scan results are guide-only')}
        description={t('PALAYSCAN scan results are intended to help users review possible rice crop issues from an image. They should be treated as support information, not as a final field diagnosis.')}
      />

      <View className="gap-4">
        <InfoSectionCard
          body={t('A scan result may depend on image quality, lighting, angle, crop stage, and whether the photo clearly shows a rice leaf, stem, or field condition.')}
          title={t('What affects the result')}
        />

        <InfoSectionCard
          body={t('Users should compare scan output with visible field symptoms and, when needed, verify findings with local agricultural references or an agricultural technician.')}
          title={t('How to use scan results')}
          bullets={[
            t('Treat the best match and top matches as guides only.'),
            t('Use clearer rice images for better checking.'),
            t('Do not rely on scan output alone for major farm decisions.'),
          ]}
        />

        <InfoSectionCard
          body={t('The app may block, warn, or avoid saving unrelated images to help protect scan quality and prevent misleading records.')}
          title={t('Built-in safeguards')}
        />

        <InfoSectionCard
          body={t('When online image checking is enabled, PALAYSCAN may send approved rice photos to the configured Kindwise crop.health service for image-based checking. The scan result should still be treated as guide-only.')}
          title={t('Online scan support')}
          bullets={[
            t('Use scan results as a starting point for comparison, not a final diagnosis.'),
            t('Keep photos focused on rice leaves, stems, panicles, or field patches.'),
            t('Do not upload unrelated personal or sensitive images.'),
          ]}
        />
      </View>
    </ScreenContainer>
  );
}
