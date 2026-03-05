import express from "express";
import Session from "../db/SessionSchema.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { sessionToken } = req.cookies;

    // 1️. Remove session from DB
    if (sessionToken) {
      await Session.deleteOne({ session_token: sessionToken });
    }

    // 2️. Clear cookies
    res
      .clearCookie("accessToken", { httpOnly: true, secure: false, sameSite: "lax", path: "/" })
      .clearCookie("refreshToken", { httpOnly: true, secure: false, sameSite: "lax", path: "/" })
      .clearCookie("sessionToken", { httpOnly: true, secure: false, sameSite: "lax", path: "/" })
      .status(200)
      .set("Access-Control-Allow-Credentials", "true")
      .set("Access-Control-Allow-Origin", "http://localhost:5173")
      .json({ message: "Logged out successfully" });

  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;