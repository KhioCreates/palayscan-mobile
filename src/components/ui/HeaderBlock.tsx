import { Text, View } from 'react-native';

type HeaderBlockProps = {
  eyebrow?: string;
  title: string;
  description: string;
};

export function HeaderBlock({ eyebrow, title, description }: HeaderBlockProps) {
  return (
    <View className="mb-5 gap-2">
      {eyebrow ? (
        <Text className="text-xs font-semibold uppercase tracking-[1.8px] text-brand-700">
          {eyebrow}
        </Text>
      ) : null}
      <Text className="text-[30px] font-bold leading-9 text-ink-900">{title}</Text>
      <Text className="max-w-[340px] text-base leading-6 text-ink-600">{description}</Text>
    </View>
  );
}
