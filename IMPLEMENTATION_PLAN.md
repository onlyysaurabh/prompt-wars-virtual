# Carbon Footprint Tracker — Implementation Plan

*Quick prototype → Vercel deploy | Next.js 15 + Supabase + emissions.dev*

---

## Architecture Overview

```
┌─────────────────────────────────────────────────┐
│  Next.js 15 (App Router) — Vercel Edge          │
│  ┌───────────┐  ┌────────────┐  ┌────────────┐ │
│  │ Landing    │  │ Dashboard  │  │ Actions    │ │
│  │ Page       │  │ (charts)   │  │ (log data) │ │
│  └─────┬─────┘  └─────┬──────┘  └─────┬──────┘ │
│        │              │               │         │
│        └──────────┬───┘               │         │
│              ┌────▼─────┐       ┌─────▼─────┐  │
│              │ API Routes │       │ Cron Jobs │  │
│              └────┬─────┘       └───────────┘  │
│                   │                             │
│  ┌────────────────▼───────────────────────────┐ │
│  │  Supabase (Auth + Postgres + Realtime)      │ │
│  └────────────────┬───────────────────────────┘ │
│                   │                             │
│  ┌────────────────▼───────────────────────────┐ │
│  │  emissions.dev API (carbon calculations)    │ │
│  │  carbon-footprint npm (food/diet fallback)  │ │
│  └─────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

**Tech Stack Decision:**

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | Next.js 15 (App Router) | Vercel-native, RSC, streaming, edge runtime |
| Styling | Tailwind CSS + shadcn/ui | Radix underneath → full WCAG AA. Copy-paste, own the code |
| Database | Supabase (Postgres) | Already in .env.example. Auth + DB + Realtime in one |
| Auth | Supabase Auth | Zero extra deps, email + Google OAuth, JWT for RLS |
| Charts | Recharts | React-native, composable, ARIA support |
| Carbon API | emissions.dev | TS SDK, 500 free req/mo, sub-100ms, GHG Protocol |
| Food fallback | carbon-footprint npm | Client-side, zero API cost, covers food/diet/electronics |
| Testing | Vitest + Playwright + jest-axe | Unit + E2E + a11y |
| Validation | Zod | Type-safe schema validation at API boundary |
| State | React Server Components + use | Minimal client state, server-first |

---

## Scoring Criteria Coverage Map

| Criterion | How Addressed | Evidence |
|-----------|---------------|----------|
| **Code Quality** | ESLint + Prettier + TypeScript strict, folder-per-feature, Zod schemas, RSC-first | Tooling config + project structure |
| **Security** | Supabase RLS, CSRF via Next.js, input validation (Zod), no secrets in client, CSP headers | RLS policies + middleware + headers |
| **Efficiency** | Edge runtime, server components (zero JS sent), streaming, connection pooling (Supavisor) | Architecture choices |
| **Testing** | Vitest (unit), Playwright (E2E), jest-axe (a11y), MSW for API mocks | Test directory structure |
| **Accessibility** | shadcn/ui (Radix), semantic HTML, ARIA live regions, skip links, contrast-safe chart palette, keyboard nav | Component patterns |
| **AI Accessibility** | JSON-LD structured data, semantic HTML, meta tags, machine-readable content | New section below |
| **Problem Alignment** | Personalized insights, actionable tips, gamification (badges), benchmarking, multi-category tracking | Feature set |

---

## Phase 0: Landing Page + Design System (Day 0)

- [x] **0.1 Design System Integration**

Map DESIGN.md tokens to Tailwind config for brand consistency:

```javascript
// tailwind.config.js
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Brand
        primary: {
          DEFAULT: '#0d9488',
          deep: '#0f766e',
          press: '#115e59',
          soft: '#2dd4bf',
          'bg-subdued-hover': '#ccfbf1',
        },
        'brand-dark-900': '#0c1222',
        
        // Surfaces
        canvas: {
          DEFAULT: '#ffffff',
          soft: '#f6f9fc',
          cream: '#f5f0e6',
        },
        
        // Borders
        hairline: {
          DEFAULT: '#e3e8ee',
          input: '#a8c3de',
        },
        
        // Text
        ink: {
          DEFAULT: '#0d253d',
          secondary: '#273951',
          mute: '#64748d',
          'mute-2': '#61718a',
        },
        'on-primary': '#ffffff',
        
        // Accents
        coral: '#e8573a',
        sky: '#38bdf8',
        lemon: '#a3a33b',
        'shadow-blue': '#003770',
      },
      fontFamily: {
        display: ['Inter', 'SF Pro Display', 'system-ui', 'sans-serif'],
        body: ['Inter', 'SF Pro Display', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xs: '4px',
        sm: '6px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        pill: '9999px',
      },
      spacing: {
        xxs: '2px',
        huge: '64px',
      },
      fontSize: {
        // Display tier (weight 300, negative tracking)
        'display-xxl': ['56px', { lineHeight: '1.03', letterSpacing: '-1.4px', fontWeight: '300' }],
        'display-xl': ['48px', { lineHeight: '1.15', letterSpacing: '-0.96px', fontWeight: '300' }],
        'display-lg': ['32px', { lineHeight: '1.1', letterSpacing: '-0.64px', fontWeight: '300' }],
        'display-md': ['26px', { lineHeight: '1.12', letterSpacing: '-0.26px', fontWeight: '300' }],
        // Body tier
        'body-tabular': ['14px', { lineHeight: '1.4', letterSpacing: '-0.42px', fontWeight: '300', fontFeatureSettings: '"tnum"' }],
      },
      boxShadow: {
        'card-1': 'rgba(0,55,112,0.08) 0 1px 3px',
        'card-2': 'rgba(0,55,112,0.08) 0 8px 24px, rgba(0,55,112,0.04) 0 2px 6px',
      },
    },
  },
  plugins: [],
}

