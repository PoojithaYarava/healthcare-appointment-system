import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import adminRouter from './routes/adminRoute.js';
import appointmentRouter from './routes/appointmentRoutes.js';

// App Config
const app = express();
const port = process.env.PORT || 4000;

// Connect to Database and Cloudinary
connectDB();
connectCloudinary();

// Middlewares
app.use(express.json());
app.use(cors());

//API Endpoints
app.use('/api/admin', adminRouter);
app.use('/api/appointment', appointmentRouter);

app.get('/', (req, res) => {
    res.send("MediConnect API is Working!");
});

app.listen(port, () => console.log('server started on http://localhost:4000'));


