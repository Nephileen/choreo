import fs from "fs";
import path from "path";
import { DATA_DIR } from "../config/storagePaths";

const VIDEOS_JSON = path.join(DATA_DIR, "videos.json");

function readVideos() {
  if (!fs.existsSync(VIDEOS_JSON)) return [];
  try {
    return JSON.parse(fs.readFileSync(VIDEOS_JSON, "utf8") || "[]");
  } catch {
    return [];
  }
}

export function getUserVideos(req: any, res: any) {
  const userId = (req.query.userId as string) || "default_user";
  const videos = readVideos();
  const userClips = videos.filter((v: any) => v.userId === userId);
  return res.json({ clips: userClips });
}
