import express from "express";
import TransactionSchema from "../db/TransactionSchema.js";

const router = express.Router();

// GET last 10 transactions for admin table
router.get("/", async (req, res) => {
  try {
    const transactions = await TransactionSchema.find()
      .sort({ date: -1 })       // newest first
      .limit(10)
      .populate("agent_id", "name"); // populate agent name only

    // Map to desired format for frontend
    const data = transactions.map(t => ({
      _id: t._id,
      date: t.date,
      amount: t.amount,
      agent_id: t.agent_id._id,     // add the ID
      agent_name: t.agent_id.name,    //full name
    }));

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


export default router;