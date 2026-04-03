import express from 'express';
import { bookAppointment } from '../controllers/appointmentController.js';

const appointmentRouter = express.Router();

// This defines the endpoint: /api/appointment/book-appointment
appointmentRouter.post('/book-appointment', bookAppointment);

export default appointmentRouter;