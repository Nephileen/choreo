import fs from "fs";
import path from "path";

const SEQ_JSON = path.join(process.cwd(), "data", "sequences.json");

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
      return res.status(400).json({ error: "userId and sequence required" });
    }
    const sequences = readSeq();
    sequences[userId] = sequence;
    writeSeq(sequences);
    return res.json({ ok: true, sequence });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}

export function getSequence(req: any, res: any) {
  const userId = req.query.userId;
  const sequences = readSeq();
  return res.json({ sequence: sequences[userId] || [] });
}
