import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { updateSession } from '@/lib/middleware'

// Public routes (no OTP gate)
const EXEMPT_PREFIXES = ['/auth', '/api/mfa/complete']

export async function middleware(req: NextRequest) {
  const url = req.nextUrl
  const path = url.pathname

  // Skip static assets per your matcher AND skip exempt prefixes
  if (EXEMPT_PREFIXES.some(p => path.startsWith(p))) {
    return await updateSession(req)
  }

  // Require OTP cookie everywhere else (this includes /create_task, /update_task)
  const mfaOk = req.cookies.get('mfa_ok')?.value === '1'
  if (!mfaOk) {
    url.pathname = '/auth/verify-otp'
    return NextResponse.redirect(url)
  }

  // Proceed with your normal Supabase session sync
  return await updateSession(req)
}

export const config = {
  runtime: 'nodejs',
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}