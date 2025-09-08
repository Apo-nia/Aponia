'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/client';

import { loadPlanningMode, savePlanningMode, type PlanningMode } from '@/lib/helper/planningMode';


import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useTheme } from 'next-themes';
import { useUiMode } from '@/lib/helper/useUiMode';

type NavbarProps = {
  name?: string;
  avatarUrl?: string;
  userId?: string | null;
};

export default function Navbar({ name = 'User', avatarUrl, userId }: NavbarProps) {
  const router = useRouter();
  const supabase = createClient();

  // planning mode
  const [mode, setMode] = useState<PlanningMode>('study');
  useEffect(() => { setMode(loadPlanningMode(userId)); }, [userId]);
  const setModePersist = (m: PlanningMode) => { setMode(m); savePlanningMode(m, userId); };


  // === in your component body ===
const { theme, setTheme } = useTheme();
const { mode: uiMode, setMode: setUiMode } = useUiMode();


  const onAddTask = () => router.push(`/create_task?mode=${mode}`);
  const onLogout = async () => { 
    await supabase.auth.signOut();
     // Reset theme + uiMode instead of clearing all storage
  localStorage.setItem("theme", "dark");
  localStorage.setItem("uiMode", "default");

  // Reset <html> attributes too
  document.documentElement.dataset.uiMode = "default";
  document.documentElement.classList.remove("light");
  document.documentElement.classList.add("dark");
    router.push('/auth/login'); 
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/40 backdrop-blur">
      <div className="flex h-12 w-full items-center justify-between px-6">
        {/* Left */}
        <Link href="/dashboard" className="text-sm sm:text-base font-semibold tracking-tight hover:opacity-90">
          Aponia-AI_<span className="text-primary">Study</span>
        </Link>

        {/* Center */}
        {/* <div className="hidden md:flex items-center gap-3">
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs sm:text-sm">
            Planning Mode:&nbsp;<span className="font-medium capitalize">{mode}</span>
          </span>
          <div className="flex rounded-full bg-white/10 p-0.5">
            <button
              onClick={() => setModePersist('study')}
              className={`px-3 py-1 text-xs sm:text-sm rounded-full ${mode === 'study' ? 'bg-white/20' : 'hover:bg-white/10'}`}
            >
              Study
            </button>
            <button
              onClick={() => setModePersist('content')}
              className={`px-3 py-1 text-xs sm:text-sm rounded-full ${mode === 'content' ? 'bg-white/20' : 'hover:bg-white/10'}`}
            >
              Content
            </button>
          </div>

          <button
            onClick={onAddTask}
            className="h-8 rounded-full border border-white/10 bg-white/5 px-3 text-xs sm:text-sm font-medium
                       hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
          >
            + {mode === 'study' ? 'Study Task' : 'Content Task'}
          </button>
        </div> */}
        {/* Center */}
        <div className="hidden md:flex items-center gap-3">

        {/* Planning Mode chip */}
        <span className="chip-animate rounded-full bg-white/10 px-3 py-1 text-xs sm:text-sm">
            Planning Mode:&nbsp;<span className="font-medium capitalize">{mode}</span>
        </span>

        {/* Study / Content toggle */}
        <div className="flex rounded-full bg-white/10 p-0.5">
            <button
                onClick={() => setModePersist('study')}
                className={`toggle-pill px-3 py-1 text-xs sm:text-sm rounded-full ${
                mode === 'study' ? 'bg-white/20' : ''
                }`}
                aria-pressed={mode === 'study'}
            >
                <span key={mode === 'study' ? 'study' : 'other'} className={mode === 'study' ? 'pill-active' : ''}>
                Study
                </span>
            </button>

            <button
                onClick={() => setModePersist('content')}
                className={`toggle-pill px-3 py-1 text-xs sm:text-sm rounded-full ${
                mode === 'content' ? 'bg-white/20' : ''
                }`}
                aria-pressed={mode === 'content'}
            >
                <span key={mode === 'content' ? 'content' : 'other'} className={mode === 'content' ? 'pill-active' : ''}>
                Content
                </span>
            </button>
        </div>

        {/* + Task — label swaps with a tiny fade/slide */}
        <button
            onClick={onAddTask}
            className="cta h-8 rounded-full border border-white/10 bg-white/5 px-3 text-xs sm:text-sm font-medium
                    focus:outline-none focus:ring-2 focus:ring-white/20"
        >
            <span key={mode} className="inline-block swap-fade">
            + {mode === 'study' ? 'Study Task' : 'Content Task'}
            </span>
        </button>
        </div>

        {/* Right avatar + name menu (Dropdown + Submenu) */}
        <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
            <button className="flex items-center gap-2 rounded-full bg-white/5 px-3 py-1.5 transition hover:bg-white/10">
            <div className="h-8 w-8 overflow-hidden rounded-full bg-white/20">
                {avatarUrl ? (
                <Image src={avatarUrl} alt="avatar" width={32} height={32} className="h-8 w-8 object-cover" />
                ) : (
                <div className="flex h-8 w-8 items-center justify-center text-sm font-medium">
                    {(name || 'U').slice(0, 1).toUpperCase()}
                </div>
                )}
            </div>
            <span className="hidden sm:inline text-sm">Hello, {name}</span>
            </button>
        </DropdownMenu.Trigger>

        {/* Main menu */}
            <DropdownMenu.Content
                sideOffset={8}
                align="end"
                className="dropdown-animate w-56 rounded-xl border border-white/10 bg-popover text-popover-foreground p-1 shadow-xl"
                >
                <DropdownMenu.Item
                    onSelect={() => router.push('/profile')}
                    className="menu-item w-full rounded-lg px-3 py-2 text-sm outline-none cursor-pointer"
                >
                    Profile
                </DropdownMenu.Item>

                <DropdownMenu.Sub>
                    <DropdownMenu.SubTrigger className="menu-item w-full rounded-lg px-3 py-2 text-sm outline-none cursor-pointer">
                    Theme Mode
                    </DropdownMenu.SubTrigger>

                    <DropdownMenu.SubContent
                    sideOffset={8}
                    alignOffset={-4}
                    className="dropdown-animate w-56 rounded-xl border border-white/10 bg-popover text-popover-foreground p-2 shadow-xl"
                    >
                    <div className="px-2 pb-2 text-xs opacity-70">Color Theme</div>
                    <DropdownMenu.RadioGroup value={theme ?? 'dark'} onValueChange={setTheme}>
                        <DropdownMenu.RadioItem
                        value="dark"
                        className="menu-item flex items-center gap-2 rounded-md px-3 py-2 text-sm outline-none cursor-pointer"
                        >
                        <DropdownMenu.ItemIndicator>
                            <span className="menu-indicator inline-block h-2 w-2 rounded-full bg-primary" />
                        </DropdownMenu.ItemIndicator>
                        Dark
                        </DropdownMenu.RadioItem>
                        <DropdownMenu.RadioItem
                        value="light"
                        className="menu-item flex items-center gap-2 rounded-md px-3 py-2 text-sm outline-none cursor-pointer"
                        >
                        <DropdownMenu.ItemIndicator>
                            <span className="menu-indicator inline-block h-2 w-2 rounded-full bg-primary" />
                        </DropdownMenu.ItemIndicator>
                        Light
                        </DropdownMenu.RadioItem>
                    </DropdownMenu.RadioGroup>

                    <div className="mt-2 px-2 pb-2 text-xs opacity-70">UI Flavor</div>
                    <DropdownMenu.RadioGroup value={uiMode} onValueChange={(v) => setUiMode(v as any)}>
                        {['default', 'focused', 'overwhelmed'].map((val) => (
                        <DropdownMenu.RadioItem
                            key={val}
                            value={val}
                            className="menu-item flex items-center gap-2 rounded-md px-3 py-2 text-sm outline-none cursor-pointer"
                        >
                            <DropdownMenu.ItemIndicator>
                            <span className="menu-indicator inline-block h-2 w-2 rounded-full bg-primary" />
                            </DropdownMenu.ItemIndicator>
                            {val[0].toUpperCase() + val.slice(1)}
                        </DropdownMenu.RadioItem>
                        ))}
                    </DropdownMenu.RadioGroup>
                    </DropdownMenu.SubContent>
                </DropdownMenu.Sub>

                <DropdownMenu.Separator className="my-1 h-px bg-white/10" />

                <DropdownMenu.Item
                    onSelect={onLogout}
                    className="menu-item w-full rounded-lg px-3 py-2 text-left text-sm text-red-400 outline-none cursor-pointer hover:bg-red-500/10"
                >
                    Logout
                </DropdownMenu.Item>
            </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>
    </header>
  );
}
