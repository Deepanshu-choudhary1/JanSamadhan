import express from "express";
import { authenticate, authorize } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import {
  getAllIssues,
  assignIssue,
  updateStatus,
  uploadProof,
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/issues", authenticate, authorize(["Admin"]), getAllIssues);
router.put("/issues/:id/assign", authenticate, authorize(["Admin"]), assignIssue);
router.put("/issues/:id/status", authenticate, authorize(["Admin"]), updateStatus);
router.post("/issues/:id/proof", authenticate, authorize(["Admin"]), upload.single("proof"), uploadProof);

export default router;
