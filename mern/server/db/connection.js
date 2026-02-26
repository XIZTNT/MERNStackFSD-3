import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.ATLAS_URI, {
      dbName: "Module07", // your database name
    });

    console.log("MongoDB connected with Mongoose!");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1); // stop server if DB connection fails
  }
};

export default connectDB;




// import { MongoClient } from "mongodb";
// import mongoose from 'mongoose';

// const URI = process.env.ATLAS_URI || "";
// const CLIENT = new MongoClient(URI);

// // Mongoose Connection
// await mongoose.connect(URI, {
//     dbName: "test"
// });

// // Native MongoDB Driver Connection
// let DB;
// try {
//     await CLIENT.connect();
//     DB = CLIENT.db("test");
//     console.log("You successfully connected to MongoDB!");
// } catch(e) {
//     console.error("MongoDB connection error:", e);
// }
// export default DB;
