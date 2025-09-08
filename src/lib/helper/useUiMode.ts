"use client";

import { useEffect, useState } from "react";

export type UiMode = "default" | "focused" | "overwhelmed";
const KEY = "uiMode";

export function useUiMode() {
  const [mode, setMode] = useState<UiMode>(() => {
    if (typeof window === "undefined") return "default";
    return (localStorage.getItem(KEY) as UiMode) || "default";
  });

  useEffect(() => {
    // Put a marker on <html> for CSS to hook into
    document.documentElement.dataset.uiMode = mode;
    localStorage.setItem(KEY, mode);
  }, [mode]);

  return { mode, setMode };
}