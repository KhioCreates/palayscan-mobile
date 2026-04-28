const DEFAULT_KINDWISE_API_URL = 'https://crop.kindwise.com/api/v1';
const DEFAULT_DETAILS = [
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

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization,Content-Type,X-Admin-Key',
};

function jsonResponse(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      ...CORS_HEADERS,
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
}

function normalizeStatus(value) {
  const status = String(value || 'open').trim().toLowerCase();
  return ['open', 'paused', 'closed'].includes(status) ? status : 'open';
}

function parseInteger(value, fallback) {
  const parsed = Number.parseInt(String(value || ''), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function readBearerToken(request) {
  const authorization = request.headers.get('Authorization') || '';
  const match = authorization.match(/^Bearer\s+(.+)$/i);
  return match ? match[1].trim() : '';
}

function assertClientAccess(request, env) {
  const expectedToken = env.SCAN_PROXY_CLIENT_KEY;

  if (!expectedToken) {
    return;
  }

  if (readBearerToken(request) !== expectedToken) {
    throw new Response(
      JSON.stringify({
        error: 'unauthorized',
        message: 'Scan access is not allowed for this app build.',
      }),
      {
        status: 401,
        headers: {
          ...CORS_HEADERS,
          'Content-Type': 'application/json; charset=utf-8',
        },
      },
    );
  }
}

function assertAdminAccess(request, env) {
  const expectedToken = env.SCAN_PROXY_ADMIN_KEY;

  if (!expectedToken) {
    throw new Response(
      JSON.stringify({
        error: 'admin_not_configured',
        message: 'Admin access is not configured for this proxy.',
      }),
      {
        status: 503,
        headers: {
          ...CORS_HEADERS,
          'Content-Type': 'application/json; charset=utf-8',
        },
      },
    );
  }

  const providedToken = request.headers.get('X-Admin-Key') || readBearerToken(request);

  if (providedToken !== expectedToken) {
    throw new Response(
      JSON.stringify({
        error: 'unauthorized',
        message: 'Admin access is not allowed.',
      }),
      {
        status: 401,
        headers: {
          ...CORS_HEADERS,
          'Content-Type': 'application/json; charset=utf-8',
        },
      },
    );
  }
}

async function readJson(request) {
  try {
    return await request.json();
  } catch {
    throw new Response(
      JSON.stringify({
        error: 'invalid_json',
        message: 'Request body must be valid JSON.',
      }),
      {
        status: 400,
        headers: {
          ...CORS_HEADERS,
          'Content-Type': 'application/json; charset=utf-8',
        },
      },
    );
  }
}

function cleanBase64Image(value) {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  const dataUrlMatch = trimmed.match(/^data:image\/[a-z0-9.+-]+;base64,(.+)$/i);
  return dataUrlMatch ? dataUrlMatch[1] : trimmed;
}

function approximateBase64Bytes(base64Value) {
  const padding = base64Value.endsWith('==') ? 2 : base64Value.endsWith('=') ? 1 : 0;
  return Math.max(0, Math.floor((base64Value.length * 3) / 4) - padding);
}

function validateScanPayload(payload, env) {
  if (!payload || typeof payload !== 'object') {
    throw new Response(
      JSON.stringify({
        error: 'invalid_payload',
        message: 'Scan request is missing.',
      }),
      {
        status: 400,
        headers: {
          ...CORS_HEADERS,
          'Content-Type': 'application/json; charset=utf-8',
        },
      },
    );
  }

  const clientId = typeof payload.clientId === 'string' ? payload.clientId.trim() : '';

  if (!clientId || clientId.length < 8 || clientId.length > 120) {
    throw new Response(
      JSON.stringify({
        error: 'missing_client_id',
        message: 'This app install needs a valid scan device code.',
      }),
      {
        status: 400,
        headers: {
          ...CORS_HEADERS,
          'Content-Type': 'application/json; charset=utf-8',
        },
      },
    );
  }

  const maxImages = parseInteger(env.SCAN_MAX_IMAGES, 5);
  const maxImageBytes = parseInteger(env.SCAN_MAX_IMAGE_BYTES, 5 * 1024 * 1024);
  const rawImages = Array.isArray(payload.images) ? payload.images : [];

  if (rawImages.length === 0) {
    throw new Response(
      JSON.stringify({
        error: 'missing_images',
        message: 'Add at least one rice photo before scanning.',
      }),
      {
        status: 400,
        headers: {
          ...CORS_HEADERS,
          'Content-Type': 'application/json; charset=utf-8',
        },
      },
    );
  }

  if (rawImages.length > maxImages) {
    throw new Response(
      JSON.stringify({
        error: 'too_many_images',
        message: `Use up to ${maxImages} photos in one scan.`,
      }),
      {
        status: 413,
        headers: {
          ...CORS_HEADERS,
          'Content-Type': 'application/json; charset=utf-8',
        },
      },
    );
  }

  const images = rawImages.map(cleanBase64Image);

  if (images.some((image) => !image)) {
    throw new Response(
      JSON.stringify({
        error: 'invalid_images',
        message: 'One or more photos could not be read.',
      }),
      {
        status: 400,
        headers: {
          ...CORS_HEADERS,
          'Content-Type': 'application/json; charset=utf-8',
        },
      },
    );
  }

  const oversizedImage = images.find((image) => approximateBase64Bytes(image) > maxImageBytes);

  if (oversizedImage) {
    throw new Response(
      JSON.stringify({
        error: 'image_too_large',
        message: 'One photo is too large. Retake or choose a smaller photo.',
      }),
      {
        status: 413,
        headers: {
          ...CORS_HEADERS,
          'Content-Type': 'application/json; charset=utf-8',
        },
      },
    );
  }

  return {
    clientId,
    images,
    details: Array.isArray(payload.details) && payload.details.length > 0 ? payload.details : DEFAULT_DETAILS,
    language: typeof payload.language === 'string' && payload.language.trim() ? payload.language.trim() : 'en',
  };
}

async function sha256Hex(value) {
  const bytes = new TextEncoder().encode(value);
  const hashBuffer = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(hashBuffer)]
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

function quotaKey(clientHash) {
  return `quota:${clientHash}`;
}

async function getQuotaState(env, clientHash) {
  const defaultQuota = parseInteger(env.SCAN_DEFAULT_QUOTA, 5);
  const saved = await env.PALAYSCAN_SCAN_KV.get(quotaKey(clientHash), 'json');

  if (saved && typeof saved === 'object') {
    return {
      remaining: Number.isFinite(saved.remaining) ? saved.remaining : defaultQuota,
      used: Number.isFinite(saved.used) ? saved.used : 0,
      createdAt: typeof saved.createdAt === 'string' ? saved.createdAt : new Date().toISOString(),
      updatedAt: typeof saved.updatedAt === 'string' ? saved.updatedAt : new Date().toISOString(),
    };
  }

  const now = new Date().toISOString();
  return {
    remaining: defaultQuota,
    used: 0,
    createdAt: now,
    updatedAt: now,
  };
}

async function saveQuotaState(env, clientHash, state) {
  await env.PALAYSCAN_SCAN_KV.put(
    quotaKey(clientHash),
    JSON.stringify({
      ...state,
      updatedAt: new Date().toISOString(),
    }),
  );
}

async function getRuntimeStatus(env) {
  const saved = await env.PALAYSCAN_SCAN_KV.get('config:status');
  return normalizeStatus(saved || env.SCAN_BETA_STATUS);
}

function buildKindwiseUrl(env, details, language) {
  const baseUrl = String(env.KINDWISE_API_URL || DEFAULT_KINDWISE_API_URL)
    .trim()
    .replace(/\/+$/, '');
  const endpoint = baseUrl.endsWith('/identification') ? baseUrl : `${baseUrl}/identification`;
  const url = new URL(endpoint);
  url.searchParams.set('details', details.join(','));
  url.searchParams.set('language', language || 'en');
  return url.toString();
}

function readName(record) {
  if (!record || typeof record !== 'object') {
    return '';
  }

  const values = [
    record.name,
    record.common_name,
    record.commonName,
    record.scientific_name,
    record.scientificName,
  ];

  for (const value of values) {
    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
  }

  return '';
}

function readScientificName(record) {
  if (!record || typeof record !== 'object') {
    return '';
  }

  const values = [
    record.scientific_name,
    record.scientificName,
    record.name,
  ];

  for (const value of values) {
    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
  }

  if (record.taxonomy && typeof record.taxonomy === 'object') {
    const taxonomy = record.taxonomy;
    const taxonomyValues = [taxonomy.species, taxonomy.genus];

    for (const value of taxonomyValues) {
      if (typeof value === 'string' && value.trim()) {
        return value.trim();
      }
    }
  }

  return '';
}

function readConfidence(record) {
  if (!record || typeof record !== 'object') {
    return 0;
  }

  const value = record.probability ?? record.confidence ?? record.score ?? record.similarity;

  if (typeof value === 'number') {
    return value > 1 ? value / 100 : value;
  }

  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? (parsed > 1 ? parsed / 100 : parsed) : 0;
  }

  return 0;
}

function collectCropSuggestions(payload) {
  const paths = [
    ['result', 'crop', 'suggestions'],
    ['crop', 'suggestions'],
  ];
  const suggestions = [];

  for (const path of paths) {
    let current = payload;

    for (const key of path) {
      if (!current || typeof current !== 'object') {
        current = null;
        break;
      }

      current = current[key];
    }

    if (!Array.isArray(current)) {
      continue;
    }

    for (const entry of current) {
      const label = readName(entry);

      if (!label) {
        continue;
      }

      suggestions.push({
        label,
        scientificName: readScientificName(entry),
        confidence: readConfidence(entry),
      });
    }
  }

  return suggestions.sort((a, b) => b.confidence - a.confidence);
}

function readIsPlantBinary(payload) {
  const isPlant = payload?.result?.is_plant;
  return typeof isPlant?.binary === 'boolean' ? isPlant.binary : null;
}

function looksLikeRice(suggestion) {
  if (!suggestion) {
    return true;
  }

  const combined = `${suggestion.label} ${suggestion.scientificName || ''}`.toLowerCase();
  return combined.includes('rice') || combined.includes('oryza sativa');
}

function buildRejectedImageResponse(payload, quotaState) {
  if (readIsPlantBinary(payload) === false) {
    return jsonResponse(
      {
        error: 'non_plant_image',
        message: 'This photo does not clearly show a plant. Please use a clear palay leaf, stem, panicle, or field photo.',
        scansRemaining: quotaState.remaining,
      },
      422,
    );
  }

  const topCrop = collectCropSuggestions(payload)[0];

  if (!looksLikeRice(topCrop)) {
    return jsonResponse(
      {
        error: 'not_rice_image',
        message: 'This photo does not clearly look like palay. Please use a clear rice leaf, stem, panicle, or field photo.',
        cropLabel: topCrop?.label,
        cropScientificName: topCrop?.scientificName,
        scansRemaining: quotaState.remaining,
      },
      422,
    );
  }

  return null;
}

async function callKindwise({ env, details, images, language }) {
  if (!env.KINDWISE_API_KEY) {
    return jsonResponse(
      {
        error: 'kindwise_key_missing',
        message: 'Scan service is not configured yet.',
      },
      503,
    );
  }

  const response = await fetch(buildKindwiseUrl(env, details, language), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Api-Key': env.KINDWISE_API_KEY,
    },
    body: JSON.stringify({ images }),
  });

  const rawText = await response.text();
  let payload = null;

  try {
    payload = rawText ? JSON.parse(rawText) : null;
  } catch {
    payload = rawText;
  }

  return {
    ok: response.ok,
    status: response.status,
    payload,
  };
}

