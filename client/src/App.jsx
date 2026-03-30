import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Doctors from './pages/Doctors';
import Hospitals from './pages/Hospitals';
import Login from './pages/Login';
import MyAppointments from './pages/MyAppointments';
import BookAppointment from './pages/BookAppointment';
import Navbar from './components/Navbar';

const App = () => {
  return (
    <div className='mx-4 sm:mx-[10%]'>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/doctors' element={<Doctors />} />
        <Route path='/hospitals' element={<Hospitals />} />
        <Route path='/login' element={<Login />} />
        <Route path='/my-appointments' element={<MyAppointments />} />
        <Route path='/book-appointment/:docId' element={<BookAppointment />} />
      </Routes>
    </div>
  );
};

export default App;
