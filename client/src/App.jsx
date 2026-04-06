import React from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Doctors from './pages/Doctors'
import Login from './pages/Login'
import About from './pages/About'
import Contact from './pages/Contact'
import Hospitals from './pages/Hospitals'
import MyProfile from './pages/MyProfile'
import MyAppointments from './pages/MyAppointments'
import Appointment from './pages/Appointment'
import Payments from './pages/payments'
import DoctorAppointments from './pages/DoctorAppointments'
import AdminPanel from './pages/AdminPanel'
import AdminLogin from './pages/AdminLogin'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const App = () => {
  const location = useLocation()
  const isDoctorDashboard = location.pathname.startsWith('/doctor/')
  const isAdminPage = location.pathname.startsWith('/admin')

  return (
    <div className='mx-4 sm:mx-[10%] flex flex-col min-h-screen'>
      <ToastContainer />
      <Navbar />
      <div className={`flex-1 ${(isDoctorDashboard || isAdminPage) ? 'pb-4' : ''}`}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/doctors' element={<Doctors />} />
          <Route path='/doctors/:speciality' element={<Doctors />} />
          <Route path='/hospitals' element={<Hospitals />} />
          <Route path='/login' element={<Login />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/my-profile' element={<MyProfile />} />
          <Route path='/my-appointments' element={<MyAppointments />} />
          <Route path='/appointment/:docId' element={<Appointment />} />
          <Route path='/payments/:appointmentId' element={<Payments />} />
          <Route path='/doctor/appointments' element={<DoctorAppointments />} />
          <Route path='/admin/login' element={<AdminLogin />} />
          <Route path='/admin' element={<AdminPanel />} />
        </Routes>
      </div>
      {!(isDoctorDashboard || isAdminPage) && <Footer />}
      {(isDoctorDashboard || isAdminPage) && <Footer compact />}
    </div>
  )
}

export default App
