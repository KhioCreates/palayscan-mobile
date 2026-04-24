import { View } from 'react-native';

import { HeaderBlock } from '../components/ui/HeaderBlock';
import { InfoSectionCard } from '../components/ui/InfoSectionCard';
import { ScreenContainer } from '../components/ui/ScreenContainer';

export function DataPrivacyScreen() {
  return (
    <ScreenContainer bottomSpacing="comfortable">
      <HeaderBlock
        eyebrow="Data Privacy"
        title="Simple privacy guidance for local app use"
        description="PALAYSCAN is designed to keep most records on the device, while clearly warning users when a live scan may involve an external image-check service."
      />

      <View className="gap-4">
        <InfoSectionCard
          body="Saved scan history and planner history are stored locally on the device so the user can review records later without needing a backend account."
          title="What stays local"
          bullets={[
            'Planner records are saved locally for offline review and editing.',
            'Saved scan history is stored locally on the device.',
            'Users can remove saved records from local history inside the app.',
          ]}
        />

        <InfoSectionCard
          body="If live scan is enabled, a selected image may be sent to an external plant-health identification service after the app’s pre-check safeguards pass. This is different from mock mode, which does not use the live scan service."
          title="What may leave the device"
        />

        <InfoSectionCard
          body="Users should avoid uploading personal, unrelated, or sensitive images. PALAYSCAN is intended for clear rice leaf, stem, or field photos only."
          title="Recommended user practice"
        />
      </View>
    </ScreenContainer>
  );
}
