import express from "express";
import cors from "cors";
import path from "path";
import uploadRoutes from "./routes/uploads.js";
import exportRoutes from "./routes/export.js";
import videoRoutes from "./routes/videos.js";
import { getSequence, saveSequence } from "./controllers/sequenceController.js";

import { UPLOAD_DIR, EXPORT_DIR } from "./config/storagePaths.js";

const app = express();
app.use(cors());
app.use(express.json());

// serve static
app.use("/uploads", express.static(UPLOAD_DIR));
app.use("/exports", express.static(EXPORT_DIR));

// api
app.use("/api/upload", uploadRoutes);
app.use("/api/export", exportRoutes);
app.use("/api/videos", videoRoutes);

// sequence routes
app.post("/api/sequence", saveSequence);
app.get("/api/sequence", getSequence);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
