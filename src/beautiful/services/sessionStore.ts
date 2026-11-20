/**
 * Client-side session and workflow persistence store.
 */
export interface SessionState {
  sessionId: string;
  timestamp: number;
  activeModel: string;
  notes: string[];
}

const STORAGE_KEY = 'super_harness_session_v1';

export function loadSavedSession(): SessionState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveSession(state: SessionState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore quota errors in test environments
  }
}
