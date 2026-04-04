import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { NavLink, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Navbar = () => {
    const navigate = useNavigate();
    const { token, setToken, userData } = useContext(AppContext);

    const logout = () => {
        setToken(false);
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className='flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400 px-4 sm:px-[10%]'>
            {/* NEW LOGO DESIGN: Icon + Text */}
            <div onClick={() => navigate('/')} className='flex items-center gap-2 cursor-pointer'>
                <img className='w-8' src={assets.logo} alt="Logo Icon" />
                <p className='text-2xl font-bold text-primary tracking-tight'>
                    Medi<span className='text-secondary'>Connect</span>
                </p>
            </div>
            
            <ul className='hidden md:flex items-start gap-5 font-medium'>
                <NavLink to='/'><li className='py-1 uppercase'>Home</li></NavLink>
                <NavLink to='/doctors'><li className='py-1 uppercase'>Find Doctors</li></NavLink>
                <NavLink to='/about'><li className='py-1 uppercase'>Hospitals</li></NavLink>
                <NavLink to='/contact'><li className='py-1 uppercase'>My Bookings</li></NavLink>
            </ul>

            <div className='flex items-center gap-4'>
                {token && userData ? (
                    <div className='flex items-center gap-2 cursor-pointer group relative'>
                        <div className='w-9 h-9 rounded-full overflow-hidden border border-gray-300 bg-gray-100'>
                            <img 
                                className='w-full h-full object-cover' 
                                src={userData.image ? userData.image : assets.profile_pic} 
                                alt="User Profile" 
                            />
                        </div>
                        <img className='w-2.5' src={assets.dropdown_icon} alt="" />

                        <div className='absolute top-full right-0 mt-2 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
                            <div className='min-w-48 bg-stone-100 rounded-md flex flex-col gap-3 p-4 shadow-lg border border-gray-200'>
                                <p onClick={() => navigate('/my-profile')} className='hover:text-black hover:bg-stone-200 p-1.5 rounded cursor-pointer'>My Profile</p>
                                <p onClick={() => navigate('/my-appointments')} className='hover:text-black hover:bg-stone-200 p-1.5 rounded cursor-pointer'>My Appointments</p>
                                <p onClick={logout} className='hover:text-black hover:bg-stone-200 p-1.5 rounded cursor-pointer'>Logout</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <button 
                        onClick={() => navigate('/login')} 
                        className='bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block transition-all hover:scale-105'>
                        Sign In
                    </button>
                )}
            </div>
        </div>
    );
};

export default Navbar;