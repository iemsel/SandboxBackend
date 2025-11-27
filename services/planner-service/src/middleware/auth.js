const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "devsecret";

function authRequired(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ error: "Missing Authorization header" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = {
      id: payload.sub,
      email: payload.email,
      name: payload.name
    };
    next();
  } catch (err) {
    console.error("JWT error (planner-service):", err.message);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

module.exports = { authRequired };