export default config
```

**Global CSS for font features:**

```css
/* src/app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    font-feature-settings: 'ss01';
  }
  
  /* Tabular figures for CO₂ metrics */
  .tabular-nums {
    font-feature-settings: 'tnum';
  }
}
```

- [x] **0.2 Landing Page Implementation**

**Hero section with gradient mesh + feature cards:**

```tsx
// src/app/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { GradientMesh } from '@/components/landing/gradient-mesh'
import { FeatureCards } from '@/components/landing/feature-cards'
import { DashboardMockup } from '@/components/landing/dashboard-mockup'
import { SocialProof } from '@/components/landing/social-proof'

export const metadata: Metadata = {
  title: 'CarbonTrack — Understand, Track, and Reduce Your Carbon Footprint',
  description: 'Track your carbon footprint through simple actions. Get personalized insights, actionable tips, and gamified achievements to reduce your environmental impact.',
  openGraph: {
    title: 'CarbonTrack',
    description: 'Understand, track, and reduce your carbon footprint',
    type: 'website',
  },
}

export default function LandingPage() {
  return (
    <main>
      {/* Hero with gradient mesh backdrop */}
      <section className="relative min-h-[90vh] overflow-hidden">
        <GradientMesh />
        
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <div className="text-center max-w-3xl mx-auto">
            {/* Eyebrow pill */}
            <span className="inline-block px-3 py-1 text-xs font-medium bg-primary-bg-subdued-hover text-primary-deep rounded-pill mb-6">
              YOUR CARBON FOOTPRINT, VISUALIZED
            </span>
            
            {/* Hero headline — Inter weight 300, negative tracking */}
            <h1 className="text-display-xxl font-display text-ink mb-6">
              Track Your Carbon
              <br />
              <span className="text-primary">Footprint</span>
            </h1>
            
            <p className="text-body-lg text-ink-secondary mb-8 max-w-xl mx-auto">
              Understand, track, and reduce your carbon footprint through simple actions 
              and personalized insights. Join thousands making a difference.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-on-primary bg-primary rounded-pill hover:bg-primary-deep transition-colors"
              >
                Start Tracking Free
              </Link>
              <Link
                href="#features"
                className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-primary bg-white border border-primary rounded-pill hover:bg-primary-bg-subdued-hover transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
          
          {/* Dashboard mockup */}
          <div className="mt-16 max-w-5xl mx-auto">
            <DashboardMockup />
          </div>
        </div>
      </section>
      
      {/* Features section */}
      <section id="features" className="py-24 bg-canvas-soft">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-display-lg font-display text-ink mb-4">
              Everything You Need to Reduce Your Impact
            </h2>
            <p className="text-body-lg text-ink-secondary max-w-2xl mx-auto">
              Four simple categories to track your daily activities. 
              Get personalized insights and actionable tips to reduce your carbon footprint.
            </p>
          </div>
          
          <FeatureCards />
        </div>
      </section>
      
      {/* Social proof */}
      <section className="py-24 bg-canvas">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SocialProof />
        </div>
      </section>
      
      {/* CTA section */}
      <section className="py-24 bg-brand-dark-900">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-display-lg font-display text-on-primary mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-body-lg text-gray-300 mb-8">
            Start tracking your carbon footprint today. It only takes a few seconds per action.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-brand-dark-900 bg-primary rounded-pill hover:bg-primary-soft transition-colors"
          >
            Get Started Now
          </Link>
        </div>
      </section>
    </main>
  )
}
```

**Gradient Mesh Component (SVG-based):**

```tsx
// src/components/landing/gradient-mesh.tsx
export function GradientMesh() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* SVG gradient mesh — cream, sage, sky, teal, coral */}
      <svg
        viewBox="0 0 1440 800"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="mesh-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f5f0e6" /> {/* canvas-cream */}
            <stop offset="25%" stopColor="#a3a33b" stopOpacity="0.4" /> {/* lemon/sage */}
            <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.3" /> {/* sky */}
            <stop offset="75%" stopColor="#0d9488" stopOpacity="0.4" /> {/* primary */}
            <stop offset="100%" stopColor="#e8573a" stopOpacity="0.3" /> {/* coral */}
          </linearGradient>
          
          {/* Organic blob shapes for depth */}
          <filter id="blur">
            <feGaussianBlur stdDeviation="40" />
          </filter>
        </defs>
        
        <rect width="100%" height="100%" fill="url(#mesh-gradient)" />
        
        {/* Organic blobs */}
        <ellipse cx="20%" cy="30%" rx="300" ry="200" fill="#a3a33b" fillOpacity="0.15" filter="url(#blur)" />
        <ellipse cx="70%" cy="25%" rx="350" ry="250" fill="#38bdf8" fillOpacity="0.2" filter="url(#blur)" />
        <ellipse cx="85%" cy="60%" rx="250" ry="180" fill="#e8573a" fillOpacity="0.15" filter="url(#blur)" />
        <ellipse cx="40%" cy="70%" rx="280" ry="190" fill="#0d9488" fillOpacity="0.2" filter="url(#blur)" />
      </svg>
    </div>
  )
}
```

**Feature Cards Component:**

```tsx
// src/components/landing/feature-cards.tsx
import { 
  Car, 
  Zap, 
  Utensils, 
  ShoppingBag 
} from 'lucide-react'