async function handleStatus(env) {
  return jsonResponse({
    status: await getRuntimeStatus(env),
    defaultQuota: parseInteger(env.SCAN_DEFAULT_QUOTA, 5),
  });
}

async function handleScan(request, env) {
  assertClientAccess(request, env);

  const status = await getRuntimeStatus(env);

  if (status !== 'open') {
    return jsonResponse(
      {
        error: 'testing_closed',
        message: 'PALAYSCAN online scanning is not available right now.',
        status,
      },
      403,
    );
  }

  const scanRequest = validateScanPayload(await readJson(request), env);
  const clientHash = await sha256Hex(scanRequest.clientId);
  const quotaState = await getQuotaState(env, clientHash);

  if (quotaState.remaining <= 0) {
    return jsonResponse(
      {
        error: 'scan_quota_empty',
        message: 'No scans remaining for this device. Please message the project developer for more scans.',
        scansRemaining: 0,
      },
      429,
    );
  }

  const kindwiseResult = await callKindwise({
    env,
    details: scanRequest.details,
    images: scanRequest.images,
    language: scanRequest.language,
  });

  if (kindwiseResult instanceof Response) {
    return kindwiseResult;
  }

  if (!kindwiseResult.ok) {
    return jsonResponse(
      {
        error: 'scan_provider_error',
        message: 'The online scan service could not check this photo right now.',
        providerStatus: kindwiseResult.status,
      },
      kindwiseResult.status >= 500 ? 502 : 400,
    );
  }

  quotaState.remaining = Math.max(0, quotaState.remaining - 1);
  quotaState.used += 1;
  quotaState.lastScanAt = new Date().toISOString();
  await saveQuotaState(env, clientHash, quotaState);

  if (!kindwiseResult.payload || typeof kindwiseResult.payload !== 'object') {
    return jsonResponse(
      {
        error: 'invalid_provider_response',
        message: 'The online scan service returned an unreadable response.',
        scansRemaining: quotaState.remaining,
      },
      502,
    );
  }

  const rejection = buildRejectedImageResponse(kindwiseResult.payload, quotaState);

  if (rejection) {
    return rejection;
  }

  return jsonResponse({
    ...kindwiseResult.payload,
    palayscan: {
      scansRemaining: quotaState.remaining,
      scansUsed: quotaState.used,
    },
  });
}

