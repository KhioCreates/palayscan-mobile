import { Ionicons } from '@expo/vector-icons';
import { Image, ImageSourcePropType, View, Text } from 'react-native';

import { GuideCategory } from '../types';

type GuideEntryVisualProps = {
  category: GuideCategory;
  title: string;
  imageSource?: ImageSourcePropType;
  imageAlt?: string;
  imageFit?: 'cover' | 'contain';
  size?: 'list' | 'detail';
  compactPlaceholder?: boolean;
  badgeLabel?: string;
  primaryDetail?: string;
  secondaryDetail?: string;
  tertiaryDetail?: string;
  visualHint?: string;
};

const visualConfig: Record<
  GuideCategory,
  {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    helper: string;
    stamp: string;
  }
> = {
  variety: {
    icon: 'leaf-outline',
    label: 'Variety profile',
    helper: 'Verified rice variety data',
    stamp: 'RICE',
  },
  pest: {
    icon: 'bug-outline',
    label: 'Field signs',
    helper: 'Key pest checks for field comparison',
    stamp: 'PEST',
  },
  disease: {
    icon: 'shield-checkmark-outline',
    label: 'Symptom guide',
    helper: 'Key disease checks for field comparison',
    stamp: 'DISEASE',
  },
};

export function GuideEntryVisual({
  category,
  title,
  imageSource,
  imageAlt,
  imageFit = 'cover',
  size = 'list',
  compactPlaceholder = false,
  badgeLabel,
  primaryDetail,
  secondaryDetail,
  tertiaryDetail,
  visualHint,
}: GuideEntryVisualProps) {
  const config = visualConfig[category];
  const isDetail = size === 'detail';
  const shouldUseCompactPlaceholder = isDetail && compactPlaceholder;
  const details = [primaryDetail, secondaryDetail, tertiaryDetail].filter(
    (detail): detail is string => Boolean(detail),
  );
  const resolvedBadge = badgeLabel ?? config.stamp;

  if (imageSource) {
    return (
      <View
        className={`overflow-hidden border border-brand-100 bg-brand-50 ${
          isDetail ? 'h-56 rounded-[24px]' : 'h-28 w-28 rounded-[22px]'
        }`}
      >
        <Image
          accessibilityIgnoresInvertColors
          accessibilityLabel={imageAlt ?? `${title} guide image`}
          className="h-full w-full"
          resizeMode={imageFit}
          source={imageSource}
        />
      </View>
    );
  }

  return (
    <View
      className={`overflow-hidden border border-brand-100 bg-brand-50 ${
          shouldUseCompactPlaceholder
            ? 'rounded-[22px] px-4 py-4'
          : isDetail
            ? 'h-52 rounded-[24px] px-5 py-5'
            : 'h-28 w-28 rounded-[22px] p-3'
      }`}
    >
      <View className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-brand-200/40" />
      <View className="absolute -bottom-10 -left-8 h-24 w-24 rounded-full bg-earth-200/35" />

      <View
        className={`relative z-10 ${
          shouldUseCompactPlaceholder
            ? 'gap-3'
            : isDetail
              ? 'flex-1 justify-between'
              : 'flex-1 items-center justify-center'
        }`}
      >
        {shouldUseCompactPlaceholder ? (
          <View className="gap-3">
            <View className="flex-row items-center gap-3">
              <View className="h-12 w-12 items-center justify-center rounded-full bg-white">
                <Ionicons color="#2d6033" name={config.icon} size={24} />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-semibold uppercase tracking-[1.1px] text-brand-700">
                  {resolvedBadge}
                </Text>
                <Text className="mt-1 text-lg font-semibold text-ink-900">{config.label}</Text>
                <Text className="mt-1 text-sm leading-5 text-ink-700">
                  {visualHint ?? config.helper}
                </Text>
              </View>
            </View>

            {details.length > 0 ? (
              <View className="gap-2">
                {details.map((detail) => (
                  <View className="rounded-[16px] bg-white/85 px-3 py-2" key={detail}>
                    <Text className="text-sm leading-5 text-ink-800">{detail}</Text>
                  </View>
                ))}
              </View>
            ) : null}
          </View>
        ) : isDetail ? (
          <View className="flex-1 justify-between">
            <View className="h-14 w-14 items-center justify-center rounded-full bg-white">
              <Ionicons color="#2d6033" name={config.icon} size={28} />
            </View>
            <View>
              <Text className="text-base font-semibold text-ink-900">{config.label}</Text>
              <Text className="mt-1 text-sm leading-5 text-ink-700">
                {visualHint ?? config.helper}
              </Text>
            </View>
          </View>
        ) : (
          <>
            <View className="h-10 w-10 items-center justify-center rounded-full bg-white">
              <Ionicons color="#2d6033" name={config.icon} size={22} />
            </View>
            <View className="mt-3 w-full gap-1.5">
              <View className="h-1.5 rounded-full bg-brand-200" />
              <View className="h-1.5 w-3/4 rounded-full bg-earth-200" />
              <View className="h-1.5 w-1/2 rounded-full bg-brand-100" />
            </View>
            <Text className="mt-2 text-center text-[10px] font-semibold uppercase leading-4 tracking-[0.8px] text-brand-800">
              {resolvedBadge}
            </Text>
          </>
        )}
      </View>
    </View>
  );
}
