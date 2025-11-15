// types/phrase.ts

export type Phrase = {
  id: string;
  title: string;
  notes: string;
  videoUrl: string;   // for now this will be a URL string (or can be empty)
  orderIndex: number;
  createdAt: number;  // Date.now()
};
