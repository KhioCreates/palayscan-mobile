import { Ionicons } from '@expo/vector-icons';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { SectionCard } from '../../../components/ui/SectionCard';
import { PlannedActivity } from '../types';
import {
  addDays,
  addMonths,
  formatDate,
  formatMonthYear,
  fromIsoDate,
  isDateWithinRange,
  isSameDay,
  startOfMonth,
  startOfWeek,
  toIsoDate,
} from '../utils/date';

const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

type PlannerCalendarSummaryProps = {
  activities: PlannedActivity[];
  initialFocusDate: string;
  selectedActivityId?: string | null;
  onSelectActivity?: (activityId: string) => void;
  onSelectDate?: (dateIso: string) => void;
  onSelectDateActivityIds?: (activityIds: string[]) => void;
};

function getActivitiesForDate(date: Date, activities: PlannedActivity[]) {
  return activities.filter((activity) =>
    isDateWithinRange(date, fromIsoDate(activity.startDate), fromIsoDate(activity.endDate)),
  );
}

export function PlannerCalendarSummary({
  activities,
  initialFocusDate,
  selectedActivityId,
  onSelectActivity,
  onSelectDate,
  onSelectDateActivityIds,
}: PlannerCalendarSummaryProps) {
  const [visibleMonth, setVisibleMonth] = useState(() => startOfMonth(fromIsoDate(initialFocusDate)));
  const [selectedDateIso, setSelectedDateIso] = useState(initialFocusDate);

  useEffect(() => {
    if (!selectedActivityId) {
      return;
    }

    const matchingActivity = activities.find((activity) => activity.id === selectedActivityId);

    if (!matchingActivity) {
      return;
    }

    setSelectedDateIso(matchingActivity.startDate);
    setVisibleMonth(startOfMonth(fromIsoDate(matchingActivity.startDate)));
  }, [activities, selectedActivityId]);

  const selectedDate = useMemo(() => fromIsoDate(selectedDateIso), [selectedDateIso]);
  const selectedDateActivities = useMemo(
    () => getActivitiesForDate(selectedDate, activities),
    [activities, selectedDate],
  );

  useEffect(() => {
    onSelectDateActivityIds?.(selectedDateActivities.map((activity) => activity.id));
  }, [onSelectDateActivityIds, selectedDateActivities]);

  const calendarDays = useMemo(() => {
    const firstVisibleDate = startOfWeek(startOfMonth(visibleMonth));

    return Array.from({ length: 42 }, (_, index) => addDays(firstVisibleDate, index));
  }, [visibleMonth]);

  return (
    <SectionCard>
      <View className="gap-4">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-lg font-semibold text-ink-900">Calendar Summary</Text>
            <Text className="mt-1 text-sm leading-6 text-ink-600">
              View the estimated crop timeline by month and tap a date to see planned activities.
            </Text>
          </View>
        </View>

        <View className="flex-row items-center justify-between rounded-[20px] bg-brand-50/70 px-4 py-3">
          <Pressable
            accessibilityRole="button"
            className="h-10 w-10 items-center justify-center rounded-full bg-white"
            onPress={() => setVisibleMonth((currentMonth) => addMonths(currentMonth, -1))}
          >
            <Ionicons color="#2d6033" name="chevron-back" size={18} />
          </Pressable>

          <Text className="text-base font-semibold text-ink-900">{formatMonthYear(visibleMonth)}</Text>

          <Pressable
            accessibilityRole="button"
            className="h-10 w-10 items-center justify-center rounded-full bg-white"
            onPress={() => setVisibleMonth((currentMonth) => addMonths(currentMonth, 1))}
          >
            <Ionicons color="#2d6033" name="chevron-forward" size={18} />
          </Pressable>
        </View>

        <View className="gap-2">
          <View className="flex-row">
            {weekdayLabels.map((label) => (
              <View key={label} className="flex-1 items-center py-1">
                <Text className="text-xs font-semibold uppercase tracking-[1px] text-ink-500">
                  {label}
                </Text>
              </View>
            ))}
          </View>

          <View className="gap-2">
            {Array.from({ length: 6 }, (_, weekIndex) => (
              <View className="flex-row gap-2" key={`week-${weekIndex}`}>
                {calendarDays.slice(weekIndex * 7, weekIndex * 7 + 7).map((date) => {
                  const dateActivities = getActivitiesForDate(date, activities);
                  const isCurrentMonth = date.getMonth() === visibleMonth.getMonth();
                  const isSelectedDay = isSameDay(date, selectedDate);
                  const hasActivities = dateActivities.length > 0;
                  const matchesSelectedActivity =
                    !!selectedActivityId &&
                    dateActivities.some((activity) => activity.id === selectedActivityId);
                  const activityCount = dateActivities.length;

                  const backgroundClassName = matchesSelectedActivity
                    ? 'bg-brand-600'
                    : isSelectedDay
                      ? 'bg-brand-100'
                      : hasActivities
                        ? 'bg-brand-50'
                        : 'bg-white';

                  const textClassName = matchesSelectedActivity
                    ? 'text-white'
                    : isSelectedDay
                      ? 'text-brand-800'
                    : isCurrentMonth
                      ? 'text-ink-900'
                      : 'text-ink-400';

                  return (
                    <Pressable
                      accessibilityRole="button"
                      className={`flex-1 rounded-[18px] border px-1 py-2 ${
                        matchesSelectedActivity
                          ? 'border-brand-600'
                          : isSelectedDay
                            ? 'border-brand-500'
                          : hasActivities
                            ? 'border-brand-100'
                            : 'border-transparent'
                      } ${backgroundClassName} ${!isCurrentMonth && !matchesSelectedActivity ? 'opacity-60' : ''}`}
                      key={toIsoDate(date)}
                      onPress={() => {
                        const nextDateIso = toIsoDate(date);
                        setSelectedDateIso(nextDateIso);
                        onSelectDate?.(nextDateIso);
                      }}
                    >
                      <View className="items-center gap-1">
                        <Text className={`text-sm font-semibold ${textClassName}`}>
                          {date.getDate()}
                        </Text>

                        <View className="min-h-[12px] flex-row items-center justify-center gap-1">
                          {hasActivities ? (
                            <>
                              <View
                                className={`h-1.5 w-1.5 rounded-full ${
                                  matchesSelectedActivity ? 'bg-white' : 'bg-brand-600'
                                }`}
                              />
                              {activityCount > 1 ? (
                                <View
                                  className={`rounded-full px-1.5 py-[1px] ${
                                    matchesSelectedActivity ? 'bg-white/20' : 'bg-brand-100'
                                  }`}
                                >
                                  <Text
                                    className={`text-[10px] font-semibold ${
                                      matchesSelectedActivity ? 'text-white' : 'text-brand-700'
                                    }`}
                                  >
                                    {activityCount}
                                  </Text>
                                </View>
                              ) : null}
                            </>
                          ) : null}
                        </View>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            ))}
          </View>
        </View>

        <View className="rounded-[20px] bg-brand-50/45 px-4 py-4">
          <Text className="text-sm font-semibold text-ink-900">
            Activities on {formatDate(selectedDate)}
          </Text>
          {selectedDateActivities.length > 1 ? (
            <Text className="mt-1 text-xs leading-5 text-ink-600">
              {selectedDateActivities.length} activities are scheduled on this date.
            </Text>
          ) : null}

          {selectedDateActivities.length > 0 ? (
            <View className="mt-3 gap-2">
              {selectedDateActivities.map((activity) => {
                const isSelectedActivity = activity.id === selectedActivityId;

                return (
                  <Pressable
                    accessibilityRole="button"
                    className={`rounded-[16px] px-4 py-3 ${
                      isSelectedActivity ? 'bg-brand-100 border border-brand-200' : 'bg-white'
                    }`}
                    key={activity.id}
                    onPress={() => onSelectActivity?.(activity.id)}
                  >
                    <Text
                      className={`text-sm font-semibold ${
                        isSelectedActivity ? 'text-brand-800' : 'text-ink-900'
                      }`}
                    >
                      {activity.title}
                    </Text>
                    <Text
                      className={`mt-1 text-xs ${
                        isSelectedActivity ? 'text-brand-700' : 'text-ink-600'
                      }`}
                    >
                      {activity.windowLabel}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          ) : (
            <Text className="mt-2 text-sm leading-6 text-ink-600">
              No scheduled activity falls on this date in the current crop calendar view.
            </Text>
          )}
        </View>
      </View>
    </SectionCard>
  );
}
