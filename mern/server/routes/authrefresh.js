// authrefresh.js
import express from "express";
import auth from "../middleware/auth.js";

const router = express.Router();

// just use "/" here
router.get("/", auth, (req, res) => {
  res.status(200).json({ user: req.user });
});

export default router;
