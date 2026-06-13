import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { generateInsights } from '@/lib/carbon/insights'

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

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const insights = generateInsights(actions || [], profile || {})

  return NextResponse.json({ success: true, data: insights })
}
