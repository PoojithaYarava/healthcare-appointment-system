import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { NavLink, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Navbar = () => {
    const navigate = useNavigate();
    const { token, setToken, userData } = useContext(AppContext);

    // Clears local state and storage to successfully log the user out
    const logout = () => {
        setToken(false);
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className='flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400 px-4 sm:px-[10%]'>
            {/* Logo Section */}
            <div onClick={() => navigate('/')} className='flex items-center gap-2 cursor-pointer'>
                <img className='w-8' src={assets.logo} alt="Logo" />
                <p className='text-2xl font-bold text-primary tracking-tight'>
                    Medi<span className='text-secondary'>Connect</span>
                </p>
            </div>
            
            {/* Navigation Links with Active Indicators */}
            <ul className='hidden md:flex items-start gap-5 font-medium'>
                <NavLink to='/'>
                    <li className='py-1'>HOME</li>
                    <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
                </NavLink>
                <NavLink to='/doctors'>
                    <li className='py-1'>FIND DOCTORS</li>
                    <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
                </NavLink>
                <NavLink to='/about'>
                    <li className='py-1'>HOSPITALS</li>
                    <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
                </NavLink>
                <NavLink to='/contact'>
                    <li className='py-1'>MY BOOKINGS</li>
                    <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
                </NavLink>
            </ul>

            <div className='flex items-center gap-4'>
                {/* This check is the 'Gatekeeper'. 
                    If the backend error (userId undefined) is happening, 
                    userData will be false, and this menu will hide.
                */}
                {token && userData ? (
                    <div className='flex items-center gap-2 cursor-pointer group relative'>
                        <img 
                            className='w-8 rounded-full' 
                            src={userData.image ? userData.image : assets.profile_pic} 
                            alt="Profile" 
                        />
                        <img className='w-2.5' src={assets.dropdown_icon} alt="" />

                        {/* Dropdown Menu */}
                        <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
                            <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4 shadow-md'>
                                <p onClick={() => navigate('/my-profile')} className='hover:text-black cursor-pointer'>My Profile</p>
                                <p onClick={() => navigate('/my-appointments')} className='hover:text-black cursor-pointer'>My Appointments</p>
                                <p onClick={logout} className='hover:text-black cursor-pointer'>Logout</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <button 
                        onClick={() => navigate('/login')} 
                        className='bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block transition-all hover:scale-105'>
                        Create account
                    </button>
                )}
            </div>
        </div>
    );
};

export default Navbar;