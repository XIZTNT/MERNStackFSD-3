import express from "express";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import User from "../db/UserSchema.js";
import Session from "../db/SessionSchema.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // JWT tokens
    const accessToken = jwt.sign({ id: user._id, role: user.role }, process.env.ACCESS_SECRET, { expiresIn: "15m" });
    const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_SECRET, { expiresIn: "24h" });

    // 1. Create Session token
    const sessionToken = uuidv4();
    const session = new Session({
      session_token: sessionToken,
      user: user._id,
    });
    await session.save();

    const ONE_DAY = 24 * 60 * 60 * 1000;

    // 2️. Send cookies (JWT + Session)
    res
      .cookie("accessToken", accessToken, { httpOnly: true, maxAge: ONE_DAY, sameSite: "lax", path: "/" })
      .cookie("refreshToken", refreshToken, { httpOnly: true, maxAge: ONE_DAY, sameSite: "lax", path: "/" })
      .cookie("session_token", sessionToken, { httpOnly: true, maxAge: ONE_DAY, sameSite: "lax", path: "/" })
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
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;