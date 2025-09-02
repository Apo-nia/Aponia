"use client";

import { getProviders, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function SignInPage() {
  const [providers, setProviders] = useState<Record<string, any> | null>(null);
  const search = useSearchParams();
  const callbackUrl = search.get("callbackUrl") || "/";

  useEffect(() => {
    (async () => {
      const res = await getProviders();
      setProviders(res);
    })();
  }, []);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="bg-white/5 border border-white/10 rounded-xl p-6 w-full max-w-sm text-center">
        <h1 className="text-lg font-semibold text-white mb-4">Sign in</h1>
        <p className="text-sm text-white/70 mb-6">Connect your account to continue.</p>
        <div className="space-y-3">
          {providers && Object.values(providers).map((p: any) => (
            <button
              key={p.id}
              onClick={() => signIn(p.id, { callbackUrl })}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-md text-sm font-medium"
            >
              Continue with {p.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
