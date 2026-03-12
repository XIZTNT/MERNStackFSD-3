import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./db/connection.js";
import dotenv from "dotenv";

// Routes Imports
import records from "./routes/record.js";
import login from "./routes/login.js";
//Cookie refresh route for testing auth middleware
import authrefresh from "./routes/authrefresh.js";
//Logout to test cookie clearing
import logout from "./routes/logout.js";
//Transactions
import transactiondata from "./routes/transactiondata.js";
import transactionpost from "./routes/transactionpost.js";
//Validate Token
import validatetoken from "./routes/validatetoken.js"
//Session POST
import session from "./routes/session.js"

//Load environment variables from config.env
dotenv.config({ path: "./config.env" });

const PORT = process.env.PORT || 5050;
const app = express();

// Middleware
app.use(cors({
    origin: "http://localhost:5173", // Vite frontend for cookies to pass
    credentials: true
}));

//JWT Cookie Storage feature
app.use(express.json());
app.use(cookieParser()); // MUST be before routes

// Connect to MongoDB
connectDB();


// Routes initialized here
app.use("/record", records);
app.use("/login", login);
app.use("/authrefresh", authrefresh);
app.use("/logout", logout);
app.use("/transaction-data", transactiondata);
app.use("/transaction", transactionpost);
app.use("/validate_token", validatetoken);
app.use("/session", session);

// Start server
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
