import { Image, Text, View } from 'react-native';

import { HeaderBlock } from '../components/ui/HeaderBlock';
import { InfoSectionCard } from '../components/ui/InfoSectionCard';
import { ScreenContainer } from '../components/ui/ScreenContainer';
import { SectionCard } from '../components/ui/SectionCard';
import { useAppLanguage } from '../localization/appLanguage';

const projectTeam = [
  {
    name: 'Project Developer',
    role: 'PALAYSCAN',
  },
];

const projectDeveloperPhoto = require('../../assets/project dev.png');

export function AboutScreen() {
  const { t } = useAppLanguage();

  return (
    <ScreenContainer bottomSpacing="comfortable">
      <HeaderBlock
        eyebrow={t('About PALAYSCAN')}
        title={t('Farmer support for scan, guide, and crop calendar use')}
        description={t('PALAYSCAN is a rice-focused mobile app that combines image-based crop issue guidance, an offline guide module, and an estimated crop calendar for local field planning.')}
      />

      <View className="gap-4">
        <InfoSectionCard
          body={t('The app is designed to help users review rice-related guide content, check possible crop issues from images, and organize planting-to-harvest activities in a simple mobile workflow.')}
          title={t('What PALAYSCAN does')}
        />

        <InfoSectionCard
          body={t('The app is organized around the main tasks that a farmer or field user is most likely to open first.')}
          bullets={[
            t('Guide: local palay varieties, pests, and diseases for offline browsing.'),
            t('Scan: image-based checking flow with guide-only result messaging and history.'),
            t('Planner: an estimated crop calendar based on planting method and planting date.'),
            t('History: local review of saved scan and planner records.'),
          ]}
          title={t('Main modules')}
        />

        <InfoSectionCard
          body={t('Image checking can use the configured Kindwise crop.health service when online scan support is enabled. PALAYSCAN still presents those outputs as guide-only support and does not show or store the service key in the app interface.')}
          bullets={[
            t('Scan service credit: Kindwise crop.health.'),
            t('Offline guide and planner content stay available without online scan support.'),
            t('Guide and planner wording are aligned with rice-focused agriculture references listed in References.'),
          ]}
          title={t('Technology credits')}
        />

        <SectionCard>
          <View className="gap-4">
            <View>
              <Text className="text-lg font-semibold text-ink-900">{t('Project team')}</Text>
            </View>

            <View className="gap-3">
              {projectTeam.map((member) => (
                <View
                  className="flex-row items-center gap-4 rounded-[24px] bg-brand-50 p-4"
                  key={member.name}
                >
                  <View className="h-24 w-24 overflow-hidden rounded-[24px] border border-brand-100 bg-white">
                    <Image
                      accessibilityIgnoresInvertColors
                      accessibilityLabel="PALAYSCAN project developer photo"
                      className="h-full w-full"
                      resizeMode="cover"
                      source={projectDeveloperPhoto}
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-semibold text-ink-900">
                      {t(member.name)}
                    </Text>
                    <Text className="mt-1 text-xs font-semibold uppercase tracking-[1.2px] text-brand-700">
                      {member.role}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </SectionCard>
      </View>
    </ScreenContainer>
  );
}
