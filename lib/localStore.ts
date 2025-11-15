// lib/localStore.ts
import { Phrase } from "../types/phrase";

const KEY = "dance-phrases:v1";

export function loadPhrases(): Phrase[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Phrase[];
    return parsed.sort((a, b) => a.orderIndex - b.orderIndex);
  } catch {
    return [];
  }
}

export function savePhrases(phrases: Phrase[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(phrases));
}
