import express from "express";
import {
  addComment,
  getIssueById,
  getMyIssues,
  listIssues,
  reportIssue,
  upvoteIssue,
} from "../controllers/issueController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

router.get("/", listIssues);
router.get("/my", authenticate, authorize(["Citizen"]), getMyIssues);
router.get("/:id", getIssueById);
router.post("/", authenticate, authorize(["Citizen"]), reportIssue);
router.post("/:id/upvote", authenticate, authorize(["Citizen"]), upvoteIssue);
router.post("/:id/comments", authenticate, authorize(["Citizen"]), addComment);

export default router;
