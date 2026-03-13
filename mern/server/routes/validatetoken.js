import express from "express";
import Session from "../db/SessionSchema.js";

const router = express.Router();

/**
 * GET /validate_token
 * Validate a session token
 * Can accept token from query (for manual testing) OR from cookie
 */
router.get("/", async (req, res) => {
  try {
    // Check cookie first
    let sessionToken = req.cookies?.session_token;

    // Fallback to query param for testing
    if (!sessionToken) {
      sessionToken = req.query?.token;
    }

    if (!sessionToken) {
      return res.json({
        status: "ok",
        data: { valid: false, user: null },
        message: "No token provided",
      });
    }

    const session = await Session.findOne({ session_token: sessionToken })
      .populate("user", "first_name last_name");

    if (!session) {
      return res.json({
        status: "ok",
        data: { valid: false, user: null },
        message: "Session not found or expired",
      });
    }

    res.json({
      status: "ok",
      data: {
        valid: true,
        user: {
          id: session.user._id,
          first_name: session.user.first_name,
          last_name: session.user.last_name,
        },
      },
      message: "Session is valid",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      data: null,
      message: err.message,
    });
  }
});

export default router;