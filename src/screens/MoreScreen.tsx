import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Text, View } from 'react-native';

import { HeaderBlock } from '../components/ui/HeaderBlock';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { ScreenContainer } from '../components/ui/ScreenContainer';
import { SectionCard } from '../components/ui/SectionCard';
import { RootStackParamList } from '../navigation/RootNavigator';

export function MoreScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <ScreenContainer>
      <HeaderBlock
        eyebrow="More"
        title="Extra app sections"
        description="This keeps the bottom navigation clean while still giving easy access to supporting screens."
      />

      <SectionCard tone="muted">
        <View className="gap-2">
          <Text className="text-lg font-semibold text-ink-900">Supporting pages</Text>
          <Text className="text-sm leading-6 text-ink-600">
            History and About live here so the main tab bar can focus on the most important farmer
            actions.
          </Text>
        </View>
      </SectionCard>

      <View className="mt-5 gap-4">
        <PrimaryButton
          hint="Review saved scan and planner records."
          icon={<Ionicons color="white" name="time-outline" size={22} />}
          label="Open History"
          onPress={() => navigation.navigate('History')}
        />
        <PrimaryButton
          hint="See project information and acknowledgments."
          icon={<Ionicons color="white" name="information-circle-outline" size={22} />}
          label="Open About"
          onPress={() => navigation.navigate('About')}
        />
      </View>
    </ScreenContainer>
  );
}
