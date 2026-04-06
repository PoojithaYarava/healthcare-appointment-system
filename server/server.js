import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';

// Import Routers
import adminRouter from './routes/adminRoute.js';
import appointmentRouter from './routes/appointmentRoutes.js';
import doctorRouter from './routes/doctorRoute.js';
import labTestRouter from './routes/labTestRoute.js';
import publicRouter from './routes/publicRoute.js';
import userRouter from './routes/userRoute.js'; // Ensure this file exists!

// App Config
const app = express();
const port = process.env.PORT || 4000;
const allowedOrigins = [
    'http://localhost:5173',
    process.env.FRONTEND_URL,
    process.env.FRONTEND_URL_ALT
].filter(Boolean);
const allowedVercelHostPattern = /^https:\/\/healthcare-appointment-system(?:-[a-z0-9-]+)?\.vercel\.app$/i;

// Connect to Database and Cloudinary
connectDB();
connectCloudinary();

// Middlewares

app.use(cors({
    origin: (origin, callback) => {
        const isAllowedVercelDeployment = origin ? allowedVercelHostPattern.test(origin) : false;

        // Allow server-to-server requests and configured frontend origins.
        if (!origin || allowedOrigins.includes(origin) || isAllowedVercelDeployment) {
            return callback(null, true);
        }

        return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json());

// API Endpoints
app.use('/api/admin', adminRouter);
app.use('/api/appointment', appointmentRouter);
app.use('/api/data', publicRouter);
app.use('/api/doctor', doctorRouter);
app.use('/api/lab-tests', labTestRouter);
app.use('/api/user', userRouter); // This maps to your login/register logic

app.get('/', (req, res) => {
    res.send("MediConnect API is Working!");
});

// Use template literals for a clickable link in the terminal
app.listen(port, () => console.log(`Server started on port ${port}`));


