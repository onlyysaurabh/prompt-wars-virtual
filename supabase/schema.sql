-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User profiles (extends auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  display_name TEXT,
  country TEXT DEFAULT 'US',
  household_size INTEGER DEFAULT 1,
  energy_source TEXT DEFAULT 'grid',  -- grid, solar, wind, mixed
  diet_type TEXT DEFAULT 'omnivore',  -- vegan, vegetarian, pescatarian, omnivore
  has_car BOOLEAN DEFAULT false,
  car_fuel_type TEXT,                  -- gasoline, diesel, electric, hybrid
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Carbon actions log
CREATE TABLE carbon_actions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN ('transport', 'energy', 'food', 'shopping', 'other')),
  subcategory TEXT NOT NULL,           -- flight, car_trip, bus, electricity, gas, meat, etc.
  description TEXT,
  quantity NUMERIC(10, 2) NOT NULL,    -- distance_km, kwh, kg, items, etc.
  unit TEXT NOT NULL,                  -- km, kwh, kg, items, etc.
  co2_kg NUMERIC(10, 2) NOT NULL,     -- calculated CO₂ in kg
  calculated_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::JSONB,  -- extra data (vehicle model, flight route, etc.)
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Weekly/monthly summaries (computed)
CREATE TABLE carbon_summaries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  period_type TEXT NOT NULL CHECK (period_type IN ('weekly', 'monthly', 'yearly')),
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  total_co2_kg NUMERIC(10, 2) NOT NULL,
  breakdown JSONB NOT NULL DEFAULT '{}'::JSONB,  -- per-category totals
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, period_type, period_start)
);

-- Badges/achievements
CREATE TABLE user_badges (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  badge_type TEXT NOT NULL,            -- first_action, streak_7, below_average, etc.
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, badge_type)
);

-- Goals
CREATE TABLE user_goals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  goal_type TEXT NOT NULL CHECK (goal_type IN ('monthly_target', 'category_limit', 'streak')),
  target_co2_kg NUMERIC(10, 2),
  target_category TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE carbon_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE carbon_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_goals ENABLE ROW LEVEL SECURITY;

-- Policies: users can only see/edit their own data
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own actions" ON carbon_actions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own actions" ON carbon_actions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own actions" ON carbon_actions FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own summaries" ON carbon_summaries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own badges" ON user_badges FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own goals" ON user_goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own goals" ON user_goals FOR ALL USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_carbon_actions_user_date ON carbon_actions(user_id, created_at DESC);
CREATE INDEX idx_carbon_actions_category ON carbon_actions(user_id, category);
CREATE INDEX idx_carbon_summaries_period ON carbon_summaries(user_id, period_type, period_start DESC);
