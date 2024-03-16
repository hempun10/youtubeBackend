import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.DATABASE_URL}`
    );
    console.log(
      `\n Connected to the database: ${connectionInstance.connection.name}`
    );
  } catch (error) {
    console.log("Error connecting to the database", error);
    process.exit(1);
  }
};

export default connectDB;
