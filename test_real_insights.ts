import { createClient } from '@supabase/supabase-js'
import { generateInsights } from './src/lib/carbon/insights.ts'
import 'dotenv/config'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function test() {
  const { data: users } = await supabase.auth.admin.listUsers()
  const user = users.users.find(u => u.email === 'deepdata@example.com')
  
  if (!user) {
    console.error('User not found')
    return
  }

  const { data: actions } = await supabase.from('carbon_actions').select('*').eq('user_id', user.id)
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

  console.log(`Found ${actions.length} actions`)
  
  const insights = generateInsights(actions, profile)
  console.log('Generated insights:', JSON.stringify(insights, null, 2))
}

test()
