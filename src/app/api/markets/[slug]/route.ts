import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  // Fetch market
  const { data: market, error: marketError } = await supabase
    .from("markets")
    .select("*")
    .eq("slug", slug)
    .single();

  if (marketError || !market) {
    return NextResponse.json({ error: "Market not found" }, { status: 404 });
  }

  // Fetch related data in parallel
  const [hoursResult, productsResult, featuresResult] = await Promise.all([
    supabase
      .from("market_hours")
      .select("*")
      .eq("market_id", market.id)
      .order("day_of_week"),
    supabase
      .from("market_products")
      .select("*")
      .eq("market_id", market.id),
    supabase
      .from("market_features")
      .select("*")
      .eq("market_id", market.id),
  ]);

  return NextResponse.json({
    ...market,
    hours: hoursResult.data || [],
    products: productsResult.data || [],
    features: featuresResult.data || [],
  });
}
