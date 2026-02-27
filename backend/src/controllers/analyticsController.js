import { readStore } from "../lib/store.js";

const day = (date) => new Date(date).toISOString().slice(0, 10);

export const getSummary = async (_req, res) => {
  const { issues } = await readStore();
  const summary = {
    total: issues.length,
    reported: issues.filter((i) => i.status === "Reported").length,
    inProgress: issues.filter((i) => i.status === "In Progress").length,
    resolved: issues.filter((i) => i.status === "Resolved").length,
  };
  return res.json(summary);
};

export const getIssuesByCategory = async (_req, res) => {
  const { issues } = await readStore();
  const grouped = Object.entries(
    issues.reduce((acc, issue) => {
      acc[issue.category] = (acc[issue.category] || 0) + 1;
      return acc;
    }, {})
  ).map(([category, count]) => ({ category, count }));

  return res.json(grouped);
};

export const getResolutionTimes = async (_req, res) => {
  const { issues } = await readStore();
  const rows = issues
    .filter((i) => i.status === "Resolved")
    .map((issue) => ({
      date: day(issue.updatedAt),
      avgResolutionDays:
        (new Date(issue.updatedAt).getTime() - new Date(issue.createdAt).getTime()) /
        (1000 * 60 * 60 * 24),
    }));

  return res.json(rows);
};

export const getIssuesTrend = async (_req, res) => {
  const { issues } = await readStore();
  const grouped = Object.entries(
    issues.reduce((acc, issue) => {
      const created = day(issue.createdAt);
      acc[created] = (acc[created] || 0) + 1;
      return acc;
    }, {})
  )
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return res.json(grouped);
};
