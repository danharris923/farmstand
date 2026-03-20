-- ============================================
-- Supabase Schema for BC Farmers Market Finder
-- ============================================

-- Enable PostGIS for geographic queries
CREATE EXTENSION IF NOT EXISTS postgis;

-- ============================================
-- MARKETS TABLE - Core market data
-- ============================================
CREATE TABLE markets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

    -- Identity
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    source_url TEXT,              -- Original URL on bcfarmersmarkettrail.com

    -- Location
    address TEXT,
    city TEXT,
    province TEXT DEFAULT 'BC',
    postal_code TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    location GEOGRAPHY(POINT, 4326),  -- PostGIS point for geo queries
    region TEXT,                  -- e.g. "Thompson Okanagan", "Vancouver Island"
    community TEXT,               -- e.g. "Kelowna", "Victoria"

    -- Schedule
    season_type TEXT CHECK (season_type IN ('summer', 'winter', 'year-round')),
    season_start DATE,
    season_end DATE,

    -- Contact
    phone TEXT,
    email TEXT,
    website TEXT,

    -- Social Media
    facebook TEXT,
    instagram TEXT,
    twitter TEXT,

    -- Content
    description TEXT,
    image_url TEXT,
    indigenous_territory TEXT,

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_scraped_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE
);

-- ============================================
-- MARKET HOURS - Operating days/times
-- ============================================
CREATE TABLE market_hours (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    market_id UUID NOT NULL REFERENCES markets(id) ON DELETE CASCADE,
    day_of_week TEXT NOT NULL CHECK (day_of_week IN (
        'Monday', 'Tuesday', 'Wednesday', 'Thursday',
        'Friday', 'Saturday', 'Sunday'
    )),
    open_time TIME,
    close_time TIME,
    UNIQUE (market_id, day_of_week)
);

-- ============================================
-- MARKET PRODUCTS - What's sold there
-- ============================================
CREATE TABLE market_products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    market_id UUID NOT NULL REFERENCES markets(id) ON DELETE CASCADE,
    product TEXT NOT NULL,         -- e.g. "Fruits/Vegetables", "Meat", "Seafood"
    UNIQUE (market_id, product)
);

-- ============================================
-- MARKET FEATURES - Amenities and features
-- ============================================
CREATE TABLE market_features (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    market_id UUID NOT NULL REFERENCES markets(id) ON DELETE CASCADE,
    category TEXT NOT NULL,        -- e.g. "accessibility", "parking", "amenities", "payment"
    feature TEXT NOT NULL,         -- e.g. "Wheelchair Accessible", "Dog-Friendly"
    UNIQUE (market_id, feature)
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_markets_location ON markets USING GIST (location);
CREATE INDEX idx_markets_region ON markets (region);
CREATE INDEX idx_markets_season_type ON markets (season_type);
CREATE INDEX idx_markets_is_active ON markets (is_active);
CREATE INDEX idx_markets_city ON markets (city);
CREATE INDEX idx_market_hours_market_id ON market_hours (market_id);
CREATE INDEX idx_market_products_market_id ON market_products (market_id);
CREATE INDEX idx_market_features_market_id ON market_features (market_id);

-- ============================================
-- AUTO-UPDATE updated_at TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER markets_updated_at
    BEFORE UPDATE ON markets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- ============================================
-- AUTO-POPULATE location FROM lat/lng TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION update_location_point()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.latitude IS NOT NULL AND NEW.longitude IS NOT NULL THEN
        NEW.location = ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326)::GEOGRAPHY;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER markets_location_point
    BEFORE INSERT OR UPDATE OF latitude, longitude ON markets
    FOR EACH ROW
    EXECUTE FUNCTION update_location_point();

-- ============================================
-- HELPFUL VIEWS
-- ============================================

-- Markets with their hours as JSON array
CREATE VIEW markets_with_hours AS
SELECT
    m.*,
    COALESCE(
        json_agg(
            json_build_object(
                'day', h.day_of_week,
                'open', h.open_time::TEXT,
                'close', h.close_time::TEXT
            )
        ) FILTER (WHERE h.id IS NOT NULL),
        '[]'::json
    ) AS hours
FROM markets m
LEFT JOIN market_hours h ON m.id = h.market_id
GROUP BY m.id;

-- Find markets near a point (usage: SELECT * FROM nearby_markets(49.28, -123.12, 10000))
CREATE OR REPLACE FUNCTION nearby_markets(
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    radius_meters INTEGER DEFAULT 25000
)
RETURNS TABLE (
    id UUID,
    name TEXT,
    address TEXT,
    city TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    distance_meters DOUBLE PRECISION,
    season_type TEXT,
    website TEXT,
    image_url TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        m.id, m.name, m.address, m.city,
        m.latitude, m.longitude,
        ST_Distance(
            m.location,
            ST_SetSRID(ST_MakePoint(lng, lat), 4326)::GEOGRAPHY
        ) AS distance_meters,
        m.season_type, m.website, m.image_url
    FROM markets m
    WHERE m.is_active = TRUE
      AND ST_DWithin(
          m.location,
          ST_SetSRID(ST_MakePoint(lng, lat), 4326)::GEOGRAPHY,
          radius_meters
      )
    ORDER BY distance_meters;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- ROW LEVEL SECURITY (for Supabase)
-- ============================================
ALTER TABLE markets ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_features ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Markets are viewable by everyone" ON markets FOR SELECT USING (true);
CREATE POLICY "Market hours are viewable by everyone" ON market_hours FOR SELECT USING (true);
CREATE POLICY "Market products are viewable by everyone" ON market_products FOR SELECT USING (true);
CREATE POLICY "Market features are viewable by everyone" ON market_features FOR SELECT USING (true);
