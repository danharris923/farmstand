/**
 * Data Loader: Fetches market data from BC Farmers Market Trail WP REST API
 * and upserts it into Supabase.
 *
 * Usage:
 *   npx tsx scripts/load-markets.ts
 *
 * Requires env vars: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const API_URL =
  "https://bcfarmersmarkettrail.com/wp-json/wp/v2/market?per_page=100";

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars");
  console.error("Run: source .env.local (or set them in your shell)");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ---------------------------------------------------------------------------
// Fetch all markets from the WP REST API
// ---------------------------------------------------------------------------
async function fetchAllMarkets(): Promise<any[]> {
  const allMarkets: any[] = [];
  let page = 1;

  while (true) {
    const url = `${API_URL}&page=${page}&_embed`;
    console.log(`📡 Fetching page ${page}: ${url}`);

    const resp = await fetch(url, {
      headers: { "User-Agent": "FarmstandLoader/1.0" },
    });

    if (!resp.ok) {
      if (resp.status === 400) break; // past last page
      throw new Error(`API error: ${resp.status} ${resp.statusText}`);
    }

    const data = await resp.json();
    if (!data.length) break;

    allMarkets.push(...data);
    console.log(`  ✓ Got ${data.length} markets (total: ${allMarkets.length})`);

    const totalPages = parseInt(resp.headers.get("X-WP-TotalPages") || "1");
    if (page >= totalPages) break;

    page++;
    await new Promise((r) => setTimeout(r, 500));
  }

  return allMarkets;
}

// ---------------------------------------------------------------------------
// Normalize a WP market into our Supabase schema
// ---------------------------------------------------------------------------
function normalizeMarket(raw: any) {
  // custom_fields contains the rich data (address, coords, hours, etc.)
  // It can be a dict (single market) or array with one dict (list endpoint)
  let cf = raw.custom_fields || {};
  if (Array.isArray(cf)) cf = cf[0] || {};
  const basicDetails = cf.basic_details || {};
  const regionData = cf.region || {};
  const mapMarker = regionData.map_marker || {};
  const hoursDays = cf.hours_days || [];

  const title = raw.title?.rendered || "";
  const name = title
    .replace(/&#8217;/g, "'")
    .replace(/&#8211;/g, "–")
    .replace(/&#8216;/g, "'")
    .replace(/&#038;/g, "&")
    .replace(/&amp;/g, "&");

  // Resolve taxonomy terms from _embedded
  const embeddedTerms = raw._embedded?.["wp:term"] || [];
  const regionTerms: string[] = [];
  const featureTerms: string[] = [];
  const productTerms: string[] = [];
  const seasonTerms: string[] = [];

  for (const group of embeddedTerms) {
    if (!Array.isArray(group)) continue;
    for (const term of group) {
      switch (term.taxonomy) {
        case "region":
          regionTerms.push(term.name);
          break;
        case "feature":
          featureTerms.push(term.name);
          break;
        case "product":
          productTerms.push(term.name);
          break;
        case "season":
          seasonTerms.push(term.name);
          break;
      }
    }
  }

  // Determine season type
  let seasonType: string | null = null;
  if (seasonTerms.some((s) => s.toLowerCase().includes("year")))
    seasonType = "year-round";
  else if (seasonTerms.some((s) => s.toLowerCase() === "winter"))
    seasonType = "winter";
  else if (seasonTerms.some((s) => s.toLowerCase() === "summer"))
    seasonType = "summer";

  // Extract region (broadest) and community
  const bcRegions = [
    "Thompson Okanagan", "Metro Vancouver", "Vancouver Island",
    "Kootenay Rockies", "Fraser Valley", "Cariboo Chilcotin Coast",
    "Northern BC", "Sea to Sky", "Sunshine Coast", "City of Vancouver",
    "Vancouver Island & Gulf Islands", "Sea to Sky & Sunshine Coast",
  ];
  const region = regionTerms.find((r) => bcRegions.includes(r)) || null;
  const community = regionTerms.find((r) => !bcRegions.includes(r)) || null;

  // Strip HTML from description
  const content = raw.content?.rendered || "";
  const description = content
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&#8217;/g, "'")
    .trim()
    .slice(0, 2000);

  // Extract featured image
  let imageUrl: string | null = null;
  const embedded = raw._embedded?.["wp:featuredmedia"];
  if (embedded?.[0]?.source_url) {
    imageUrl = embedded[0].source_url;
  }

  // Parse hours from hours_days array
  const hours = parseHoursDays(hoursDays);

  // Get season dates from first hours_days entry
  let seasonStart: string | null = null;
  let seasonEnd: string | null = null;
  if (Array.isArray(hoursDays) && hoursDays.length > 0) {
    seasonStart = hoursDays[0]?.season_opens || null;
    seasonEnd = hoursDays[0]?.season_closes || null;
  }

  return {
    market: {
      name,
      slug: raw.slug,
      source_url: raw.link || null,
      address: basicDetails.street_address || null,
      city: basicDetails.city || null,
      province: basicDetails.province || "BC",
      postal_code: basicDetails.postal_code || null,
      latitude: mapMarker.lat ? parseFloat(mapMarker.lat) : null,
      longitude: mapMarker.lng ? parseFloat(mapMarker.lng) : null,
      region,
      community,
      season_type: seasonType,
      season_start: seasonStart,
      season_end: seasonEnd,
      phone: basicDetails.phone_number || null,
      email: basicDetails.email_address || null,
      website: basicDetails.website || null,
      facebook: basicDetails.facebook || null,
      instagram: basicDetails.instagram || null,
      twitter: basicDetails.twitter || null,
      description: description || null,
      image_url: imageUrl,
      indigenous_territory: basicDetails.city_name || null,
      is_active: true,
      last_scraped_at: new Date().toISOString(),
    },
    hours,
    products: productTerms,
    features: featureTerms,
  };
}

function parseHoursDays(
  hoursDays: any
): { day_of_week: string; open_time: string | null; close_time: string | null }[] {
  if (!Array.isArray(hoursDays)) return [];

  const dayNames = [
    "Sunday", "Monday", "Tuesday", "Wednesday",
    "Thursday", "Friday", "Saturday",
  ];
  const result: any[] = [];

  for (const entry of hoursDays) {
    const days = entry.days_of_week || [];
    for (let i = 0; i < days.length; i++) {
      const dayIndex = parseInt(days[i]);
      const dayName = isNaN(dayIndex) ? days[i] : (dayNames[dayIndex] || days[i]);

      // Hours stored as hours_0, hours_1, etc. matching the day index
      const hourKey = `hours_${dayIndex}`;
      const hourData = entry[hourKey] || {};

      result.push({
        day_of_week: dayName,
        open_time: hourData.open_time || null,
        close_time: hourData.close_time || null,
      });
    }
  }

  return result;
}

// ---------------------------------------------------------------------------
// Upsert into Supabase
// ---------------------------------------------------------------------------
async function upsertMarket(normalized: ReturnType<typeof normalizeMarket>) {
  const { market, hours, products, features } = normalized;

  // Upsert the market (match on slug)
  const { data: upserted, error: marketError } = await supabase
    .from("markets")
    .upsert(market, { onConflict: "slug" })
    .select("id")
    .single();

  if (marketError) {
    console.error(`  ✗ Failed to upsert ${market.name}: ${marketError.message}`);
    return false;
  }

  const marketId = upserted.id;

  // Clear old related data and re-insert
  await Promise.all([
    supabase.from("market_hours").delete().eq("market_id", marketId),
    supabase.from("market_products").delete().eq("market_id", marketId),
    supabase.from("market_features").delete().eq("market_id", marketId),
  ]);

  // Insert hours
  if (hours.length > 0) {
    const { error: hoursError } = await supabase
      .from("market_hours")
      .insert(hours.map((h) => ({ ...h, market_id: marketId })));
    if (hoursError) console.warn(`  ⚠ Hours insert error: ${hoursError.message}`);
  }

  // Insert products
  if (products.length > 0) {
    const { error: prodError } = await supabase
      .from("market_products")
      .insert(products.map((p) => ({ market_id: marketId, product: p })));
    if (prodError) console.warn(`  ⚠ Products insert error: ${prodError.message}`);
  }

  // Insert features
  if (features.length > 0) {
    const { error: featError } = await supabase
      .from("market_features")
      .insert(
        features.map((f) => ({
          market_id: marketId,
          category: categorizeFeature(f),
          feature: f,
        }))
      );
    if (featError) console.warn(`  ⚠ Features insert error: ${featError.message}`);
  }

  return true;
}

function categorizeFeature(feature: string): string {
  const lower = feature.toLowerCase();
  if (
    lower.includes("parking") ||
    lower.includes("transit") ||
    lower.includes("bike") ||
    lower.includes("ev charging")
  )
    return "parking";
  if (
    lower.includes("cash") ||
    lower.includes("credit") ||
    lower.includes("debit") ||
    lower.includes("money") ||
    lower.includes("payment")
  )
    return "payment";
  if (lower.includes("wheelchair") || lower.includes("accessible"))
    return "accessibility";
  return "amenities";
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  console.log("🌽 BC Farmers Market Data Loader");
  console.log("================================\n");

  // Step 1: Fetch from WP REST API
  console.log("Step 1: Fetching markets from bcfarmersmarkettrail.com...\n");
  const rawMarkets = await fetchAllMarkets();
  console.log(`\n✅ Fetched ${rawMarkets.length} markets from API\n`);

  // Step 2: Normalize and load
  console.log("Step 2: Loading into Supabase...\n");
  let success = 0;
  let failed = 0;

  for (const raw of rawMarkets) {
    const normalized = normalizeMarket(raw);
    const name = normalized.market.name;
    const coords = normalized.market.latitude
      ? `(${normalized.market.latitude.toFixed(4)}, ${normalized.market.longitude?.toFixed(4)})`
      : "(no coords)";

    const ok = await upsertMarket(normalized);
    if (ok) {
      console.log(
        `  ✓ ${name} — ${normalized.market.city || "?"} ${coords} [${normalized.hours.length}h, ${normalized.products.length}p, ${normalized.features.length}f]`
      );
      success++;
    } else {
      failed++;
    }
  }

  console.log(`\n================================`);
  console.log(`✅ Loaded: ${success}`);
  if (failed) console.log(`❌ Failed: ${failed}`);
  console.log(`📊 Total:  ${rawMarkets.length}`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
