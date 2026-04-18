import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AboutScreen } from '../screens/AboutScreen';
import { GuideNavigator } from '../features/guide/navigation/GuideNavigator';
import { PlannerNavigator } from '../features/planner/navigation/PlannerNavigator';
import { PlannerHistoryDetailScreen } from '../features/planner/screens/PlannerHistoryDetailScreen';
import { ScanHistoryDetailScreen } from '../features/scan/screens/ScanHistoryDetailScreen';
import { ScanNavigator } from '../features/scan/navigation/ScanNavigator';
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
  ScanHistoryDetail: { recordId: string };
  PlannerHistoryDetail: { recordId: string };
};

const Tab = createBottomTabNavigator<RootTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen name="Home">
        {({ navigation }) => <HomeScreen goToTab={(tabName) => navigation.navigate(tabName)} />}
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
          component={ScanHistoryDetailScreen}
          name="ScanHistoryDetail"
          options={{
            title: 'Scan History Detail',
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
