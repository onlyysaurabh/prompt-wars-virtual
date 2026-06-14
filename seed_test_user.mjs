import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error("Missing SUPABASE env vars");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

// Helper to generate a random date within the last N days
function randomDateWithinLastDays(days) {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * days));
  // Randomize time
  date.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60), Math.floor(Math.random() * 60));
  return date.toISOString();
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min, max) {
  return (Math.random() * (max - min) + min).toFixed(2);
}

async function run() {
  const email = 'deepdata@example.com';
  const password = 'password123';
  
  console.log(`Starting deep seed for ${email}...`);

  // Create user
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true
  });

  if (authError) {
    if (authError.message.includes('already been registered')) {
        console.log('User already exists, proceeding to seed data...');
    } else {
        console.error('Error creating user:', authError);
        return;
    }
  }

  // Fetch user to get ID
  const { data: usersData, error: usersError } = await supabase.auth.admin.listUsers();
  const user = usersData?.users.find(u => u.email === email);
  if (!user) {
    console.error('Could not find user');
    return;
  }

  const userId = user.id;

  // Create profile
  const { error: profileError } = await supabase.from('profiles').upsert({
    id: userId,
    display_name: 'Eco Warrior',
    country: 'US',
    household_size: 3,
    energy_source: 'mixed',
    diet_type: 'vegetarian',
    has_car: true,
    car_fuel_type: 'hybrid'
  });
  if (profileError) {
    console.error('Error creating profile:', profileError);
  }

  console.log('Cleaning up old data...');
  // Delete existing data to prevent duplicates
  await supabase.from('carbon_actions').delete().eq('user_id', userId);
  await supabase.from('user_goals').delete().eq('user_id', userId);
  await supabase.from('user_badges').delete().eq('user_id', userId);
  await supabase.from('carbon_summaries').delete().eq('user_id', userId);

  console.log('Generating carbon actions...');
  const actions = [];
  
  // Base activities templates
  const templates = [
    { category: 'transport', subcategory: 'car_trip', description: 'Commute to work', unit: 'km', getQty: () => randomInt(10, 40), co2PerUnit: 0.12, metadata: { vehicle: 'hybrid sedan' } },
    { category: 'transport', subcategory: 'bus', description: 'Bus trip to downtown', unit: 'km', getQty: () => randomInt(5, 20), co2PerUnit: 0.08, metadata: { route: 'City Line' } },
    { category: 'transport', subcategory: 'flight', description: 'Domestic flight', unit: 'km', getQty: () => randomInt(800, 2000), co2PerUnit: 0.25, metadata: { class: 'economy' } },
    { category: 'energy', subcategory: 'electricity', description: 'Daily electricity', unit: 'kwh', getQty: () => randomInt(5, 15), co2PerUnit: 0.4 },
    { category: 'energy', subcategory: 'gas', description: 'Heating', unit: 'kwh', getQty: () => randomInt(10, 30), co2PerUnit: 0.2 },
    { category: 'food', subcategory: 'meat', description: 'Chicken meal', unit: 'kg', getQty: () => randomFloat(0.2, 0.5), co2PerUnit: 6.9 },
    { category: 'food', subcategory: 'dairy', description: 'Cheese and milk', unit: 'kg', getQty: () => randomFloat(0.5, 1.5), co2PerUnit: 3.2 },
    { category: 'food', subcategory: 'plant_based', description: 'Vegetables and grains', unit: 'kg', getQty: () => randomFloat(1.0, 2.5), co2PerUnit: 1.1 },
    { category: 'shopping', subcategory: 'clothing', description: 'New shirt', unit: 'items', getQty: () => randomInt(1, 3), co2PerUnit: 10.0 },
    { category: 'shopping', subcategory: 'electronics', description: 'Gadget', unit: 'items', getQty: () => 1, co2PerUnit: 50.0 },
    { category: 'other', subcategory: 'waste', description: 'Household waste', unit: 'kg', getQty: () => randomFloat(2.0, 5.0), co2PerUnit: 0.5 },
  ];

  // Generate 200 actions over the last 90 days
  for (let i = 0; i < 200; i++) {
    const template = templates[Math.floor(Math.random() * templates.length)];
    const quantity = template.getQty();
    const co2_kg = parseFloat((quantity * template.co2PerUnit).toFixed(2));
    const created_at = randomDateWithinLastDays(90);
    
    actions.push({
      user_id: userId,
      category: template.category,
      subcategory: template.subcategory,
      description: template.description,
      quantity,
      unit: template.unit,
      co2_kg,
      metadata: template.metadata || {},
      created_at
    });
  }

  // Insert actions in chunks to avoid any request size limits (though 200 is small)
  const { error: actionsError } = await supabase.from('carbon_actions').insert(actions);
  if (actionsError) {
    console.error('Error inserting actions:', actionsError);
  } else {
    console.log(`Inserted ${actions.length} carbon actions.`);
  }

  console.log('Generating goals...');
  const goals = [
    { user_id: userId, goal_type: 'monthly_target', target_co2_kg: 300, active: true },
    { user_id: userId, goal_type: 'category_limit', target_category: 'transport', target_co2_kg: 100, active: true },
    { user_id: userId, goal_type: 'streak', target_co2_kg: null, active: true }
  ];
  await supabase.from('user_goals').insert(goals);

  console.log('Generating badges...');
  const badges = [
    { user_id: userId, badge_type: 'first_action' },
    { user_id: userId, badge_type: 'streak_7' },
    { user_id: userId, badge_type: 'below_average' },
    { user_id: userId, badge_type: 'eco_warrior' }
  ];
  await supabase.from('user_badges').insert(badges);

  console.log('Generating summaries...');
  // Add some monthly summaries for the past 3 months
  const now = new Date();
  const summaries = [];
  for (let i = 1; i <= 3; i++) {
    const periodStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const periodEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0); // last day of month
    
    summaries.push({
      user_id: userId,
      period_type: 'monthly',
      period_start: periodStart.toISOString().split('T')[0],
      period_end: periodEnd.toISOString().split('T')[0],
      total_co2_kg: parseFloat(randomFloat(250, 450)),
      breakdown: {
        transport: parseFloat(randomFloat(50, 150)),
        energy: parseFloat(randomFloat(80, 120)),
        food: parseFloat(randomFloat(50, 100)),
        shopping: parseFloat(randomFloat(20, 80))
      }
    });
  }
  await supabase.from('carbon_summaries').insert(summaries);

  console.log('====================================');
  console.log('Deep Data User Ready!');
  console.log('Email:', email);
  console.log('Password:', password);
  console.log(`Actions created: ${actions.length}`);
  console.log('====================================');
}

run();
