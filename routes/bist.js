import express from "express";
import { bistPrices } from "../controllers/prices.js";
import { specificBist } from "../controllers/specificBist.js";
import { verifyToken } from "../middleware/auth.js";
import { updatePrices } from "../controllers/prices.js";
const router = express.Router();

/* BIST FİYATLARI */
router.get("/", (req, res) => {
  res.json("success");
});
router.get("/prices", bistPrices);
router.get("/prices/:id", specificBist);
router.patch("/updateprices", updatePrices);

export default router;
