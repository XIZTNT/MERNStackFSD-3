import express from "express";
import { v4 as uuidv4 } from "uuid";
import Session from "../db/SessionSchema.js";
import User from "../db/UserSchema.js";

const router = express.Router();

/**
 * POST /session
 * Optional: Create a new session for a given user_id
 * Expects: { user_id } in the body
 */
router.post("/", async (req, res) => {
    try {
        const { user_id } = req.body;

        if (!user_id) {
            return res.status(400).json({
                status: "error",
                data: null,
                message: "user_id required"
            });
        }

        const user = await User.findById(user_id);
        if (!user) {
            return res.status(404).json({
                status: "error",
                data: null,
                message: "User not found"
            });
        }

        // Generate UUID session token
        const token = uuidv4();

        // Create and save session
        const session = new Session({
            session_token: token,
            user: user._id,
        });
        await session.save();

        // Return the token
        res.json({
            status: "ok",
            data: { token },
            message: "Session saved successfully"
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