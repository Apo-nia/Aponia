'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const RESEND_COOLDOWN = 60; // seconds

export function OtpVerifyForm() {
  const params = useSearchParams();
  const router = useRouter();
  const email = params.get('email') || '';

  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const [secondsLeft, setSecondsLeft] = useState(RESEND_COOLDOWN);
  const [isResending, setIsResending] = useState(false);
  const canResend = secondsLeft === 0 && !isResending;

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const t = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [secondsLeft]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setError(null);
    const supabase = createClient();

    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: code,
        type: 'email',
      });
      if (error) throw error;

      await fetch('/api/mfa/complete', { method: 'POST' });
      router.push('/dashboard');
    } catch (err: any) {
      setError(err?.message ?? 'Invalid or expired code');
    } finally {
      setIsVerifying(false);
    }
  };

  const resend = async () => {
    if (!canResend || !email) return;
    setIsResending(true);
    setError(null);
    const supabase = createClient();

    try {
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) throw error;
      setSecondsLeft(RESEND_COOLDOWN); // restart cooldown
    } catch (err: any) {
      // Supabase may return 429 if you hit rate limits
      setError(err?.message ?? 'Could not resend code. Try again shortly.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Enter your code</CardTitle>
        <CardDescription>We sent a 6-digit code to {email || 'your email'}.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleVerify} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="code">Code</Label>
            <Input
              id="code"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="123456"
              value={code}
              onChange={(e) => setCode(e.target.value.trim())}
              required
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button className="w-full" type="submit" disabled={isVerifying}>
            {isVerifying ? 'Verifying…' : 'Verify & continue'}
          </Button>

          <div className="mt-2 text-center text-sm">
            {!canResend ? (
              <span>Resend code in {secondsLeft}s</span>
            ) : (
              <button
                type="button"
                className="underline underline-offset-4"
                onClick={resend}
                disabled={isResending}
              >
                {isResending ? 'Sending…' : 'Resend code'}
              </button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
