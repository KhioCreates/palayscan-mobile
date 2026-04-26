import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useMemo, useState } from 'react';
import { Platform, Pressable, Text, TextInput, View } from 'react-native';

import { HeaderBlock } from '../../../components/ui/HeaderBlock';
import { PrimaryButton } from '../../../components/ui/PrimaryButton';
import { ScreenContainer } from '../../../components/ui/ScreenContainer';
import { SectionCard } from '../../../components/ui/SectionCard';
import {
  cropDurationOptions,
  DEFAULT_CROP_DURATION_DAYS,
  MAX_CROP_DURATION_DAYS,
  MIN_CROP_DURATION_DAYS,
  plantingMethodOptions,
} from '../data/plannerRules';
import { generatePlannerSchedule } from '../services/generateSchedule';
import { getPlannerHistory, savePlannerSchedule } from '../services/plannerStorage';
import { formatDate, toIsoDate } from '../utils/date';
import { MethodOptionCard } from '../components/MethodOptionCard';
import { PlannerWorkDashboard } from '../components/PlannerWorkDashboard';
import { PlannerNavigatorParamList } from '../navigation/PlannerNavigator';
import { CropDurationOption, PlantingMethod, SavedPlannerRecord } from '../types';

type PlannerHomeScreenProps = NativeStackScreenProps<PlannerNavigatorParamList, 'PlannerHome'>;

