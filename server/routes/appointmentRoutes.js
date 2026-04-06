import express from 'express';
import { bookAppointment, getUserAppointments, confirmAppointmentPayment, cancelAppointment } from '../controllers/appointmentController.js';
import authUser from '../middlewares/authUser.js';

const appointmentRouter = express.Router();

appointmentRouter.post('/book-appointment', authUser, bookAppointment);
appointmentRouter.post('/confirm-payment', authUser, confirmAppointmentPayment);
appointmentRouter.post('/cancel', authUser, cancelAppointment);
appointmentRouter.get('/my-appointments', authUser, getUserAppointments);

export default appointmentRouter;
