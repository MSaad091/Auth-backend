import mongoose from "mongoose";

const DBname = "Authentication";
const MONGO_URI = "mongodb+srv://Saad:0310@cluster0.11va0rw.mongodb.net";

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(`${MONGO_URI}/${DBname}`);
    console.log("✅ MongoDB Connected Successfully!");
    return connection;
  } catch (error) {
    console.log("❌ MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

export default connectDB;
