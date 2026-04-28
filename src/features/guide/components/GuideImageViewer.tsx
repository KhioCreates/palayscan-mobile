import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
  Image,
  ImageSourcePropType,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import { useAppLanguage } from '../../../localization/appLanguage';

type GuideImageViewerProps = {
  visible: boolean;
  imageSource?: ImageSourcePropType;
  imageAlt?: string;
  title: string;
  caption?: string;
  onClose: () => void;
};

const zoomSteps = [1, 1.5, 2, 3];

export function GuideImageViewer({
  visible,
  imageSource,
  imageAlt,
  title,
  caption,
  onClose,
}: GuideImageViewerProps) {
  const { t } = useAppLanguage();
  const { height, width } = useWindowDimensions();
  const [zoomIndex, setZoomIndex] = useState(0);

  useEffect(() => {
    if (visible) {
      setZoomIndex(0);
    }
  }, [visible]);

  const zoom = zoomSteps[zoomIndex];
  const viewportWidth = Math.min(width - 28, 760);
  const viewportHeight = Math.min(Math.max(380, height - 310), height * 0.68);
  const baseImageWidth = viewportWidth;
  const baseImageHeight = viewportHeight;
  const scaledWidth = baseImageWidth * zoom;
  const scaledHeight = baseImageHeight * zoom;
  const panContentWidth = Math.max(scaledWidth, viewportWidth);
  const panContentHeight = Math.max(scaledHeight, viewportHeight);

  const handleZoomIn = () => {
    setZoomIndex((currentZoomIndex) => Math.min(currentZoomIndex + 1, zoomSteps.length - 1));
  };

  const handleZoomOut = () => {
    setZoomIndex((currentZoomIndex) => Math.max(currentZoomIndex - 1, 0));
  };

  if (!imageSource) {
    return null;
  }

  return (
    <Modal
      animationType="fade"
      backdropColor="#101a12"
      hardwareAccelerated
      onRequestClose={onClose}
      presentationStyle="fullScreen"
      statusBarTranslucent
      transparent={false}
      visible={visible}
    >
      <View style={styles.screen}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <Pressable
              accessibilityLabel={t('Close image viewer')}
              accessibilityRole="button"
              onPress={onClose}
              style={({ pressed }) => [styles.closeButton, pressed ? styles.pressed : null]}
            >
              <Ionicons color="#ffffff" name="close" size={31} />
            </Pressable>
            <View style={styles.headerText}>
              <Text numberOfLines={1} style={styles.title}>
                {title}
              </Text>
              <Text style={styles.helper}>{t('Use + or - to zoom. Drag when zoomed.')}</Text>
            </View>
          </View>

          <View style={styles.viewerWrap}>
            <ScrollView
              bounces={false}
              contentContainerStyle={{
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: panContentWidth,
              }}
              horizontal
              nestedScrollEnabled
              showsHorizontalScrollIndicator={zoom > 1}
              style={[styles.panViewport, { height: viewportHeight, width: viewportWidth }]}
            >
              <ScrollView
                bounces={false}
                contentContainerStyle={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: panContentHeight,
                }}
                nestedScrollEnabled
                showsVerticalScrollIndicator={zoom > 1}
                style={{ height: viewportHeight, width: panContentWidth }}
              >
                <Image
                  accessibilityIgnoresInvertColors
                  accessibilityLabel={imageAlt ?? t('{title} guide image', { title })}
                  resizeMode={zoom === 1 ? 'cover' : 'contain'}
                  source={imageSource}
                  style={[
                    styles.image,
                    {
                      borderRadius: zoom === 1 ? 24 : 12,
                      height: scaledHeight,
                      width: scaledWidth,
                    },
                  ]}
                />
              </ScrollView>
            </ScrollView>
          </View>

          <View style={styles.footer}>
            {caption ? <Text style={styles.caption}>{caption}</Text> : null}

            <View style={styles.zoomStepRow}>
              {zoomSteps.map((zoomStep, index) => {
                const isSelected = index === zoomIndex;

                return (
                  <Pressable
                    accessibilityLabel={t('Set zoom to {zoom} times', { zoom: zoomStep })}
                    accessibilityRole="button"
                    key={zoomStep}
                    onPress={() => setZoomIndex(index)}
                    style={({ pressed }) => [styles.zoomStepButton, pressed ? styles.pressed : null]}
                  >
                    <Text style={isSelected ? styles.zoomStepTextSelected : styles.zoomStepText}>
                      {zoomStep}x
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.controlRow}>
              <Pressable
                accessibilityLabel={t('Zoom out')}
                accessibilityRole="button"
                disabled={zoomIndex === 0}
                onPress={handleZoomOut}
                style={({ pressed }) => [styles.zoomIconButton, pressed ? styles.pressed : null]}
              >
                <Text style={zoomIndex === 0 ? styles.zoomIconTextDisabled : styles.zoomIconText}>
                  -
                </Text>
              </Pressable>

              <Pressable
                accessibilityLabel={t('Reset image zoom')}
                accessibilityRole="button"
                onPress={() => setZoomIndex(0)}
                style={({ pressed }) => [styles.zoomPercentButton, pressed ? styles.pressed : null]}
              >
                <Text style={styles.zoomPercentText}>{Math.round(zoom * 100)}%</Text>
                <Text style={styles.resetText}>{t('Reset')}</Text>
              </Pressable>

              <Pressable
                accessibilityLabel={t('Zoom in')}
                accessibilityRole="button"
                disabled={zoomIndex === zoomSteps.length - 1}
                onPress={handleZoomIn}
                style={({ pressed }) => [styles.zoomIconButton, pressed ? styles.pressed : null]}
              >
                <Text
                  style={
                    zoomIndex === zoomSteps.length - 1
                      ? styles.zoomIconTextDisabled
                      : styles.zoomIconText
                  }
                >
                  +
                </Text>
              </Pressable>
            </View>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#101a12',
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  closeButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.24)',
    borderColor: 'rgba(255,255,255,0.28)',
    borderRadius: 999,
    borderWidth: 1,
    height: 56,
    justifyContent: 'center',
    width: 56,
  },
  headerText: {
    flex: 1,
  },
  title: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '800',
  },
  helper: {
    color: 'rgba(255,255,255,0.82)',
    fontSize: 13,
    lineHeight: 18,
    marginTop: 2,
  },
  viewerWrap: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  panViewport: {
    backgroundColor: '#18251a',
    borderColor: 'rgba(255,255,255,0.16)',
    borderRadius: 28,
    borderWidth: 1,
  },
  image: {
    backgroundColor: '#18251a',
  },
  footer: {
    gap: 12,
    paddingBottom: 18,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  caption: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  zoomStepRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 14,
    justifyContent: 'center',
  },
  zoomStepButton: {
    alignItems: 'center',
    minHeight: 36,
    minWidth: 44,
    justifyContent: 'center',
  },
  zoomStepText: {
    color: 'rgba(255,255,255,0.78)',
    fontSize: 17,
    fontWeight: '800',
  },
  zoomStepTextSelected: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '900',
  },
  controlRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 22,
    justifyContent: 'center',
  },
  zoomIconButton: {
    alignItems: 'center',
    minHeight: 56,
    minWidth: 64,
    height: 76,
    justifyContent: 'center',
  },
  zoomIconText: {
    color: '#ffffff',
    fontSize: 44,
    fontWeight: '500',
    lineHeight: 50,
  },
  zoomIconTextDisabled: {
    color: 'rgba(255,255,255,0.38)',
    fontSize: 44,
    fontWeight: '500',
    lineHeight: 50,
  },
  zoomPercentButton: {
    alignItems: 'center',
    minHeight: 56,
    minWidth: 96,
    height: 76,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  zoomPercentText: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '900',
  },
  resetText: {
    color: 'rgba(255,255,255,0.74)',
    fontSize: 13,
    fontWeight: '800',
    marginTop: -1,
  },
  disabled: {
    opacity: 0.4,
  },
  pressed: {
    opacity: 0.78,
  },
});
