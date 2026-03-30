import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Doctors from '../pages/Doctors';
import Login from '../pages/Login';
import BookAppointment from '../pages/BookAppointment';
import MyAppointments from '../pages/MyAppointments';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/doctors" element={<Doctors />} />
      <Route path="/login" element={<Login />} />
      <Route path="/book-appointment/:docId" element={<BookAppointment />} />
      <Route path="/my-appointments" element={<MyAppointments />} />
    </Routes>
  );
};

export default AppRoutes;