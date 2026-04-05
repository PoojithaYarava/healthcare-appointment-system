import express from 'express';
import { bookAppointment, getUserAppointments } from '../controllers/appointmentController.js';
import authUser from '../middlewares/authUser.js';

const appointmentRouter = express.Router();

appointmentRouter.post('/book-appointment', authUser, bookAppointment);
appointmentRouter.get('/my-appointments', authUser, getUserAppointments);

export default appointmentRouter;
