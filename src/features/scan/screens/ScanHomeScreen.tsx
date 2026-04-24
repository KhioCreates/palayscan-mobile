import { Ionicons } from '@expo/vector-icons';
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
import { ScanActionCard } from '../components/ScanActionCard';
import { ScanResultCard } from '../components/ScanResultCard';
import {
  KindwiseConfigError,
  KindwiseRequestError,
  identifyRiceIssueFromBase64,
} from '../services/kindwiseClient';
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
import { ScanApiState, ScanResult, SelectedScanImage } from '../types';

async function requestCameraAccess() {
  const permission = await ImagePicker.requestCameraPermissionsAsync();
  return permission.granted;
}

async function requestGalleryAccess() {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  return permission.granted;
}

const scanMode = process.env.EXPO_PUBLIC_SCAN_MODE === 'live' ? 'live' : 'mock';
const LIVE_ANALYZE_COOLDOWN_MS = 12000;
const LIVE_SCAN_SESSION_CAP = 4;
const LIVE_SCAN_GATE_CONFIDENCE_THRESHOLD = 0.7;

export function ScanHomeScreen() {
  const [selectedImage, setSelectedImage] = useState<SelectedScanImage | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [apiState, setApiState] = useState<ScanApiState>('idle');
  const [notes, setNotes] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [guardMessage, setGuardMessage] = useState<string | null>(null);
  const [confirmedRiceImage, setConfirmedRiceImage] = useState(false);
  const [lastAnalyzedImageUri, setLastAnalyzedImageUri] = useState<string | null>(null);
  const [validatedImageUri, setValidatedImageUri] = useState<string | null>(null);
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

  const isAnalyzeDisabled = useMemo(
    () => apiState === 'loading' || cooldownRemaining > 0,
    [apiState, cooldownRemaining],
  );

  const analyzeHint = useMemo(() => {
    if (apiState === 'loading') {
      return 'Analysis is already in progress. Please wait for it to finish.';
    }

    if (cooldownRemaining > 0) {
      return `Please wait ${cooldownRemaining}s before sending another ${scanMode} scan request.`;
    }

    if (scanMode === 'live' && liveScanCount >= LIVE_SCAN_SESSION_CAP) {
      return 'Live scan limit reached for this session to protect API credits.';
    }

    return scanMode === 'live'
      ? 'Analyze this image using the configured Kindwise API.'
      : 'Analyze this image using local mock scan mode.';
  }, [apiState, cooldownRemaining, liveScanCount]);

  const handleCameraCapture = async () => {
    const granted = await requestCameraAccess();

    if (!granted) {
      Alert.alert(
        'Camera permission needed',
        'Please allow camera access so you can capture a rice image for scanning.',
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
      setSelectedImage({
        uri: response.assets[0].uri,
        base64: response.assets[0].base64,
      });
      setResult(null);
      setApiState('idle');
      setErrorMessage(null);
      setGuardMessage(null);
      setConfirmedRiceImage(false);
      setLastAnalyzedImageUri(null);
      setValidatedImageUri(null);
    }
  };

  const handleGalleryPick = async () => {
    const granted = await requestGalleryAccess();

    if (!granted) {
      Alert.alert(
        'Gallery permission needed',
        'Please allow photo library access so you can choose a rice image to scan.',
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
      setSelectedImage({
        uri: response.assets[0].uri,
        base64: response.assets[0].base64,
      });
      setResult(null);
      setApiState('idle');
      setErrorMessage(null);
      setGuardMessage(null);
      setConfirmedRiceImage(false);
      setLastAnalyzedImageUri(null);
      setValidatedImageUri(null);
    }
  };

  const requestLocalRiceConfirmation = () =>
    new Promise<boolean>((resolve) => {
      Alert.alert(
        'Confirm rice image',
        'Continue only if this is a clear rice leaf, stem, or field photo. Do not analyze unrelated images.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => resolve(false),
          },
          {
            text: 'Continue',
            onPress: () => resolve(true),
          },
        ],
      );
    });

  const handleAnalyze = async () => {
    if (!selectedImage) {
      return;
    }

    if (apiState === 'loading') {
      return;
    }

    if (cooldownRemaining > 0) {
      setGuardMessage(`Please wait ${cooldownRemaining}s before analyzing again.`);
      return;
    }

    if (selectedImage.uri === lastAnalyzedImageUri) {
      setGuardMessage(
        scanMode === 'live'
          ? 'This image was already analyzed in this session. Change the image before sending another live scan.'
          : 'This image was already analyzed. Choose a new image or retake it first.',
      );
      return;
    }

    if (scanMode === 'live' && liveScanCount >= LIVE_SCAN_SESSION_CAP) {
      setGuardMessage(
        'Live scan limit reached for this session to protect API credits. Restart the app or switch to mock mode.',
      );
      return;
    }

    const localGate = getLocalScanGateResult({
      confirmedRiceImage,
      imageUri: selectedImage.uri,
      validatedImageUri,
    });

    if (localGate.status === 'confirm-required') {
      if (!confirmedRiceImage) {
        setGuardMessage(localGate.message);
        return;
      }

      const confirmed = await requestLocalRiceConfirmation();

      if (!confirmed) {
        setGuardMessage('Scan canceled. Please choose a clear rice leaf, stem, or field photo.');
        return;
      }

      setValidatedImageUri(selectedImage.uri);
    }

    setApiState('loading');
    setResult(null);
    setErrorMessage(null);
    setGuardMessage(null);

    try {
      if (scanMode === 'live') {
        const gateResult = await runLiveScanPrecheckFromBase64(selectedImage.base64);
        const gateDecision = shouldAllowLiveScanFromGate(
          gateResult,
          LIVE_SCAN_GATE_CONFIDENCE_THRESHOLD,
        );

        if (!gateDecision.allowed) {
          setApiState('idle');
          setGuardMessage(
            gateDecision.reason ??
              'This image did not pass the live pre-check. Please try another rice photo.',
          );
          return;
        }
      }

      const routerPrefilter = await runRouterPrefilter(selectedImage.uri);

      if (routerPrefilter.verdict === 'block') {
        setApiState('idle');
        setGuardMessage(
          routerPrefilter.reason ??
            'This image was blocked by the local pre-check.',
        );
        return;
      }

      const mappedResult =
        scanMode === 'live'
          ? mapKindwiseResponseToScanResult({
              imageUri: selectedImage.uri,
              notes,
              response: await identifyRiceIssueFromBase64(selectedImage.base64),
            })
          : {
              ...buildPlaceholderScanResult(selectedImage.uri),
              notes: notes.trim() || undefined,
            };

      setLastAnalyzedImageUri(selectedImage.uri);

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
          saveDecision.reason ?? 'This scan result was not saved because it did not pass local validation.',
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
          : 'The image could not be analyzed right now. Please try again.';

      setErrorMessage(message);
      setApiState('error');
    } finally {
      if (scanMode === 'live') {
        setCooldownUntil(Date.now() + LIVE_ANALYZE_COOLDOWN_MS);
      }
    }
  };

  return (
    <ScreenContainer bottomSpacing="comfortable">
      <HeaderBlock
        eyebrow="Scan Module"
        title="Capture or upload a rice image"
        description="Choose a clear rice photo, then analyze it to view the strongest crop health matches."
      />

      <View className="gap-4">
        <ScanActionCard
          description="Use the device camera to capture a clear rice pest or disease image."
          icon="camera-outline"
          onPress={handleCameraCapture}
          title="Capture with camera"
        />

        <ScanActionCard
          description="Choose an existing image from the device gallery."
          icon="images-outline"
          onPress={handleGalleryPick}
          title="Choose from gallery"
        />

        {selectedImage ? (
          <SectionCard>
            <View className="gap-4">
              <View className="gap-2">
                <Text className="text-lg font-semibold text-ink-900">Selected image</Text>
                <Text className="text-sm leading-6 text-ink-600">
                  Preview the image before analyzing. You can replace it anytime using camera or gallery.
                </Text>
              </View>

              <Image
                source={{ uri: selectedImage.uri }}
                className="h-[240px] w-full rounded-[22px] bg-brand-100"
                resizeMode="cover"
              />

              <View className="gap-2">
                <Text className="text-sm font-semibold text-ink-900">Optional notes</Text>
                <TextInput
                  className="min-h-[96px] rounded-[20px] bg-brand-50 px-4 py-3 text-sm text-ink-900"
                  multiline
                  onChangeText={setNotes}
                  placeholder="Add short notes for this scan result later if needed."
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
                  I confirm this is a clear rice leaf, stem, or field photo.
                </Text>
              </Pressable>

              {guardMessage ? (
                <View className="rounded-[18px] bg-earth-50 px-4 py-3">
                  <Text className="text-sm leading-6 text-ink-700">{guardMessage}</Text>
                </View>
              ) : null}

              {scanMode === 'live' ? (
                <View className="rounded-[18px] bg-earth-50 px-4 py-3">
                  <Text className="text-sm leading-6 text-ink-700">
                    Live scans use Kindwise credits. Only analyze clear rice leaf, stem, or field
                    images when you are ready to send a real request.
                  </Text>
                </View>
              ) : null}

              <PrimaryButton
                disabled={isAnalyzeDisabled}
                hint={analyzeHint}
                icon={<Ionicons color="white" name="sparkles-outline" size={22} />}
                label="Analyze image"
                onPress={handleAnalyze}
              />
            </View>
          </SectionCard>
        ) : null}

        {apiState === 'loading' ? (
          <SectionCard tone="muted">
            <View className="items-center gap-3 py-3">
              <ActivityIndicator color="#2d6033" />
              <Text className="text-base font-semibold text-ink-900">Analyzing image</Text>
              <Text className="text-center text-sm leading-6 text-ink-600">
                {scanMode === 'live'
                  ? 'The image is being checked through the configured Kindwise scan request.'
                  : 'The image is being checked using local mock scan mode.'}
              </Text>
            </View>
          </SectionCard>
        ) : null}

        {apiState === 'error' && errorMessage ? (
          <SectionCard tone="muted">
            <View className="gap-2">
              <Text className="text-lg font-semibold text-ink-900">Scan could not be completed</Text>
              <Text className="text-sm leading-6 text-ink-600">
                {__DEV__
                  ? errorMessage
                  : 'The scan could not be completed. Check your connection and image, then try again.'}
              </Text>
            </View>
          </SectionCard>
        ) : null}

        {apiState === 'empty' ? (
          <SectionCard tone="muted">
            <View className="gap-2">
              <Text className="text-lg font-semibold text-ink-900">No usable matches found</Text>
              <Text className="text-sm leading-6 text-ink-600">
                The scan finished, but there were not enough usable matches to show a result. Try a clearer image.
              </Text>
            </View>
          </SectionCard>
        ) : null}

        {result ? <ScanResultCard result={result} /> : null}
      </View>
    </ScreenContainer>
  );
}
