// API service for communicating with the backend
const API_BASE_URL = "http://localhost:4000";

// Generate or retrieve userId (use a stable identifier)
function getUserId(): string {
  let userId = localStorage.getItem("userId");
  if (!userId) {
    userId = `user_${Date.now()}`;
    localStorage.setItem("userId", userId);
  }
  return userId;
}

export interface UploadedClip {
  id: string;
  userId: string;
  filename: string;
  url: string;
  originalName: string;
  size: number;
  uploadedAt: string;
  duration?: number; // Duration in seconds (optional, may be added by backend)
}

export interface SavedSequence {
  sequence: string[]; // Array of clip IDs
}

// Upload videos to the backend
export async function uploadVideos(files: File[]): Promise<UploadedClip[]> {
  const formData = new FormData();
  files.forEach((file) => formData.append("videos", file));
  formData.append("userId", getUserId());

  const response = await fetch(`${API_BASE_URL}/api/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.details || error.error || "Upload failed");
  }

  const data = await response.json();
  return data.uploaded;
}

// Get all videos for the current user
export async function getVideos(): Promise<UploadedClip[]> {
  const userId = getUserId();
  const response = await fetch(`${API_BASE_URL}/api/videos?userId=${userId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch videos");
  }

  const data = await response.json();
  return data.clips;
}

// Save a sequence (arrangement of clips)
export async function saveSequence(clipIds: string[]): Promise<void> {
  const userId = getUserId();
  const response = await fetch(`${API_BASE_URL}/api/sequence`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, sequence: clipIds }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.details || error.error || "Failed to save sequence");
  }
}

// Get saved sequence for the current user
export async function getSequence(): Promise<string[]> {
  const userId = getUserId();
  const response = await fetch(`${API_BASE_URL}/api/sequence?userId=${userId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch sequence");
  }

  const data = await response.json();
  return data.sequence || [];
}

// Export/merge videos into a single choreography video
export async function exportChoreography(): Promise<string> {
  const userId = getUserId();
  const response = await fetch(`${API_BASE_URL}/api/export`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.details || error.error || "Export failed");
  }

  const data = await response.json();
  return data.exportUrl; // e.g., "/exports/choreo_userid_timestamp.mp4"
}

// Get the full URL for a video/export
export function getFullUrl(path: string): string {
  if (path.startsWith("http")) return path;
  return `${API_BASE_URL}${path}`;
}
