import express from "express";
import { authenticate, authorize } from "../middleware/auth.js";
import {
  getSummary,
  getIssuesByCategory,
  getResolutionTimes,
  getIssuesTrend,
} from "../controllers/analyticsController.js";

const router = express.Router();

router.get("/summary", authenticate, authorize(["Admin"]), getSummary);
router.get("/issues-by-category", authenticate, authorize(["Admin"]), getIssuesByCategory);
router.get("/resolution-times", authenticate, authorize(["Admin"]), getResolutionTimes);
router.get("/trend", authenticate, authorize(["Admin"]), getIssuesTrend);

export default router;
