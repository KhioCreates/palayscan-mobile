import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useMemo, useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';

import { ScreenContainer } from '../components/ui/ScreenContainer';
import { SectionCard } from '../components/ui/SectionCard';
import { getPlannerHistory } from '../features/planner/services/plannerStorage';
import { PlannedActivity, SavedPlannerRecord } from '../features/planner/types';
import { formatDate, fromIsoDate } from '../features/planner/utils/date';
import { GuideCollectionKey } from '../features/guide/types';
import { useAppLanguage, type Translator } from '../localization/appLanguage';

type HomeScreenProps = {
  openGuideSection: (categoryKey: GuideCollectionKey) => void;
  openPlannerRecord: (recordId: string) => void;
};

type PlannerDashboardItem = {
  activity?: PlannedActivity;
  recordId?: string;
  recordTitle?: string;
  statusLabel: string;
  title: string;
  description: string;
};

type PlannerDashboardSummary = {
  calendarCount: number;
  upcomingCount: number;
};

type PlannerInsight = 'calendars' | 'activities';

type UpcomingActivitySummary = {
  id: string;
  recordId: string;
  statusLabel: string;
  title: string;
  windowLabel: string;
  recordTitle: string;
};

const guideStats = [
  { categoryKey: 'varieties', labelKey: 'Palay varieties', value: '15' },
  { categoryKey: 'pests', labelKey: 'Pests', value: '15' },
  { categoryKey: 'diseases', labelKey: 'Diseases', value: '15' },
] satisfies Array<{
  categoryKey: GuideCollectionKey;
  labelKey: string;
  value: string;
}>;

const palayscanLogo = require('../../assets/brand/palayscan-logo.png');

const dayInMs = 1000 * 60 * 60 * 24;

function normalizeDate(date: Date) {
  const normalized = new Date(date);
  normalized.setHours(12, 0, 0, 0);
  return normalized;
}

function getDaysBetween(firstDate: Date, secondDate: Date) {
  return Math.round((normalizeDate(firstDate).getTime() - normalizeDate(secondDate).getTime()) / dayInMs);
}

function getRelativeDayLabel(daysAway: number, t: Translator) {
  if (daysAway === 0) {
    return t('Today');
  }

  return daysAway === 1 ? t('Tomorrow') : t('In {days} days', { days: daysAway });
}

function getPlannerDashboardItem(records: SavedPlannerRecord[], t: Translator): PlannerDashboardItem {
  if (records.length === 0) {
    return {
      statusLabel: t('Not set'),
      title: t('No crop calendar yet'),
      description: t('Create one in Planner to see your next farm activity here.'),
    };
  }

  const today = normalizeDate(new Date());
  const activities = records.flatMap((record) =>
    record.activities.map((activity) => ({
      activity,
      record,
      startDate: fromIsoDate(activity.startDate),
      endDate: fromIsoDate(activity.endDate),
    })),
  );

  const activeActivity = activities
    .filter((item) => today >= item.startDate && today <= item.endDate)
    .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())[0];

  if (activeActivity) {
    return {
      activity: activeActivity.activity,
      recordId: activeActivity.record.id,
      recordTitle: t(activeActivity.record.title),
      statusLabel: t('Today'),
      title: t(activeActivity.activity.title),
      description: activeActivity.activity.windowLabel,
    };
  }

  const nextActivity = activities
    .filter((item) => item.startDate > today)
    .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())[0];

  if (nextActivity) {
    const daysAway = getDaysBetween(nextActivity.startDate, today);

    return {
      activity: nextActivity.activity,
      recordId: nextActivity.record.id,
      recordTitle: t(nextActivity.record.title),
      statusLabel: getRelativeDayLabel(daysAway, t),
      title: t(nextActivity.activity.title),
      description: nextActivity.activity.windowLabel,
    };
  }

  const latestRecord = records[0];

  return {
    recordId: latestRecord.id,
    recordTitle: t(latestRecord.title),
    statusLabel: t('Complete'),
    title: t('Crop calendar completed'),
    description: t('Last planting date: {date}', {
      date: formatDate(fromIsoDate(latestRecord.plantingDate)),
    }),
  };
}

