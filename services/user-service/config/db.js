import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("User database connected");
  } catch (error) {
    console.error("User database connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;