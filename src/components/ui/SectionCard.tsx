import { ReactNode } from 'react';
import { View } from 'react-native';

type SectionCardProps = {
  children: ReactNode;
  tone?: 'default' | 'muted';
};

export function SectionCard({ children, tone = 'default' }: SectionCardProps) {
  const toneClassName =
    tone === 'muted' ? 'border-brand-100 bg-brand-100/60' : 'border-white bg-white';

  return (
    <View className={`rounded-[24px] border p-5 shadow-soft ${toneClassName}`}>{children}</View>
  );
}
