import express from "express";
import Record from "../db/AgentSchema.js"; // Import the Mongoose Record model

// router is an instance of the express router.
// We use it to define our routes for /record endpoints.
const router = express.Router();

/* -------------------- GET ALL RECORDS -------------------- */
// This section will help you get a list of all the records.
router.get("/", async (req, res) => {
  try {
    // Use Mongoose's `find` method to fetch all records from the collection
    const records = await Record.find();

    // Respond with success, message, and data
    res.status(200).json({
      success: true,
      message: "Records fetched successfully",
      data: records,
    });
  } catch (err) {
    console.error("Error fetching records:", err);

    // Respond with error message
    res.status(500).json({
      success: false,
      message: "Error fetching records",
    });
  }
});

/* -------------------- GET SINGLE RECORD -------------------- */
// This section will help you get a single record by id
router.get("/:id", async (req, res) => {
  try {
    // Use Mongoose's `findById` method to fetch a single record by ID
    const record = await Record.findById(req.params.id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Record not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Record fetched successfully",
      data: record,
    });
  } catch (err) {
    console.error("Error fetching record:", err);
    res.status(500).json({
      success: false,
      message: "Error fetching record",
    });
  }
});

/* -------------------- CREATE NEW RECORD -------------------- */
// This section will help you create a new record.
router.post("/", async (req, res) => {
  try {
    // Create a new Record instance from the request body
    const newRecord = new Record(req.body);

    // Save the record to the database
    const savedRecord = await newRecord.save();

    res.status(201).json({
      success: true,
      message: "Record created successfully",
      data: savedRecord,
    });
  } catch (err) {
    console.error("Error adding record:", err);
    res.status(500).json({
      success: false,
      message: "Error adding record",
    });
  }
});

/* -------------------- UPDATE RECORD BY ID -------------------- */
// This section will help you update a record by id.
router.patch("/:id", async (req, res) => {
  try {
    // Update a record by ID and return the updated document
    const updatedRecord = await Record.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedRecord) {
      return res.status(404).json({
        success: false,
        message: "Record not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Record updated successfully",
      data: updatedRecord,
    });
  } catch (err) {
    console.error("Error updating record:", err);
    res.status(500).json({
      success: false,
      message: "Error updating record",
    });
  }
});

/* -------------------- DELETE RECORD BY ID -------------------- */
// This section will help you delete a record
router.delete("/:id", async (req, res) => {
  try {
    // Delete a record by ID
    const deletedRecord = await Record.findByIdAndDelete(req.params.id);

    if (!deletedRecord) {
      return res.status(404).json({
        success: false,
        message: "Record not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Record deleted successfully",
      data: deletedRecord,
    });
  } catch (err) {
    console.error("Error deleting record:", err);
    res.status(500).json({
      success: false,
      message: "Error deleting record",
    });
  }
});

export default router;
