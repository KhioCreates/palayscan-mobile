import { useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Text, TextInput, View } from 'react-native';

import { HeaderBlock } from '../../../components/ui/HeaderBlock';
import { ScreenContainer } from '../../../components/ui/ScreenContainer';
import { GuideStackHeader } from '../components/GuideStackHeader';
import { getGuideCategory, getGuideEntries } from '../data';
import { GuideListItem } from '../components/GuideListItem';
import { GuideStackParamList } from '../navigation/GuideNavigator';
import { useAppLanguage } from '../../../localization/appLanguage';

type GuideListScreenProps = NativeStackScreenProps<GuideStackParamList, 'GuideList'>;

export function GuideListScreen({ navigation, route }: GuideListScreenProps) {
  const { t } = useAppLanguage();
  const { categoryKey } = route.params;
  const category = getGuideCategory(categoryKey);
  const entries = getGuideEntries(categoryKey);
  const [searchQuery, setSearchQuery] = useState('');
  const isVarietyList = categoryKey === 'varieties';

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredEntries = [...entries]
    .sort((firstEntry, secondEntry) => firstEntry.name.localeCompare(secondEntry.name))
    .filter((entry) => {
      if (!normalizedQuery) {
        return true;
      }

      return (
        entry.name.toLowerCase().includes(normalizedQuery) ||
        entry.shortDescription.toLowerCase().includes(normalizedQuery)
      );
    });

  if (!category) {
    return (
      <ScreenContainer bottomSpacing="comfortable">
        <GuideStackHeader onBack={() => navigation.goBack()} title={t('Guide')} />
        <HeaderBlock
          eyebrow={t('Guide')}
          title={t('Section not found')}
          description={t('This guide section could not be loaded from local data.')}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer bottomSpacing="comfortable">
      <GuideStackHeader
        backLabel={t('Back to Guide')}
        onBack={() => navigation.goBack()}
        title={t(category.title)}
      />
      <HeaderBlock
        eyebrow={t(category.eyebrow)}
        title={t(category.title)}
        description={t(category.description)}
      />

      <View className="mb-4 rounded-full bg-brand-100/70 px-4 py-3">
        <Text className="text-sm font-medium text-ink-700">
          {isVarietyList
            ? t('{count} palay varieties saved in this guide', { count: entries.length })
            : t('{count} guide topics saved in this section', { count: entries.length })}
        </Text>
      </View>

      <View className="mb-5 rounded-[24px] border border-brand-100 bg-white px-4 py-3 shadow-soft">
        <Text className="mb-2 text-xs font-semibold uppercase tracking-[1.2px] text-brand-700">
          {t('Search')}
        </Text>
        <TextInput
          autoCapitalize="words"
          autoCorrect={false}
          className="rounded-full bg-brand-50 px-4 py-3 text-sm text-ink-800"
          onChangeText={setSearchQuery}
          placeholder={t('Search {category}', { category: category.title.toLowerCase() })}
          placeholderTextColor="#708272"
          value={searchQuery}
        />
        <Text className="mt-3 text-xs leading-5 text-ink-700">
          {isVarietyList
            ? t('Search by variety name, for example Rc 222.')
            : t('Search by name or visible field sign.')}
        </Text>
      </View>

      <View className="gap-4">
        {filteredEntries.length > 0 ? (
          filteredEntries.map((entry) => (
            <GuideListItem
              key={entry.id}
              badge={entry.category}
              category={entry.category}
              imageAlt={entry.imageAlt}
              imageFit={entry.imageFit}
              imageSource={entry.imageSource}
              onPress={() =>
                navigation.navigate('GuideDetail', {
                  categoryKey,
                  entryId: entry.id,
                })
              }
              summary={entry.shortDescription}
              title={entry.name}
            />
          ))
        ) : (
          <View className="rounded-[24px] bg-brand-50 px-5 py-5">
            <Text className="text-base font-semibold text-ink-900">
              {t('No matching entries found')}
            </Text>
            <Text className="mt-2 text-sm leading-6 text-ink-700">
              {t('Try another keyword or clear the search to see the full offline guide list.')}
            </Text>
          </View>
        )}
      </View>
    </ScreenContainer>
  );
}
