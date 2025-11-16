import express from "express";
import { exportChoreo } from "../controllers/exportController.js";

const router = express.Router();

router.post("/", exportChoreo);

export default router;