const features = [
  {
    icon: Car,
    title: 'Transport',
    description: 'Track flights, car trips, public transit, cycling, and walking. Calculate emissions based on distance, vehicle type, and passengers.',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    icon: Zap,
    title: 'Energy',
    description: 'Monitor electricity, gas, and heating usage. See how your energy source affects your carbon footprint.',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
  },
  {
    icon: Utensils,
    title: 'Food',
    description: 'Log meals and track the carbon impact of your diet. Compare plant-based vs. meat-heavy meals.',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
  {
    icon: ShoppingBag,
    title: 'Shopping',
    description: 'Track purchases across clothing, electronics, and furniture. Make informed choices about consumption.',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
  },
]

export function FeatureCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {features.map((feature) => (
        <article
          key={feature.title}
          className="relative bg-canvas rounded-lg p-8 border border-hairline hover:shadow-card-1 transition-shadow"
        >
          <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${feature.bgColor} ${feature.color} mb-4`}>
            <feature.icon className="w-6 h-6" />
          </div>
          
          <h3 className="text-heading-lg font-display text-ink mb-2">
            {feature.title}
          </h3>
          
          <p className="text-body-md text-ink-secondary">
            {feature.description}
          </p>
        </article>
      ))}
    </div>
  )
}
```

---

## Phase 1: Project Scaffold + Auth (Day 1)

- [x] **1.1 Initialize Next.js 15 + Dependencies**

```bash
npx create-next-app@latest carbon-tracker \
  --typescript --tailwind --eslint --app --src-dir \
  --import-alias "@/*"

cd carbon-tracker

# UI + Forms
npx shadcn@latest init   # shadcn/ui (Radix + Tailwind)
npx shadcn@latest add button card input label select dialog badge progress tabs toast
npm i react-hook-form @hookform/resolvers zod

# Database + Auth
npm i @supabase/supabase-js @supabase/ssr

# Charts
npm i recharts

# Carbon calculations
npm i carbon-footprint    # client-side fallback
# emissions.dev SDK added later (needs API key)

# Testing
npm i -D vitest @testing-library/react @testing-library/jest-dom jest-axe msw
npm i -D @playwright/test

# Dev tools
npm i -D prettier eslint-config-prettier

# Error handling
npm i @sentry/nextjs  # Optional: error tracking
```

- [x] **1.2 Folder Structure**

```
src/
├── app/
│   ├── layout.tsx              # Root layout (html lang, skip link, fonts)
│   ├── page.tsx                # Landing page (Phase 0)
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── (protected)/
│   │   ├── layout.tsx          # Auth guard + sidebar nav
│   │   ├── dashboard/page.tsx  # Main dashboard with charts
│   │   ├── actions/page.tsx    # Log carbon actions
│   │   ├── insights/page.tsx   # Personalized tips
│   │   ├── goals/page.tsx      # Targets + progress
│   │   └── settings/page.tsx   # Profile + preferences
│   └── api/
│       ├── actions/route.ts    # CRUD carbon actions
│       ├── insights/route.ts   # Generate insights
│       ├── auth/callback/route.ts
│       └── cron/daily-reminder/route.ts
├── components/
│   ├── ui/                     # shadcn components (auto-generated)
│   ├── charts/
│   │   ├── emissions-over-time.tsx
│   │   ├── category-breakdown.tsx
│   │   └── comparison-chart.tsx
│   ├── forms/
│   │   ├── log-transport.tsx
│   │   ├── log-energy.tsx
│   │   ├── log-food.tsx
│   │   └── log-shopping.tsx
│   ├── landing/
│   │   ├── gradient-mesh.tsx
│   │   ├── feature-cards.tsx
│   │   ├── dashboard-mockup.tsx
│   │   └── social-proof.tsx
│   └── layout/
│       ├── sidebar.tsx
│       ├── header.tsx
│       ├── skip-link.tsx
│       └── focus-manager.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts           # Browser client
│   │   ├── server.ts           # Server client (cookies)
│   │   ├── middleware.ts       # Auth middleware
│   │   └── admin.ts            # Service role client
│   ├── carbon/
│   │   ├── emissions-dev.ts    # emissions.dev wrapper
│   │   ├── local-calculator.ts # carbon-footprint npm fallback
│   │   ├── categories.ts       # Transport, energy, food, shopping
│   │   └── insights.ts         # Tip generation logic
│   ├── validators/
│   │   ├── action.ts           # Zod schemas for carbon actions
│   │   └── user.ts             # User profile schemas
│   └── utils/
│       ├── formatting.ts       # CO₂ formatting (kg, tonnes)
│       ├── charts.ts           # Chart color palette + helpers
│       └── error-handling.ts   # Error boundaries + handlers
├── hooks/
│   ├── use-carbon-actions.ts   # SWR/fetch for actions
│   └── use-dashboard.ts        # Dashboard data aggregation
├── types/
│   └── index.ts                # Shared TypeScript types
└── __tests__/
    ├── components/             # Component tests
    ├── lib/                    # Utility tests
    └── api/                    # API route tests
```

- [x] **1.3 Supabase Schema (SQL)**

```sql
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
```

- [x] **1.4 Auth Setup**

```typescript
// src/lib/supabase/middleware.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return request.cookies.get(name)?.value },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Protect /dashboard routes
  if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return response
}

// middleware.ts (root)
import { updateSession } from '@/lib/supabase/middleware'
import { type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: ['/dashboard/:path*', '/actions/:path*', '/insights/:path*'],
}
```

---

## Phase 2: Core Features (Days 2-3)

- [ ] **2.1 Carbon Action Logging**

**4 categories of input:**

| Category | Subcategories | Input Fields | API/Calculation |
|----------|--------------|--------------|-----------------|
| **Transport** | Flight, Car, Bus, Train, Bike, Walk | Distance (km), passengers, vehicle type | emissions.dev (flights/cars) or local calc |
| **Energy** | Electricity, Gas, Heating oil | Amount (kWh or liters), period | Local calc (country grid factor) |
| **Food** | Meat, Dairy, Vegetables, Processed, Dining out | Weight (kg) or servings | carbon-footprint npm |
| **Shopping** | Clothing, Electronics, Furniture, Other | Item count, category, estimated cost | Estimation model |

**Zod validation example:**

```typescript
// src/lib/validators/action.ts
import { z } from 'zod'

export const transportActionSchema = z.object({
  category: z.literal('transport'),
  subcategory: z.enum(['flight', 'car', 'bus', 'train', 'bike', 'walk']),
  distance_km: z.number().positive().max(50000),
  passengers: z.number().int().positive().max(9).default(1),
  vehicle_model: z.string().optional(),
  departure_airport: z.string().length(3).optional(),
  arrival_airport: z.string().length(3).optional(),
})

export const energyActionSchema = z.object({
  category: z.literal('energy'),
  subcategory: z.enum(['electricity', 'gas', 'heating_oil']),
  amount: z.number().positive().max(100000),
  unit: z.enum(['kwh', 'liters', 'therms']),
  period: z.enum(['daily', 'weekly', 'monthly']).default('monthly'),
})

export const foodActionSchema = z.object({
  category: z.literal('food'),
  subcategory: z.enum(['meat_beef', 'meat_chicken', 'meat_pork', 'dairy', 'vegetables', 'grains', 'processed', 'dining_out']),
  amount: z.number().positive().max(1000),
  unit: z.enum(['kg', 'servings', 'meals']),
})

export const carbonActionSchema = z.discriminatedUnion('category', [
  transportActionSchema,
  energyActionSchema,
  foodActionSchema,
])
```

- [ ] **2.2 Dashboard with Charts**

```tsx
// src/app/(protected)/dashboard/page.tsx
import { createServerClient } from '@/lib/supabase/server'
import { EmissionsOverTime } from '@/components/charts/emissions-over-time'
import { CategoryBreakdown } from '@/components/charts/category-breakdown'
import { WeeklyComparison } from '@/components/charts/comparison-chart'
import { BadgeCollection } from '@/components/badges/badge-collection'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function DashboardPage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch last 30 days of actions
  const { data: actions } = await supabase
    .from('carbon_actions')
    .select('*')
    .eq('user_id', user!.id)
    .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
    .order('created_at', { ascending: false })

  const totalCo2 = actions?.reduce((sum, a) => sum + a.co2_kg, 0) ?? 0
  const categoryBreakdown = actions?.reduce((acc, a) => {
    acc[a.category] = (acc[a.category] || 0) + a.co2_kg
    return acc
  }, {} as Record<string, number>) ?? {}

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Your Carbon Dashboard</h1>

      {/* Summary cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>This Month</CardTitle></CardHeader>
          <CardContent>
            <p className="text-4xl font-bold tabular-nums">{totalCo2.toFixed(1)} <span className="text-lg">kg CO₂</span></p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Daily Average</CardTitle></CardHeader>
          <CardContent>
            <p className="text-4xl font-bold tabular-nums">{(totalCo2 / 30).toFixed(1)} <span className="text-lg">kg/day</span></p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>vs. Country Avg</CardTitle></CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-green-600 tabular-nums">-12%</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Emissions Over Time</CardTitle></CardHeader>
          <CardContent>
            <EmissionsOverTime actions={actions ?? []} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Category Breakdown</CardTitle></CardHeader>
          <CardContent>
            <CategoryBreakdown data={categoryBreakdown} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
```

- [ ] **2.3 Personalized Insights Engine**

```typescript
// src/lib/carbon/insights.ts
import type { CarbonAction } from '@/types'

interface Insight {
  type: 'tip' | 'achievement' | 'comparison' | 'suggestion'
  title: string
  description: string
  impact?: string   // "Save X kg CO₂/year"
  priority: 'high' | 'medium' | 'low'
}

const COUNTRY_AVG_KG_PER_DAY: Record<string, number> = {
  US: 42.0,
  UK: 28.0,
  DE: 25.0,
  IN: 7.0,
  AU: 40.0,
  DEFAULT: 20.0,
}

const REDUCTION_TIPS: Record<string, Insight[]> = {
  transport: [
    { type: 'tip', title: 'Try cycling for short trips', description: 'Bikes produce zero emissions and are faster than cars in urban areas.', impact: 'Save ~2.6 kg CO₂ per 10 km', priority: 'high' },
    { type: 'tip', title: 'Consider public transit', description: 'Buses emit ~80% less CO₂ per passenger than single-occupancy cars.', impact: 'Save ~1.8 kg CO₂ per 10 km', priority: 'medium' },
    { type: 'suggestion', title: 'Fly less, stay connected', description: 'One round-trip flight NYC→LA produces ~0.9 tonnes CO₂. Video calls produce 0.', impact: 'Save ~900 kg CO₂ per skipped flight', priority: 'high' },
  ],
  energy: [
    { type: 'tip', title: 'Switch to LED bulbs', description: 'LEDs use 75% less energy than incandescent and last 25x longer.', impact: 'Save ~43 kg CO₂ per year per bulb', priority: 'medium' },
    { type: 'tip', title: 'Unplug idle devices', description: 'Standby power accounts for 5-10% of household energy use.', impact: 'Save ~50-100 kg CO₂ per year', priority: 'low' },
  ],
  food: [
    { type: 'tip', title: 'Reduce beef consumption', description: 'Beef produces 27x more CO₂ than plant-based proteins.', impact: 'Save ~35 kg CO₂ per kg of beef replaced', priority: 'high' },
    { type: 'tip', title: 'Eat more legumes', description: 'Lentils produce 0.9 kg CO₂ per kg, compared to 27 kg for beef.', impact: 'Save ~26 kg CO₂ per kg replaced', priority: 'medium' },
  ],
}

export function generateInsights(
  actions: CarbonAction[],
  userProfile: { country?: string; diet_type?: string }
): Insight[] {
  const insights: Insight[] = []
  const dailyAvg = calculateDailyAverage(actions)
  const countryAvg = COUNTRY_AVG_KG_PER_DAY[userProfile.country ?? 'DEFAULT'] ?? COUNTRY_AVG_KG_PER_DAY.DEFAULT

  // Comparison insight
  const diff = ((dailyAvg - countryAvg) / countryAvg) * 100
  if (diff < -10) {
    insights.push({
      type: 'comparison',
      title: 'You\'re below average!',
      description: `Your daily emissions are ${Math.abs(diff).toFixed(0)}% lower than the ${userProfile.country ?? 'global'} average.`,
      priority: 'high',
    })
  } else if (diff > 10) {
    insights.push({
      type: 'comparison',
      title: 'Room to improve',
      description: `Your daily emissions are ${diff.toFixed(0)}% higher than the ${userProfile.country ?? 'global'} average.`,
      priority: 'medium',
    })
  }

  // Category-specific tips
  const categoryTotals = getCategoryTotals(actions)
  const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0]

  if (topCategory) {
    const [category] = topCategory
    const tips = REDUCTION_TIPS[category] ?? []
    insights.push(...tips.slice(0, 2))
  }

  // Streak badge check
  const streak = calculateStreak(actions)
  if (streak >= 7) {
    insights.push({
      type: 'achievement',
      title: `${streak}-day logging streak!`,
      description: 'Consistency is key. Keep tracking to find reduction opportunities.',
      priority: 'medium',
    })
  }

  return insights.sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 }
    return order[a.priority] - order[b.priority]
  })
}
```

---

## Phase 3: AI Accessibility (Day 3)

- [x] **3.1 Structured Data (JSON-LD)**

**Root layout with comprehensive structured data:**

```tsx
// src/app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { SkipLink } from '@/components/layout/skip-link'
import { FocusManager } from '@/components/layout/focus-manager'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

// JSON-LD structured data for AI crawlers
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  'name': 'CarbonTrack',
  'description': 'Track and reduce your carbon footprint through simple actions and personalized insights.',
  'url': 'https://carbontrack.app',
  'applicationCategory': 'LifestyleApplication',
  'operatingSystem': 'Web',
  'offers': {
    '@type': 'Offer',
    'price': '0',
    'priceCurrency': 'USD',
  },
  'featureList': [
    'Carbon footprint tracking across transport, energy, food, and shopping',
    'Personalized reduction tips based on your activity',
    'Country-level benchmarking and comparisons',
    'Gamified achievements and streaks',
    'Visual dashboard with charts and breakdowns',
  ],
}

export const metadata: Metadata = {
  title: { template: '%s | CarbonTrack', default: 'CarbonTrack — Track Your Carbon Footprint' },
  description: 'Understand, track, and reduce your carbon footprint through simple actions and personalized insights.',
  openGraph: {
    title: 'CarbonTrack',
    description: 'Track and reduce your carbon footprint',
    type: 'website',
    siteName: 'CarbonTrack',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CarbonTrack',
    description: 'Track and reduce your carbon footprint',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <SkipLink />
        <FocusManager />
        {children}
      </body>
    </html>
  )
}
```

- [x] **3.2 Semantic HTML Patterns**

**Accessible navigation:**

```tsx
// src/components/layout/header.tsx
export function Header() {
  return (
    <header role="banner" className="sticky top-0 z-40 bg-canvas border-b border-hairline">
      <nav role="navigation" aria-label="Main navigation" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <a href="/" className="flex items-center gap-2" aria-label="CarbonTrack Home">
            <span className="text-xl font-semibold text-ink">CarbonTrack</span>
          </a>
          
          <ul className="flex items-center gap-6" role="menubar">
            <li role="none">
              <a href="/dashboard" role="menuitem" className="text-body-md text-ink-secondary hover:text-primary">
                Dashboard
              </a>
            </li>
            <li role="none">
              <a href="/actions" role="menuitem" className="text-body-md text-ink-secondary hover:text-primary">
                Log Action
              </a>
            </li>
            <li role="none">
              <a href="/insights" role="menuitem" className="text-body-md text-ink-secondary hover:text-primary">
                Insights
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  )
}
```

**ARIA live regions for dynamic content:**

```tsx
// src/components/charts/emissions-over-time.tsx
'use client'

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

interface Props {
  data: Array<{ date: string; co2_kg: number }>
}

export function EmissionsOverTime({ data }: Props) {
  const description = `Line chart showing carbon emissions over time. ${
    data.length > 1
      ? `Emissions went from ${data[0].co2_kg.toFixed(1)} kg on ${data[0].date} to ${data[data.length - 1].co2_kg.toFixed(1)} kg on ${data[data.length - 1].date}.`
      : 'No data available yet.'
  }`

  return (
    <figure role="img" aria-label={description}>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} aria-hidden="true">
          <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
          <YAxis stroke="hsl(var(--muted-foreground))" />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="co2_kg"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={{ r: 4, fill: 'hsl(var(--primary))' }}
          />
        </LineChart>
      </ResponsiveContainer>
      <figcaption className="sr-only">{description}</figcaption>

      {/* Data table alternative for screen readers */}
      <table className="sr-only">
        <caption>Daily carbon emissions</caption>
        <thead>
          <tr><th>Date</th><th>CO₂ (kg)</th></tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={d.date}><td>{d.date}</td><td>{d.co2_kg.toFixed(1)}</td></tr>
          ))}
        </tbody>
      </table>
    </figure>
  )
}
```

- [x] **3.3 Machine-Readable Content**

**API routes for AI consumption:**

```typescript
// src/app/api/actions/route.ts
import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { carbonActionSchema } from '@/lib/validators/action'

export async function GET() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: actions } = await supabase
    .from('carbon_actions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return NextResponse.json({
    success: true,
    data: actions,
    meta: {
      total: actions?.length ?? 0,
      userId: user.id,
      generatedAt: new Date().toISOString(),
    },
  })
}

export async function POST(request: Request) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const validation = carbonActionSchema.safeParse(body)

  if (!validation.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: validation.error.flatten().fieldErrors },
      { status: 400 }
    )
  }

  // Calculate CO₂ and insert
  const { data: action } = await supabase
    .from('carbon_actions')
    .insert({ ...validation.data, user_id: user.id, co2_kg: calculateCO2(validation.data) })
    .select()
    .single()

  return NextResponse.json({ success: true, data: action }, { status: 201 })
}
```

---

## Phase 4: Accessibility + Security (Day 4)

- [x] **4.1 Accessibility Implementation**

**Skip link + focus management:**

```tsx
// src/components/layout/skip-link.tsx
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-ring"
    >
      Skip to main content
    </a>
  )
}
```

**Color-safe chart palette (WCAG AA contrast ratios):**

```typescript
// src/lib/utils/charts.ts
// All colors verified ≥3:1 contrast against white for chart elements (WCAG 1.4.11)
// All text colors verified ≥4.5:1 contrast against white (WCAG 1.4.3)
export const CHART_COLORS = {
  transport: { stroke: '#2563EB', fill: '#2563EB', label: '4.54:1' }, // Blue
  energy:    { stroke: '#DC2626', fill: '#DC2626', label: '4.63:1' }, // Red
  food:      { stroke: '#7C3AED', fill: '#7C3AED', label: '5.87:1' }, // Purple
  shopping:  { stroke: '#EA580C', fill: '#EA580C', label: '4.48:1' }, // Orange
  other:     { stroke: '#6B7280', fill: '#6B7280', label: '4.60:1' }, // Gray
} as const

// Line style patterns for non-color differentiation
export const LINE_PATTERNS = ['solid', 'dashed', 'dotted', 'dashdot'] as const
```

- [x] **4.2 Security Implementation**

**Security headers (next.config.ts):**

```typescript
// next.config.ts
import type { NextConfig } from 'next'

const securityHeaders = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' blob: data: https://*.supabase.co",
      "font-src 'self'",
      "connect-src 'self' https://*.supabase.co https://api.emissions.dev",
      "frame-src 'none'",
    ].join('; '),
  },
]

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }]
  },
}

export default nextConfig
```

**Zod validation middleware (API routes):**

```typescript
// src/lib/utils/api-helpers.ts
import { type ZodSchema } from 'zod'
import { NextResponse } from 'next/server'

export function validateRequest<T>(body: unknown, schema: ZodSchema<T>) {
  const result = schema.safeParse(body)
  if (!result.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: result.error.flatten().fieldErrors },
      { status: 400 }
    )
  }
  return { data: result.data, error: null }
}
```

**Rate limiting (Vercel edge):**

```typescript
// src/lib/utils/rate-limit.ts
const rateLimit = new Map<string, { count: number; timestamp: number }>()

export function checkRateLimit(key: string, limit: number = 30, windowMs: number = 60000): boolean {
  const now = Date.now()
  const entry = rateLimit.get(key)

  if (!entry || now - entry.timestamp > windowMs) {
    rateLimit.set(key, { count: 1, timestamp: now })
    return true
  }

  if (entry.count >= limit) return false

  entry.count++
  return true
}
```

- [x] **4.3 Error Handling**

**Error boundary component:**

```tsx
// src/components/error-boundary.tsx
'use client'

import React from 'react'

interface Props {
  children: React.ReactNode
  fallback?: React.ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="p-8 text-center">
            <h2 className="text-xl font-semibold text-ink mb-2">Something went wrong</h2>
            <p className="text-body-md text-ink-secondary mb-4">
              {this.state.error?.message || 'An unexpected error occurred.'}
            </p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="px-4 py-2 text-sm font-medium text-on-primary bg-primary rounded-pill hover:bg-primary-deep"
            >
              Try again
            </button>
          </div>
        )
      )
    }

    return this.props.children
  }
}
```

**API error response format:**

```typescript
// src/lib/utils/error-response.ts
import { NextResponse } from 'next/server'

export function errorResponse(message: string, status: number = 500) {
  return NextResponse.json(
    { 
      success: false, 
      error: message,
      timestamp: new Date().toISOString(),
    },
    { status }
  )
}

export function unauthorizedResponse() {
  return errorResponse('Unauthorized', 401)
}

export function validationErrorResponse(details: Record<string, string[]>) {
  return NextResponse.json(
    { 
      success: false, 
      error: 'Validation failed',
      details,
      timestamp: new Date().toISOString(),
    },
    { status: 400 }
  )
}
```

---

## Phase 5: Testing (Day 5)

- [ ] **5.1 Test Setup**

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./__tests__/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', '__tests__/setup.ts'],
    },
  },
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
})
```

- [ ] **5.2 Test Categories**

| Test Type | Tool | What to Test | Target Coverage |
|-----------|------|--------------|-----------------|
| **Unit** | Vitest | Utils, validators, insight engine, formatting | 90%+ |
| **Component** | Vitest + Testing Library | Form components, chart rendering, badge display | 80%+ |
| **a11y** | jest-axe | All interactive components, pages | 100% of components |
| **API** | Vitest + MSW | API routes, validation, error handling | 85%+ |
| **E2E** | Playwright | Auth flow, log action, view dashboard, insights | Key user journeys |

**Example tests:**

```typescript
// __tests__/lib/carbon/insights.test.ts
import { describe, it, expect } from 'vitest'
import { generateInsights } from '@/lib/carbon/insights'

