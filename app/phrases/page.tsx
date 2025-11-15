// App/phrases/page.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Phrase } from "../../types/phrase";
import { loadPhrases, savePhrases } from "../../lib/localStore";
import SortablePhraseList from "../../components/SortablePhraseList";

function makeId() {
  return Math.random().toString(36).slice(2, 10);
}

export default function PhrasesPage() {
  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const initial = loadPhrases();
    if (initial.length === 0) {
      const seed: Phrase[] = [
        {
          id: makeId(),
          title: "Intro turn combo",
          notes: "Light on feet, counts 5-6-7-8.",
          videoUrl: "",
          orderIndex: 0,
          createdAt: Date.now(),
        },
        {
          id: makeId(),
          title: "Floor phrase",
          notes: "Watch knees on slide into the floor.",
          videoUrl: "",
          orderIndex: 1,
          createdAt: Date.now(),
        },
      ];
      setPhrases(seed);
      savePhrases(seed);
    } else {
      setPhrases(initial);
    }
  }, []);

  useEffect(() => {
    savePhrases(phrases);
  }, [phrases]);

  const visible = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return phrases;
    return phrases.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.notes.toLowerCase().includes(q)
    );
  }, [phrases, filter]);

  function addPhrase() {
    const next: Phrase = {
      id: makeId(),
      title: "New phrase",
      notes: "",
      videoUrl: "",
      orderIndex: phrases.length,
      createdAt: Date.now(),
    };
    setPhrases([...phrases, next]);
  }

  return (
    <main
      style={{
        maxWidth: 900,
        margin: "32px auto",
        padding: "0 16px 32px",
        display: "grid",
        gap: 16,
      }}
    >
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <h1 style={{ fontSize: 24, fontWeight: 600 }}>
          Your Dance Phrases
        </h1>
        <button
          onClick={addPhrase}
          style={{
            borderRadius: 999,
            border: "1px solid #4b5563",
            padding: "8px 14px",
            background: "#111827",
            color: "white",
            cursor: "pointer",
          }}
        >
          + Add phrase
        </button>
      </header>

      <div>
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Search by title or notes..."
          style={{
            width: "100%",
            padding: "8px 10px",
            borderRadius: 8,
            border: "1px solid #4b5563",
            background: "#020617",
            color: "white",
          }}
        />
      </div>

      <SortablePhraseList phrases={visible} setPhrases={setPhrases} />

      <p style={{ fontSize: 11, color: "#9ca3af" }}>
        Right now, your phrases are saved only in this browser using
        localStorage. Later we can connect this to a real database and file
        storage.
      </p>
    </main>
  );
}
