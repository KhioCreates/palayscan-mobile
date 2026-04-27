import { Text, View } from 'react-native';

import { HeaderBlock } from '../components/ui/HeaderBlock';
import { InfoSectionCard } from '../components/ui/InfoSectionCard';
import { ScreenContainer } from '../components/ui/ScreenContainer';
import { SectionCard } from '../components/ui/SectionCard';

const projectTeam = [
  {
    initials: 'PT',
    name: 'Project proponents',
    role: 'Use this area for the final proponent names and photos before presentation or release.',
  },
  {
    initials: 'DEV',
    name: 'Developer',
    role: 'App design, mobile implementation, scan workflow integration, and field workflow testing.',
  },
];

export function AboutScreen() {
  return (
    <ScreenContainer bottomSpacing="comfortable">
      <HeaderBlock
        eyebrow="About PALAYSCAN"
        title="Farmer support for scan, guide, and crop calendar use"
        description="PALAYSCAN is a rice-focused mobile app that combines image-based crop issue guidance, an offline guide module, and an estimated crop calendar for local field planning."
      />

      <View className="gap-4">
        <InfoSectionCard
          body="The app is designed to help users review rice-related guide content, check possible crop issues from images, and organize planting-to-harvest activities in a simple mobile workflow."
          title="What PALAYSCAN does"
        />

        <InfoSectionCard
          body="The app is organized around the main tasks that a farmer or field user is most likely to open first."
          bullets={[
            'Guide: local palay varieties, pests, and diseases for offline browsing.',
            'Scan: image-based checking flow with guide-only result messaging and history.',
            'Planner: an estimated crop calendar based on planting method and planting date.',
            'History: local review of saved scan and planner records.',
          ]}
          title="Main modules"
        />

        <InfoSectionCard
          body="Image checking can use the configured Kindwise crop.health service when online scan support is enabled. PALAYSCAN still presents those outputs as guide-only support and does not show or store the service key in the app interface."
          bullets={[
            'Scan service credit: Kindwise crop.health.',
            'Offline guide and planner content stay available without online scan support.',
            'Guide and planner wording are aligned with rice-focused agriculture references listed in References.',
          ]}
          title="Technology credits"
        />

        <InfoSectionCard
          body="PALAYSCAN is intended as a support tool for learning, initial checking, and local record review. It should not replace a field visit, official crop diagnosis, or site-specific advice from local agricultural technicians."
          title="How to use it responsibly"
        />

        <SectionCard>
          <View className="gap-4">
            <View>
              <Text className="text-lg font-semibold text-ink-900">Project team</Text>
              <Text className="mt-2 text-sm leading-6 text-ink-700">
                Add the final proponent names and photos here once the team details are ready.
                Keeping this inside About avoids crowding the farmer workflow screens.
              </Text>
            </View>

            <View className="gap-3">
              {projectTeam.map((member) => (
                <View
                  className="flex-row items-center gap-3 rounded-[20px] bg-brand-50 p-3"
                  key={member.name}
                >
                  <View className="h-12 w-12 items-center justify-center rounded-full bg-white">
                    <Text className="text-xs font-semibold text-brand-700">{member.initials}</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-semibold text-ink-900">{member.name}</Text>
                    <Text className="mt-1 text-xs leading-5 text-ink-700">{member.role}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </SectionCard>

        <SectionCard tone="muted">
          <View className="gap-3">
            <Text className="text-lg font-semibold text-ink-900">App note</Text>
            <Text className="text-sm leading-6 text-ink-700">
              This app is kept simple, readable, and farmer-friendly for practical mobile use. It
              combines offline local content with optional online scan support when configured.
            </Text>
          </View>
        </SectionCard>
      </View>
    </ScreenContainer>
  );
}
