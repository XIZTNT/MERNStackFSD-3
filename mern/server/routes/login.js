import express from "express";
import jwt from "jsonwebtoken";
import User from "../db/UserSchema.js";

const router = express.Router();

/**
 * POST /login
 *
 * Authenticates user credentials.
 * If valid:
 *  - Generates short-lived access token (15m)
 *  - Generates longer-lived refresh token (24h)
 *  - Sends both as httpOnly cookies (24h lifespan)
 */
router.post("/", async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Look up user by email
    const user = await User.findOne({ email });

    // If user does not exist → reject
    if (!user) {
      return res.status(401).json({ message: "Unauthorized: user not found" });
    }

    // 2️. Validate password
    // NOTE: Currently plain text comparison (can replace with bcrypt in production)
    if (user.password !== password) {
      return res.status(401).json({ message: "Unauthorized: wrong password" });
    }

    // 3️. Generate Access Token
    // - Contains user id + role
    // - Expires in 15 minutes
    // - Used to access protected routes
    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.ACCESS_SECRET,
      { expiresIn: "15m" }
    );

    // 4️. Generate Refresh Token
    // - Contains user id
    // - Expires in 24 hours
    // - Used to issue new access tokens
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_SECRET,
      { expiresIn: "24h" }
    );

    // Cookie lifespan: 24 hours
    const ONE_DAY = 24 * 60 * 60 * 1000;

    // 5️. Send tokens as secure httpOnly cookies
    // - httpOnly prevents JS access (XSS protection)
    // - sameSite helps mitigate CSRF
    // - maxAge ensures browser deletes after 24h
    res
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false, // set to true in production (HTTPS)
        sameSite: "lax",
        maxAge: ONE_DAY,
        path: "/",
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: ONE_DAY,
        path: "/",
      })
      .status(200)
      .json({
        message: "Login successful",
        user: {
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
        },
      });

  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
