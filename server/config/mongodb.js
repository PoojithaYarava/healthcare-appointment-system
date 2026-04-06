import mongoose from "mongoose";
import doctorModel from "../models/doctorModel.js";

const connectDB = async () => {
    mongoose.connection.on('connected', () => {
        console.log("Database Connected Successfully");
    });

    mongoose.connection.on('error', (err) => {
        console.log("Database Connection Error:", err);
    });

    try {
        await mongoose.connect(`${process.env.MONGODB_URI}`);

        // Backfill older doctors so legacy admin/seeded records remain approved
        await doctorModel.updateMany(
            { isApproved: { $exists: false } },
            {
                $set: {
                    isApproved: true,
                    registrationStatus: 'approved',
                    registrationSource: 'admin'
                }
            }
        );
    } catch (error) {
        console.log("Initial Connection Failed:", error.message);
    }
};

export default connectDB;
