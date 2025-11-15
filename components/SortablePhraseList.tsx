"use client";

import React from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { Phrase } from "../types/phrase";
import PhraseCard from "./PhraseCard";

type Props = {
  phrases: Phrase[];
  setPhrases: (next: Phrase[]) => void;
};

export default function SortablePhraseList({ phrases, setPhrases }: Props) {
  const sensors = useSensors(useSensor(PointerSensor));

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = phrases.findIndex((p) => p.id === active.id);
    const newIndex = phrases.findIndex((p) => p.id === over.id);

    const reordered = arrayMove(phrases, oldIndex, newIndex).map((p, idx) => ({
      ...p,
      orderIndex: idx,
    }));

    setPhrases(reordered);
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={phrases.map((p) => p.id)}
        strategy={verticalListSortingStrategy}
      >
        <div style={{ display: "grid", gap: 16 }}>
          {phrases.map((p) => (
            <div key={p.id}>
              <PhraseCard
                phrase={p}
                onChange={(next) => {
                  const copy = [...phrases];
                  const idx = copy.findIndex((x) => x.id === next.id);
                  if (idx !== -1) copy[idx] = next;
                  setPhrases(copy);
                }}
              />
            </div>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
