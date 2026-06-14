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

async function run() {
  const email = 'test@example.com';
  const password = 'password123';
  
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
    display_name: 'Test User',
    country: 'US',
    household_size: 2,
    energy_source: 'mixed',
    diet_type: 'omnivore',
    has_car: true,
    car_fuel_type: 'gasoline'
  });
  if (profileError) {
    console.error('Error creating profile:', profileError);
  }

  // Delete existing actions to prevent duplicates if running multiple times
  await supabase.from('carbon_actions').delete().eq('user_id', userId);

  // Create some carbon actions
  const actions = [
    {
      user_id: userId,
      category: 'transport',
      subcategory: 'car_trip',
      description: 'Commute to work',
      quantity: 15,
      unit: 'km',
      co2_kg: 3.5,
      metadata: { vehicle: 'sedan' }
    },
    {
      user_id: userId,
      category: 'energy',
      subcategory: 'electricity',
      description: 'Monthly electricity bill',
      quantity: 350,
      unit: 'kwh',
      co2_kg: 145.2
    },
    {
      user_id: userId,
      category: 'food',
      subcategory: 'meat',
      description: 'Beef dinner',
      quantity: 0.5,
      unit: 'kg',
      co2_kg: 13.5
    },
    {
      user_id: userId,
      category: 'shopping',
      subcategory: 'clothing',
      description: 'New jeans',
      quantity: 1,
      unit: 'items',
      co2_kg: 15.0
    }
  ];

  const { error: actionsError } = await supabase.from('carbon_actions').insert(actions);
  if (actionsError) {
    console.error('Error inserting actions:', actionsError);
  } else {
    console.log('Successfully inserted mock carbon actions.');
  }

  console.log('====================================');
  console.log('Test user ready!');
  console.log('Email:', email);
  console.log('Password:', password);
  console.log('====================================');
}

run();
