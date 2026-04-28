import AsyncStorage from '@react-native-async-storage/async-storage';

const SCAN_CLIENT_ID_KEY = 'palayscan.scan.clientId.v1';

function createScanClientId() {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).slice(2, 12);
  return `ps_${timestamp}_${randomPart}`;
}

export async function getScanClientId() {
  const savedClientId = await AsyncStorage.getItem(SCAN_CLIENT_ID_KEY);

  if (savedClientId) {
    return savedClientId;
  }

  const nextClientId = createScanClientId();
  await AsyncStorage.setItem(SCAN_CLIENT_ID_KEY, nextClientId);
  return nextClientId;
}
