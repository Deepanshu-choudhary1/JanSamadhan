import { Issue } from "../models/Issue.js";
import { Sequelize } from "sequelize";

// Summary stats
export const getSummary = async (req, res) => {
  try {
    const total = await Issue.count();
    const resolved = await Issue.count({ where: { status: "Resolved" } });
    const inProgress = await Issue.count({ where: { status: "In Progress" } });
    const reported = await Issue.count({ where: { status: "Reported" } });

    res.json({ total, resolved, inProgress, reported });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Issues by category (Pie chart data)
export const getIssuesByCategory = async (req, res) => {
  try {
    const results = await Issue.findAll({
      attributes: [
        "category",
        [Sequelize.fn("COUNT", Sequelize.col("category")), "count"],
      ],
      group: ["category"],
    });

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Avg resolution time (Line chart data)
export const getResolutionTimes = async (req, res) => {
  try {
    const results = await Issue.findAll({
      attributes: [
        [Sequelize.fn("DATE", Sequelize.col("createdAt")), "date"],
        [
          Sequelize.fn(
            "AVG",
            Sequelize.literal("julianday(updatedAt) - julianday(createdAt)")
          ),
          "avgResolutionDays",
        ],
      ],
      where: { status: "Resolved" },
      group: [Sequelize.fn("DATE", Sequelize.col("createdAt"))],
      order: [[Sequelize.fn("DATE", Sequelize.col("createdAt")), "ASC"]],
    });

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Issues trend (Bar chart data)
export const getIssuesTrend = async (req, res) => {
  try {
    const results = await Issue.findAll({
      attributes: [
        [Sequelize.fn("DATE", Sequelize.col("createdAt")), "date"],
        [Sequelize.fn("COUNT", Sequelize.col("id")), "count"],
      ],
      group: [Sequelize.fn("DATE", Sequelize.col("createdAt"))],
      order: [[Sequelize.fn("DATE", Sequelize.col("createdAt")), "ASC"]],
    });

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
