export interface Market {
  id: string;
  name: string;
  slug: string;
  source_url: string | null;
  address: string | null;
  city: string | null;
  province: string;
  postal_code: string | null;
  latitude: number | null;
  longitude: number | null;
  region: string | null;
  community: string | null;
  season_type: "summer" | "winter" | "year-round" | null;
  season_start: string | null;
  season_end: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  facebook: string | null;
  instagram: string | null;
  twitter: string | null;
  description: string | null;
  image_url: string | null;
  indigenous_territory: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MarketHours {
  id: string;
  market_id: string;
  day_of_week: string;
  open_time: string | null;
  close_time: string | null;
}

export interface MarketProduct {
  id: string;
  market_id: string;
  product: string;
}

export interface MarketFeature {
  id: string;
  market_id: string;
  category: string;
  feature: string;
}

export interface MarketWithDetails extends Market {
  hours?: MarketHours[];
  products?: MarketProduct[];
  features?: MarketFeature[];
  distance_meters?: number;
}

export interface NearbyQuery {
  lat: number;
  lng: number;
  radius?: number; // meters, default 25000
}
