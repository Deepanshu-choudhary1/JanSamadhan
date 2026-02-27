import express from "express";
import {
  getIssuesByCategory,
  getIssuesTrend,
  getResolutionTimes,
  getSummary,
} from "../controllers/analyticsController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

router.get("/summary", authenticate, authorize(["Admin"]), getSummary);
router.get("/issues-by-category", authenticate, authorize(["Admin"]), getIssuesByCategory);
router.get("/resolution-times", authenticate, authorize(["Admin"]), getResolutionTimes);
router.get("/trend", authenticate, authorize(["Admin"]), getIssuesTrend);

export default router;
