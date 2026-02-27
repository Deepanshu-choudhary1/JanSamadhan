import jwt from "jsonwebtoken";

const getJwtSecret = () => process.env.JWT_SECRET || "jansamadhan-dev-secret";
const VALID_ROLES = ["Citizen", "Admin"];

export const signToken = (user) => {
  if (!VALID_ROLES.includes(user.role)) {
    throw new Error("Invalid role while signing token");
  }

  return jwt.sign({ id: user.id, role: user.role, email: user.email }, getJwtSecret(), {
    expiresIn: "7d",
  });
};

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, getJwtSecret());
    if (!VALID_ROLES.includes(decoded?.role)) {
      return res.status(403).json({ error: "Invalid role in token." });
    }

    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token." });
  }
};

export const authorize = (roles = []) => (req, res, next) => {
  if (!roles.includes(req.user?.role)) {
    return res.status(403).json({ error: "Forbidden" });
  }

  next();
};
