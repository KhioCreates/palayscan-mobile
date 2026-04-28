import { View } from 'react-native';

import { HeaderBlock } from '../components/ui/HeaderBlock';
import { InfoSectionCard } from '../components/ui/InfoSectionCard';
import { ScreenContainer } from '../components/ui/ScreenContainer';
import { useAppLanguage } from '../localization/appLanguage';

export function DataPrivacyScreen() {
  const { t } = useAppLanguage();

  return (
    <ScreenContainer bottomSpacing="comfortable">
      <HeaderBlock
        eyebrow={t('Data Privacy')}
        title={t('Simple privacy guidance for local app use')}
        description={t('PALAYSCAN is designed to keep most records on the device, while clearly warning users when image checking may involve an external service.')}
      />

      <View className="gap-4">
        <InfoSectionCard
          body={t('Saved scan history and planner history are stored locally on the device so the user can review records later without needing a backend account.')}
          title={t('What stays local')}
          bullets={[
            t('Planner records are saved locally for offline review and editing.'),
            t('Saved scan history is stored locally on the device.'),
            t('Users can remove saved records from local history inside the app.'),
          ]}
        />

        <InfoSectionCard
          body={t('If online image checking is enabled, a selected image may be sent to the configured Kindwise crop.health plant-health identification service after the app\'s pre-check safeguards pass.')}
          title={t('What may leave the device')}
          bullets={[
            t('Do not include faces, personal documents, or unrelated objects in scan photos.'),
            t('Only clear rice field images should be submitted for online checking.'),
            t('The API key is configuration data and should not be shown to regular app users.'),
          ]}
        />

        <InfoSectionCard
          body={t('Users should avoid uploading personal, unrelated, or sensitive images. PALAYSCAN is intended for clear rice leaf, stem, or field photos only.')}
          title={t('Recommended user practice')}
        />
      </View>
    </ScreenContainer>
  );
}
