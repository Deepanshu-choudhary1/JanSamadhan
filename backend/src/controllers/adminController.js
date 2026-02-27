import { readStore, writeStore } from "../lib/store.js";

export const getAllIssues = async (req, res) => {
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
  return res.json(issue);
};

export const updateStatus = async (req, res) => {
  const store = await readStore();
  const issue = store.issues.find((i) => i.id === Number(req.params.id));

  if (!issue) return res.status(404).json({ error: "Issue not found" });

  issue.status = req.body.status || issue.status;
  issue.updatedAt = new Date().toISOString();

  await writeStore(store);
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
  return res.json(issue);
};
