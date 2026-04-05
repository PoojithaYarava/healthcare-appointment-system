import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Doctors from '../pages/Doctors';
import Hospitals from '../pages/Hospitals';
import Login from '../pages/Login';
import Appointment from '../pages/Appointment';
import MyAppointments from '../pages/MyAppointments';
import Payments from '../pages/payments';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/doctors" element={<Doctors />} />
      <Route path="/hospitals" element={<Hospitals />} />
      <Route path="/login" element={<Login />} />
      <Route path="/appointment/:docId" element={<Appointment />} />
      <Route path="/my-appointments" element={<MyAppointments />} />
      <Route path="/payments/:appointmentId" element={<Payments />} />
    </Routes>
  );
};

export default AppRoutes;
