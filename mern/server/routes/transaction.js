import express from "express";
import TransactionSchema from "../db/TransactionSchema.js";


const router = express.Router();

// GET last 10 transactions for admin table
router.get("/", async (req, res) => {
  try {
    const transactions = await TransactionSchema.find()
      .sort({ date: -1 })
      .limit(10); // no populate

    const data = transactions.map(t => ({
      _id: t._id,
      date: t.date,
      amount: t.amount,
      agent_id: t.agent_id, // just return the ID
    }));

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

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