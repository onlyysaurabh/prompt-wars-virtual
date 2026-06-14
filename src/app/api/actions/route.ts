import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { carbonActionSchema } from '@/lib/validators/action'
import { calculateCO2 } from '@/lib/carbon/local-calculator'

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

  try {
    const body = await request.json()
    const validation = carbonActionSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    // Calculate CO₂ and insert
    const { data: action, error } = await supabase
      .from('carbon_actions')
      .insert({ ...validation.data, user_id: user.id, co2_kg: calculateCO2(validation.data) })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, data: action }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 })
  }
}
