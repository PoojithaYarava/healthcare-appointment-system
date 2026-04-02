import mongoose from "mongoose";

const connectDB = async () => {

    // Success Listener: Fires when the connection is established
    mongoose.connection.on('connected', () => {
        console.log("Database Connected Successfully ✅");
    });

    // Error Listener: Fires if the connection drops or credentials fail
    mongoose.connection.on('error', (err) => {
        console.log("Database Connection Error ❌:", err);
    });

    try {
        // We pull the MONGODB_URI directly from your .env file
        await mongoose.connect(`${process.env.MONGODB_URI}`);
    } catch (error) {
        console.log("Initial Connection Failed ❌:", error.message);
    }
};

export default connectDB;