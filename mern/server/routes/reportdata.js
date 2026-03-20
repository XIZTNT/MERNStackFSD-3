import express from "express";
const router = express.Router();
import Transaction from "../db/TransactionSchema.js";
// import Agent from "../db/AgentSchema.js";

router.get("/", async (req, res) => {
  try {

    //BAR GRAPH: total per agent
    const agentData = await Transaction.aggregate([
      {
        $group: {
          _id: "$agent_id",
          total: { $sum: "$amount" }
        }
      },
      {
        $lookup: {
          from: "recordsWk7",
          localField: "_id",
          foreignField: "_id",
          as: "agent"
        }
      },
      {
        $unwind: {
          path: "$agent",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          agent: { $ifNull: ["$agent.name", "Unknown"] },
          total: 1,
          _id: 0
        }
      }
    ]);

    // LINE GRAPH: for past 2 weeks/14 days
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

    const transactionLineData = await Transaction.aggregate([
      {
        $match: {
          date: { $gte: twoWeeksAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$date" }
          },
          total: { $sum: "$amount" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    //Fill missing days
    const last14Days = [];

    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);

      const formatted = d.toISOString().split("T")[0];

      const found = transactionLineData.find(t => t._id === formatted);

      last14Days.push({
        date: formatted, 
        total: found ? found.total : 0
      });
    }

    res.json({
      status: "ok",
      data: {
        agent_bar_data: agentData,
        transaction_line_data: last14Days
      },
      message: null
    });

  } catch (err) {
    res.json({
      status: "error",
      data: null,
      message: err.message
    });
  }
});

export default router;