# PALAYSCAN live scan proxy

Kindwise recommends calling crop.health from your own backend before real users test the app. A mobile app can be inspected or intercepted, so a Kindwise API key stored in `EXPO_PUBLIC_KINDWISE_API_KEY` should be treated as development-only.

## App-side configuration

For local testing, PALAYSCAN can still call crop.health directly with:

```text
EXPO_PUBLIC_SCAN_MODE=live
EXPO_PUBLIC_KINDWISE_API_URL=https://crop.kindwise.com/api/v1
EXPO_PUBLIC_KINDWISE_API_KEY=...
```

Before production, prefer:

```text
EXPO_PUBLIC_SCAN_MODE=live
EXPO_PUBLIC_SCAN_PROXY_URL=https://your-backend.example.com/api/palayscan/identify
EXPO_PUBLIC_SCAN_PROXY_KEY=optional-public-client-token
```

When `EXPO_PUBLIC_SCAN_PROXY_URL` is set, the app sends this JSON body to your backend:

```json
{
  "provider": "crop.health",
  "language": "en",
  "details": [
    "type",
    "taxonomy",
    "description",
    "treatment",
    "symptoms",
    "severity",
    "spreading",
    "image",
    "images",
    "common_names",
    "wiki_url",
    "url",
    "eppo_code",
    "gbif_id"
  ],
  "images": ["base64-image-1", "base64-image-2"]
}
```

The backend should add the real `Api-Key` header and forward the request to:

```text
POST https://crop.kindwise.com/api/v1/identification?details=type,taxonomy,description,treatment,symptoms,severity,spreading,image,images,common_names,wiki_url,url,eppo_code,gbif_id&language=en
```

Return the crop.health response JSON unchanged so PALAYSCAN can parse the same result shape in direct and proxy mode.

## Backend checks to add

- Keep the Kindwise API key only in server environment variables.
- Reject requests with too many images or oversized base64 payloads.
- Rate-limit by user/device/session before calling crop.health.
- Log request timing and response status without storing raw photos unless you have user consent.
- Keep the existing PALAYSCAN same-problem rule: one scan should contain one rice problem from the same plant or field patch.
