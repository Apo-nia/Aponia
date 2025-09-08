export type PlanningMode = 'study' | 'content';

const keyFor = (userId?: string | null) =>
  `aponia:planning-mode:${userId ?? 'anon'}`;

export function loadPlanningMode(userId?: string | null): PlanningMode {
  if (typeof window === 'undefined') return 'study';
  const v = localStorage.getItem(keyFor(userId));
  return (v === 'content' || v === 'study') ? v : 'study';
}

export function savePlanningMode(mode: PlanningMode, userId?: string | null) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(keyFor(userId), mode);
  window.location.reload();
}

export function clearPlanningMode(userId?: string | null) {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(keyFor(userId));
}