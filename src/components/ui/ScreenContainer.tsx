import { ReactNode, RefObject } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ScreenContainerProps = {
  children: ReactNode;
  scroll?: boolean;
  bottomSpacing?: 'default' | 'comfortable' | 'roomy';
  topSpacing?: 'default' | 'comfortable';
  scrollRef?: RefObject<ScrollView | null>;
};

export function ScreenContainer({
  children,
  scroll = true,
  bottomSpacing = 'default',
  topSpacing = 'default',
  scrollRef,
}: ScreenContainerProps) {
  const bottomPaddingClassName =
    bottomSpacing === 'roomy' ? 'pb-40' : bottomSpacing === 'comfortable' ? 'pb-32' : 'pb-8';
  const topPaddingClassName = topSpacing === 'comfortable' ? 'pt-7' : 'pt-5';
  const content = (
    <View className={`flex-1 px-5 ${topPaddingClassName} ${bottomPaddingClassName}`}>{children}</View>
  );

  return (
    <SafeAreaView className="flex-1 bg-brand-50">
      {scroll ? (
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          className="flex-1"
        >
          {content}
        </ScrollView>
      ) : (
        content
      )}
    </SafeAreaView>
  );
}
