import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { ScreenContainer } from '../components/ui/ScreenContainer';
import { SectionCard } from '../components/ui/SectionCard';
import { getPlannerHistory } from '../features/planner/services/plannerStorage';
import { PlannedActivity, SavedPlannerRecord } from '../features/planner/types';
import { formatDate, fromIsoDate } from '../features/planner/utils/date';

type HomeScreenProps = {
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
  { label: 'Palay varieties', value: '15' },
  { label: 'Pests', value: '15' },
  { label: 'Diseases', value: '15' },
];

const dayInMs = 1000 * 60 * 60 * 24;

function normalizeDate(date: Date) {
  const normalized = new Date(date);
  normalized.setHours(12, 0, 0, 0);
  return normalized;
}

function getDaysBetween(firstDate: Date, secondDate: Date) {
  return Math.round((normalizeDate(firstDate).getTime() - normalizeDate(secondDate).getTime()) / dayInMs);
}

function getPlannerDashboardItem(records: SavedPlannerRecord[]): PlannerDashboardItem {
  if (records.length === 0) {
    return {
      statusLabel: 'Not set',
      title: 'No crop calendar yet',
      description: 'Create one in Planner to see your next farm activity here.',
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
      recordTitle: activeActivity.record.title,
      statusLabel: 'Today',
      title: activeActivity.activity.title,
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
      recordTitle: nextActivity.record.title,
      statusLabel: daysAway === 1 ? 'Tomorrow' : `In ${daysAway} days`,
      title: nextActivity.activity.title,
      description: nextActivity.activity.windowLabel,
    };
  }

  const latestRecord = records[0];

  return {
    recordId: latestRecord.id,
    recordTitle: latestRecord.title,
    statusLabel: 'Complete',
    title: 'Crop calendar completed',
    description: `Last planting date: ${formatDate(fromIsoDate(latestRecord.plantingDate))}`,
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

function getUpcomingActivityItems(records: SavedPlannerRecord[], limit = 3): UpcomingActivitySummary[] {
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
          statusLabel: activeToday ? 'Today' : daysAway === 1 ? 'Tomorrow' : `In ${daysAway} days`,
          title: activity.title,
          windowLabel: activity.windowLabel,
          recordTitle: record.title,
        };
      }),
    )
    .filter((item) => item.endDate >= today)
    .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
    .slice(0, limit);
}

export function HomeScreen({ openPlannerRecord }: HomeScreenProps) {
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
    () => getPlannerDashboardItem(focusedPlannerRecords),
    [focusedPlannerRecords],
  );
  const plannerDashboardSummary = useMemo(
    () => getPlannerDashboardSummary(focusedPlannerRecords),
    [focusedPlannerRecords],
  );
  const upcomingActivityItems = useMemo(
    () => getUpcomingActivityItems(focusedPlannerRecords),
    [focusedPlannerRecords],
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
          <View className="absolute right-5 top-5 h-12 w-12 items-center justify-center rounded-full bg-white/10">
            <Ionicons color="rgba(255,255,255,0.72)" name="leaf-outline" size={22} />
          </View>

          <View className="relative z-10 max-w-[315px] gap-4">
            <View className="flex-row items-center gap-3">
              <View className="h-14 w-14 items-center justify-center rounded-[22px] border border-white/15 bg-white/15">
                <Ionicons color="white" name="scan-outline" size={26} />
              </View>
              <View className="flex-1">
                <Text className="text-[30px] font-bold leading-9 tracking-[1px] text-white">
                  PALAYSCAN
                </Text>
                <Text className="mt-1 text-sm font-semibold uppercase tracking-[1.8px] text-white opacity-90">
                  Scan. Guide. Plan.
                </Text>
              </View>
            </View>

            <Text className="text-base leading-6 text-white opacity-90">
              Rice support for field checking and estimated farm activities.
            </Text>
          </View>

          <View className="relative z-10 mt-5 flex-row gap-3">
            {guideStats.map((stat) => (
              <View
                className="flex-1 rounded-[20px] border border-white/10 bg-white/15 px-3 py-3"
                key={stat.label}
              >
                <Text className="text-xl font-bold text-white">{stat.value}</Text>
                <Text className="mt-1 text-xs leading-4 text-white opacity-90">{stat.label}</Text>
              </View>
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
                      Planner reminder
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
                          ? 'Focused calendar. Tap to open full details.'
                          : 'Tap to open this saved crop calendar.'}
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
                        <Text className="text-[11px] font-semibold text-brand-700">Show all</Text>
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
                    Saved calendars
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
                    {selectedPlannerRecord ? 'Focused activities' : 'Upcoming activities'}
                  </Text>
                </Pressable>
              </View>

              <View className="rounded-[20px] bg-brand-50 px-4 py-4">
                {selectedPlannerInsight === 'activities' ? (
                  <View className="gap-3">
                    <View className="flex-row items-center justify-between gap-3">
                      <Text className="text-sm font-semibold text-ink-900">Next activities</Text>
                      {plannerDashboardSummary.upcomingCount > 0 ? (
                        <Text className="text-[11px] font-semibold text-brand-700">
                          Showing {upcomingActivityItems.length} of{' '}
                          {plannerDashboardSummary.upcomingCount}
                        </Text>
                      ) : null}
                    </View>
                    {selectedPlannerRecord ? (
                      <Text className="text-xs leading-5 text-ink-700">
                        Focused on {selectedPlannerRecord.title}. Use Show all to return to every
                        saved calendar.
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
                        No upcoming planner activities yet.
                      </Text>
                    )}
                  </View>
                ) : (
                  <View className="gap-3">
                    <View className="flex-row items-center justify-between gap-3">
                      <Text className="text-sm font-semibold text-ink-900">Recent calendars</Text>
                      {plannerRecords.length > 0 ? (
                        <Text className="text-[11px] font-semibold text-brand-700">
                          Showing {recentCalendars.length} of {plannerRecords.length}
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
                                  {record.title}
                                </Text>
                                <Text className="mt-1 text-xs leading-5 text-ink-700">
                                  Planting date: {formatDate(fromIsoDate(record.plantingDate))}
                                </Text>
                                <Text className="mt-1 text-xs leading-5 text-brand-700">
                                  {record.activityCount} activities -{' '}
                                  {isFocused ? 'Focused on Home' : 'Tap to focus'}
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
                        No saved crop calendars yet.
                      </Text>
                    )}
                  </View>
                )}
                <View className="mt-3 flex-row items-center gap-2">
                  <Ionicons color="#2d6033" name="calendar-outline" size={15} />
                  <Text className="text-xs font-semibold text-brand-700">
                    {plannerRecords.length > 0
                      ? selectedPlannerInsight === 'calendars'
                        ? 'Tap a calendar to focus Home. Open details from the focused card.'
                        : 'Tap an activity to open its saved calendar details.'
                      : 'Use the Planner tab to create your first crop calendar.'}
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
              <Text className="text-base font-semibold text-ink-900">Local-first records</Text>
              <Text className="mt-1 text-sm leading-5 text-ink-700">
                Guide, planner history, and saved scan records are organized for offline review.
              </Text>
            </View>
          </View>
        </SectionCard>
      </View>
    </ScreenContainer>
  );
}
