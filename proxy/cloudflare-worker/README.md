# PALAYSCAN scan proxy

Cloudflare Worker proxy for PALAYSCAN Android testing.

It keeps the Kindwise API key on the server, gives each app install a default scan quota, and can pause online scanning without uninstalling the APK from testers' phones.

## Endpoints

- `GET /status`
  Returns `open`, `paused`, or `closed`.
- `POST /scan`
  App scan endpoint. Checks app access, device quota, calls Kindwise, rejects obvious non-plant or non-rice responses, and returns the Kindwise response shape PALAYSCAN already understands.
- `POST /admin/topup`
  Adds scans to a device.
- `POST /admin/status`
  Sets runtime status to `open`, `paused`, or `closed`.

## Cloudflare setup

From this folder:

```bash
npx wrangler kv namespace create PALAYSCAN_SCAN_KV
```

Copy the returned namespace id into `wrangler.jsonc`.

Add secrets:

```bash
npx wrangler secret put KINDWISE_API_KEY
npx wrangler secret put SCAN_PROXY_CLIENT_KEY
npx wrangler secret put SCAN_PROXY_ADMIN_KEY
```

Deploy:

```bash
npx wrangler deploy
```

## App env for tester build

Use the Worker URL in the Expo app:

```text
EXPO_PUBLIC_SCAN_MODE=live
EXPO_PUBLIC_SCAN_PROXY_URL=https://palayscan-scan-proxy.your-account.workers.dev/scan
EXPO_PUBLIC_SCAN_PROXY_KEY=your-client-key

# Keep these commented for local fallback only.
# EXPO_PUBLIC_KINDWISE_API_URL=https://crop.kindwise.com/api/v1
# EXPO_PUBLIC_KINDWISE_API_KEY=your-kindwise-key
```

Do not put the Kindwise key in an Android tester build. `EXPO_PUBLIC_` values are bundled into the app.

## Admin examples

Pause online scanning:

```bash
curl -X POST https://palayscan-scan-proxy.your-account.workers.dev/admin/status \
  -H "Content-Type: application/json" \
  -H "X-Admin-Key: your-admin-key" \
  -d "{\"status\":\"paused\"}"
```

Open online scanning again:

```bash
curl -X POST https://palayscan-scan-proxy.your-account.workers.dev/admin/status \
  -H "Content-Type: application/json" \
  -H "X-Admin-Key: your-admin-key" \
  -d "{\"status\":\"open\"}"
```

Add five scans for a device:

```bash
curl -X POST https://palayscan-scan-proxy.your-account.workers.dev/admin/topup \
  -H "Content-Type: application/json" \
  -H "X-Admin-Key: your-admin-key" \
  -d "{\"clientId\":\"device-code-from-app\",\"scans\":5}"
```
