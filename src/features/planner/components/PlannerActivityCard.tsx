import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { SectionCard } from '../../../components/ui/SectionCard';
import { useAppLanguage } from '../../../localization/appLanguage';
import { PlannerActivityType } from '../types';
import {
  getPlannerActivityStyle,
  PlannerActivityStatus,
} from '../utils/plannerPresentation';

type PlannerActivityCardProps = {
  title: string;
  description: string;
  dateLabel: string;
  notes: string[];
  type: PlannerActivityType;
  completedAt?: string;
  onPress?: () => void;
  onToggleComplete?: () => void;
  selected?: boolean;
  status?: PlannerActivityStatus;
};

export function PlannerActivityCard({
  title,
  description,
  dateLabel,
  notes,
  type,
  completedAt,
  onPress,
  onToggleComplete,
  selected = false,
  status,
}: PlannerActivityCardProps) {
  const { t } = useAppLanguage();
  const [notesExpanded, setNotesExpanded] = useState(false);
  const activityStyle = getPlannerActivityStyle(type);
  const fallbackStatus: PlannerActivityStatus = {
    label: completedAt ? 'Done' : 'Upcoming',
    tone: completedAt ? 'done' : 'upcoming',
  };
  const activityStatus = status ?? fallbackStatus;
  const statusBadgeClassName =
    activityStatus.tone === 'done'
      ? 'bg-brand-100'
      : activityStatus.tone === 'late'
        ? 'bg-orange-50'
        : activityStatus.tone === 'today'
          ? 'bg-earth-50'
          : 'bg-ink-50';
  const statusTextClassName =
    activityStatus.tone === 'done'
      ? 'text-brand-800'
      : activityStatus.tone === 'late'
        ? 'text-orange-700'
        : activityStatus.tone === 'today'
          ? 'text-earth-500'
          : 'text-ink-600';
  const isComplete = !!completedAt;
  const showNotes = notes.length > 0 && notesExpanded;
  const isDoneEarly = activityStatus.label === 'Done early';

  const handlePress = () => {
    if (notes.length > 0) {
      setNotesExpanded((currentValue) => !currentValue);
    }

    onPress?.();
  };

  return (
    <Pressable
      accessibilityRole="button"
      className="active:opacity-90"
      disabled={!onPress && notes.length === 0}
      onPress={handlePress}
    >
      <View className={selected ? 'rounded-[24px] border border-brand-200 bg-brand-50/40 p-[1px]' : undefined}>
        <SectionCard tone="default">
          <View className="gap-3">
            <View className="flex-row items-center justify-between gap-3">
              <View className="flex-1 flex-row items-center gap-3">
                <View className={`h-11 w-11 items-center justify-center rounded-full ${activityStyle.softClassName}`}>
                  <Ionicons color="#2d6033" name={activityStyle.icon} size={21} />
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-ink-900">{t(title)}</Text>
                  <Text className={`mt-1 text-xs font-semibold ${activityStyle.textClassName}`}>
                    {t(activityStyle.label)}
                  </Text>
                </View>
              </View>

              {onToggleComplete ? (
                <Pressable
                  accessibilityLabel={isComplete ? t('Mark task not done') : t('Mark task done')}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: isComplete }}
                  className={`h-11 w-11 items-center justify-center rounded-full ${
                    isComplete ? 'bg-brand-600' : 'bg-brand-50'
                  }`}
                  onPress={onToggleComplete}
                >
                  <Ionicons
                    color={isComplete ? 'white' : '#2d6033'}
                    name={isComplete ? 'checkmark' : 'ellipse-outline'}
                    size={22}
                  />
                </Pressable>
              ) : null}
            </View>

            <View className="flex-row flex-wrap gap-2">
              <View className={`rounded-full px-3 py-1 ${statusBadgeClassName}`}>
                <Text className={`text-xs font-semibold ${statusTextClassName}`}>
                  {t(activityStatus.label)}
                </Text>
              </View>
              <View className={`rounded-full px-3 py-1 ${selected ? 'bg-brand-100' : 'bg-brand-50'}`}>
                <Text className="text-xs font-semibold text-brand-800">{dateLabel}</Text>
              </View>
            </View>

            <Text className="text-sm leading-6 text-ink-700">{t(description)}</Text>

            {isDoneEarly ? (
              <View className="rounded-[16px] bg-brand-50/70 px-4 py-3">
                <Text className="text-xs leading-5 text-ink-700">
                  {t('Logged before the planned window. The crop stage still follows the calendar date.')}
                </Text>
              </View>
            ) : null}

            {notes.length > 0 ? (
              <View className="flex-row items-center justify-between rounded-[16px] bg-brand-50/70 px-4 py-3">
                <Text className="text-sm font-semibold text-brand-800">
                  {showNotes ? t('Hide activity notes') : t('Show activity notes')}
                </Text>
                <Ionicons
                  color="#2d6033"
                  name={showNotes ? 'chevron-up' : 'chevron-down'}
                  size={18}
                />
              </View>
            ) : null}

            {showNotes ? (
              <View className="gap-2 rounded-[18px] bg-brand-50/70 p-3">
                <Text className="text-sm font-semibold text-ink-900">{t('Activity Notes')}</Text>
                {notes.map((note) => (
                  <View key={note} className="flex-row gap-3">
                    <Text className="pt-0.5 text-brand-700">-</Text>
                    <Text className="flex-1 text-sm leading-6 text-ink-700">{t(note)}</Text>
                  </View>
                ))}
              </View>
            ) : null}
          </View>
        </SectionCard>
      </View>
    </Pressable>
  );
}
