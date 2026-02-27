import bcrypt from "bcryptjs";
import { nextId, readStore, writeStore } from "../lib/store.js";
import { signToken } from "../middleware/auth.js";

const publicUser = ({ passwordHash, ...user }) => user;

export const signup = async (req, res) => {
  try {
    const { name, email, password, role, adminSignupKey } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "name, email and password are required" });
    }

    const store = await readStore();
    const normalizedEmail = email.toLowerCase().trim();

    const exists = store.users.find((u) => u.email === normalizedEmail);
    if (exists) {
      return res.status(409).json({ error: "User already exists" });
    }

    let resolvedRole = "Citizen";
    if (role === "Admin") {
      const expectedKey = process.env.ADMIN_SIGNUP_KEY;
      if (!expectedKey || adminSignupKey !== expectedKey) {
        return res.status(403).json({ error: "Admin signup is restricted" });
      }
      resolvedRole = "Admin";
    }

    const newUser = {
      id: nextId(store.users),
      name: name.trim(),
      email: normalizedEmail,
      passwordHash: await bcrypt.hash(password, 10),
      role: resolvedRole,
      createdAt: new Date().toISOString(),
    };

    store.users.push(newUser);
    await writeStore(store);

    const user = publicUser(newUser);
    return res.status(201).json({ user, token: signToken(user) });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "email and password are required" });
    }

    const store = await readStore();
    const user = store.users.find((u) => u.email === email.toLowerCase().trim());

    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });

    const safeUser = publicUser(user);
    return res.json({ user: safeUser, token: signToken(safeUser) });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const logout = async (_req, res) => res.json({ message: "Logged out" });
