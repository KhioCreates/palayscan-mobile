import { Image, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppLanguage } from '../localization/appLanguage';

type WelcomeScreenProps = {
  onContinue: () => void;
};

const palayscanLogo = require('../../assets/brand/palayscan-logo.png');

export function WelcomeScreen({ onContinue }: WelcomeScreenProps) {
  const { t } = useAppLanguage();

  return (
    <SafeAreaView className="flex-1 bg-[#f4f8f1]">
      <View className="flex-1 justify-between px-8 py-8">
        <View className="flex-1 items-center justify-center">
          <View className="h-36 w-36 items-center justify-center">
            <Image
              accessibilityIgnoresInvertColors
              accessibilityLabel="PALAYSCAN logo"
              className="h-36 w-36"
              resizeMode="contain"
              source={palayscanLogo}
            />
          </View>

          <Text className="mt-7 text-center text-[38px] font-bold leading-[44px] tracking-[1px] text-brand-900">
            PALAYSCAN
          </Text>
          <Text className="mt-3 text-center text-sm font-semibold uppercase tracking-[2.4px] text-brand-700">
            {t('Scan. Guide. Plan.')}
          </Text>
        </View>

        <Pressable
          accessibilityRole="button"
          className="min-h-[56px] items-center justify-center rounded-full bg-brand-600 px-6 py-4 active:bg-brand-700"
          onPress={onContinue}
        >
          <Text className="text-base font-semibold text-white">{t('Continue')}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
