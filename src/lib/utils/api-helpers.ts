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
