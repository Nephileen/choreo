import fs from "fs";
import path from "path";
import { UPLOAD_DIR } from "../config/storagePaths";
import { v4 as uuidv4 } from "uuid";

const VIDEOS_JSON = path.join(process.cwd(), "data", "videos.json");

type MulterFile = Express.Multer.File;

function readVideos(): any[] {
  if (!fs.existsSync(VIDEOS_JSON)) return [];
  try {
    const raw = fs.readFileSync(VIDEOS_JSON, "utf8");
    return JSON.parse(raw || "[]");
  } catch {
    return [];
  }
}

function writeVideos(v: any[]) {
  fs.writeFileSync(VIDEOS_JSON, JSON.stringify(v, null, 2));
}

export async function handleVideoUpload(req: any, res: any) {
  try {
    const userId = req.body.userId || "default_user";
    const files: MulterFile[] = req.files || [];

    if (!files || files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    // ensure user folder
    const userFolder = path.join(UPLOAD_DIR, userId);
    if (!fs.existsSync(userFolder)) fs.mkdirSync(userFolder, { recursive: true });

    const videos = readVideos();
    const uploaded: any[] = [];

    for (const f of files) {
      // multer will have saved file to temp or to uploads root depending on your multer config
      // move to user folder and give new name
      const newId = uuidv4();
      const ext = path.extname(f.originalname) || ".mp4";
      const newFilename = `${newId}${ext}`;
      const dest = path.join(userFolder, newFilename);

      // if multer stored file in some other path (f.path), move it; else, copy buffer
      if (f.path && fs.existsSync(f.path)) {
        fs.renameSync(f.path, dest);
      } else if ((f as any).buffer) {
        fs.writeFileSync(dest, (f as any).buffer);
      } else {
        // fallback: if multer stored with originalname in UPLOAD_DIR root
        const possible = path.join(UPLOAD_DIR, f.filename || f.originalname);
        if (fs.existsSync(possible)) fs.renameSync(possible, dest);
      }

      const clipData = {
        id: newId,
        userId,
        filename: newFilename,
        url: `/uploads/${userId}/${newFilename}`,
        originalName: f.originalname,
        size: f.size || 0,
        uploadedAt: new Date().toISOString()
      };

      videos.push(clipData);
      uploaded.push(clipData);
    }

    writeVideos(videos);

    return res.json({ uploaded });
  } catch (err: any) {
    console.error("upload error", err);
    return res.status(500).json({ error: "Upload failed", details: err.message });
  }
}