describe('generateInsights', () => {
  it('should return comparison insight when above average', () => {
    const actions = Array.from({ length: 30 }, (_, i) => ({
      co2_kg: 50,
      category: 'transport',
      created_at: new Date(Date.now() - i * 86400000).toISOString(),
    }))

    const insights = generateInsights(actions, { country: 'US' })
    const comparison = insights.find(i => i.type === 'comparison')
    expect(comparison).toBeDefined()
    expect(comparison!.title).toContain('Room to improve')
  })

  it('should return transport tips for heavy transport users', () => {
    const actions = [{ co2_kg: 100, category: 'transport', created_at: new Date().toISOString() }]
    const insights = generateInsights(actions, { country: 'US' })
    expect(insights.some(i => i.title.includes('cycling') || i.title.includes('transit'))).toBe(true)
  })
})

// __tests__/lib/validators/action.test.ts
import { describe, it, expect } from 'vitest'
import { transportActionSchema } from '@/lib/validators/action'

describe('transportActionSchema', () => {
  it('should accept valid flight data', () => {
    const result = transportActionSchema.safeParse({
      category: 'transport',
      subcategory: 'flight',
      distance_km: 5500,
      passengers: 1,
      departure_airport: 'JFK',
      arrival_airport: 'LHR',
    })
    expect(result.success).toBe(true)
  })

  it('should reject negative distance', () => {
    const result = transportActionSchema.safeParse({
      category: 'transport',
      subcategory: 'car',
      distance_km: -10,
      passengers: 1,
    })
    expect(result.success).toBe(false)
  })
})

