import fs from "fs";
import path from "path";
import { DATA_DIR } from "../config/storagePaths";

const SEQ_JSON = path.join(DATA_DIR, "sequences.json");

function readSeq() {
  if (!fs.existsSync(SEQ_JSON)) return {};
  try {
    return JSON.parse(fs.readFileSync(SEQ_JSON, "utf8") || "{}");
  } catch {
    return {};
  }
}

function writeSeq(s: any) {
  fs.writeFileSync(SEQ_JSON, JSON.stringify(s, null, 2));
}

export function saveSequence(req: any, res: any) {
  try {
    const { userId, sequence } = req.body;
    if (!userId || !Array.isArray(sequence)) {
      return res.status(400).json({ error: "userId and sequence array required" });
    }

    if (sequence.length === 0) {
      return res.status(400).json({ error: "Sequence cannot be empty" });
    }

    const sequences = readSeq();
    sequences[userId] = sequence;
    writeSeq(sequences);
    return res.json({ ok: true, sequence });
  } catch (err: any) {
    console.error("sequence save error", err);
    return res.status(500).json({ error: "Failed to save sequence", details: err.message });
  }
}

export function getSequence(req: any, res: any) {
  try {
    const userId = req.query.userId;
    if (!userId) {
      return res.status(400).json({ error: "userId query parameter required" });
    }
    const sequences = readSeq();
    return res.json({ sequence: sequences[userId] || [] });
  } catch (err: any) {
    console.error("sequence get error", err);
    return res.status(500).json({ error: "Failed to retrieve sequence", details: err.message });
  }
}
