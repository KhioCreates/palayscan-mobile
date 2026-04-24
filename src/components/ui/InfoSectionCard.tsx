import { Text, View } from 'react-native';

import { SectionCard } from './SectionCard';

type InfoSectionCardProps = {
  title: string;
  body: string;
  bullets?: string[];
};

export function InfoSectionCard({ title, body, bullets }: InfoSectionCardProps) {
  return (
    <SectionCard>
      <View className="gap-3">
        <Text className="text-lg font-semibold text-ink-900">{title}</Text>
        <Text className="text-sm leading-6 text-ink-700">{body}</Text>
        {bullets?.length ? (
          <View className="gap-2">
            {bullets.map((bullet) => (
              <View className="flex-row gap-3" key={bullet}>
                <Text className="pt-0.5 text-brand-700">-</Text>
                <Text className="flex-1 text-sm leading-6 text-ink-700">{bullet}</Text>
              </View>
            ))}
          </View>
        ) : null}
      </View>
    </SectionCard>
  );
}
