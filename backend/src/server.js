import http from "http";
import crypto from "crypto";
import fs from "fs/promises";
import fsSync from "fs";
import path from "path";
import { URL } from "url";

const loadEnvFile = () => {
  const envPath = path.resolve("backend/.env");
  if (!fsSync.existsSync(envPath)) return;

  const lines = fsSync.readFileSync(envPath, "utf-8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const idx = trimmed.indexOf("=");
    if (idx <= 0) continue;

    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim();
    if (!(key in process.env)) process.env[key] = value;
  }
};

loadEnvFile();

const PORT = Number(process.env.PORT) || 5000;
const storePath = path.resolve("backend/src/data/store.json");
const JWT_SECRET = process.env.JWT_SECRET || "jansamadhan-dev-secret";
const ADMIN_SIGNUP_KEY = process.env.ADMIN_SIGNUP_KEY || "";

const json = (res, code, data) => {
  res.writeHead(code, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET,POST,PUT,OPTIONS",
  });
  res.end(JSON.stringify(data));
};

const readStore = async () => JSON.parse(await fs.readFile(storePath, "utf-8"));
const writeStore = async (data) => fs.writeFile(storePath, JSON.stringify(data, null, 2));
const nextId = (arr) => (arr.length ? Math.max(...arr.map((x) => Number(x.id) || 0)) + 1 : 1);

const b64url = (obj) => Buffer.from(JSON.stringify(obj)).toString("base64url");
const sign = (payload) => {
  const body = b64url(payload);
  const sig = crypto.createHmac("sha256", JWT_SECRET).update(body).digest("base64url");
  return `${body}.${sig}`;
};
const verify = (token) => {
  const [body, sig] = String(token || "").split(".");
  if (!body || !sig) throw new Error("invalid token");
  const expected = crypto.createHmac("sha256", JWT_SECRET).update(body).digest("base64url");
  if (expected !== sig) throw new Error("invalid signature");
  return JSON.parse(Buffer.from(body, "base64url").toString("utf-8"));
};

const parseBody = async (req) => {
  const chunks = [];
  for await (const c of req) chunks.push(c);
  if (!chunks.length) return {};
  const raw = Buffer.concat(chunks).toString("utf-8");
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
};

const notifyUser = (user, message) => {
  if (!user) return;
  if (user.email) console.log(`[email] ${user.email}: ${message}`);
  if (user.phone) console.log(`[sms] ${user.phone}: ${message}`);
  if (user.pushToken) console.log(`[push] ${user.pushToken}: ${message}`);
};

const getAuthUser = (req) => {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!token) return null;
  try {
    return verify(token);
  } catch {
    return null;
  }
};

const requireRole = (user, roles) => user && roles.includes(user.role);

