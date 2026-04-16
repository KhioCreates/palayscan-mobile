import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { PlannerSchedule } from '../types';
import { PlannerHomeScreen } from '../screens/PlannerHomeScreen';
import { PlannerScheduleScreen } from '../screens/PlannerScheduleScreen';

export type PlannerNavigatorParamList = {
  PlannerHome: undefined;
  PlannerSchedule: {
    schedule: PlannerSchedule;
  };
};

const Stack = createNativeStackNavigator<PlannerNavigatorParamList>();

export function PlannerNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#f4f8f1' },
      }}
    >
      <Stack.Screen component={PlannerHomeScreen} name="PlannerHome" />
      <Stack.Screen component={PlannerScheduleScreen} name="PlannerSchedule" />
    </Stack.Navigator>
  );
}