export function PlannerHomeScreen({ navigation }: PlannerHomeScreenProps) {
  const [selectedMethod, setSelectedMethod] = useState<PlantingMethod>('transplanting');
  const [selectedDurationOption, setSelectedDurationOption] =
    useState<CropDurationOption>('medium');
  const [customDurationText, setCustomDurationText] = useState(String(DEFAULT_CROP_DURATION_DAYS));
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [latestRecord, setLatestRecord] = useState<SavedPlannerRecord | null>(null);

  const selectedDateLabel = useMemo(() => formatDate(selectedDate), [selectedDate]);
  const selectedDurationMeta = cropDurationOptions.find(
    (option) => option.id === selectedDurationOption,
  );
  const customDurationDays = useMemo(() => {
    const parsedDays = Number.parseInt(customDurationText, 10);

    if (!Number.isFinite(parsedDays)) {
      return DEFAULT_CROP_DURATION_DAYS;
    }

    return Math.min(MAX_CROP_DURATION_DAYS, Math.max(MIN_CROP_DURATION_DAYS, parsedDays));
  }, [customDurationText]);
  const selectedDurationDays =
    selectedDurationOption === 'custom'
      ? customDurationDays
      : selectedDurationMeta?.days ?? DEFAULT_CROP_DURATION_DAYS;
  const selectedDurationLabel =
    selectedDurationOption === 'custom'
      ? `Custom ${selectedDurationDays}-day variety`
      : selectedDurationMeta?.shortLabel ?? 'Medium variety';

  useFocusEffect(
    useCallback(() => {
      let active = true;

      getPlannerHistory().then((history) => {
        if (active) {
          setLatestRecord(history[0] ?? null);
        }
      });

      return () => {
        active = false;
      };
    }, []),
  );

  const handleDateChange = (event: DateTimePickerEvent, nextDate?: Date) => {
    if (Platform.OS !== 'ios') {
      setShowDatePicker(false);
    }

    if (event.type === 'set' && nextDate) {
      setSelectedDate(nextDate);
    }
  };

  const handleGenerateSchedule = async () => {
    const schedule = generatePlannerSchedule(
      selectedMethod,
      toIsoDate(selectedDate),
      selectedDurationDays,
      selectedDurationLabel,
    );
    const record = await savePlannerSchedule(schedule);

    navigation.navigate('PlannerSchedule', {
      recordId: record.id,
      schedule: {
        method: record.method,
        plantingDate: record.plantingDate,
        cropDurationDays: record.cropDurationDays,
        cropDurationLabel: record.cropDurationLabel,
        activities: record.activities,
      },
    });
  };

  const handleOpenLatestSchedule = () => {
    if (!latestRecord) {
      return;
    }

    navigation.navigate('PlannerSchedule', {
      recordId: latestRecord.id,
      schedule: {
        method: latestRecord.method,
        plantingDate: latestRecord.plantingDate,
        cropDurationDays: latestRecord.cropDurationDays,
        cropDurationLabel: latestRecord.cropDurationLabel,
        activities: latestRecord.activities,
      },
    });
  };

  return (
    <ScreenContainer bottomSpacing="comfortable">
      <HeaderBlock
        eyebrow="Planner Module"
        title="Plan the next field work"
        description="Build a rice crop calendar, check upcoming work, and keep saved activities ready for offline field review."
      />

      <View className="gap-4">
        {latestRecord ? (
          <View className="gap-3">
            <PlannerWorkDashboard
              activities={latestRecord.activities}
              cropDurationDays={latestRecord.cropDurationDays}
              cropDurationLabel={latestRecord.cropDurationLabel}
              plantingDate={latestRecord.plantingDate}
              title="Latest saved plan"
            />

            <PrimaryButton
              hint="Open the latest saved crop calendar and update task status."
              icon={<Ionicons color="white" name="arrow-forward-outline" size={22} />}
              label="Open latest calendar"
              onPress={handleOpenLatestSchedule}
            />
          </View>
        ) : null}

        <SectionCard>
          <View className="gap-3">
            <View className="flex-row items-start gap-3">
              <View className="h-11 w-11 items-center justify-center rounded-full bg-brand-50">
                <Ionicons color="#2d6033" name="options-outline" size={22} />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-semibold text-ink-900">Crop plan setup</Text>
                <Text className="mt-1 text-sm leading-6 text-ink-700">
                  Start with the planting method used in the field.
                </Text>
              </View>
            </View>
            <View className="gap-3">
              {plantingMethodOptions.map((method) => (
                <MethodOptionCard
                  key={method.id}
                  onPress={() => setSelectedMethod(method.id)}
                  selected={selectedMethod === method.id}
                  subtitle={method.subtitle}
                  title={method.title}
                />
              ))}
            </View>
          </View>
        </SectionCard>

        <SectionCard>
          <View className="gap-3">
            <View className="flex-row items-start gap-3">
              <View className="h-11 w-11 items-center justify-center rounded-full bg-brand-50">
                <Ionicons color="#2d6033" name="calendar-outline" size={22} />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-semibold text-ink-900">Planting date</Text>
                <Text className="mt-1 text-sm leading-6 text-ink-700">
                  This date becomes day 0 for the task timeline.
                </Text>
              </View>
            </View>
            <Pressable
              accessibilityRole="button"
              className="min-h-[58px] flex-row items-center justify-between rounded-[20px] bg-brand-50 px-4 py-4 active:bg-brand-100"
              onPress={() => setShowDatePicker(true)}
            >
              <View className="flex-1 pr-3">
                <Text className="text-base font-semibold text-ink-900">{selectedDateLabel}</Text>
                <Text className="mt-1 text-sm text-ink-700">
                  Tap to change the planting date used for the schedule.
                </Text>
              </View>
              <Ionicons color="#2d6033" name="calendar-outline" size={22} />
            </Pressable>

            {showDatePicker ? (
              <DateTimePicker
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                mode="date"
                onChange={handleDateChange}
                value={selectedDate}
              />
            ) : null}
          </View>
        </SectionCard>

        <SectionCard>
          <View className="gap-3">
            <View className="flex-row items-start gap-3">
              <View className="h-11 w-11 items-center justify-center rounded-full bg-brand-50">
                <Ionicons color="#2d6033" name="time-outline" size={22} />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-semibold text-ink-900">Rice variety duration</Text>
                <Text className="mt-1 text-sm leading-6 text-ink-700">
                  Adjust harvest timing based on the variety days to maturity.
                </Text>
              </View>
            </View>

            <View className="flex-row flex-wrap gap-2">
              {cropDurationOptions.map((option) => {
                const selected = selectedDurationOption === option.id;

                return (
                  <Pressable
                    accessibilityRole="button"
                    className={`rounded-full border px-4 py-3 ${
                      selected ? 'border-brand-600 bg-brand-600' : 'border-brand-100 bg-brand-50'
                    }`}
                    key={option.id}
                    onPress={() => setSelectedDurationOption(option.id)}
                  >
                    <Text
                      className={`text-sm font-semibold ${
                        selected ? 'text-white' : 'text-brand-800'
                      }`}
                    >
                      {option.title}
                    </Text>
                    <Text
                      className={`mt-1 text-xs ${selected ? 'text-white/90' : 'text-ink-700'}`}
                    >
                      {option.days} days
                    </Text>
                  </Pressable>
                );
              })}

              <Pressable
                accessibilityRole="button"
                className={`rounded-full border px-4 py-3 ${
                  selectedDurationOption === 'custom'
                    ? 'border-brand-600 bg-brand-600'
                    : 'border-brand-100 bg-brand-50'
                }`}
                onPress={() => setSelectedDurationOption('custom')}
              >
                <Text
                  className={`text-sm font-semibold ${
                    selectedDurationOption === 'custom' ? 'text-white' : 'text-brand-800'
                  }`}
                >
                  Custom
                </Text>
                <Text
                  className={`mt-1 text-xs ${
                    selectedDurationOption === 'custom' ? 'text-white/90' : 'text-ink-700'
                  }`}
                >
                  {selectedDurationDays} days
                </Text>
              </Pressable>
            </View>

            {selectedDurationOption === 'custom' ? (
              <View className="rounded-[20px] bg-brand-50 p-4">
                <Text className="text-sm font-semibold text-ink-900">Custom maturity days</Text>
                <TextInput
                  className="mt-3 rounded-[16px] bg-white px-4 py-3 text-base font-semibold text-ink-900"
                  keyboardType="number-pad"
                  maxLength={3}
                  onChangeText={setCustomDurationText}
                  placeholder={`${DEFAULT_CROP_DURATION_DAYS}`}
                  placeholderTextColor="#6e7f73"
                  value={customDurationText}
                />
                <Text className="mt-2 text-xs leading-5 text-ink-700">
                  Use {MIN_CROP_DURATION_DAYS}-{MAX_CROP_DURATION_DAYS} days. Harvest will move
                  with this value.
                </Text>
              </View>
            ) : null}
          </View>
        </SectionCard>

        <SectionCard tone="muted">
          <View className="gap-3">
            <View className="flex-row items-center gap-3">
              <View className="h-11 w-11 items-center justify-center rounded-full bg-white">
                <Ionicons color="#2d6033" name="checkmark-done-outline" size={22} />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-semibold text-ink-900">Work plan included</Text>
                <Text className="mt-1 text-sm leading-6 text-ink-700">
                  Land prep, seed prep, planting, fertilizer, water checks, scouting, and harvest.
                </Text>
              </View>
            </View>
            <View className="rounded-[20px] bg-white/75 p-4">
              <Text className="text-sm leading-6 text-ink-700">
                Dates are estimates. You can open the saved calendar later, mark tasks done, and
                adjust activity dates from planner history.
              </Text>
            </View>
          </View>
        </SectionCard>

        <PrimaryButton
          hint="Generate and save an estimated local crop calendar."
          icon={<Ionicons color="white" name="calendar-number-outline" size={22} />}
          label="Generate calendar"
          onPress={handleGenerateSchedule}
        />
      </View>
    </ScreenContainer>
  );
}