const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") return json(res, 204, {});

  const url = new URL(req.url, `http://${req.headers.host}`);
  const { pathname } = url;
  const method = req.method;

  try {
    if (method === "GET" && pathname === "/api/health") return json(res, 200, { ok: true });

    if (method === "POST" && pathname === "/api/auth/signup") {
      const body = await parseBody(req);
      const { name, email, password, role, adminSignupKey, phone, pushToken } = body;
      if (!name || !email || !password) return json(res, 400, { error: "name, email and password are required" });

      const store = await readStore();
      const normalizedEmail = String(email).toLowerCase().trim();
      if (store.users.find((u) => u.email === normalizedEmail)) return json(res, 409, { error: "User already exists" });

      let resolvedRole = "Citizen";
      if (role === "Admin") {
        if (!ADMIN_SIGNUP_KEY || adminSignupKey !== ADMIN_SIGNUP_KEY) {
          return json(res, 403, { error: "Admin signup is restricted" });
        }
        resolvedRole = "Admin";
      }

      const user = {
        id: nextId(store.users),
        name: String(name).trim(),
        email: normalizedEmail,
        passwordHash: crypto.createHash("sha256").update(String(password)).digest("hex"),
        role: resolvedRole,
        phone: phone || null,
        pushToken: pushToken || null,
        createdAt: new Date().toISOString(),
      };

      store.users.push(user);
      await writeStore(store);
      const { passwordHash, ...safeUser } = user;
      return json(res, 201, { user: safeUser, token: sign({ id: user.id, role: user.role, email: user.email }) });
    }

    if (method === "POST" && pathname === "/api/auth/login") {
      const body = await parseBody(req);
      const { email, password } = body;
      const store = await readStore();
      const user = store.users.find((u) => u.email === String(email || "").toLowerCase().trim());
      const hash = crypto.createHash("sha256").update(String(password || "")).digest("hex");
      if (!user || user.passwordHash !== hash) return json(res, 401, { error: "Invalid credentials" });
      const { passwordHash, ...safeUser } = user;
      return json(res, 200, { user: safeUser, token: sign({ id: user.id, role: user.role, email: user.email }) });
    }

    if (method === "POST" && pathname === "/api/auth/logout") return json(res, 200, { message: "Logged out" });

    if (method === "GET" && pathname === "/api/issues") {
      const store = await readStore();
      const status = url.searchParams.get("status");
      const category = url.searchParams.get("category");
      let issues = [...store.issues];
      if (status && status !== "All") issues = issues.filter((i) => i.status === status);
      if (category && category !== "All") issues = issues.filter((i) => i.category === category);
      return json(res, 200, issues);
    }

    if (method === "GET" && pathname === "/api/issues/my") {
      const user = getAuthUser(req);
      if (!requireRole(user, ["Citizen"])) return json(res, 403, { error: "Forbidden" });
      const store = await readStore();
      return json(res, 200, store.issues.filter((i) => i.userId === user.id));
    }

    const issueIdMatch = pathname.match(/^\/api\/issues\/(\d+)$/);
    if (method === "GET" && issueIdMatch) {
      const id = Number(issueIdMatch[1]);
      const store = await readStore();
      const issue = store.issues.find((i) => i.id === id);
      if (!issue) return json(res, 404, { error: "Issue not found" });
      return json(res, 200, issue);
    }

    if (method === "POST" && pathname === "/api/issues") {
      const user = getAuthUser(req);
      if (!requireRole(user, ["Citizen"])) return json(res, 403, { error: "Forbidden" });
      const body = await parseBody(req);
      if (!body.title || !body.description || !body.category) return json(res, 400, { error: "title, description and category are required" });
      const store = await readStore();
      const issue = {
        id: nextId(store.issues),
        title: body.title,
        description: body.description,
        category: body.category,
        location: body.location || null,
        imageUrl: body.imageUrl || null,
        status: "Reported",
        userId: user.id,
        assignedTo: null,
        proofUrl: null,
        upvotes: 0,
        comments: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      store.issues.push(issue);
      await writeStore(store);
      const owner = store.users.find((u) => u.id === user.id);
      notifyUser(owner, `Issue #${issue.id} reported successfully.`);
      return json(res, 201, issue);
    }

    const upvoteMatch = pathname.match(/^\/api\/issues\/(\d+)\/upvote$/);
    if (method === "POST" && upvoteMatch) {
      const user = getAuthUser(req);
      if (!requireRole(user, ["Citizen"])) return json(res, 403, { error: "Forbidden" });
      const id = Number(upvoteMatch[1]);
      const store = await readStore();
      const issue = store.issues.find((i) => i.id === id);
      if (!issue) return json(res, 404, { error: "Issue not found" });
      issue.upvotes += 1;
      issue.updatedAt = new Date().toISOString();
      await writeStore(store);
      return json(res, 200, issue);
    }

    const commentMatch = pathname.match(/^\/api\/issues\/(\d+)\/comments$/);
    if (method === "POST" && commentMatch) {
      const user = getAuthUser(req);
      if (!requireRole(user, ["Citizen"])) return json(res, 403, { error: "Forbidden" });
      const body = await parseBody(req);
      if (!body.text?.trim()) return json(res, 400, { error: "Comment text is required" });
      const id = Number(commentMatch[1]);
      const store = await readStore();
      const issue = store.issues.find((i) => i.id === id);
      if (!issue) return json(res, 404, { error: "Issue not found" });
      issue.comments.push({ id: nextId(issue.comments), userId: user.id, user: user.email, role: user.role, text: body.text.trim(), createdAt: new Date().toISOString() });
      issue.updatedAt = new Date().toISOString();
      await writeStore(store);
      return json(res, 201, issue);
    }

    if (method === "GET" && pathname === "/api/admin/issues") {
      const user = getAuthUser(req);
      if (!requireRole(user, ["Admin"])) return json(res, 403, { error: "Forbidden" });
      const store = await readStore();
      return json(res, 200, store.issues);
    }

    const assignMatch = pathname.match(/^\/api\/admin\/issues\/(\d+)\/assign$/);
    if (method === "PUT" && assignMatch) {
      const user = getAuthUser(req);
      if (!requireRole(user, ["Admin"])) return json(res, 403, { error: "Forbidden" });
      const body = await parseBody(req);
      const id = Number(assignMatch[1]);
      const store = await readStore();
      const issue = store.issues.find((i) => i.id === id);
      if (!issue) return json(res, 404, { error: "Issue not found" });
      issue.assignedTo = body.assignedTo || "Municipal Team";
      issue.status = "In Progress";
      issue.updatedAt = new Date().toISOString();
      await writeStore(store);
      notifyUser(store.users.find((u) => u.id === issue.userId), `Issue #${issue.id} assigned to ${issue.assignedTo}.`);
      return json(res, 200, issue);
    }

    const statusMatch = pathname.match(/^\/api\/admin\/issues\/(\d+)\/status$/);
    if (method === "PUT" && statusMatch) {
      const user = getAuthUser(req);
      if (!requireRole(user, ["Admin"])) return json(res, 403, { error: "Forbidden" });
      const body = await parseBody(req);
      const id = Number(statusMatch[1]);
      const store = await readStore();
      const issue = store.issues.find((i) => i.id === id);
      if (!issue) return json(res, 404, { error: "Issue not found" });
      issue.status = body.status || issue.status;
      issue.updatedAt = new Date().toISOString();
      await writeStore(store);
      notifyUser(store.users.find((u) => u.id === issue.userId), `Issue #${issue.id} status updated to ${issue.status}.`);
      return json(res, 200, issue);
    }

    const proofMatch = pathname.match(/^\/api\/admin\/issues\/(\d+)\/proof$/);
    if (method === "POST" && proofMatch) {
      const user = getAuthUser(req);
      if (!requireRole(user, ["Admin"])) return json(res, 403, { error: "Forbidden" });
      const body = await parseBody(req);
      const id = Number(proofMatch[1]);
      const store = await readStore();
      const issue = store.issues.find((i) => i.id === id);
      if (!issue) return json(res, 404, { error: "Issue not found" });
      issue.proofUrl = body.proofUrl || null;
      issue.status = "Resolved";
      issue.updatedAt = new Date().toISOString();
      await writeStore(store);
      notifyUser(store.users.find((u) => u.id === issue.userId), `Issue #${issue.id} resolved.`);
      return json(res, 200, issue);
    }

    if (method === "GET" && pathname === "/api/analytics/summary") {
      const user = getAuthUser(req);
      if (!requireRole(user, ["Admin"])) return json(res, 403, { error: "Forbidden" });
      const { issues } = await readStore();
      return json(res, 200, {
        total: issues.length,
        reported: issues.filter((i) => i.status === "Reported").length,
        inProgress: issues.filter((i) => i.status === "In Progress").length,
        resolved: issues.filter((i) => i.status === "Resolved").length,
      });
    }

    if (method === "GET" && pathname === "/api/analytics/issues-by-category") {
      const user = getAuthUser(req);
      if (!requireRole(user, ["Admin"])) return json(res, 403, { error: "Forbidden" });
      const { issues } = await readStore();
      const grouped = Object.entries(issues.reduce((acc, i) => ((acc[i.category] = (acc[i.category] || 0) + 1), acc), {})).map(([category, count]) => ({ category, count }));
      return json(res, 200, grouped);
    }

    if (method === "GET" && pathname === "/api/analytics/resolution-times") {
      const user = getAuthUser(req);
      if (!requireRole(user, ["Admin"])) return json(res, 403, { error: "Forbidden" });
      const { issues } = await readStore();
      const rows = issues.filter((i) => i.status === "Resolved").map((i) => ({
        date: i.updatedAt.slice(0, 10),
        avgResolutionDays: (new Date(i.updatedAt) - new Date(i.createdAt)) / (1000 * 60 * 60 * 24),
      }));
      return json(res, 200, rows);
    }

    if (method === "GET" && pathname === "/api/analytics/trend") {
      const user = getAuthUser(req);
      if (!requireRole(user, ["Admin"])) return json(res, 403, { error: "Forbidden" });
      const { issues } = await readStore();
      const grouped = Object.entries(issues.reduce((acc, i) => ((acc[i.createdAt.slice(0, 10)] = (acc[i.createdAt.slice(0, 10)] || 0) + 1), acc), {})).map(([date, count]) => ({ date, count })).sort((a, b) => a.date.localeCompare(b.date));
      return json(res, 200, grouped);
    }

    return json(res, 404, { error: "Not found" });
  } catch (error) {
    return json(res, 500, { error: error.message || "Internal server error" });
  }
});

server.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
