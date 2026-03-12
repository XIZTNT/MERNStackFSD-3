// /routes/transaction-post.js
import express from "express";
import TransactionSchema from "../db/TransactionSchema.js";

const router = express.Router();

// POST a new transaction
router.post("/", async (req, res) => {
  try {
    const { agent_id, amount } = req.body;
    if (!agent_id || amount <= 0) {
      return res.status(400).json({ success: false, message: "Invalid data" });
    }

    const transaction = new TransactionSchema({ agent_id, amount });
    await transaction.save();

    res.json({ success: true, data: transaction });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;