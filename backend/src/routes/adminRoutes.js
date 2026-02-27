import express from "express";
import {
  assignIssue,
  getAllIssues,
  updateStatus,
  uploadProof,
} from "../controllers/adminController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

router.get("/issues", authenticate, authorize(["Admin"]), getAllIssues);
router.put("/issues/:id/assign", authenticate, authorize(["Admin"]), assignIssue);
router.put("/issues/:id/status", authenticate, authorize(["Admin"]), updateStatus);
router.post("/issues/:id/proof", authenticate, authorize(["Admin"]), uploadProof);

export default router;
