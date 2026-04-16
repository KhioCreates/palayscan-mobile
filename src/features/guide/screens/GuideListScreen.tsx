import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Text, View } from 'react-native';

import { HeaderBlock } from '../../../components/ui/HeaderBlock';
import { ScreenContainer } from '../../../components/ui/ScreenContainer';
import { GuideStackHeader } from '../components/GuideStackHeader';
import { getGuideCategory, getGuideEntries } from '../data';
import { GuideListItem } from '../components/GuideListItem';
import { GuideStackParamList } from '../navigation/GuideNavigator';

type GuideListScreenProps = NativeStackScreenProps<GuideStackParamList, 'GuideList'>;

export function GuideListScreen({ navigation, route }: GuideListScreenProps) {
  const { categoryKey } = route.params;
  const category = getGuideCategory(categoryKey);
  const entries = getGuideEntries(categoryKey);

  if (!category) {
    return (
      <ScreenContainer bottomSpacing="comfortable">
        <GuideStackHeader onBack={() => navigation.goBack()} title="Guide" />
        <HeaderBlock
          eyebrow="Guide"
          title="Section not found"
          description="This guide section could not be loaded from local data."
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer bottomSpacing="comfortable">
      <GuideStackHeader
        backLabel="Back to Guide"
        onBack={() => navigation.goBack()}
        title={category.title}
      />
      <HeaderBlock
        eyebrow={category.eyebrow}
        title={category.title}
        description={category.description}
      />

      <View className="mb-4 rounded-full bg-brand-100/70 px-4 py-3">
        <Text className="text-sm font-medium text-ink-700">
          {entries.length} local entries available in this section
        </Text>
      </View>

      <View className="gap-4">
        {entries.map((entry) => (
          <GuideListItem
            key={entry.id}
            badge={entry.category}
            onPress={() =>
              navigation.navigate('GuideDetail', {
                categoryKey,
                entryId: entry.id,
              })
            }
            summary={entry.shortDescription}
            title={entry.name}
          />
        ))}
      </View>
    </ScreenContainer>
  );
}
