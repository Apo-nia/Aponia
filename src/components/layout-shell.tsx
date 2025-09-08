"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { clearPlanningMode } from "@/lib/helper/planningMode";
import { createClient } from "@/lib/client";
import Navbar from "./ui/navbar";
// import Navbar from "./navbar";

const AUTH_ROUTES = [
  "/auth/login",
  "/auth/sign-up",
  "/auth/forgot-password",
  "/auth/update-password",
  "/auth/sign-up-success",
  "/auth/error",
  "/auth/login-otp",
  "/auth/verify-otp"

];

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideNavbar = AUTH_ROUTES.some((r) => (pathname ?? "").startsWith(r));

  const supabase = createClient();
  const [name, setName] = useState<string>("User");
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const [userId, setUserId] = useState<string | null>(null);

  // keep last user id available when signing out (state may change before we clear prefs)
  const lastUserIdRef = useRef<string | null>(null);
  useEffect(() => { lastUserIdRef.current = userId; }, [userId]);

  async function loadUser() {
    const { data: { user } } = await supabase.auth.getUser();
    setUserId(user?.id ?? null);

    if (!user) {
      setName("User");
      setAvatarUrl(undefined);
      return;
    }

    const fallback = user.email?.split("@")[0] ?? "User";

    const { data: profile } = await supabase
      .from("users")
      .select("first_name, last_name")
      .eq("id", user.id)
      .single();

    const fullName = `${profile?.first_name ?? ""} ${profile?.last_name ?? ""}`.trim();
    setName(fullName || fallback);
    // setAvatarUrl(profile?.avatar_url ?? undefined); // if/when you add it
  }

  useEffect(() => {
    loadUser();

    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED" || event === "USER_UPDATED") {
        loadUser();
      }
      if (event === "SIGNED_OUT") {
        // clear per-user planning mode
        clearPlanningMode(lastUserIdRef.current || undefined);
        setUserId(null);
        setName("User");
        setAvatarUrl(undefined);
        // Reset theme + uiMode
        if (typeof window !== "undefined") {
            localStorage.setItem("theme", "dark");
            localStorage.setItem("uiMode", "default");
        }

        if (typeof document !== "undefined") {
            document.documentElement.dataset.uiMode = "default";
            document.documentElement.classList.remove("light");
            document.documentElement.classList.add("dark");
        }
      }
    });

    // also re-check on route change if layout persists
    loadUser();

    return () => {
      sub.subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <div className="min-h-dvh flex flex-col">
      {!hideNavbar && <Navbar name={name} avatarUrl={avatarUrl} userId={userId} />}
      <main className="flex-1">{children}</main>
    </div>
  );
}