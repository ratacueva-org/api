import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async (): Promise<void> => {
  try {
    const mongoUri: string | undefined = process.env.MONGO_URI;

    if (!mongoUri) {
      console.error('Error: MONGO_URI environment variable is not defined.');
      process.exit(1);
    }

    const connection = await mongoose.connect(mongoUri);

    console.log(`MongoDB connected to: ${connection.connection.name} on ${connection.connection.host}`);
  } catch (error) {
    console.error('An error occurred while attempting to connect to the database:', error);
    process.exit(1);
  }
};

export default connectDB;
