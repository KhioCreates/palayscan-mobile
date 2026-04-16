const kindwiseConfig = {
  apiUrl: process.env.EXPO_PUBLIC_KINDWISE_API_URL,
  apiKey: process.env.EXPO_PUBLIC_KINDWISE_API_KEY,
};

export class KindwiseConfigError extends Error {}
export class KindwiseRequestError extends Error {}

function buildIdentificationUrl(apiUrl: string) {
  const trimmedUrl = apiUrl.trim().replace(/\/+$/, '');

  if (trimmedUrl.endsWith('/identification')) {
    return trimmedUrl;
  }

  return `${trimmedUrl}/identification`;
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

function logKindwiseDebug(label: string, value: unknown) {
  if (__DEV__) {
    console.log(`[Kindwise] ${label}:`, value);
  }
}

export async function identifyRiceIssueFromBase64(base64Image: string) {
  const { apiKey, apiUrl } = validateKindwiseConfig();

  logKindwiseDebug('request url', apiUrl);
  logKindwiseDebug('api key present', Boolean(apiKey));
  logKindwiseDebug('api key prefix', apiKey.slice(0, 4));
  logKindwiseDebug('request body summary', {
    imagesCount: 1,
    imageBase64Length: base64Image.length,
  });

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Api-Key': apiKey,
    },
    body: JSON.stringify({
      images: [base64Image],
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
