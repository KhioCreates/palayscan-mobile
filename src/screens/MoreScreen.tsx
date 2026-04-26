import { ComponentProps, useCallback, useState } from 'react';

import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Pressable, Text, View } from 'react-native';

import { HeaderBlock } from '../components/ui/HeaderBlock';
import { ScreenContainer } from '../components/ui/ScreenContainer';
import { SectionCard } from '../components/ui/SectionCard';
import { getPlannerHistory } from '../features/planner/services/plannerStorage';
import { getScanHistory } from '../features/scan/services/scanStorage';
import { RootStackParamList } from '../navigation/RootNavigator';

type MoreRouteName =
  | 'History'
  | 'About'
  | 'DataPrivacy'
  | 'ScanDisclaimer'
  | 'PlannerDisclaimer'
  | 'References';

type MoreItem = {
  title: string;
  description: string;
  icon: ComponentProps<typeof Ionicons>['name'];
  route: MoreRouteName;
};

type MoreSection = {
  title: string;
  description: string;
  items: MoreItem[];
};

const moreSections: MoreSection[] = [
  {
    title: 'Safety and Privacy',
    description: 'Quick reminders before relying on scan or planner outputs.',
    items: [
      {
        title: 'Data Privacy',
        description: 'Local records, live scan image use, and device storage.',
        icon: 'shield-checkmark-outline',
        route: 'DataPrivacy',
      },
      {
        title: 'Scan Disclaimer',
        description: 'Image checks are a guide and should be verified in the field.',
        icon: 'scan-outline',
        route: 'ScanDisclaimer',
      },
      {
        title: 'Planner Disclaimer',
        description: 'Crop calendars are estimates and can be adjusted.',
        icon: 'calendar-outline',
        route: 'PlannerDisclaimer',
      },
    ],
  },
  {
    title: 'About PALAYSCAN',
    description: 'Project details and app scope.',
    items: [
      {
        title: 'About the App',
        description: 'Project team, technology credits, and what PALAYSCAN can do.',
        icon: 'information-circle-outline',
        route: 'About',
      },
    ],
  },
  {
    title: 'References',
    description: 'Agriculture basis used by the guide and planner.',
    items: [
      {
        title: 'Reference Sources',
        description: 'Sources used for guide wording and crop calendar logic.',
        icon: 'book-outline',
        route: 'References',
      },
    ],
  },
];

const scanMode = process.env.EXPO_PUBLIC_SCAN_MODE === 'live' ? 'live' : 'mock';

function MoreListRow({ item, onPress }: { item: MoreItem; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      className="flex-row items-center gap-3 rounded-[18px] px-2 py-4 active:bg-brand-50"
      onPress={onPress}
    >
      <View className="h-11 w-11 items-center justify-center rounded-full bg-brand-50">
        <Ionicons color="#2d6033" name={item.icon} size={21} />
      </View>
      <View className="flex-1">
        <Text className="text-base font-semibold text-ink-900">{item.title}</Text>
        <Text className="mt-1 text-xs leading-5 text-ink-700">{item.description}</Text>
      </View>
      <Ionicons color="#2d6033" name="chevron-forward" size={19} />
    </Pressable>
  );
}

function buildCountLabel(count: number, singular: string, plural: string) {
  return `${count} ${count === 1 ? singular : plural}`;
}

function MoreSectionGroup({
  section,
  onNavigate,
}: {
  section: MoreSection;
  onNavigate: (route: MoreRouteName) => void;
}) {
  return (
    <SectionCard>
      <View className="gap-3">
        <View>
          <Text className="text-sm font-semibold uppercase tracking-[2px] text-brand-700">
            {section.title}
          </Text>
          <Text className="mt-2 text-sm leading-6 text-ink-700">{section.description}</Text>
        </View>

        {section.items.map((item) => (
          <MoreListRow key={item.route} item={item} onPress={() => onNavigate(item.route)} />
        ))}
      </View>
    </SectionCard>
  );
}

export function MoreScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [scanRecordCount, setScanRecordCount] = useState(0);
  const [plannerRecordCount, setPlannerRecordCount] = useState(0);
  const totalRecordCount = scanRecordCount + plannerRecordCount;
  const savedRecordLabel = buildCountLabel(totalRecordCount, 'saved record', 'saved records');
  const savedRecordSummary = `${buildCountLabel(scanRecordCount, 'scan', 'scans')} - ${buildCountLabel(
    plannerRecordCount,
    'calendar',
    'calendars',
  )}`;
  const scanModeLabel = scanMode === 'live' ? 'Live scan is on' : 'Mock scan is on';
  const scanModeDescription =
    scanMode === 'live'
      ? 'Clear rice photos may be checked online through the configured crop.health service.'
      : 'This build uses local demo scan output.';

  useFocusEffect(
    useCallback(() => {
      let active = true;

      Promise.all([getScanHistory(), getPlannerHistory()]).then(([scanRecords, plannerRecords]) => {
        if (!active) {
          return;
        }

        setScanRecordCount(scanRecords.length);
        setPlannerRecordCount(plannerRecords.length);
      });

      return () => {
        active = false;
      };
    }, []),
  );

  const handleNavigate = (route: MoreRouteName) => {
    switch (route) {
      case 'History':
        navigation.navigate('History');
        break;
      case 'About':
        navigation.navigate('About');
        break;
      case 'DataPrivacy':
        navigation.navigate('DataPrivacy');
        break;
      case 'ScanDisclaimer':
        navigation.navigate('ScanDisclaimer');
        break;
      case 'PlannerDisclaimer':
        navigation.navigate('PlannerDisclaimer');
        break;
      case 'References':
        navigation.navigate('References');
        break;
    }
  };

  return (
    <ScreenContainer bottomSpacing="roomy">
      <HeaderBlock
        eyebrow="More"
        title="Records and Help"
        description="Find saved scans, crop calendars, privacy notes, and app references."
      />

      <Pressable
        accessibilityRole="button"
        className="rounded-[28px] bg-brand-600 p-5 shadow-soft active:bg-brand-700"
        onPress={() => handleNavigate('History')}
      >
        <View className="flex-row items-start gap-4">
          <View className="h-14 w-14 items-center justify-center rounded-full bg-white/15">
            <Ionicons color="white" name="time-outline" size={26} />
          </View>
          <View className="flex-1">
            <Text className="text-xs font-semibold uppercase tracking-[2px] text-white/80">
              Saved Records
            </Text>
            <Text className="mt-2 text-2xl font-semibold text-white">{savedRecordLabel}</Text>
            <Text className="mt-2 text-sm leading-6 text-white/85">{savedRecordSummary}</Text>
          </View>
          <Ionicons color="white" name="chevron-forward" size={24} />
        </View>
      </Pressable>

      <SectionCard tone="muted">
        <View className="flex-row items-start gap-3">
          <View className="h-11 w-11 items-center justify-center rounded-full bg-white">
            <Ionicons
              color="#2d6033"
              name={scanMode === 'live' ? 'cloud-upload-outline' : 'phone-portrait-outline'}
              size={21}
            />
          </View>
          <View className="flex-1">
            <Text className="text-base font-semibold text-ink-900">{scanModeLabel}</Text>
            <Text className="mt-1 text-sm leading-6 text-ink-700">{scanModeDescription}</Text>
          </View>
        </View>
      </SectionCard>

      <View className="mt-5 gap-4">
        {moreSections.map((section) => (
          <MoreSectionGroup
            key={section.title}
            onNavigate={handleNavigate}
            section={section}
          />
        ))}
      </View>
    </ScreenContainer>
  );
}