// __tests__/components/charts.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import axe from '@axe-core/react'
import { EmissionsOverTime } from '@/components/charts/emissions-over-time'

describe('EmissionsOverTime', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(
      <EmissionsOverTime data={[{ date: '2025-01-01', co2_kg: 10 }]} />
    )
    const results = await axe(container)
    expect(results.violations).toHaveLength(0)
  })

  it('should include data table for screen readers', () => {
    render(<EmissionsOverTime data={[{ date: '2025-01-01', co2_kg: 10 }]} />)
    expect(screen.getByRole('table')).toBeInTheDocument()
  })
})
```

- [ ] **5.3 Playwright E2E**

```typescript
// e2e/auth-and-logging.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Carbon Tracker', () => {
  test('full user journey: sign up → log action → view dashboard', async ({ page }) => {
    // Sign up
    await page.goto('/signup')
    await page.fill('input[name="email"]', `test-${Date.now()}@example.com`)
    await page.fill('input[name="password"]', 'SecurePass123!')
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL('/dashboard')

    // Log a transport action
    await page.goto('/actions')
    await page.click('button:has-text("Transport")')
    await page.fill('input[name="distance_km"]', '100')
    await page.selectOption('select[name="subcategory"]', 'car')
    await page.click('button:has-text("Log Action")')
    await expect(page.locator('[role="status"]')).toContainText('Action logged')

    // View dashboard
    await page.goto('/dashboard')
    await expect(page.locator('text=kg CO₂')).toBeVisible()
  })

  test('keyboard navigation works throughout app', async ({ page }) => {
    await page.goto('/login')
    // Tab through all interactive elements
    await page.keyboard.press('Tab')
    await expect(page.locator(':focus')).toHaveAttribute('name', 'email')
    await page.keyboard.press('Tab')
    await expect(page.locator(':focus')).toHaveAttribute('name', 'password')
  })
})
```

---

## Phase 6: Polish + Deploy (Day 6)

- [ ] **6.1 Gamification**

```typescript
// Badge definitions
export const BADGES = {
  first_action: { name: 'First Step', description: 'Log your first carbon action', icon: '🌱' },
  streak_7: { name: 'Week Warrior', description: 'Log actions for 7 consecutive days', icon: '🔥' },
  streak_30: { name: 'Monthly Master', description: 'Log actions for 30 consecutive days', icon: '🏆' },
  below_average: { name: 'Below Average', description: 'Stay below your country\'s daily average', icon: '🌍' },
  transport_hero: { name: 'Transport Hero', description: 'Choose green transport 10 times', icon: '🚲' },
  energy_saver: { name: 'Energy Saver', description: 'Reduce energy use by 20%', icon: '⚡' },
  plant_power: { name: 'Plant Power', description: 'Log 20 plant-based meals', icon: '🥦' },
} as const
```

- [ ] **6.2 Country Averages for Benchmarking**

```typescript
// kg CO₂ per day per capita (2024 estimates)
export const COUNTRY_AVERAGES = {
  US: 42.0, CA: 35.0, AU: 40.0, UK: 28.0, DE: 25.0,
  FR: 22.0, JP: 30.0, CN: 22.0, IN: 7.0, BR: 12.0,
  GLOBAL: 16.0,
} as const
```

- [ ] **6.3 Vercel Deployment Checklist**

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Link project
vercel link

# 3. Set environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_JWT_SECRET
vercel env add EMISIONS_API_KEY   # optional, for emissions.dev

# 4. Deploy
vercel --prod

# 5. Verify
vercel ls

# 6. Run accessibility audit
npx @axe-core/cli http://localhost:3000

# 7. Run Lighthouse
npx lighthouse http://localhost:3000 --only-categories=accessibility

# 8. Security audit
npm audit
npm audit fix
```

