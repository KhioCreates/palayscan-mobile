import { Text, View } from 'react-native';

import { HeaderBlock } from '../components/ui/HeaderBlock';
import { ScreenContainer } from '../components/ui/ScreenContainer';
import { SectionCard } from '../components/ui/SectionCard';

const aboutItems = [
  'App purpose and farmer-friendly support',
  'How image scanning works',
  'Offline and online usage note',
  'Developers, adviser, and school information',
  'Capstone acknowledgment and disclaimer',
];

export function AboutScreen() {
  return (
    <ScreenContainer>
      <HeaderBlock
        eyebrow="About PALAYSCAN"
        title="Project information and acknowledgments"
        description="This placeholder prepares the final About content without adding real school details yet."
      />

      <View className="gap-4">
        {aboutItems.map((item) => (
          <SectionCard key={item}>
            <Text className="text-base leading-7 text-ink-700">{item}</Text>
          </SectionCard>
        ))}
      </View>
    </ScreenContainer>
  );
}
