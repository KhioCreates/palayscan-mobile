import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';

import { HeaderBlock } from '../../../components/ui/HeaderBlock';
import { PrimaryButton } from '../../../components/ui/PrimaryButton';
import { ScreenContainer } from '../../../components/ui/ScreenContainer';
import { SectionCard } from '../../../components/ui/SectionCard';
import { ScanResultCard } from '../components/ScanResultCard';
import {
  KindwiseConfigError,
  KindwiseRequestError,
  identifyRiceIssueFromBase64Images,
} from '../services/kindwiseClient';
import { ScanNavigatorParamList } from '../navigation/ScanNavigator';
import { mapKindwiseResponseToScanResult } from '../services/mapKindwiseResult';
import { runRouterPrefilter } from '../services/routerPrefilter';
import {
  runLiveScanPrecheckFromBase64,
  ScanPrecheckConfigError,
  ScanPrecheckRequestError,
} from '../services/scanPrecheck';
import { saveScanResult } from '../services/scanStorage';
import {
  getLocalScanGateResult,
  shouldAllowLiveScanFromGate,
  shouldAutoSaveScanResult,
} from '../services/scanValidation';
import { buildPlaceholderScanResult } from '../utils/scanPlaceholder';
import {
  ScanApiState,
  ScanPhotoEvidence,
  ScanPhotoFocus,
  ScanResult,
  SelectedScanImage,
} from '../types';
import { useAppLanguage } from '../../../localization/appLanguage';

async function requestCameraAccess() {
  const permission = await ImagePicker.requestCameraPermissionsAsync();
  return permission.granted;
}

async function requestGalleryAccess() {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  return permission.granted;
}

const scanMode = process.env.EXPO_PUBLIC_SCAN_MODE === 'live' ? 'live' : 'mock';
const hasScanProxy = Boolean(process.env.EXPO_PUBLIC_SCAN_PROXY_URL);
const LIVE_ANALYZE_COOLDOWN_MS = 12000;
const LIVE_SCAN_SESSION_CAP = hasScanProxy ? Number.POSITIVE_INFINITY : 5;
const LIVE_SCAN_GATE_CONFIDENCE_THRESHOLD = 0.7;
const MAX_SCAN_IMAGES = 5;
const defaultPhotoFocus: ScanPhotoFocus = 'Leaf';

const cropPhotoParts: Array<{ label: ScanPhotoFocus; icon: keyof typeof Ionicons.glyphMap }> = [
  { label: 'Leaf', icon: 'leaf-outline' },
  { label: 'Stem', icon: 'git-branch-outline' },
  { label: 'Panicle', icon: 'flower-outline' },
  { label: 'Field', icon: 'grid-outline' },
];

const photoChecks = [
  'Clear rice part',
  'Good lighting',
  'Symptom is close',
];

