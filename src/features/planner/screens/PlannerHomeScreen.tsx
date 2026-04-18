import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';

import { HeaderBlock } from '../../../components/ui/HeaderBlock';
import { PrimaryButton } from '../../../components/ui/PrimaryButton';
import { ScreenContainer } from '../../../components/ui/ScreenContainer';
import { SectionCard } from '../../../components/ui/SectionCard';
import { plantingMethodOptions } from '../data/plannerRules';
import { generatePlannerSchedule } from '../services/generateSchedule';
import { savePlannerSchedule } from '../services/plannerStorage';
import { formatDate, toIsoDate } from '../utils/date';
import { MethodOptionCard } from '../components/MethodOptionCard';
import { PlannerNavigatorParamList } from '../navigation/PlannerNavigator';
import { PlantingMethod } from '../types';

type PlannerHomeScreenProps = NativeStackScreenProps<PlannerNavigatorParamList, 'PlannerHome'>;

export function PlannerHomeScreen({ navigation }: PlannerHomeScreenProps) {
  const [selectedMethod, setSelectedMethod] = useState<PlantingMethod>('transplanting');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const selectedDateLabel = useMemo(() => formatDate(selectedDate), [selectedDate]);

  const handleDateChange = (event: DateTimePickerEvent, nextDate?: Date) => {
    if (Platform.OS !== 'ios') {
      setShowDatePicker(false);
    }

    if (event.type === 'set' && nextDate) {
      setSelectedDate(nextDate);
    }
  };

  const handleGenerateSchedule = async () => {
    const schedule = generatePlannerSchedule(selectedMethod, toIsoDate(selectedDate));
    await savePlannerSchedule(schedule);

    navigation.navigate('PlannerSchedule', {
      schedule,
    });
  };

  return (
    <ScreenContainer bottomSpacing="comfortable">
      <HeaderBlock
        eyebrow="Planner Module"
        title="Create an estimated crop calendar"
        description="Choose a planting method and planting date, then generate a local planting-to-harvest activity timeline."
      />

      <View className="gap-4">
        <SectionCard>
          <View className="gap-3">
            <Text className="text-lg font-semibold text-ink-900">1. Select planting method</Text>
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
            <Text className="text-lg font-semibold text-ink-900">2. Select planting date</Text>
            <Pressable
              accessibilityRole="button"
              className="min-h-[58px] flex-row items-center justify-between rounded-[20px] bg-brand-50 px-4 py-4 active:bg-brand-100"
              onPress={() => setShowDatePicker(true)}
            >
              <View className="flex-1 pr-3">
                <Text className="text-base font-semibold text-ink-900">{selectedDateLabel}</Text>
                <Text className="mt-1 text-sm text-ink-600">
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

        <SectionCard tone="muted">
          <View className="gap-2">
            <Text className="text-lg font-semibold text-ink-900">What this calendar includes</Text>
            <Text className="text-sm leading-6 text-ink-600">
              The schedule includes land preparation, seed preparation, planting activity,
              fertilizer timing, water management checks, pest monitoring windows, and harvest
              timing. Nursery preparation appears only for transplanting.
            </Text>
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
