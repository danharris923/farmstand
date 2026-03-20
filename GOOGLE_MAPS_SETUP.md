# Google Maps API Setup

## Steps to get your API key

1. Go to https://console.cloud.google.com/
2. Create a new project called "farmstand"
3. Enable these APIs:
   - **Maps JavaScript API** (for the frontend map)
   - **Places API (New)** (for place details/autocomplete)
   - **Geocoding API** (optional, for address lookup)
4. Go to **APIs & Services > Credentials**
5. Click **Create Credentials > API Key**
6. Restrict the key:
   - **Application restrictions**: HTTP referrers
   - Add your domains: `*.vercel.app/*`, `localhost:3000/*`, your custom domain
   - **API restrictions**: Restrict to Maps JavaScript API, Places API
7. Copy the key

## Add to your environment

### Local development
Add to `app/.env.local`:
```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIza...your-key...
```

### Vercel production
```bash
echo "AIza...your-key..." | vercel env add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY production
echo "AIza...your-key..." | vercel env add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY preview
```

## Free tier (as of March 2025+)
- Maps JavaScript API: 28,000 free map loads/month
- Places API Essentials: 10,000 free calls/month
- No $200 blanket credit anymore — per-SKU free quotas instead
- Billing account required even for free tier

## Install gcloud CLI (optional)
```bash
scoop install gcloud  # or winget install Google.CloudSDK
gcloud init
gcloud services enable maps-backend.googleapis.com places-backend.googleapis.com
gcloud alpha services api-keys create --display-name="farmstand"
```
