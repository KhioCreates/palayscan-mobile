import { View } from 'react-native';

import { HeaderBlock } from '../components/ui/HeaderBlock';
import { InfoSectionCard } from '../components/ui/InfoSectionCard';
import { ScreenContainer } from '../components/ui/ScreenContainer';

export function ScanDisclaimerScreen() {
  return (
    <ScreenContainer bottomSpacing="comfortable">
      <HeaderBlock
        eyebrow="Scan Disclaimer"
        title="Scan results are guide-only"
        description="PALAYSCAN scan results are intended to help users review possible rice crop issues from an image. They should be treated as support information, not as a final field diagnosis."
      />

      <View className="gap-4">
        <InfoSectionCard
          body="A scan result may depend on image quality, lighting, angle, crop stage, and whether the photo clearly shows a rice leaf, stem, or field condition."
          title="What affects the result"
        />

        <InfoSectionCard
          body="Users should compare scan output with visible field symptoms and, when needed, verify findings with local agricultural references or an agricultural technician."
          title="How to use scan results"
          bullets={[
            'Treat the best match and top matches as guides only.',
            'Use clearer rice images for better checking.',
            'Do not rely on scan output alone for major farm decisions.',
          ]}
        />

        <InfoSectionCard
          body="The app may block, warn, or avoid saving unrelated images to help protect scan quality and prevent misleading records."
          title="Built-in safeguards"
        />
      </View>
    </ScreenContainer>
  );
}
