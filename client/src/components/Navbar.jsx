import React from 'react';
import logo from '../assets/logo.png'; 
import { NavLink, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <div className='flex items-center justify-between text-sm py-5 mb-8 border-b border-gray-100 shadow-sm px-4 md:px-10 bg-white sticky top-0 z-50'>
      
      {/* Brand Logo & Name */}
      <div onClick={() => navigate('/')} className='flex items-center gap-3 cursor-pointer'>
        <img className='w-10' src={logo} alt="MediConnect" />
        <span className='text-2xl font-extrabold text-indigo-900 tracking-tighter'>
          Medi<span className="text-emerald-500">Connect</span>
        </span>
      </div>

      {/* Navigation Links */}
      <ul className='hidden md:flex items-center gap-8 font-semibold text-gray-600'>
        <NavLink to='/' className={({isActive})=> isActive ? "text-indigo-900 border-b-2 border-indigo-900 pb-1" : "hover:text-indigo-900 transition-all"}>
          <li>HOME</li>
        </NavLink>
        <NavLink to='/doctors' className={({isActive})=> isActive ? "text-indigo-900 border-b-2 border-indigo-900 pb-1" : "hover:text-indigo-900 transition-all"}>
          <li>FIND DOCTORS</li>
        </NavLink>
        <NavLink to='/hospitals' className={({isActive})=> isActive ? "text-indigo-900 border-b-2 border-indigo-900 pb-1" : "hover:text-indigo-900 transition-all"}>
          <li>HOSPITALS</li>
        </NavLink>
        <NavLink to='/my-appointments' className={({isActive})=> isActive ? "text-indigo-900 border-b-2 border-indigo-900 pb-1" : "hover:text-indigo-900 transition-all"}>
          <li>MY BOOKINGS</li>
        </NavLink>
      </ul>

      {/* Action Button */}
      <div className='flex items-center gap-4'>
        <button 
          onClick={() => navigate('/login')} 
          className='bg-indigo-900 text-white px-8 py-3 rounded-xl font-medium hover:bg-indigo-800 hover:shadow-lg transition-all active:scale-95'
        >
          Sign In
        </button>
      </div>
    </div>
  );
};

export default Navbar;