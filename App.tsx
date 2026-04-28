import './global.css';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { RootNavigator } from './src/navigation/RootNavigator';
import { LanguageProvider } from './src/localization/appLanguage';
import { WelcomeScreen } from './src/screens/WelcomeScreen';

const WELCOME_STORAGE_KEY = 'palayscan.welcome.seen.v1';

SplashScreen.setOptions({
  duration: 650,
  fade: true,
});

function AppContent() {
  const [welcomeState, setWelcomeState] = useState<'loading' | 'show' | 'done'>('loading');

  useEffect(() => {
    let active = true;

    AsyncStorage.getItem(WELCOME_STORAGE_KEY)
      .then((storedValue) => {
        if (active) {
          setWelcomeState(storedValue === 'true' ? 'done' : 'show');
        }
      })
      .catch(() => {
        if (active) {
          setWelcomeState('show');
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const handleContinue = () => {
    setWelcomeState('done');
    AsyncStorage.setItem(WELCOME_STORAGE_KEY, 'true').catch(() => {
      // The welcome screen is non-critical; continue even if local storage fails.
    });
  };

  if (welcomeState === 'loading') {
    return <View className="flex-1 bg-[#f4f8f1]" />;
  }

  if (welcomeState === 'show') {
    return <WelcomeScreen onContinue={handleContinue} />;
  }

  return <RootNavigator />;
}

export default function App() {
  return (
    <LanguageProvider>
      <StatusBar style="dark" />
      <AppContent />
    </LanguageProvider>
  );
}
