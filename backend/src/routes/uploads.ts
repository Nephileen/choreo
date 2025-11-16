import express from "express";
import multer from "multer";
import path from "path";
import { UPLOAD_DIR } from "../config/storagePaths.js"; // note .js extension at runtime if transpiled; with ts-node you can omit
import { handleVideoUpload } from "../controllers/uploadController.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    // keep original name; the controller will move/rename the file to user folder
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

router.post("/", upload.array("videos", 10), handleVideoUpload);

export default router;
