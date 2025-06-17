import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"; // Use env variable in production

export function signJwt(payload, options = {}) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "1d", ...options });
}

export function verifyJwt(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (e) {
        return null;
    }
}
