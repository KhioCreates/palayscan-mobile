import { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';

type PrimaryButtonProps = {
  label: string;
  hint?: string;
  icon?: ReactNode;
  onPress?: () => void;
  disabled?: boolean;
};

export function PrimaryButton({ label, hint, icon, onPress, disabled = false }: PrimaryButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      className={`min-h-[58px] flex-row items-center justify-between rounded-[20px] px-4 py-4 ${
        disabled ? 'bg-brand-300' : 'bg-brand-600 active:bg-brand-700'
      }`}
      disabled={disabled}
      onPress={onPress}
    >
      <View className="flex-1 pr-3">
        <Text className="text-base font-semibold text-white">{label}</Text>
        {hint ? <Text className="mt-1 text-sm text-white/80">{hint}</Text> : null}
      </View>
      {icon ? <View>{icon}</View> : null}
    </Pressable>
  );
}
