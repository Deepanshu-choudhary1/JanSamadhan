import { nextId, readStore, writeStore } from "../lib/store.js";

const issueView = (issue, users) => ({
  ...issue,
  reporter: users.find((u) => u.id === issue.userId)?.name || "Unknown",
});

export const listIssues = async (req, res) => {
  try {
    const { status, category } = req.query;
    const store = await readStore();

    let issues = [...store.issues];
    if (status && status !== "All") issues = issues.filter((i) => i.status === status);
    if (category && category !== "All") issues = issues.filter((i) => i.category === category);

    return res.json(issues.map((issue) => issueView(issue, store.users)));
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getIssueById = async (req, res) => {
  const store = await readStore();
  const issue = store.issues.find((i) => i.id === Number(req.params.id));

  if (!issue) return res.status(404).json({ error: "Issue not found" });
  return res.json(issueView(issue, store.users));
};

export const getMyIssues = async (req, res) => {
  const store = await readStore();
  const issues = store.issues.filter((i) => i.userId === req.user.id);
  return res.json(issues.map((issue) => issueView(issue, store.users)));
};

export const reportIssue = async (req, res) => {
  try {
    const { title, description, category, location, imageUrl } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ error: "title, description and category are required" });
    }

    const store = await readStore();
    const issue = {
      id: nextId(store.issues),
      title,
      description,
      category,
      location: location || null,
      imageUrl: imageUrl || null,
      status: "Reported",
      userId: req.user.id,
      assignedTo: null,
      proofUrl: null,
      upvotes: 0,
      comments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    store.issues.push(issue);
    await writeStore(store);

    return res.status(201).json(issueView(issue, store.users));
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const upvoteIssue = async (req, res) => {
  const store = await readStore();
  const issue = store.issues.find((i) => i.id === Number(req.params.id));

  if (!issue) return res.status(404).json({ error: "Issue not found" });

  issue.upvotes += 1;
  issue.updatedAt = new Date().toISOString();
  await writeStore(store);

  return res.json(issue);
};

export const addComment = async (req, res) => {
  const { text } = req.body;
  if (!text?.trim()) return res.status(400).json({ error: "Comment text is required" });

  const store = await readStore();
  const issue = store.issues.find((i) => i.id === Number(req.params.id));
  if (!issue) return res.status(404).json({ error: "Issue not found" });

  issue.comments.push({
    id: issue.comments.length ? Math.max(...issue.comments.map((c) => c.id)) + 1 : 1,
    userId: req.user.id,
    user: req.user.email,
    role: req.user.role,
    text: text.trim(),
    createdAt: new Date().toISOString(),
  });

  issue.updatedAt = new Date().toISOString();
  await writeStore(store);

  return res.status(201).json(issue);
};