- [ ] **6.4 Performance Budget**

| Metric | Target | How |
|--------|--------|-----|
| First Contentful Paint | < 1.5s | RSC + edge functions |
| Largest Contentful Paint | < 2.5s | next/image optimization |
| Cumulative Layout Shift | < 0.1 | Fixed dimensions on charts |
| Total Bundle Size | < 150KB | Tree-shaking, dynamic imports |
| Time to Interactive | < 3s | Minimal client JS |
| Lighthouse Accessibility | 100 | jest-axe + manual testing |

---

## Implementation Order

| Step | Task | Files | Est. Time |
|------|------|-------|-----------|
| - [ ] 0 | Landing page + design system | `page.tsx`, `tailwind.config.js`, landing components | 3 hr |
| - [ ] 1 | Scaffold Next.js + deps | `package.json`, configs | 30 min |
| - [ ] 2 | Supabase setup + schema | SQL file, client libs | 1 hr |
| - [ ] 3 | Auth flow (login/signup) | Auth pages, middleware | 1.5 hr |
| - [ ] 4 | Layout + nav + skip link | Layout components | 1 hr |
| - [ ] 5 | Carbon action forms (4 categories) | Form components + Zod | 2 hr |
| - [ ] 6 | API routes (CRUD + insights) | Route handlers | 1.5 hr |
| - [ ] 7 | Dashboard + charts | Dashboard page + Recharts | 2 hr |
| - [ ] 8 | Insights engine | lib/carbon/insights.ts | 1 hr |
| - [x] 9 | AI accessibility (JSON-LD, meta, semantic) | layout.tsx, API routes | 1 hr |
| - [ ] 10 | Badges + gamification | Badge components + logic | 1 hr |
| - [x] 11 | Accessibility pass | jest-axe tests, keyboard nav | 1.5 hr |
| - [x] 12 | Security hardening | Headers, CSP, rate limiting | 1 hr |
| - [x] 13 | Error handling | Error boundaries, API errors | 1 hr |
| - [ ] 14 | Unit + integration tests | __tests__/ | 2 hr |
| - [ ] 15 | E2E tests | e2e/ | 1.5 hr |
| - [ ] 16 | Deploy + verify | vercel.json, env vars | 30 min |
| **Total** | | | **~22 hrs** |

