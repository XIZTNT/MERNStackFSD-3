import express from "express";
import jwt from "jsonwebtoken";
import Session from "../db/SessionSchema.js";

const router = express.Router();

/**
 * GET /validate_token?token=xxx
 * Validate a session token
 */
router.get("/", async (req, res) => {
    try {
        const { token } = req.query;

        if (!token) {
            return res.json({
                status: "ok",
                data: { valid: false, user: null },
                message: "No token provided"
            });
        }

        const session = await Session.findOne({ session_token: token })
            .populate("user", "first_name last_name");

        if (!session) {
            return res.json({
                status: "ok",
                data: { valid: false, user: null },
                message: "Session not found or expired"
            });
        }

        res.json({
            status: "ok",
            data: {
                valid: true,
                user: {
                    id: session.user._id,
                    first_name: session.user.first_name,
                    last_name: session.user.last_name
                }
            },
            message: null
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: "error",
            data: null,
            message: err.message
        });
    }
});

export default router;