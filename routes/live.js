import express from "express";
import {
  createLive,
  deleteLive,
  getActiveLive,
  getLiveHistory,
  finishLive,
} from "../controllers/live.js";
const router = express.Router();

router.get("/history", getLiveHistory);
router.get("/active", getActiveLive);
router.post("/live", createLive);
router.patch("/finish/:id", finishLive);
router.delete("/delete/:id", deleteLive);

export default router;