function createScanImageId() {
  return `scan-photo-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function toSelectedScanImage(
  asset: ImagePicker.ImagePickerAsset | undefined,
  focus: ScanPhotoFocus,
  source: SelectedScanImage['source'],
): SelectedScanImage | null {
  if (!asset?.uri || !asset.base64) {
    return null;
  }

  return {
    id: createScanImageId(),
    uri: asset.uri,
    base64: asset.base64,
    focus,
    source,
  };
}

function buildImageOnlySignature(images: SelectedScanImage[]) {
  return images.map((image) => image.uri).join('|');
}

function buildScanMetadataSignature(images: SelectedScanImage[]) {
  return images.map((image) => `${image.uri}:${image.focus}`).join('|');
}

function buildScanPhotos(images: SelectedScanImage[]): ScanPhotoEvidence[] {
  return images.map((image) => ({
    imageUri: image.uri,
    focus: image.focus,
  }));
}

function buildScanNotes(notes: string) {
  const cleanedNotes = notes.trim();

  return cleanedNotes || undefined;
}

function ImageSourceButton({
  title,
  description,
  icon,
  onPress,
  tone,
}: {
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  tone: 'primary' | 'secondary';
}) {
  const isPrimary = tone === 'primary';

  return (
    <Pressable
      accessibilityRole="button"
      className={`min-h-[132px] flex-1 justify-between rounded-[22px] border px-4 py-4 active:opacity-90 ${
        isPrimary ? 'border-brand-600 bg-brand-600' : 'border-brand-100 bg-brand-50'
      }`}
      onPress={onPress}
    >
      <View
        className={`h-11 w-11 items-center justify-center rounded-full ${
          isPrimary ? 'bg-white/15' : 'bg-white'
        }`}
      >
        <Ionicons color={isPrimary ? 'white' : '#2d6033'} name={icon} size={23} />
      </View>
      <View>
        <Text className={`text-base font-semibold ${isPrimary ? 'text-white' : 'text-ink-900'}`}>
          {title}
        </Text>
        <Text
          className={`mt-1 text-xs leading-5 ${isPrimary ? 'text-white/85' : 'text-ink-700'}`}
        >
          {description}
        </Text>
      </View>
    </Pressable>
  );
}

function PhotoQualityStrip() {
  const { t } = useAppLanguage();

  return (
    <View className="flex-row gap-2">
      {photoChecks.map((check) => (
        <View
          className="min-h-12 flex-1 items-center justify-center rounded-[16px] bg-brand-50 px-2 py-2"
          key={check}
        >
          <Ionicons color="#2d6033" name="checkmark-circle-outline" size={17} />
          <Text className="mt-1 text-center text-[11px] font-semibold leading-4 text-brand-800">
            {t(check)}
          </Text>
        </View>
      ))}
    </View>
  );
}

function CropPartSelector({
  value,
  onChange,
}: {
  value: ScanPhotoFocus;
  onChange: (part: ScanPhotoFocus) => void;
}) {
  const { t } = useAppLanguage();

  return (
    <View className="gap-2">
      <Text className="text-sm font-semibold text-ink-900">{t('Photo focus')}</Text>
      <View className="flex-row flex-wrap gap-2">
        {cropPhotoParts.map((part) => {
          const selected = value === part.label;

          return (
            <Pressable
              accessibilityRole="button"
              className={`min-h-11 flex-row items-center gap-2 rounded-full border px-3 py-2 ${
                selected ? 'border-brand-600 bg-brand-600' : 'border-brand-100 bg-brand-50'
              }`}
              key={part.label}
              onPress={() => onChange(part.label)}
            >
              <Ionicons color={selected ? 'white' : '#2d6033'} name={part.icon} size={16} />
              <Text
                className={`text-xs font-semibold ${
                  selected ? 'text-white' : 'text-brand-800'
                }`}
              >
                {part.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function ScanPhotoTray({
  activeImageId,
  images,
  onRemove,
  onSelect,
}: {
  activeImageId: string;
  images: SelectedScanImage[];
  onRemove: (id: string) => void;
  onSelect: (id: string) => void;
}) {
  const { t } = useAppLanguage();

  return (
    <View className="gap-2">
      <Text className="text-sm font-semibold text-ink-900">{t('Selected photos')}</Text>
      <View className="flex-row flex-wrap gap-2">
        {images.map((image, index) => {
          const selected = image.id === activeImageId;

          return (
            <View
              className={`w-[96px] rounded-[16px] border p-1.5 ${
                selected ? 'border-brand-600 bg-brand-50' : 'border-brand-100 bg-white'
              }`}
              key={image.id}
            >
              <Pressable accessibilityRole="button" onPress={() => onSelect(image.id)}>
                <Image
                  className="h-14 w-full rounded-[12px] bg-brand-100"
                  resizeMode="cover"
                  source={{ uri: image.uri }}
                />
                <Text
                  className={`mt-1 text-[11px] font-semibold ${
                    selected ? 'text-brand-800' : 'text-ink-700'
                  }`}
                  numberOfLines={1}
                >
                  {index + 1}. {image.focus}
                </Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                className="absolute right-0.5 top-0.5 h-6 w-6 items-center justify-center rounded-full bg-white/95"
                onPress={() => onRemove(image.id)}
              >
                <Ionicons color="#2d6033" name="close" size={14} />
              </Pressable>
            </View>
          );
        })}
      </View>
    </View>
  );
}

function LoadingScanCard() {
  const { t } = useAppLanguage();
  const steps = ['Checking photos', 'Matching issue', 'Preparing result'];

  return (
    <SectionCard tone="muted">
      <View className="gap-4 py-2">
        <View className="flex-row items-center gap-3">
          <View className="h-11 w-11 items-center justify-center rounded-full bg-white">
            <ActivityIndicator color="#2d6033" />
          </View>
          <View className="flex-1">
            <Text className="text-lg font-semibold text-ink-900">{t('Analyzing photos')}</Text>
            <Text className="mt-1 text-sm leading-5 text-ink-700">
              {t('Checking the rice photos and preparing a possible issue result.')}
            </Text>
          </View>
        </View>

        <View className="gap-2">
          {steps.map((step, index) => (
            <View className="flex-row items-center gap-3" key={step}>
              <View
                className={`h-6 w-6 items-center justify-center rounded-full ${
                  index === 0 ? 'bg-brand-600' : 'bg-white'
                }`}
              >
                <Text
                  className={`text-[11px] font-semibold ${
                    index === 0 ? 'text-white' : 'text-brand-700'
                  }`}
                >
                  {index + 1}
                </Text>
              </View>
              <Text className="text-sm font-medium text-ink-700">{t(step)}</Text>
            </View>
          ))}
        </View>
      </View>
    </SectionCard>
  );
}

export function ScanHomeScreen() {
  const { t } = useAppLanguage();
  const navigation = useNavigation<NativeStackNavigationProp<ScanNavigatorParamList>>();
  const [scanImages, setScanImages] = useState<SelectedScanImage[]>([]);
  const [activeImageId, setActiveImageId] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [apiState, setApiState] = useState<ScanApiState>('idle');
  const [notes, setNotes] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [guardMessage, setGuardMessage] = useState<string | null>(null);
  const [confirmedRiceImage, setConfirmedRiceImage] = useState(false);
  const [confirmedSameProblemSet, setConfirmedSameProblemSet] = useState(false);
  const [lastAnalyzedScanSignature, setLastAnalyzedScanSignature] = useState<string | null>(null);
  const [validatedScanSignature, setValidatedScanSignature] = useState<string | null>(null);
  const [cooldownUntil, setCooldownUntil] = useState<number | null>(null);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);
  const [liveScanCount, setLiveScanCount] = useState(0);

  useEffect(() => {
    if (!cooldownUntil) {
      setCooldownRemaining(0);
      return;
    }

    const updateRemaining = () => {
      const remaining = Math.max(0, Math.ceil((cooldownUntil - Date.now()) / 1000));
      setCooldownRemaining(remaining);

      if (remaining === 0) {
        setCooldownUntil(null);
      }
    };

    updateRemaining();
    const timer = setInterval(updateRemaining, 500);

    return () => clearInterval(timer);
  }, [cooldownUntil]);

  const activeImage = useMemo(
    () => scanImages.find((image) => image.id === activeImageId) ?? scanImages[0] ?? null,
    [activeImageId, scanImages],
  );

  const primaryImage = activeImage ?? scanImages[0] ?? null;
  const imageOnlySignature = useMemo(() => buildImageOnlySignature(scanImages), [scanImages]);
  const scanMetadataSignature = useMemo(
    () => buildScanMetadataSignature(scanImages),
    [scanImages],
  );
  const analysisSignature = scanMode === 'live' ? imageOnlySignature : scanMetadataSignature;
  const scanPhotos = useMemo(() => buildScanPhotos(scanImages), [scanImages]);

  const isAnalyzeDisabled = useMemo(
    () =>
      scanImages.length === 0 ||
      apiState === 'loading' ||
      cooldownRemaining > 0 ||
      (scanImages.length > 1 && !confirmedSameProblemSet),
    [apiState, confirmedSameProblemSet, cooldownRemaining, scanImages.length],
  );

  const analyzeHint = useMemo(() => {
    if (scanImages.length === 0) {
      return t('Add at least one rice photo before analyzing.');
    }

    if (scanImages.length > 1 && !confirmedSameProblemSet) {
      return t('Confirm that the selected photos show the same rice problem before analyzing.');
    }

    if (apiState === 'loading') {
      return t('Analysis is already in progress. Please wait for it to finish.');
    }

    if (cooldownRemaining > 0) {
      return t('Analyze in {seconds}s', { seconds: cooldownRemaining });
    }

    if (scanMode === 'live' && liveScanCount >= LIVE_SCAN_SESSION_CAP) {
      return t('Scan limit reached for this session. Please try again later.');
    }

    const subject = scanImages.length === 1 ? t('this photo') : t('these photos');

    return t('Analyze {subject}.', { subject });
  }, [apiState, confirmedSameProblemSet, cooldownRemaining, liveScanCount, scanImages.length, scanMode, t]);

  const resetScanAfterPhotoChange = () => {
    setResult(null);
    setApiState('idle');
    setErrorMessage(null);
    setGuardMessage(null);
    setConfirmedRiceImage(false);
    setConfirmedSameProblemSet(false);
    setLastAnalyzedScanSignature(null);
    setValidatedScanSignature(null);
  };

  const canAddPhoto = () => {
    if (scanImages.length < MAX_SCAN_IMAGES) {
      return true;
    }

    Alert.alert(
      t('Photo limit reached'),
      t('You can send up to {max} photos in one scan.', { max: MAX_SCAN_IMAGES }),
    );
    return false;
  };

  const addScanImage = (image: SelectedScanImage) => {
    setScanImages((current) => [...current, image]);
    setActiveImageId(image.id);
    resetScanAfterPhotoChange();
  };

  const replaceActiveScanImage = (image: SelectedScanImage) => {
    if (!activeImage) {
      addScanImage(image);
      return;
    }

    const replacement: SelectedScanImage = {
      ...image,
      id: activeImage.id,
      focus: activeImage.focus,
    };

    setScanImages((current) =>
      current.map((item) => (item.id === activeImage.id ? replacement : item)),
    );
    setActiveImageId(activeImage.id);
    resetScanAfterPhotoChange();
  };

  const removeScanImage = (id: string) => {
    const nextImages = scanImages.filter((image) => image.id !== id);
    setScanImages(nextImages);

    if (activeImageId === id) {
      setActiveImageId(nextImages[0]?.id ?? null);
    }

    resetScanAfterPhotoChange();
  };

  const updateActivePhotoFocus = (focus: ScanPhotoFocus) => {
    if (!activeImage) {
      return;
    }

    setScanImages((current) =>
      current.map((image) => (image.id === activeImage.id ? { ...image, focus } : image)),
    );
    setResult(null);
    setApiState('idle');
    setErrorMessage(null);
    setGuardMessage(null);
  };

  const handleCameraCapture = async () => {
    if (!canAddPhoto()) {
      return;
    }

    const granted = await requestCameraAccess();

    if (!granted) {
      Alert.alert(
        t('Camera permission needed'),
        t('Please allow camera access so you can capture a rice image for scanning.'),
      );
      return;
    }

    const response = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      base64: true,
      quality: 0.8,
      mediaTypes: ['images'],
    });

    if (!response.canceled && response.assets[0]?.uri && response.assets[0]?.base64) {
      const image = toSelectedScanImage(response.assets[0], defaultPhotoFocus, 'camera');

      if (image) {
        addScanImage(image);
      }
    }
  };

  const handleGalleryPick = async () => {
    if (!canAddPhoto()) {
      return;
    }

    const granted = await requestGalleryAccess();

    if (!granted) {
      Alert.alert(
        t('Gallery permission needed'),
        t('Please allow photo library access so you can choose a rice image to scan.'),
      );
      return;
    }

    const response = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      base64: true,
      quality: 0.8,
      mediaTypes: ['images'],
    });

    if (!response.canceled && response.assets[0]?.uri && response.assets[0]?.base64) {
      const image = toSelectedScanImage(response.assets[0], defaultPhotoFocus, 'gallery');

      if (image) {
        addScanImage(image);
      }
    }
  };

  const handleActiveCameraReplace = async () => {
    const granted = await requestCameraAccess();

    if (!granted) {
      Alert.alert(
        t('Camera permission needed'),
        t('Please allow camera access so you can capture a rice image for scanning.'),
      );
      return;
    }

    const response = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      base64: true,
      quality: 0.8,
      mediaTypes: ['images'],
    });

    if (!response.canceled && response.assets[0]?.uri && response.assets[0]?.base64) {
      const image = toSelectedScanImage(
        response.assets[0],
        activeImage?.focus ?? defaultPhotoFocus,
        'camera',
      );

      if (image) {
        replaceActiveScanImage(image);
      }
    }
  };

  const handleActiveGalleryReplace = async () => {
    const granted = await requestGalleryAccess();

    if (!granted) {
      Alert.alert(
        t('Gallery permission needed'),
        t('Please allow photo library access so you can choose a rice image to scan.'),
      );
      return;
    }

    const response = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      base64: true,
      quality: 0.8,
      mediaTypes: ['images'],
    });

    if (!response.canceled && response.assets[0]?.uri && response.assets[0]?.base64) {
      const image = toSelectedScanImage(
        response.assets[0],
        activeImage?.focus ?? defaultPhotoFocus,
        'gallery',
      );

      if (image) {
        replaceActiveScanImage(image);
      }
    }
  };

  const handleAnalyze = async () => {
    if (!primaryImage || scanImages.length === 0) {
      return;
    }

    if (apiState === 'loading') {
      return;
    }

    if (cooldownRemaining > 0) {
      setGuardMessage(`Please wait ${cooldownRemaining}s before analyzing again.`);
      return;
    }

    if (scanImages.length > 1 && !confirmedSameProblemSet) {
      setGuardMessage('Please confirm that all selected photos show the same rice problem.');
      return;
    }

    if (analysisSignature === lastAnalyzedScanSignature) {
      setGuardMessage(
        t('This photo set was already analyzed. Add, replace, or retake a photo first.'),
      );
      return;
    }

    if (scanMode === 'live' && liveScanCount >= LIVE_SCAN_SESSION_CAP) {
      setGuardMessage(
        t('Scan limit reached for this session. Please try again later.'),
      );
      return;
    }

    const localGate = getLocalScanGateResult({
      confirmedRiceImage,
      imageUri: imageOnlySignature,
      validatedImageUri: validatedScanSignature,
    });

    if (localGate.status === 'confirm-required') {
      if (!confirmedRiceImage) {
        setGuardMessage(localGate.message);
        return;
      }

      setValidatedScanSignature(imageOnlySignature);
    }

    setApiState('loading');
    setResult(null);
    setErrorMessage(null);
    setGuardMessage(null);

    try {
      if (scanMode === 'live') {
        const gateResult = await runLiveScanPrecheckFromBase64(primaryImage.base64);
        const gateDecision = shouldAllowLiveScanFromGate(
          gateResult,
          LIVE_SCAN_GATE_CONFIDENCE_THRESHOLD,
        );

        if (!gateDecision.allowed) {
          setApiState('idle');
          setGuardMessage(
            gateDecision.reason ??
              t('This image did not pass the pre-check. Please try another rice photo.'),
          );
          return;
        }
      }

      const routerPrefilter = await runRouterPrefilter(primaryImage.uri);

      if (routerPrefilter.verdict === 'block') {
        setApiState('idle');
        setGuardMessage(
          routerPrefilter.reason ??
            t('This photo set was blocked by the local pre-check.'),
        );
        return;
      }

      const scanNotes = buildScanNotes(notes);
      let mappedResult: ScanResult | null = null;

      if (scanMode === 'live') {
        const response = await identifyRiceIssueFromBase64Images(
          scanImages.map((image) => image.base64),
        );
        const liveResult = mapKindwiseResponseToScanResult({
          imageUri: primaryImage.uri,
          notes: scanNotes,
          response,
        });
        mappedResult = liveResult ? { ...liveResult, scanPhotos } : null;
      } else {
        mappedResult = {
          ...buildPlaceholderScanResult(primaryImage.uri),
          notes: scanNotes,
          scanPhotos,
        };
      }

      setLastAnalyzedScanSignature(analysisSignature);

      if (scanMode === 'live') {
        setLiveScanCount((count) => count + 1);
      }

      if (!mappedResult) {
        setApiState('empty');
        return;
      }

      setResult(mappedResult);
      const saveDecision = shouldAutoSaveScanResult({
        result: mappedResult,
        mode: scanMode,
        hasStrongLocalPass: false,
      });

      if (saveDecision.allowed) {
        await saveScanResult(mappedResult, scanMode);
      } else {
        setGuardMessage(
          saveDecision.reason ??
            t('This scan result was not saved because it did not pass local validation.'),
        );
      }

      setApiState('success');
    } catch (error) {
      const message =
        error instanceof KindwiseConfigError ||
        error instanceof KindwiseRequestError ||
        error instanceof ScanPrecheckConfigError ||
        error instanceof ScanPrecheckRequestError
          ? error.message
          : t('The image could not be analyzed right now. Please try again.');

      setErrorMessage(message);
      setApiState('error');
    } finally {
      if (scanMode === 'live') {
        setCooldownUntil(Date.now() + LIVE_ANALYZE_COOLDOWN_MS);
      }
    }
  };

  const openResultDetail = (predictionIndex: number) => {
    if (!result) {
      return;
    }

    navigation.navigate('ScanResultDetail', {
      result,
      mode: scanMode,
      initialPredictionIndex: predictionIndex,
    });
  };

  return (
    <ScreenContainer bottomSpacing="comfortable">
      <HeaderBlock
        eyebrow={t('Scan Module')}
        title={t('Scan a rice problem')}
        description={t(
          'Capture or upload rice photos, then review the photo focus before analysis.',
        )}
      />

      <View className="gap-4">
        <SectionCard>
          <View className="gap-4">
            <View className="flex-row items-center justify-between gap-3">
                <View className="flex-1">
                <Text className="text-xl font-semibold text-ink-900">{t('Start field scan')}</Text>
                <Text className="mt-1 text-sm leading-6 text-ink-700">
                  {scanImages.length > 0
                    ? t('{count}/{max} photos ready. Add another angle if needed.', {
                        count: scanImages.length,
                        max: MAX_SCAN_IMAGES,
                      })
                    : t('Use close, bright rice photos for better scan results.')}
                </Text>
              </View>
              <View className="h-12 w-12 items-center justify-center rounded-full bg-brand-50">
                <Ionicons color="#2d6033" name="scan-outline" size={24} />
              </View>
            </View>

            <View className="flex-row gap-3">
              <ImageSourceButton
                description={t('Open camera')}
                icon="camera-outline"
                onPress={handleCameraCapture}
                title={t('Capture')}
                tone="primary"
              />
              <ImageSourceButton
                description={t('Pick photo')}
                icon="cloud-upload-outline"
                onPress={handleGalleryPick}
                title={t('Upload')}
                tone="secondary"
              />
            </View>

            <PhotoQualityStrip />
          </View>
        </SectionCard>

        {activeImage ? (
          <SectionCard>
            <View className="gap-4">
              <View className="flex-row items-center justify-between gap-3">
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-ink-900">{t('Review photos')}</Text>
                  <Text className="mt-1 text-sm leading-6 text-ink-700">
                    {t('Confirm the rice photos before sending them to analysis.')}
                  </Text>
                </View>
                <View
                  className={`rounded-full px-3 py-1.5 ${
                    confirmedRiceImage ? 'bg-brand-100' : 'bg-earth-50'
                  }`}
                >
                  <Text
                    className={`text-xs font-semibold ${
                      confirmedRiceImage ? 'text-brand-700' : 'text-earth-500'
                    }`}
                  >
                    {confirmedRiceImage
                      ? t('Ready')
                      : t('{count}/{max}', { count: scanImages.length, max: MAX_SCAN_IMAGES })}
                  </Text>
                </View>
              </View>

              <View className="overflow-hidden rounded-[24px] bg-brand-100">
                <Image
                  source={{ uri: activeImage.uri }}
                  className="h-[260px] w-full"
                  resizeMode="cover"
                />
                <View className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1.5">
                  <Text className="text-xs font-semibold text-brand-800">{activeImage.focus}</Text>
                </View>
                <View className="absolute bottom-3 left-3 right-3 flex-row gap-2">
                  <Pressable
                    accessibilityRole="button"
                    className="min-h-11 flex-1 flex-row items-center justify-center gap-2 rounded-full bg-white/90 px-3 py-2 active:bg-white"
                    onPress={handleActiveCameraReplace}
                  >
                    <Ionicons color="#2d6033" name="camera-outline" size={16} />
                    <Text className="text-xs font-semibold text-brand-800">{t('Retake')}</Text>
                  </Pressable>
                  <Pressable
                    accessibilityRole="button"
                    className="min-h-11 flex-1 flex-row items-center justify-center gap-2 rounded-full bg-white/90 px-3 py-2 active:bg-white"
                    onPress={handleActiveGalleryReplace}
                  >
                    <Ionicons color="#2d6033" name="images-outline" size={16} />
                    <Text className="text-xs font-semibold text-brand-800">{t('Replace')}</Text>
                  </Pressable>
                </View>
              </View>

              <ScanPhotoTray
                activeImageId={activeImage.id}
                images={scanImages}
                onRemove={removeScanImage}
                onSelect={setActiveImageId}
              />

              <CropPartSelector onChange={updateActivePhotoFocus} value={activeImage.focus} />

              <View className="gap-2">
                <Text className="text-sm font-semibold text-ink-900">{t('Optional notes')}</Text>
                <TextInput
                  className="min-h-[96px] rounded-[20px] bg-brand-50 px-4 py-3 text-sm text-ink-900"
                  multiline
                  onChangeText={setNotes}
                  placeholder={t('Add short notes for this scan result later if needed.')}
                  placeholderTextColor="#627562"
                  textAlignVertical="top"
                  value={notes}
                />
              </View>

              <Pressable
                accessibilityRole="checkbox"
                className="flex-row items-start gap-3 rounded-[20px] bg-brand-50 px-4 py-4"
                onPress={() => {
                  setConfirmedRiceImage((current) => !current);
                  setGuardMessage(null);
                }}
              >
                <View
                  className={`mt-0.5 h-6 w-6 items-center justify-center rounded-md border ${
                    confirmedRiceImage ? 'border-brand-600 bg-brand-600' : 'border-brand-200 bg-white'
                  }`}
                >
                  {confirmedRiceImage ? <Ionicons color="white" name="checkmark" size={16} /> : null}
                </View>
                  <Text className="flex-1 text-sm leading-6 text-ink-700">
                    {t('I confirm these are clear rice leaf, stem, panicle, or field photos.')}
                  </Text>
              </Pressable>

              {scanImages.length > 1 ? (
                <Pressable
                  accessibilityRole="checkbox"
                  className="flex-row items-start gap-3 rounded-[20px] bg-earth-50 px-4 py-4"
                  onPress={() => {
                    setConfirmedSameProblemSet((current) => !current);
                    setGuardMessage(null);
                  }}
                >
                  <View
                    className={`mt-0.5 h-6 w-6 items-center justify-center rounded-md border ${
                      confirmedSameProblemSet
                        ? 'border-brand-600 bg-brand-600'
                        : 'border-earth-200 bg-white'
                    }`}
                  >
                    {confirmedSameProblemSet ? (
                      <Ionicons color="white" name="checkmark" size={16} />
                    ) : null}
                  </View>
                  <Text className="flex-1 text-sm leading-6 text-ink-700">
                    {t('These photos show the same rice problem from different angles.')}
                  </Text>
                </Pressable>
              ) : null}

              {guardMessage ? (
                <View className="rounded-[18px] bg-earth-50 px-4 py-3">
                  <Text className="text-sm leading-6 text-ink-700">{guardMessage}</Text>
                </View>
              ) : null}

              <PrimaryButton
                disabled={isAnalyzeDisabled}
                hint={analyzeHint}
                icon={<Ionicons color="white" name="sparkles-outline" size={22} />}
                  label={
                    cooldownRemaining > 0
                    ? t('Analyze in {seconds}s', { seconds: cooldownRemaining })
                    : scanImages.length > 1
                      ? t('Analyze photos')
                      : t('Analyze image')
                  }
                onPress={handleAnalyze}
              />
            </View>
          </SectionCard>
        ) : (
          <SectionCard tone="muted">
            <View className="gap-4">
              <View className="flex-row items-center gap-3">
                <View className="h-11 w-11 items-center justify-center rounded-full bg-white">
                  <Ionicons color="#2d6033" name="leaf-outline" size={22} />
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-ink-900">{t('Best photo set')}</Text>
                  <Text className="mt-1 text-sm leading-6 text-ink-700">
                    {t('Aim at the affected leaf, stem, panicle, or field patch.')}
                  </Text>
                </View>
              </View>
            </View>
          </SectionCard>
        )}

        {apiState === 'loading' ? (
          <LoadingScanCard />
        ) : null}

        {apiState === 'error' && errorMessage ? (
          <SectionCard tone="muted">
            <View className="gap-2">
              <Text className="text-lg font-semibold text-ink-900">
                {t('Scan could not be completed')}
              </Text>
              <Text className="text-sm leading-6 text-ink-700">
                {__DEV__
                  ? errorMessage
                  : t('The scan could not be completed. Check your connection and image, then try again.')}
              </Text>
            </View>
          </SectionCard>
        ) : null}

        {apiState === 'empty' ? (
          <SectionCard tone="muted">
            <View className="gap-2">
              <Text className="text-lg font-semibold text-ink-900">{t('No usable matches found')}</Text>
              <Text className="text-sm leading-6 text-ink-700">
                {t(
                  'The scan finished, but there were not enough usable matches to show a result. Try a clearer image.',
                )}
              </Text>
            </View>
          </SectionCard>
        ) : null}

        {result ? (
          <ScanResultCard onOpenDetail={openResultDetail} result={result} />
        ) : null}
      </View>
    </ScreenContainer>
  );
}
