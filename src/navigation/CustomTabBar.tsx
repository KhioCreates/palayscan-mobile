import { Ionicons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { RootTabParamList } from './RootNavigator';

const tabIcons: Record<keyof RootTabParamList, keyof typeof Ionicons.glyphMap> = {
  Home: 'home-outline',
  Guide: 'book-outline',
  Scan: 'scan-outline',
  Planner: 'calendar-outline',
  More: 'grid-outline',
};

const tabLabels: Record<keyof RootTabParamList, string> = {
  Home: 'Home',
  Guide: 'Guide',
  Scan: 'Scan',
  Planner: 'Planner',
  More: 'More',
};

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      pointerEvents="box-none"
      style={{
        paddingBottom: Math.max(insets.bottom, 10),
        paddingHorizontal: 16,
        paddingTop: 8,
        backgroundColor: 'transparent',
      }}
    >
      <View
        className="rounded-[28px] border border-brand-100/80 bg-white px-3 pt-2.5 shadow-soft"
        style={{
          minHeight: 72,
        }}
      >
        <View className="flex-row items-end justify-between">
          {state.routes.map((route, index) => {
            const isFocused = state.index === index;
            const label = tabLabels[route.name as keyof RootTabParamList];
            const iconName = tabIcons[route.name as keyof RootTabParamList];
            const isScan = route.name === 'Scan';

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name, route.params);
              }
            };

            const onLongPress = () => {
              navigation.emit({
                type: 'tabLongPress',
                target: route.key,
              });
            };

            const accessibilityLabel = descriptors[route.key].options.tabBarAccessibilityLabel;

            if (isScan) {
              return (
                <View key={route.key} className="mt-[-38px] items-center">
                  <Pressable
                    accessibilityLabel={accessibilityLabel}
                    accessibilityRole="button"
                    className="h-[70px] w-[70px] items-center justify-center rounded-full border-[6px] border-white bg-brand-600 active:bg-brand-700"
                    style={{
                      shadowColor: '#1f4f2a',
                      shadowOffset: { width: 0, height: 12 },
                      shadowOpacity: 0.2,
                      shadowRadius: 18,
                      elevation: 10,
                    }}
                    onLongPress={onLongPress}
                    onPress={onPress}
                  >
                    <Ionicons color="white" name={iconName} size={30} />
                  </Pressable>
                  <Text
                    className={`mt-1.5 text-[11px] font-semibold ${
                      isFocused ? 'text-brand-700' : 'text-ink-500'
                    }`}
                  >
                    {label}
                  </Text>
                </View>
              );
            }

            return (
              <Pressable
                key={route.key}
                accessibilityLabel={accessibilityLabel}
                accessibilityRole="button"
                className="min-h-[56px] flex-1 items-center justify-end pb-1.5"
                onLongPress={onLongPress}
                onPress={onPress}
              >
                <View
                  className={`items-center rounded-full px-3 py-1.5 ${
                    isFocused ? 'bg-brand-50/80' : 'bg-transparent'
                  }`}
                >
                  <Ionicons
                    color={isFocused ? '#2d6033' : '#6c7d6c'}
                    name={iconName}
                    size={21}
                  />
                  <Text
                    className={`mt-1 text-[11px] font-semibold ${
                      isFocused ? 'text-brand-700' : 'text-ink-500'
                    }`}
                  >
                    {label}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}
