import { ComponentProps, useCallback, useEffect, useState } from 'react';

import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Pressable, Text, View } from 'react-native';

import { HeaderBlock } from '../components/ui/HeaderBlock';
import { ScreenContainer } from '../components/ui/ScreenContainer';
import { SectionCard } from '../components/ui/SectionCard';
import { getPlannerHistory } from '../features/planner/services/plannerStorage';
import { getScanClientId } from '../features/scan/services/scanClientIdentity';
import { getScanHistory } from '../features/scan/services/scanStorage';
import { useAppLanguage, type AppLanguage } from '../localization/appLanguage';
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
        description: 'Local records, scan image use, and device storage.',
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

function MoreListRow({ item, onPress }: { item: MoreItem; onPress: () => void }) {
  const { t } = useAppLanguage();

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
        <Text className="text-base font-semibold text-ink-900">{t(item.title)}</Text>
        <Text className="mt-1 text-xs leading-5 text-ink-700">{t(item.description)}</Text>
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
  const { t } = useAppLanguage();

  return (
    <SectionCard>
      <View className="gap-3">
        <View>
          <Text className="text-sm font-semibold uppercase tracking-[2px] text-brand-700">
            {t(section.title)}
          </Text>
          <Text className="mt-2 text-sm leading-6 text-ink-700">{t(section.description)}</Text>
        </View>

        {section.items.map((item) => (
          <MoreListRow key={item.route} item={item} onPress={() => onNavigate(item.route)} />
        ))}
      </View>
    </SectionCard>
  );
}

function LanguageCard() {
  const { language, setLanguage, t } = useAppLanguage();

  const options: Array<{ code: AppLanguage; label: string }> = [
    { code: 'en', label: t('English') },
    { code: 'fil', label: t('Filipino') },
  ];

  return (
    <SectionCard tone="muted">
      <View className="gap-3">
        <View className="flex-row items-start gap-3">
          <View className="h-11 w-11 items-center justify-center rounded-full bg-white">
            <Ionicons color="#2d6033" name="language-outline" size={21} />
          </View>
          <View className="flex-1">
            <Text className="text-base font-semibold text-ink-900">{t('Language / Wika')}</Text>
            <Text className="mt-1 text-sm leading-6 text-ink-700">
              {t('Choose your app language.')}
            </Text>
          </View>
        </View>

        <View className="flex-row rounded-[18px] bg-white p-1">
          {options.map((option) => {
            const selected = language === option.code;

            return (
              <Pressable
                accessibilityRole="button"
                className={`flex-1 items-center rounded-[14px] px-3 py-3 ${
                  selected ? 'bg-brand-600' : 'bg-transparent'
                }`}
                key={option.code}
                onPress={() => setLanguage(option.code)}
              >
                <Text className={`text-sm font-semibold ${selected ? 'text-white' : 'text-ink-700'}`}>
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </SectionCard>
  );
}

function DeviceCodeCard() {
  const { t } = useAppLanguage();
  const [deviceCode, setDeviceCode] = useState('');

  useEffect(() => {
    let active = true;

    getScanClientId().then((clientId) => {
      if (active) {
        setDeviceCode(clientId);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  return (
    <SectionCard>
      <View className="flex-row items-start gap-3">
        <View className="h-11 w-11 items-center justify-center rounded-full bg-brand-50">
          <Ionicons color="#2d6033" name="key-outline" size={21} />
        </View>
        <View className="flex-1">
          <Text className="text-base font-semibold text-ink-900">{t('Device code')}</Text>
          <Text className="mt-1 text-sm leading-6 text-ink-700">
            {t('Use this code when requesting more scans.')}
          </Text>
          <View className="mt-3 rounded-[16px] bg-brand-50 px-4 py-3">
            <Text selectable className="text-sm font-semibold text-brand-800">
              {deviceCode || t('Loading code')}
            </Text>
          </View>
        </View>
      </View>
    </SectionCard>
  );
}

export function MoreScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { t } = useAppLanguage();
  const [scanRecordCount, setScanRecordCount] = useState(0);
  const [plannerRecordCount, setPlannerRecordCount] = useState(0);
  const totalRecordCount = scanRecordCount + plannerRecordCount;
  const savedRecordLabel = buildCountLabel(totalRecordCount, 'saved record', 'saved records');
  const savedRecordSummary = `${buildCountLabel(scanRecordCount, 'scan', 'scans')} - ${buildCountLabel(
    plannerRecordCount,
    'calendar',
    'calendars',
  )}`;

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
        eyebrow={t('More')}
        title={t('Records and Help')}
        description={t('Find saved scans, crop calendars, privacy notes, and app references.')}
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
              {t('Saved Records')}
            </Text>
            <Text className="mt-2 text-2xl font-semibold text-white">{savedRecordLabel}</Text>
            <Text className="mt-2 text-sm leading-6 text-white/85">{savedRecordSummary}</Text>
          </View>
          <Ionicons color="white" name="chevron-forward" size={24} />
        </View>
      </Pressable>

      <View className="mt-5">
        <LanguageCard />
      </View>

      <View className="mt-5">
        <DeviceCodeCard />
      </View>

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
