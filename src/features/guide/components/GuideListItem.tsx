import { Ionicons } from '@expo/vector-icons';
import { ImageSourcePropType, Pressable, Text, View } from 'react-native';

import { SectionCard } from '../../../components/ui/SectionCard';
import { useAppLanguage } from '../../../localization/appLanguage';
import { GuideCategory } from '../types';
import { GuideEntryVisual } from './GuideEntryVisual';

type GuideListItemProps = {
  title: string;
  summary: string;
  badge: string;
  category: GuideCategory;
  onPress: () => void;
  imageSource?: ImageSourcePropType;
  imageAlt?: string;
  imageFit?: 'cover' | 'contain';
};

export function GuideListItem({
  title,
  summary,
  badge,
  category,
  onPress,
  imageSource,
  imageAlt,
  imageFit,
}: GuideListItemProps) {
  const { t } = useAppLanguage();

  return (
    <Pressable accessibilityRole="button" className="active:opacity-90" onPress={onPress}>
      <SectionCard>
        <View className="flex-row gap-3">
          <GuideEntryVisual
            badgeLabel={badge}
            category={category}
            imageAlt={imageAlt}
            imageFit={imageFit}
            imageSource={imageSource}
            primaryDetail={summary}
            title={title}
          />

          <View className="flex-1 gap-2">
            <View className="gap-2">
              <Text className="text-lg font-semibold text-ink-900">{title}</Text>
              <View className="self-start rounded-full bg-brand-50 px-3 py-1">
                <Text className="text-xs font-semibold uppercase tracking-[1.2px] text-brand-700">
                  {t(badge)}
                </Text>
              </View>
            </View>
            <Text className="text-sm leading-6 text-ink-700">{summary}</Text>
            <View className="flex-row items-center justify-between pt-1">
              <Text className="text-sm font-semibold text-brand-700">{t('View guide details')}</Text>
              <Ionicons color="#2d6033" name="chevron-forward" size={18} />
            </View>
          </View>
        </View>
      </SectionCard>
    </Pressable>
  );
}
