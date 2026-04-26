import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ScanHomeScreen } from '../screens/ScanHomeScreen';
import { ScanResultDetailScreen } from '../screens/ScanResultDetailScreen';
import { ScanMode, ScanResult } from '../types';

export type ScanNavigatorParamList = {
  ScanHome: undefined;
  ScanResultDetail: {
    result: ScanResult;
    mode: ScanMode;
    initialPredictionIndex?: number;
  };
};

const Stack = createNativeStackNavigator<ScanNavigatorParamList>();

export function ScanNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#f4f8f1' },
      }}
    >
      <Stack.Screen component={ScanHomeScreen} name="ScanHome" />
      <Stack.Screen component={ScanResultDetailScreen} name="ScanResultDetail" />
    </Stack.Navigator>
  );
}
