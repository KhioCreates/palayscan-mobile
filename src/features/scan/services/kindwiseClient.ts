const kindwiseConfig = {
  apiUrl: process.env.EXPO_PUBLIC_KINDWISE_API_URL,
  apiKey: process.env.EXPO_PUBLIC_KINDWISE_API_KEY,
  proxyUrl: process.env.EXPO_PUBLIC_SCAN_PROXY_URL,
  proxyKey: process.env.EXPO_PUBLIC_SCAN_PROXY_KEY,
};

export class KindwiseConfigError extends Error {}
export class KindwiseRequestError extends Error {}

const cropHealthDetails = [
  'type',
  'taxonomy',
  'description',
  'treatment',
  'symptoms',
  'severity',
  'spreading',
  'image',
  'images',
  'common_names',
  'wiki_url',
  'url',
  'eppo_code',
  'gbif_id',
];

export const requestedCropHealthDetails = cropHealthDetails;

function buildIdentificationUrl(apiUrl: string) {
  const trimmedUrl = apiUrl.trim().replace(/\/+$/, '');

  if (trimmedUrl.endsWith('/identification')) {
    return trimmedUrl;
  }

  return `${trimmedUrl}/identification`;
}

function buildIdentificationRequestUrl(apiUrl: string) {
  const url = new URL(apiUrl);
  url.searchParams.set('details', cropHealthDetails.join(','));
  url.searchParams.set('language', 'en');
  return url.toString();
}

export function validateKindwiseConfig() {
  if (!kindwiseConfig.apiUrl || !kindwiseConfig.apiKey) {
    throw new KindwiseConfigError(
      'Kindwise API configuration is missing. Add EXPO_PUBLIC_KINDWISE_API_URL and EXPO_PUBLIC_KINDWISE_API_KEY to your local env file.',
    );
  }

  return {
    apiUrl: buildIdentificationUrl(kindwiseConfig.apiUrl),
    apiKey: kindwiseConfig.apiKey,
  };
}

function getScanProxyConfig() {
  if (!kindwiseConfig.proxyUrl) {
    return null;
  }

  return {
    apiUrl: kindwiseConfig.proxyUrl.trim(),
    apiKey: kindwiseConfig.proxyKey?.trim(),
  };
}

function logKindwiseDebug(label: string, value: unknown) {
  if (__DEV__) {
    console.log(`[Kindwise] ${label}:`, value);
  }
}

export async function identifyRiceIssueFromBase64Images(base64Images: string[]) {
  if (base64Images.length === 0) {
    throw new KindwiseRequestError('Add at least one image before starting a live scan.');
  }

  const proxyConfig = getScanProxyConfig();

  if (proxyConfig) {
    logKindwiseDebug('proxy request url', proxyConfig.apiUrl);
    logKindwiseDebug('proxy key present', Boolean(proxyConfig.apiKey));
    logKindwiseDebug('proxy request body summary', {
      details: cropHealthDetails,
      imagesCount: base64Images.length,
      imageBase64Lengths: base64Images.map((image) => image.length),
    });

    const proxyResponse = await fetch(proxyConfig.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(proxyConfig.apiKey ? { Authorization: `Bearer ${proxyConfig.apiKey}` } : {}),
      },
      body: JSON.stringify({
        details: cropHealthDetails,
        images: base64Images,
        language: 'en',
        provider: 'crop.health',
      }),
    });

    const rawText = await proxyResponse.text();
    let payload: unknown = null;

    try {
      payload = rawText ? JSON.parse(rawText) : null;
    } catch {
      payload = rawText;
    }

    logKindwiseDebug('proxy response status', proxyResponse.status);
    logKindwiseDebug('proxy raw response body', payload);

    if (!proxyResponse.ok) {
      const errorRecord =
        payload && typeof payload === 'object' ? (payload as Record<string, unknown>) : null;
      const message =
        (errorRecord && typeof errorRecord.message === 'string' && errorRecord.message) ||
        (errorRecord && typeof errorRecord.error === 'string' && errorRecord.error) ||
        (typeof payload === 'string' && payload) ||
        `Scan proxy request failed with status ${proxyResponse.status}.`;

      throw new KindwiseRequestError(message);
    }

    return payload;
  }

  const { apiKey, apiUrl } = validateKindwiseConfig();

  const requestUrl = buildIdentificationRequestUrl(apiUrl);

  logKindwiseDebug('request url', requestUrl);
  logKindwiseDebug('api key present', Boolean(apiKey));
  logKindwiseDebug('api key prefix', apiKey.slice(0, 4));
  logKindwiseDebug('request body summary', {
    imagesCount: base64Images.length,
    imageBase64Lengths: base64Images.map((image) => image.length),
  });

  const response = await fetch(requestUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Api-Key': apiKey,
    },
    body: JSON.stringify({
      images: base64Images,
    }),
  });

  const rawText = await response.text();
  let payload: unknown = null;

  try {
    payload = rawText ? JSON.parse(rawText) : null;
  } catch {
    payload = rawText;
  }

  logKindwiseDebug('response status', response.status);
  logKindwiseDebug('raw response body', payload);

  if (!response.ok) {
    const errorRecord =
      payload && typeof payload === 'object' ? (payload as Record<string, unknown>) : null;
    const message =
      (errorRecord && typeof errorRecord.message === 'string' && errorRecord.message) ||
      (errorRecord && typeof errorRecord.error === 'string' && errorRecord.error) ||
      (typeof payload === 'string' && payload) ||
      `Kindwise request failed with status ${response.status}.`;

    throw new KindwiseRequestError(message);
  }

  return payload;
}

export async function identifyRiceIssueFromBase64(base64Image: string) {
  return identifyRiceIssueFromBase64Images([base64Image]);
}