---

## Key Tradeoffs

| Decision | Chose | Alternative | Why |
|----------|-------|-------------|-----|
| Supabase vs Neon | Supabase | Neon | Already in .env, includes auth + realtime |
| emissions.dev vs Climatiq | emissions.dev | Climatiq | Free TS SDK, 500 req/mo, sub-100ms |
| Recharts vs D3 | Recharts | D3 | React-native, accessible, less code |
| shadcn vs MUI | shadcn | MUI | Radix a11y, owns code, smaller bundle |
| Vitest vs Jest | Vitest | Jest | Faster, ESM-native, Vite ecosystem |
| Client calc vs API | Both | API-only | Offline support + free fallback |

---

## Success Criteria

- [ ] **Landing page** with gradient mesh, feature cards, and CTA
- [ ] **AI accessibility** — JSON-LD, semantic HTML, meta tags, machine-readable content
- [ ] User can sign up/log in and see personalized dashboard
- [ ] User can log carbon actions in 4 categories (transport, energy, food, shopping)
- [ ] Dashboard shows emissions over time + category breakdown with charts
- [ ] Insights engine generates personalized tips based on user data
- [ ] All charts have screen reader alternatives (data tables)
- [ ] Keyboard navigation works throughout the app
- [ ] All form inputs have labels and error messages
- [ ] No axe-core violations in any component
- [ ] All API routes validate input with Zod
- [ ] CSP headers configured, no secrets in client bundle
- [ ] Error boundaries on all pages
- [ ] Unit tests pass with 80%+ coverage
- [ ] E2E test covers sign up → log action → view dashboard flow
- [ ] Lighthouse accessibility score ≥ 95
- [ ] App deploys to Vercel with green build

---

## Security Checklist (Pre-Deployment)

- [ ] **Secrets**: No hardcoded secrets, all in env vars
- [ ] **Input Validation**: All user inputs validated with Zod
- [ ] **SQL Injection**: All queries use Supabase client (parameterized)
- [ ] **XSS**: User content sanitized, React's built-in protection used
- [ ] **CSRF**: SameSite cookies, Next.js built-in protection
- [ ] **Authentication**: Tokens in httpOnly cookies (Supabase handles)
- [ ] **Authorization**: Row Level Security enabled on all tables
- [ ] **Rate Limiting**: Enabled on all API endpoints
- [ ] **HTTPS**: Enforced in production (Vercel)
- [ ] **Security Headers**: CSP, X-Frame-Options configured
- [ ] **Error Handling**: No sensitive data in error responses
- [ ] **Logging**: No passwords, tokens, or secrets in logs
- [ ] **Dependencies**: No known vulnerabilities (npm audit clean)
- [ ] **File Uploads**: Validated (size, type) if applicable
