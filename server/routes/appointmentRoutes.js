import express from 'express';
import { bookAppointment, getUserAppointments, confirmAppointmentPayment } from '../controllers/appointmentController.js';
import authUser from '../middlewares/authUser.js';

const appointmentRouter = express.Router();

appointmentRouter.post('/book-appointment', authUser, bookAppointment);
appointmentRouter.post('/confirm-payment', authUser, confirmAppointmentPayment);
appointmentRouter.get('/my-appointments', authUser, getUserAppointments);

export default appointmentRouter;
