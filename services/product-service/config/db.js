import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Product database connected");
  } catch (error) {
    console.error("Product database connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;