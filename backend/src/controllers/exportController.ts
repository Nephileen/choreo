import path from "path";
import fs from "fs";
import { mergeVideosByIds } from "../services/ffmpegService";
import { UPLOAD_DIR, EXPORT_DIR } from "../config/storagePaths";

const VIDEOS_JSON = path.join(process.cwd(), "data", "videos.json");
const SEQ_JSON = path.join(process.cwd(), "data", "sequences.json");

function readVideos() {
  if (!fs.existsSync(VIDEOS_JSON)) return [];
  return JSON.parse(fs.readFileSync(VIDEOS_JSON, "utf8") || "[]");
}

function readSeq() {
  if (!fs.existsSync(SEQ_JSON)) return {};
  return JSON.parse(fs.readFileSync(SEQ_JSON, "utf8") || "{}");
}

export async function exportChoreo(req: any, res: any) {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: "userId required" });

    const sequences = readSeq();
    const videos = readVideos();

    const sequence = sequences[userId];
    if (!sequence || sequence.length === 0) {
      return res.status(400).json({ error: "No sequence found for user" });
    }

    // sequence may be an array of clipIds OR filenames; check videos.json to map ids->filenames
    const clipFilenames: string[] = sequence.map((clipIdOrFilename: string) => {
      // find by id
      const v = videos.find((vv: any) => vv.id === clipIdOrFilename);
      if (v) return v.filename;
      // fallback assume it's already a filename
      return clipIdOrFilename;
    });

    // ensure user folder exists and all files exist
    for (const fn of clipFilenames) {
      const p = path.join(UPLOAD_DIR, userId, fn);
      if (!fs.existsSync(p)) return res.status(400).json({ error: `Missing clip ${fn}` });
    }

    const outputName = await mergeVideosByIds(userId, clipFilenames);

    return res.json({ ok: true, exportUrl: `/exports/${outputName}` });
  } catch (err: any) {
    console.error("export error", err);
    return res.status(500).json({ error: "Export failed", details: err.message });
  }
}
