import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { GuideCollectionKey } from '../types';
import { GuideDetailViewScreen } from '../screens/GuideDetailViewScreen';
import { GuideHomeScreen } from '../screens/GuideHomeScreen';
import { GuideListScreen } from '../screens/GuideListScreen';

export type GuideStackParamList = {
  GuideHome: undefined;
  GuideList: {
    categoryKey: GuideCollectionKey;
  };
  GuideDetail: {
    categoryKey: GuideCollectionKey;
    entryId: string;
  };
};

const Stack = createNativeStackNavigator<GuideStackParamList>();

export function GuideNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#f4f8f1' },
      }}
    >
      <Stack.Screen component={GuideHomeScreen} name="GuideHome" />
      <Stack.Screen component={GuideListScreen} name="GuideList" />
      <Stack.Screen component={GuideDetailViewScreen} name="GuideDetail" />
    </Stack.Navigator>
  );
}
