import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Inventory database connected");
  } catch (error) {
    console.error("Inventory database connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;