function getPlannerDashboardSummary(records: SavedPlannerRecord[]): PlannerDashboardSummary {
  const today = normalizeDate(new Date());
  const upcomingCount = records.reduce((count, record) => {
    const recordUpcomingCount = record.activities.filter(
      (activity) => fromIsoDate(activity.endDate) >= today,
    ).length;

    return count + recordUpcomingCount;
  }, 0);

  return {
    calendarCount: records.length,
    upcomingCount,
  };
}

function getUpcomingActivityItems(
  records: SavedPlannerRecord[],
  t: Translator,
  limit = 3,
): UpcomingActivitySummary[] {
  const today = normalizeDate(new Date());

  return records
    .flatMap((record) =>
      record.activities.map((activity) => {
        const startDate = fromIsoDate(activity.startDate);
        const endDate = fromIsoDate(activity.endDate);
        const daysAway = getDaysBetween(startDate, today);
        const activeToday = today >= startDate && today <= endDate;

        return {
          id: `${record.id}-${activity.id}`,
          recordId: record.id,
          startDate,
          endDate,
          statusLabel: activeToday ? t('Today') : getRelativeDayLabel(daysAway, t),
          title: t(activity.title),
          windowLabel: activity.windowLabel,
          recordTitle: t(record.title),
        };
      }),
    )
    .filter((item) => item.endDate >= today)
    .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
    .slice(0, limit);
}

