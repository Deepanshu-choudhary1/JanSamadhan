import { Issue } from "../models/Issue.js";
import { User } from "../models/User.js";
import { sendEmail } from "../utils/email.js";
import { sendSMS } from "../utils/sms.js";
import { sendPush } from "../utils/push.js";

// Fetch all issues with filters
export const getAllIssues = async (req, res) => {
  try {
    const { status, category } = req.query;
    const where = {};
    if (status) where.status = status;
    if (category) where.category = category;

    const issues = await Issue.findAll({ where, include: [User] });
    res.json(issues);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Assign issue to department/worker
export const assignIssue = async (req, res) => {
  try {
    const { id } = req.params;
    const { assignedTo } = req.body; // department or worker ID

    const issue = await Issue.findByPk(id);
    if (!issue) return res.status(404).json({ error: "Issue not found" });

    issue.assignedTo = assignedTo;
    issue.status = "In Progress";
    await issue.save();

    // Notify citizen
    const citizen = await User.findByPk(issue.userId);
    if (citizen) {
      await sendEmail(
        citizen.email,
        "Issue Assigned",
        `Your issue has been assigned to department: ${assignedTo}`
      );
      if (citizen.phone) {
        await sendSMS(citizen.phone, `🔔 Your issue is now assigned.`);
      }
      if (citizen.pushToken) {
        await sendPush(citizen.pushToken, "Issue Assigned", "Your issue is being worked on.");
      }
    }

    res.json({ message: "Issue assigned", issue });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update issue status
export const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const issue = await Issue.findByPk(id);
    if (!issue) return res.status(404).json({ error: "Issue not found" });

    issue.status = status;
    await issue.save();

    // Notify citizen
    const citizen = await User.findByPk(issue.userId);
    if (citizen) {
      await sendEmail(
        citizen.email,
        "Issue Status Update",
        `Your issue status has been updated to: ${status}`
      );
      if (citizen.phone) {
        await sendSMS(citizen.phone, `⚡ Status updated: ${status}`);
      }
      if (citizen.pushToken) {
        await sendPush(citizen.pushToken, "Status Update", `Issue is now ${status}`);
      }
    }

    res.json({ message: "Status updated", issue });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Upload resolution proof
export const uploadProof = async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const issue = await Issue.findByPk(id);
    if (!issue) return res.status(404).json({ error: "Issue not found" });

    issue.proofImage = `/uploads/${req.file.filename}`;
    issue.status = "Resolved";
    await issue.save();

    // Notify citizen
    const citizen = await User.findByPk(issue.userId);
    if (citizen) {
      await sendEmail(
        citizen.email,
        "Issue Resolved",
        "Your issue has been marked as resolved. Please confirm."
      );
      if (citizen.phone) {
        await sendSMS(citizen.phone, "✅ Your issue has been resolved!");
      }
      if (citizen.pushToken) {
        await sendPush(citizen.pushToken, "Issue Resolved", "Check the proof of resolution.");
      }
    }

    res.json({ message: "Proof uploaded, issue resolved", issue });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
