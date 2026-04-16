import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ScanHomeScreen } from '../screens/ScanHomeScreen';

export type ScanNavigatorParamList = {
  ScanHome: undefined;
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
    </Stack.Navigator>
  );
}