export function HomeScreen({ openGuideSection, openPlannerRecord }: HomeScreenProps) {
  const { t } = useAppLanguage();
  const [plannerRecords, setPlannerRecords] = useState<SavedPlannerRecord[]>([]);
  const [selectedPlannerInsight, setSelectedPlannerInsight] = useState<PlannerInsight>('activities');
  const [selectedPlannerRecordId, setSelectedPlannerRecordId] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      getPlannerHistory().then((records) => {
        if (active) {
          setPlannerRecords(records);
          setSelectedPlannerRecordId((currentRecordId) =>
            currentRecordId && records.some((record) => record.id === currentRecordId)
              ? currentRecordId
              : null,
          );
        }
      });

      return () => {
        active = false;
      };
    }, []),
  );

  const selectedPlannerRecord = useMemo(
    () => plannerRecords.find((record) => record.id === selectedPlannerRecordId),
    [plannerRecords, selectedPlannerRecordId],
  );
  const focusedPlannerRecords = useMemo(
    () => (selectedPlannerRecord ? [selectedPlannerRecord] : plannerRecords),
    [plannerRecords, selectedPlannerRecord],
  );
  const plannerDashboardItem = useMemo(
    () => getPlannerDashboardItem(focusedPlannerRecords, t),
    [focusedPlannerRecords, t],
  );
  const plannerDashboardSummary = useMemo(
    () => getPlannerDashboardSummary(focusedPlannerRecords),
    [focusedPlannerRecords],
  );
  const upcomingActivityItems = useMemo(
    () => getUpcomingActivityItems(focusedPlannerRecords, t),
    [focusedPlannerRecords, t],
  );
  const recentCalendars = useMemo(() => plannerRecords.slice(0, 3), [plannerRecords]);

  return (
    <ScreenContainer bottomSpacing="comfortable" topSpacing="comfortable">
      <View className="gap-5">
        <View className="overflow-hidden rounded-[32px] bg-brand-800 p-5 shadow-soft">
          <View className="absolute -left-10 -top-12 h-32 w-32 rounded-full bg-brand-500/25" />
          <View className="absolute -right-8 -top-10 h-32 w-32 rounded-full bg-white/10" />
          <View className="absolute -bottom-12 -left-16 -right-16 h-36 rounded-t-[110px] bg-brand-600/45" />
          <View className="absolute -bottom-6 -left-20 -right-14 h-28 rounded-t-[100px] border-t border-white/10 bg-brand-500/20" />
          <View className="absolute bottom-8 -left-10 -right-24 h-20 rounded-t-[80px] border-t border-earth-300/20 bg-earth-300/10" />
          <View className="absolute bottom-24 right-8 h-16 w-16 rounded-full bg-earth-300/10" />

          <View className="relative z-10 items-center gap-4">
            <View className="items-center gap-3">
              <View className="h-20 w-20 items-center justify-center">
                <Image
                  accessibilityIgnoresInvertColors
                  accessibilityLabel="PALAYSCAN logo"
                  className="h-20 w-20"
                  resizeMode="contain"
                  source={palayscanLogo}
                />
              </View>
              <View className="items-center">
                <Text className="text-center text-[32px] font-bold leading-10 tracking-[1px] text-white">
                  PALAYSCAN
                </Text>
                <Text className="mt-1 text-center text-sm font-semibold uppercase tracking-[1.8px] text-white opacity-90">
                  {t('Scan. Guide. Plan.')}
                </Text>
              </View>
            </View>
          </View>

          <View className="relative z-10 mt-5 flex-row gap-3">
            {guideStats.map((stat) => (
              <Pressable
                accessibilityHint={t('Opens this guide section')}
                accessibilityLabel={t('Open {section} guide section', {
                  section: t(stat.labelKey),
                })}
                accessibilityRole="button"
                className="min-h-[76px] flex-1 rounded-[20px] border border-white/10 bg-white/15 px-3 py-3 active:bg-white/20"
                key={stat.labelKey}
                onPress={() => openGuideSection(stat.categoryKey)}
              >
                <View className="flex-row items-start justify-between gap-2">
                  <Text className="text-xl font-bold text-white">{stat.value}</Text>
                  <Ionicons color="rgba(255,255,255,0.82)" name="chevron-forward" size={15} />
                </View>
                <Text className="mt-1 text-xs leading-4 text-white opacity-90">
                  {t(stat.labelKey)}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <SectionCard>
          <View className="gap-4">
              <View className="flex-row items-start justify-between gap-3">
                <View className="flex-row flex-1 items-start gap-3">
                  <View className="h-12 w-12 items-center justify-center rounded-2xl bg-brand-50">
                    <Ionicons color="#2d6033" name="notifications-outline" size={23} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-xs font-semibold uppercase tracking-[1.5px] text-brand-700">
                      {t('Planner reminder')}
                    </Text>
                    <Text className="mt-1 text-xl font-bold text-ink-900">
                      {plannerDashboardItem.title}
                    </Text>
                    <Text className="mt-1 text-sm leading-6 text-ink-700">
                      {plannerDashboardItem.description}
                    </Text>
                  </View>
                </View>
                <View className="rounded-full bg-brand-100 px-3 py-1">
                  <Text className="text-xs font-semibold text-brand-800">
                    {plannerDashboardItem.statusLabel}
                  </Text>
                </View>
              </View>

              {plannerDashboardItem.recordTitle ? (
                <Pressable
                  accessibilityRole="button"
                  className="rounded-[18px] bg-brand-50 px-4 py-3 active:opacity-90"
                  onPress={() => {
                    if (plannerDashboardItem.recordId) {
                      openPlannerRecord(plannerDashboardItem.recordId);
                    }
                  }}
                >
                  <View className="flex-row items-start justify-between gap-3">
                    <View className="flex-1">
                      <Text className="text-sm font-semibold text-ink-900">
                        {plannerDashboardItem.recordTitle}
                      </Text>
                      <Text className="mt-1 text-xs leading-5 text-ink-700">
                        {selectedPlannerRecord
                          ? t('Focused calendar. Tap to open full details.')
                          : t('Tap to open this saved crop calendar.')}
                      </Text>
                    </View>
                    {selectedPlannerRecord ? (
                      <Pressable
                        accessibilityRole="button"
                        className="rounded-full bg-white px-3 py-1 active:opacity-80"
                        onPress={(event) => {
                          event.stopPropagation();
                          setSelectedPlannerRecordId(null);
                        }}
                      >
                        <Text className="text-[11px] font-semibold text-brand-700">
                          {t('Show all')}
                        </Text>
                      </Pressable>
                    ) : null}
                  </View>
                </Pressable>
              ) : null}

              <View className="flex-row gap-3">
                <Pressable
                  accessibilityRole="button"
                  className={`flex-1 rounded-[18px] px-4 py-3 active:opacity-90 ${
                    selectedPlannerInsight === 'calendars' ? 'bg-brand-600' : 'bg-ink-50'
                  }`}
                  onPress={() => setSelectedPlannerInsight('calendars')}
                >
                  <Text
                    className={`text-lg font-bold ${
                      selectedPlannerInsight === 'calendars' ? 'text-white' : 'text-ink-900'
                    }`}
                  >
                    {plannerRecords.length}
                  </Text>
                  <Text
                    className={`mt-1 text-xs leading-4 ${
                      selectedPlannerInsight === 'calendars' ? 'text-white/90' : 'text-ink-700'
                    }`}
                  >
                    {t('Saved calendars')}
                  </Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  className={`flex-1 rounded-[18px] px-4 py-3 active:opacity-90 ${
                    selectedPlannerInsight === 'activities' ? 'bg-brand-600' : 'bg-ink-50'
                  }`}
                  onPress={() => setSelectedPlannerInsight('activities')}
                >
                  <Text
                    className={`text-lg font-bold ${
                      selectedPlannerInsight === 'activities' ? 'text-white' : 'text-ink-900'
                    }`}
                  >
                    {plannerDashboardSummary.upcomingCount}
                  </Text>
                  <Text
                    className={`mt-1 text-xs leading-4 ${
                      selectedPlannerInsight === 'activities' ? 'text-white/90' : 'text-ink-700'
                    }`}
                  >
                    {selectedPlannerRecord ? t('Focused activities') : t('Upcoming activities')}
                  </Text>
                </Pressable>
              </View>

              <View className="rounded-[20px] bg-brand-50 px-4 py-4">
                {selectedPlannerInsight === 'activities' ? (
                  <View className="gap-3">
                    <View className="flex-row items-center justify-between gap-3">
                      <Text className="text-sm font-semibold text-ink-900">
                        {t('Next activities')}
                      </Text>
                      {plannerDashboardSummary.upcomingCount > 0 ? (
                        <Text className="text-[11px] font-semibold text-brand-700">
                          {t('Showing {shown} of {total}', {
                            shown: upcomingActivityItems.length,
                            total: plannerDashboardSummary.upcomingCount,
                          })}
                        </Text>
                      ) : null}
                    </View>
                    {selectedPlannerRecord ? (
                      <Text className="text-xs leading-5 text-ink-700">
                        {t('Focused on {title}. Use Show all to return to every saved calendar.', {
                          title: t(selectedPlannerRecord.title),
                        })}
                      </Text>
                    ) : null}
                    {upcomingActivityItems.length > 0 ? (
                      upcomingActivityItems.map((item) => (
                        <Pressable
                          accessibilityRole="button"
                          className="rounded-[16px] bg-white px-3 py-3 active:opacity-90"
                          key={item.id}
                          onPress={() => openPlannerRecord(item.recordId)}
                        >
                          <View className="flex-row items-start justify-between gap-3">
                            <View className="flex-1">
                              <Text className="text-sm font-semibold text-ink-900">{item.title}</Text>
                              <Text className="mt-1 text-xs leading-5 text-ink-700">
                                {item.windowLabel}
                              </Text>
                              <Text className="mt-1 text-xs leading-5 text-brand-700">
                                {item.recordTitle}
                              </Text>
                            </View>
                            <View className="rounded-full bg-brand-100 px-2.5 py-1">
                              <Text className="text-[11px] font-semibold text-brand-800">
                                {item.statusLabel}
                              </Text>
                            </View>
                            <Ionicons color="#526552" name="chevron-forward" size={15} />
                          </View>
                        </Pressable>
                      ))
                    ) : (
                      <Text className="text-sm leading-6 text-ink-700">
                        {t('No upcoming planner activities yet.')}
                      </Text>
                    )}
                  </View>
                ) : (
                  <View className="gap-3">
                    <View className="flex-row items-center justify-between gap-3">
                      <Text className="text-sm font-semibold text-ink-900">
                        {t('Recent calendars')}
                      </Text>
                      {plannerRecords.length > 0 ? (
                        <Text className="text-[11px] font-semibold text-brand-700">
                          {t('Showing {shown} of {total}', {
                            shown: recentCalendars.length,
                            total: plannerRecords.length,
                          })}
                        </Text>
                      ) : null}
                    </View>
                    {recentCalendars.length > 0 ? (
                      recentCalendars.map((record) => {
                        const isFocused = selectedPlannerRecordId === record.id;

                        return (
                          <Pressable
                            accessibilityRole="button"
                            className={`rounded-[16px] border px-3 py-3 active:opacity-90 ${
                              isFocused ? 'border-brand-200 bg-brand-50' : 'border-white bg-white'
                            }`}
                            key={record.id}
                            onPress={() => {
                              setSelectedPlannerRecordId(record.id);
                              setSelectedPlannerInsight('activities');
                            }}
                          >
                            <View className="flex-row items-center justify-between gap-3">
                              <View className="flex-1">
                                <Text className="text-sm font-semibold text-ink-900">
                                  {t(record.title)}
                                </Text>
                                <Text className="mt-1 text-xs leading-5 text-ink-700">
                                  {t('Planting date: {date}', {
                                    date: formatDate(fromIsoDate(record.plantingDate)),
                                  })}
                                </Text>
                                <Text className="mt-1 text-xs leading-5 text-brand-700">
                                  {t('{count} activities - {status}', {
                                    count: record.activityCount,
                                    status: isFocused ? t('Focused on Home') : t('Tap to focus'),
                                  })}
                                </Text>
                              </View>
                              <Ionicons
                                color={isFocused ? '#2d6033' : '#526552'}
                                name={isFocused ? 'checkmark-circle' : 'ellipse-outline'}
                                size={18}
                              />
                            </View>
                          </Pressable>
                        );
                      })
                    ) : (
                      <Text className="text-sm leading-6 text-ink-700">
                        {t('No saved crop calendars yet.')}
                      </Text>
                    )}
                  </View>
                )}
                <View className="mt-3 flex-row items-center gap-2">
                  <Ionicons color="#2d6033" name="calendar-outline" size={15} />
                  <Text className="text-xs font-semibold text-brand-700">
                    {plannerRecords.length > 0
                      ? selectedPlannerInsight === 'calendars'
                        ? t('Tap a calendar to focus Home. Open details from the focused card.')
                        : t('Tap an activity to open its saved calendar details.')
                      : t('Use the Planner tab to create your first crop calendar.')}
                  </Text>
                </View>
              </View>
            </View>
          </SectionCard>

        <SectionCard tone="muted">
          <View className="flex-row items-center gap-3">
            <View className="h-10 w-10 items-center justify-center rounded-2xl bg-white">
              <Ionicons color="#2d6033" name="shield-checkmark-outline" size={21} />
            </View>
            <View className="flex-1">
              <Text className="text-base font-semibold text-ink-900">
                {t('Local-first records')}
              </Text>
              <Text className="mt-1 text-sm leading-5 text-ink-700">
                {t('Guide, planner history, and saved scan records are organized for offline review.')}
              </Text>
            </View>
          </View>
        </SectionCard>
      </View>
    </ScreenContainer>
  );
}