async function handleAdminTopup(request, env) {
  assertAdminAccess(request, env);

  const payload = await readJson(request);
  const clientId = typeof payload.clientId === 'string' ? payload.clientId.trim() : '';
  const clientHash =
    typeof payload.clientHash === 'string' && payload.clientHash.trim()
      ? payload.clientHash.trim()
      : clientId
        ? await sha256Hex(clientId)
        : '';
  const scans = parseInteger(payload.scans, 5);

  if (!clientHash) {
    return jsonResponse(
      {
        error: 'missing_client',
        message: 'Provide clientId or clientHash.',
      },
      400,
    );
  }

  const quotaState = await getQuotaState(env, clientHash);
  quotaState.remaining += scans;
  await saveQuotaState(env, clientHash, quotaState);

  return jsonResponse({
    ok: true,
    clientHash,
    scansAdded: scans,
    scansRemaining: quotaState.remaining,
  });
}

async function handleAdminStatus(request, env) {
  assertAdminAccess(request, env);

  const payload = await readJson(request);
  const status = normalizeStatus(payload.status);
  await env.PALAYSCAN_SCAN_KV.put('config:status', status);

  return jsonResponse({
    ok: true,
    status,
  });
}

async function routeRequest(request, env) {
  if (!env.PALAYSCAN_SCAN_KV) {
    return jsonResponse(
      {
        error: 'kv_missing',
        message: 'Scan quota storage is not configured.',
      },
      503,
    );
  }

  const url = new URL(request.url);
  const path = url.pathname.replace(/\/+$/, '') || '/';

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  if (request.method === 'GET' && path === '/status') {
    return handleStatus(env);
  }

  if (request.method === 'POST' && ['/', '/scan', '/identify'].includes(path)) {
    return handleScan(request, env);
  }

  if (request.method === 'POST' && path === '/admin/topup') {
    return handleAdminTopup(request, env);
  }

  if (request.method === 'POST' && path === '/admin/status') {
    return handleAdminStatus(request, env);
  }

  return jsonResponse(
    {
      error: 'not_found',
      message: 'Endpoint not found.',
    },
    404,
  );
}

export default {
  async fetch(request, env) {
    try {
      return await routeRequest(request, env);
    } catch (error) {
      if (error instanceof Response) {
        return error;
      }

      return jsonResponse(
        {
          error: 'proxy_error',
          message: 'The scan proxy could not complete this request.',
        },
        500,
      );
    }
  },
};
