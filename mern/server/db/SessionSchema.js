import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({

    session_token: {
    type: String,
    required: true,     // generated UUID
    },

    user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    },

    createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400,     // TTL: 24 hours
    },

});

const Session = mongoose.model("Session", sessionSchema, "sessions");
export default Session;