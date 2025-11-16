import express from "express";
import { getUserVideos } from "../controllers/videoController.js";

const router = express.Router();

// Get all videos for a specific user
router.get("/", getUserVideos);

export default router;
