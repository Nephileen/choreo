// components/PhraseCard.tsx
"use client";

import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Phrase } from "../types/phrase";

type Props = {
  phrase: Phrase;
  onChange: (next: Phrase) => void;
};

export default function PhraseCard({ phrase, onChange }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: phrase.id });

  const style: React.CSSProperties = {
    transform: transform ? CSS.Transform.toString(transform) : undefined,
    transition,
    border: "1px solid #444",
    borderRadius: 12,
    padding: 16,
    backgroundColor: "#111827",
    boxShadow: "0 1px 3px rgba(0,0,0,0.4)",
    display: "grid",
    gap: 8,
  };

  const [title, setTitle] = useState(phrase.title);
  const [notes, setNotes] = useState(phrase.notes);

  return (
    <div ref={setNodeRef} style={style}>
      {/* Top row: drag handle + title */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <button
          {...attributes}
          {...listeners}
          style={{
            cursor: "grab",
            borderRadius: 8,
            border: "1px solid #555",
            padding: "4px 8px",
            background: "#020617",
          }}
          aria-label="Drag phrase"
        >
          ↕
        </button>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => onChange({ ...phrase, title })}
          placeholder="Phrase title"
          style={{
            flex: 1,
            padding: "6px 8px",
            borderRadius: 8,
            border: "1px solid #555",
            background: "#020617",
            color: "white",
          }}
        />
      </div>

      {/* Video preview */}
      <div>
        {phrase.videoUrl ? (
          <video
            src={phrase.videoUrl}
            controls
            style={{
              width: "100%",
              borderRadius: 8,
              border: "1px solid #333",
            }}
          />
        ) : (
          <div
            style={{
              borderRadius: 8,
              border: "1px dashed #555",
              padding: 16,
              fontSize: 12,
              color: "#9ca3af",
              textAlign: "center",
            }}
          >
            No video yet – paste a link below or keep this as notes only.
          </div>
        )}
      </div>

      {/* Notes */}
      <div>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onBlur={() => onChange({ ...phrase, notes })}
          placeholder="Notes about counts, movement quality, cues..."
          style={{
            width: "100%",
            minHeight: 80,
            resize: "vertical",
            borderRadius: 8,
            border: "1px solid #555",
            padding: 8,
            background: "#020617",
            color: "white",
          }}
        />
        <div style={{ marginTop: 4, fontSize: 10, color: "#6b7280" }}>
          Created: {new Date(phrase.createdAt).toLocaleString()}
        </div>
      </div>

      {/* Video URL input */}
      <div>
        <input
          defaultValue={phrase.videoUrl}
          placeholder="Paste video URL (for now)"
          onBlur={(e) =>
            onChange({ ...phrase, videoUrl: e.currentTarget.value })
          }
          style={{
            width: "100%",
            padding: "6px 8px",
            borderRadius: 8,
            border: "1px solid #555",
            background: "#020617",
            color: "white",
          }}
        />
      </div>
    </div>
  );
}
