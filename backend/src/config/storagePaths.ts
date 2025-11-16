import path from "path";
import fs from "fs";

const ROOT = path.join(__dirname, "..", ".."); // project root

export const UPLOAD_DIR = path.join(ROOT, "uploads");
export const EXPORT_DIR = path.join(ROOT, "exports");
export const DATA_DIR = path.join(ROOT, "data");

// ensure directories exist
[UPLOAD_DIR, EXPORT_DIR, DATA_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});
