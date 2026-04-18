import AsyncStorage from '@react-native-async-storage/async-storage';

import { storageKeys } from '../../../lib/storage/keys';
import { SavedScanRecord, ScanMode, ScanResult } from '../types';

function buildScanRecordId(result: ScanResult) {
  const safeUri = result.imageUri.replace(/[^a-zA-Z0-9]/g, '').slice(-16);
  return `scan-${result.scannedAt}-${safeUri}`;
}

export async function getScanHistory(): Promise<SavedScanRecord[]> {
  const raw = await AsyncStorage.getItem(storageKeys.scanHistory);

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as SavedScanRecord[];
    return parsed.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch {
    return [];
  }
}

export async function saveScanResult(result: ScanResult, mode: ScanMode): Promise<SavedScanRecord> {
  const history = await getScanHistory();
  const normalizedNotes = result.notes?.trim() || undefined;
  const record: SavedScanRecord = {
    id: buildScanRecordId(result),
    createdAt: new Date().toISOString(),
    scannedAt: result.scannedAt,
    imageUri: result.imageUri,
    mode,
    topResultName: result.topResultName,
    category: result.category,
    confidence: result.predictions[0]?.confidence ?? 0,
    predictions: result.predictions,
    notes: normalizedNotes,
    nonPlantWarning: result.nonPlantWarning,
    riceMismatchWarning: result.riceMismatchWarning,
    result: {
      ...result,
      notes: normalizedNotes,
    },
  };

  const nextHistory = [record, ...history.filter((item) => item.id !== record.id)];
  await AsyncStorage.setItem(storageKeys.scanHistory, JSON.stringify(nextHistory));
  return record;
}

export async function getScanRecordById(id: string): Promise<SavedScanRecord | null> {
  const history = await getScanHistory();
  return history.find((record) => record.id === id) ?? null;
}

export async function deleteScanRecord(id: string): Promise<void> {
  const history = await getScanHistory();
  const nextHistory = history.filter((record) => record.id !== id);
  await AsyncStorage.setItem(storageKeys.scanHistory, JSON.stringify(nextHistory));
}

export async function clearScanHistory(): Promise<void> {
  await AsyncStorage.removeItem(storageKeys.scanHistory);
}
