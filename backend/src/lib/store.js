import fs from "fs/promises";
import path from "path";

const storePath = path.resolve("backend/src/data/store.json");

export const readStore = async () => {
  const raw = await fs.readFile(storePath, "utf-8");
  return JSON.parse(raw);
};

export const writeStore = async (data) => {
  await fs.writeFile(storePath, JSON.stringify(data, null, 2));
};

export const nextId = (records = []) => {
  if (!records.length) return 1;
  return Math.max(...records.map((item) => Number(item.id) || 0)) + 1;
};
