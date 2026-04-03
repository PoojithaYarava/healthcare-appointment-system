import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';

// Import Routers
import adminRouter from './routes/adminRoute.js';
import appointmentRouter from './routes/appointmentRoutes.js';
import userRouter from './routes/userRoute.js'; // Ensure this file exists!

// App Config
const app = express();
const port = process.env.PORT || 4000;

// Connect to Database and Cloudinary
connectDB();
connectCloudinary();

// Middlewares
app.use(express.json());

// FIXED: Explicit CORS for Vite
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// API Endpoints
app.use('/api/admin', adminRouter);
app.use('/api/appointment', appointmentRouter);
app.use('/api/user', userRouter); // This maps to your login/register logic

app.get('/', (req, res) => {
    res.send("MediConnect API is Working!");
});

// Use template literals for a clickable link in the terminal
app.listen(port, () => console.log(`Server started on http://localhost:4000`));


