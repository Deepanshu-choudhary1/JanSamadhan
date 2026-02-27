import { readStore, writeStore } from "../lib/store.js";
import { notifyUser } from "../services/notifications.js";

export const getAllIssues = async (_req, res) => {
  const store = await readStore();
  return res.json(store.issues);
};

export const assignIssue = async (req, res) => {
  const store = await readStore();
  const issue = store.issues.find((i) => i.id === Number(req.params.id));

  if (!issue) return res.status(404).json({ error: "Issue not found" });

  issue.assignedTo = req.body.assignedTo || "Municipal Team";
  issue.status = "In Progress";
  issue.updatedAt = new Date().toISOString();

  await writeStore(store);

  const user = store.users.find((u) => u.id === issue.userId);
  await notifyUser(user, {
    emailSubject: `Issue assigned: ${issue.title}`,
    emailText: `Your issue #${issue.id} has been assigned to ${issue.assignedTo} and moved to In Progress.`,
    emailHtml: `<p>Your issue <b>${issue.title}</b> was assigned to <b>${issue.assignedTo}</b> and moved to <b>In Progress</b>.</p>`,
    smsText: `Issue #${issue.id} assigned to ${issue.assignedTo}. Status: In Progress.`,
    pushTitle: "Issue assigned",
    pushBody: `${issue.title} is now assigned to ${issue.assignedTo}.`,
  });

  return res.json(issue);
};

export const updateStatus = async (req, res) => {
  const store = await readStore();
  const issue = store.issues.find((i) => i.id === Number(req.params.id));

  if (!issue) return res.status(404).json({ error: "Issue not found" });

  issue.status = req.body.status || issue.status;
  issue.updatedAt = new Date().toISOString();

  await writeStore(store);

  const user = store.users.find((u) => u.id === issue.userId);
  await notifyUser(user, {
    emailSubject: `Issue status updated: ${issue.title}`,
    emailText: `Your issue #${issue.id} status is now ${issue.status}.`,
    emailHtml: `<p>Your issue <b>${issue.title}</b> status has been updated to <b>${issue.status}</b>.</p>`,
    smsText: `Issue #${issue.id} status updated: ${issue.status}.`,
    pushTitle: "Issue status updated",
    pushBody: `${issue.title} status is now ${issue.status}.`,
  });

  return res.json(issue);
};

export const uploadProof = async (req, res) => {
  const store = await readStore();
  const issue = store.issues.find((i) => i.id === Number(req.params.id));

  if (!issue) return res.status(404).json({ error: "Issue not found" });

  issue.proofUrl = req.body.proofUrl || null;
  issue.status = "Resolved";
  issue.updatedAt = new Date().toISOString();

  await writeStore(store);

  const user = store.users.find((u) => u.id === issue.userId);
  await notifyUser(user, {
    emailSubject: `Issue resolved: ${issue.title}`,
    emailText: `Your issue #${issue.id} has been resolved. Proof has been uploaded.`,
    emailHtml: `<p>Your issue <b>${issue.title}</b> has been marked <b>Resolved</b>.${issue.proofUrl ? ` Proof URL: <a href="${issue.proofUrl}">${issue.proofUrl}</a>` : ""}</p>`,
    smsText: `Issue #${issue.id} resolved. ${issue.proofUrl ? `Proof: ${issue.proofUrl}` : ""}`,
    pushTitle: "Issue resolved",
    pushBody: `${issue.title} has been marked resolved.`,
  });

  return res.json(issue);
};
