import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AboutScreen } from '../screens/AboutScreen';
import { DataPrivacyScreen } from '../screens/DataPrivacyScreen';
import { PlannerDisclaimerScreen } from '../screens/PlannerDisclaimerScreen';
import { ReferencesScreen } from '../screens/ReferencesScreen';
import { ScanDisclaimerScreen } from '../screens/ScanDisclaimerScreen';
import { GuideNavigator } from '../features/guide/navigation/GuideNavigator';
import { PlannerNavigator } from '../features/planner/navigation/PlannerNavigator';
import { PlannerHistoryDetailScreen } from '../features/planner/screens/PlannerHistoryDetailScreen';
import { ScanHistoryDetailScreen } from '../features/scan/screens/ScanHistoryDetailScreen';
import { ScanResultDetailScreen } from '../features/scan/screens/ScanResultDetailScreen';
import { ScanNavigator } from '../features/scan/navigation/ScanNavigator';
import { ScanMode, ScanResult } from '../features/scan/types';
import { HistoryScreen } from '../screens/HistoryScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { MoreScreen } from '../screens/MoreScreen';
import { CustomTabBar } from './CustomTabBar';

export type RootTabParamList = {
  Home: undefined;
  Guide: undefined;
  Scan: undefined;
  Planner: undefined;
  More: undefined;
};

export type RootStackParamList = {
  MainTabs: undefined;
  History: undefined;
  About: undefined;
  DataPrivacy: undefined;
  ScanDisclaimer: undefined;
  PlannerDisclaimer: undefined;
  References: undefined;
  ScanHistoryDetail: { recordId: string };
  ScanResultDetail: {
    result: ScanResult;
    mode: ScanMode;
    initialPredictionIndex?: number;
  };
  PlannerHistoryDetail: { recordId: string };
};

const Tab = createBottomTabNavigator<RootTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

function MainTabs() {
  const rootNavigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen name="Home">
        {() => (
          <HomeScreen
            openPlannerRecord={(recordId) =>
              rootNavigation.navigate('PlannerHistoryDetail', { recordId })
            }
          />
        )}
      </Tab.Screen>
      <Tab.Screen component={GuideNavigator} name="Guide" />
      <Tab.Screen component={ScanNavigator} name="Scan" />
      <Tab.Screen component={PlannerNavigator} name="Planner" />
      <Tab.Screen component={MoreScreen} name="More" />
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          contentStyle: { backgroundColor: '#f4f8f1' },
          headerBackButtonDisplayMode: 'minimal',
          headerShadowVisible: false,
          headerStyle: { backgroundColor: '#f4f8f1' },
          headerTintColor: '#1b241c',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontWeight: '700',
            fontSize: 17,
          },
        }}
      >
        <Stack.Screen component={MainTabs} name="MainTabs" options={{ headerShown: false }} />
        <Stack.Screen
          component={HistoryScreen}
          name="History"
          options={{
            title: 'History',
          }}
        />
        <Stack.Screen
          component={AboutScreen}
          name="About"
          options={{
            title: 'About PALAYSCAN',
          }}
        />
        <Stack.Screen
          component={DataPrivacyScreen}
          name="DataPrivacy"
          options={{
            title: 'Data Privacy',
          }}
        />
        <Stack.Screen
          component={ScanDisclaimerScreen}
          name="ScanDisclaimer"
          options={{
            title: 'Scan Disclaimer',
          }}
        />
        <Stack.Screen
          component={PlannerDisclaimerScreen}
          name="PlannerDisclaimer"
          options={{
            title: 'Planner Disclaimer',
          }}
        />
        <Stack.Screen
          component={ReferencesScreen}
          name="References"
          options={{
            title: 'References and Basis',
          }}
        />
        <Stack.Screen
          component={ScanHistoryDetailScreen}
          name="ScanHistoryDetail"
          options={{
            title: 'Scan History Detail',
          }}
        />
        <Stack.Screen
          component={ScanResultDetailScreen}
          name="ScanResultDetail"
          options={{
            title: 'Scan Result Detail',
          }}
        />
        <Stack.Screen
          component={PlannerHistoryDetailScreen}
          name="PlannerHistoryDetail"
          options={{
            title: 'Planner History Detail',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
