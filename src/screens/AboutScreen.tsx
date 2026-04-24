import { Text, View } from 'react-native';

import { HeaderBlock } from '../components/ui/HeaderBlock';
import { InfoSectionCard } from '../components/ui/InfoSectionCard';
import { ScreenContainer } from '../components/ui/ScreenContainer';
import { SectionCard } from '../components/ui/SectionCard';

export function AboutScreen() {
  return (
    <ScreenContainer bottomSpacing="comfortable">
      <HeaderBlock
        eyebrow="About PALAYSCAN"
        title="Farmer support for scan, guide, and crop calendar use"
        description="PALAYSCAN is a rice-focused mobile app prototype that combines image-based crop issue guidance, an offline guide module, and an estimated crop calendar for local field planning."
      />

      <View className="gap-4">
        <InfoSectionCard
          body="The app is designed to help users review rice-related guide content, check possible crop issues from images, and organize planting-to-harvest activities in a simple mobile workflow."
          title="What PALAYSCAN does"
        />

        <InfoSectionCard
          body="The current build is organized around the main tasks that a farmer or student-demo user is most likely to open first."
          bullets={[
            'Guide: local rice varieties, pests, and diseases for offline browsing.',
            'Scan: image-based checking flow with guide-only result messaging and history.',
            'Planner: an estimated crop calendar based on planting method and planting date.',
            'History: local review of saved scan and planner records.',
          ]}
          title="Main modules"
        />

        <InfoSectionCard
          body="PALAYSCAN is intended as a support tool for learning, initial checking, and local record review. It should not replace a field visit, official crop diagnosis, or site-specific advice from local agricultural technicians."
          title="How to use it responsibly"
        />

        <SectionCard tone="muted">
          <View className="gap-3">
            <Text className="text-lg font-semibold text-ink-900">Demo-ready note</Text>
            <Text className="text-sm leading-6 text-ink-700">
              This app build is kept simple, readable, and farmer-friendly for demonstration and
              practical mobile use. It combines offline local content with optional live scan
              capability when configured.
            </Text>
          </View>
        </SectionCard>
      </View>
    </ScreenContainer>
  );
}
