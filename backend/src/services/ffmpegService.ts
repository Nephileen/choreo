import ffmpeg from "fluent-ffmpeg";
import path from "path";
import fs from "fs";
import { UPLOAD_DIR, EXPORT_DIR } from "../config/storagePaths";

// This helper will create a temporary concat file and call ffmpeg to concatenate.
// It will re-encode if needed (i.e., use libx264 + aac) to be robust across inputs.

export function mergeVideosByIds(userId: string, clipFilenames: string[]): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(clipFilenames) || clipFilenames.length === 0) {
      return reject(new Error("No clips provided"));
    }

    // build list of absolute paths to the user's clips
    const inputs = clipFilenames.map(fn => path.join(UPLOAD_DIR, userId, fn));

    // ensure inputs exist
    for (const p of inputs) {
      if (!fs.existsSync(p)) return reject(new Error(`Input not found: ${p}`));
    }

    // create temporary concat file (ffmpeg concat demuxer needs "file 'path'")
    const concatFile = path.join(EXPORT_DIR, `concat_${userId}_${Date.now()}.txt`);
    const concatContent = inputs.map(p => `file '${p.replace(/'/g, "'\\''")}'`).join("\n");
    fs.writeFileSync(concatFile, concatContent);

    const outputName = `choreo_${userId}_${Date.now()}.mp4`;
    const outputPath = path.join(EXPORT_DIR, outputName);

    // Attempt concat with copy first (fast). If it fails, fallback to re-encode.
    const cmd = ffmpeg()
      .input(concatFile)
      .inputOptions(["-f", "concat", "-safe", "0"])
      .outputOptions(["-c", "copy"])
      .on("error", function (err) {
        console.warn("ffmpeg concat copy failed; trying re-encode. error:", err.message);
        // fallback: re-encode
        const cmd2 = ffmpeg();
        inputs.forEach(i => cmd2.input(i));
        cmd2
          .on("end", () => {
            // remove concat file
            try { fs.unlinkSync(concatFile); } catch {}
            resolve(outputName);
          })
          .on("error", (err2) => {
            try { fs.unlinkSync(concatFile); } catch {}
            reject(err2);
          })
          // re-encode to H264 + AAC
          .videoCodec("libx264")
          .audioCodec("aac")
          .format("mp4")
          .mergeToFile(outputPath, EXPORT_DIR);
      })
      .on("end", () => {
        try { fs.unlinkSync(concatFile); } catch {}
        resolve(outputName);
      })
      .mergeToFile(outputPath, EXPORT_DIR);
  });
}
