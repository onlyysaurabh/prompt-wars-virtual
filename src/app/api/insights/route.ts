import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { generateInsights } from '@/lib/carbon/insights'

export async function GET() {
  try {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      console.log('Unauthorized request to /api/insights');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: actions, error: actionsError } = await supabase
      .from('carbon_actions')
      .select('*')
      .eq('user_id', user.id)

    if (actionsError) {
      console.error('Error fetching actions:', actionsError);
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('Error fetching profile:', profileError);
    }

    const insights = generateInsights(actions || [], profile || {})

    return NextResponse.json({ success: true, data: insights })
  } catch (error) {
    console.error('Unhandled error in /api/insights:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
