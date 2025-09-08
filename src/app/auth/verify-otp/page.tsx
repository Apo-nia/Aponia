// src/app/auth/verify-otp/page.tsx
import { Suspense } from 'react'
import { OtpVerifyForm } from '@/components/otp-verify-form'

function OtpVerifyFormWrapper() {
  return <OtpVerifyForm />
}

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Suspense fallback={<div>Loading...</div>}>
          <OtpVerifyFormWrapper />
        </Suspense>
      </div>
    </div>
  )
}
