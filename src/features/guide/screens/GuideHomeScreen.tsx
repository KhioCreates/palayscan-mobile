import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { View } from 'react-native';

import { HeaderBlock } from '../../../components/ui/HeaderBlock';
import { ScreenContainer } from '../../../components/ui/ScreenContainer';
import { guideCategoryMeta, guideData } from '../data';
import { GuideCategoryCard } from '../components/GuideCategoryCard';
import { GuideCollectionKey } from '../types';
import { GuideStackParamList } from '../navigation/GuideNavigator';

type GuideHomeScreenProps = NativeStackScreenProps<GuideStackParamList, 'GuideHome'>;

export function GuideHomeScreen({ navigation }: GuideHomeScreenProps) {
  return (
    <ScreenContainer bottomSpacing="comfortable">
      <HeaderBlock
        eyebrow="Guide Module"
        title="Palay field guide"
        description="Browse palay varieties, pests, and diseases with clear notes and field reference photos."
      />

      <View className="gap-4">
        {guideCategoryMeta.map((section) => (
          <GuideCategoryCard
            key={section.key}
            category={section.category}
            count={guideData[section.key].length}
            description={section.description}
            onPress={() =>
              navigation.navigate('GuideList', {
                categoryKey: section.key as GuideCollectionKey,
              })
            }
            title={section.title}
          />
        ))}
      </View>
    </ScreenContainer>
  );
}
