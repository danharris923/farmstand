/**
 * Loads additional market/farm data from OpenStreetMap and Google Places
 * into Supabase, deduplicating against existing entries.
 *
 * Usage: npx tsx scripts/load-extra-sources.ts
 */

import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing env vars. Run: export $(grep -v '^#' .env.local | xargs)");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Haversine distance in km
function distance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function parseAddress(fullAddress: string) {
  // "2985 Christie Rd, Qualicum Beach, BC V9K 2L7, Canada"
  const parts = fullAddress.split(",").map((s) => s.trim());
  const street = parts[0] || "";
  const city = parts[1] || "";
  const provPostal = parts[2] || "";
  const postalMatch = provPostal.match(/[A-Z]\d[A-Z]\s?\d[A-Z]\d/);
  return {
    address: street,
    city,
    province: "BC",
    postal_code: postalMatch ? postalMatch[0] : null,
  };
}

async function main() {
  console.log("🌾 Loading extra data sources into Supabase\n");

  // Get existing markets for dedup
  const { data: existing } = await supabase
    .from("markets")
    .select("id, name, latitude, longitude, slug");
  const existingMarkets = existing || [];
  console.log(`📊 Existing markets in DB: ${existingMarkets.length}\n`);

  // Check if a new entry is a duplicate (within 200m of existing)
  function isDuplicate(lat: number, lng: number, name: string): boolean {
    const nameLower = name.toLowerCase();
    for (const m of existingMarkets) {
      if (!m.latitude || !m.longitude) continue;
      const dist = distance(lat, lng, m.latitude, m.longitude);
      if (dist < 0.2) return true; // within 200m
      // Also check name similarity
      if (dist < 2 && m.name.toLowerCase().includes(nameLower.slice(0, 10)))
        return true;
    }
    return false;
  }

  let added = 0;
  let skipped = 0;

  // ---- Load OpenStreetMap data ----
  const osmPath = path.join(__dirname, "..", "osm_markets.json");
  if (fs.existsSync(osmPath)) {
    const osm = JSON.parse(fs.readFileSync(osmPath, "utf-8"));
    // Filter to BC only
    const bcOsm = osm.filter(
      (e: any) => e.longitude && e.longitude < -114.5 && e.latitude > 48
    );
    console.log(`🗺️  OpenStreetMap: ${bcOsm.length} BC entries`);

    for (const entry of bcOsm) {
      if (!entry.latitude || !entry.longitude || !entry.name) continue;
      if (isDuplicate(entry.latitude, entry.longitude, entry.name)) {
        skipped++;
        continue;
      }

      const slug = slugify(entry.name) + "-osm";
      const market = {
        name: entry.name,
        slug,
        address: entry.address || null,
        city: entry.city || null,
        province: "BC",
        postal_code: entry.postal_code || null,
        latitude: entry.latitude,
        longitude: entry.longitude,
        phone: entry.phone || null,
        website: entry.website || null,
        description: entry.description || null,
        season_type: null,
        is_active: true,
        source_url: `https://www.openstreetmap.org/`,
        last_scraped_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("markets")
        .upsert(market, { onConflict: "slug" });

      if (error) {
        // Try with unique slug
        market.slug = slug + "-" + Math.random().toString(36).slice(2, 6);
        const { error: err2 } = await supabase
          .from("markets")
          .upsert(market, { onConflict: "slug" });
        if (err2) {
          console.log(`  ✗ ${entry.name}: ${err2.message}`);
          skipped++;
          continue;
        }
      }

      // Add to existing list for future dedup
      existingMarkets.push({
        id: "",
        name: entry.name,
        latitude: entry.latitude,
        longitude: entry.longitude,
        slug,
      });
      added++;
      console.log(
        `  ✓ ${entry.name} (${entry.city || "?"}) [OSM]`
      );
    }
  }

  // ---- Load Google Places data ----
  const gpPath = path.join(__dirname, "..", "google_places.json");
  if (fs.existsSync(gpPath)) {
    const gp = JSON.parse(fs.readFileSync(gpPath, "utf-8"));
    const bcGp = gp.filter(
      (e: any) =>
        e.address &&
        (e.address.includes("BC") || e.address.includes("British Columbia"))
    );
    console.log(`\n📍 Google Places: ${bcGp.length} BC entries`);

    for (const entry of bcGp) {
      if (!entry.latitude || !entry.longitude || !entry.name) continue;
      if (isDuplicate(entry.latitude, entry.longitude, entry.name)) {
        skipped++;
        continue;
      }

      const parsed = parseAddress(entry.address);
      const slug = slugify(entry.name) + "-gp";
      const market = {
        name: entry.name,
        slug,
        address: parsed.address || null,
        city: parsed.city || null,
        province: "BC",
        postal_code: parsed.postal_code || null,
        latitude: entry.latitude,
        longitude: entry.longitude,
        website: null,
        is_active: true,
        source_url: null,
        last_scraped_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("markets")
        .upsert(market, { onConflict: "slug" });

      if (error) {
        market.slug = slug + "-" + Math.random().toString(36).slice(2, 6);
        const { error: err2 } = await supabase
          .from("markets")
          .upsert(market, { onConflict: "slug" });
        if (err2) {
          console.log(`  ✗ ${entry.name}: ${err2.message}`);
          skipped++;
          continue;
        }
      }

      existingMarkets.push({
        id: "",
        name: entry.name,
        latitude: entry.latitude,
        longitude: entry.longitude,
        slug,
      });
      added++;
      console.log(
        `  ✓ ${entry.name} (${parsed.city || "?"}) [Google]`
      );
    }
  }

  console.log(`\n================================`);
  console.log(`✅ Added: ${added}`);
  console.log(`⏭️  Skipped (duplicates): ${skipped}`);
  console.log(`📊 Total in DB now: ${existingMarkets.length}`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
