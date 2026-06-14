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
