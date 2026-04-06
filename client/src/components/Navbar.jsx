import React, { useContext, useMemo } from 'react'
import { assets } from '../assets/assets'
import { NavLink, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/appContextInstance'

const Navbar = () => {
    const navigate = useNavigate();
    const { token, authRole, userData, doctorData, adminData, clearSession } = useContext(AppContext);
    const authToken = token || localStorage.getItem('token');
    const profile = authRole === 'doctor' ? doctorData : authRole === 'admin' ? adminData : userData;

    const initials = useMemo(() => {
        const name = profile?.name?.trim();
        if (!name) {
            return 'MC';
        }

        return name
            .split(/\s+/)
            .slice(0, 2)
            .map((part) => part[0]?.toUpperCase() || '')
            .join('');
    }, [profile?.name]);

    const logout = () => {
        clearSession();
        navigate(authRole === 'admin' ? '/admin/login' : '/login');
    };

    const navLinkClass = ({ isActive }) => (
        `relative px-1 py-1 transition-colors ${isActive ? 'text-emerald-700' : 'text-slate-900 hover:text-emerald-700'}`
    );

    return (
        <div className='flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-300 px-4 sm:px-[10%]'>
            <div onClick={() => navigate(authRole === 'doctor' ? '/doctor/appointments' : authRole === 'admin' ? '/admin' : '/')} className='flex items-center gap-2 cursor-pointer'>
                <img className='w-8' src={assets.logo} alt="Logo" />
                <p className='text-2xl font-bold tracking-tight'>
                    <span className='text-[#3b3486]'>Medi</span><span className='text-[#22c58b]'>Connect</span>
                </p>
            </div>
            
            <ul className='hidden md:flex items-center gap-8 font-semibold tracking-tight'>
                {authRole === 'doctor' ? (
                    <>
                        <NavLink to='/doctor/appointments' end className={navLinkClass}>
                            {({ isActive }) => (
                                <>
                                    <li>DASHBOARD</li>
                                    <span className={`absolute inset-x-0 -bottom-2 h-0.5 rounded-full bg-emerald-600 transition-opacity ${isActive ? 'opacity-100' : 'opacity-0'}`} />
                                </>
                            )}
                        </NavLink>
                        <NavLink to='/doctor/appointments' className={navLinkClass}>
                            {({ isActive }) => (
                                <>
                                    <li>APPOINTMENTS</li>
                                    <span className={`absolute inset-x-0 -bottom-2 h-0.5 rounded-full bg-emerald-600 transition-opacity ${isActive ? 'opacity-100' : 'opacity-0'}`} />
                                </>
                            )}
                        </NavLink>
                    </>
                ) : authRole === 'admin' ? (
                    <NavLink to='/admin' end className={navLinkClass}>
                        {({ isActive }) => (
                            <>
                                <li>ADMIN</li>
                                <span className={`absolute inset-x-0 -bottom-2 h-0.5 rounded-full bg-emerald-600 transition-opacity ${isActive ? 'opacity-100' : 'opacity-0'}`} />
                            </>
                        )}
                    </NavLink>
                ) : (
                    <>
                        <NavLink to='/' className={navLinkClass}>
                            {({ isActive }) => (
                                <>
                                    <li>HOME</li>
                                    <span className={`absolute inset-x-0 -bottom-2 h-0.5 rounded-full bg-indigo-600 transition-opacity ${isActive ? 'opacity-100' : 'opacity-0'}`} />
                                </>
                            )}
                        </NavLink>
                        <NavLink to='/doctors' className={navLinkClass}>
                            {({ isActive }) => (
                                <>
                                    <li>FIND DOCTORS</li>
                                    <span className={`absolute inset-x-0 -bottom-2 h-0.5 rounded-full bg-indigo-600 transition-opacity ${isActive ? 'opacity-100' : 'opacity-0'}`} />
                                </>
                            )}
                        </NavLink>
                        <NavLink to='/hospitals' className={navLinkClass}>
                            {({ isActive }) => (
                                <>
                                    <li>HOSPITALS</li>
                                    <span className={`absolute inset-x-0 -bottom-2 h-0.5 rounded-full bg-indigo-600 transition-opacity ${isActive ? 'opacity-100' : 'opacity-0'}`} />
                                </>
                            )}
                        </NavLink>
                        <NavLink to='/lab-tests' className={navLinkClass}>
                            {({ isActive }) => (
                                <>
                                    <li>LAB TESTS</li>
                                    <span className={`absolute inset-x-0 -bottom-2 h-0.5 rounded-full bg-indigo-600 transition-opacity ${isActive ? 'opacity-100' : 'opacity-0'}`} />
                                </>
                            )}
                        </NavLink>
                        <NavLink to='/my-appointments' className={navLinkClass}>
                            {({ isActive }) => (
                                <>
                                    <li>MY BOOKINGS</li>
                                    <span className={`absolute inset-x-0 -bottom-2 h-0.5 rounded-full bg-indigo-600 transition-opacity ${isActive ? 'opacity-100' : 'opacity-0'}`} />
                                </>
                            )}
                        </NavLink>
                    </>
                )}
            </ul>

            <div className='flex items-center gap-4'>
                {authToken ? (
                    <div className='flex items-center gap-2 cursor-pointer group relative'>
                        {profile?.image ? (
                            <img
                                className='h-10 w-10 rounded-full border border-slate-200 object-cover shadow-sm'
                                src={profile.image}
                                alt="Profile"
                            />
                        ) : (
                            <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold shadow-sm ${authRole === 'doctor' ? 'bg-emerald-100 text-emerald-700' : authRole === 'admin' ? 'bg-slate-200 text-slate-800' : 'bg-indigo-100 text-indigo-700'}`}>
                                {initials}
                            </div>
                        )}
                        <div className='hidden sm:block text-left'>
                            <p className='text-sm font-semibold text-slate-900'>{profile?.name || (authRole === 'doctor' ? 'Doctor Account' : authRole === 'admin' ? 'Admin' : 'My Account')}</p>
                            <p className='text-xs uppercase tracking-[0.15em] text-slate-400'>{authRole === 'doctor' ? 'Doctor Portal' : authRole === 'admin' ? 'Admin Portal' : 'Patient Portal'}</p>
                        </div>
                        <img className='w-2.5' src={assets.dropdown_icon} alt="" />

                        <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
                            <div className='min-w-56 rounded-2xl border border-slate-200 bg-white flex flex-col gap-4 p-4 shadow-xl'>
                                {authRole === 'doctor' ? (
                                    <>
                                        <div>
                                            <p className='text-sm font-semibold text-slate-900'>{profile?.name || 'Doctor Dashboard'}</p>
                                            <p className='text-xs text-slate-500'>{profile?.speciality || 'Manage appointments and confirmations'}</p>
                                        </div>
                                        <p onClick={() => navigate('/doctor/appointments')} className='hover:text-black cursor-pointer'>Doctor Dashboard</p>
                                    </>
                                ) : authRole === 'admin' ? (
                                    <>
                                        <div>
                                            <p className='text-sm font-semibold text-slate-900'>{profile?.name || 'Admin'}</p>
                                            <p className='text-xs text-slate-500'>{profile?.email || 'Platform administrator'}</p>
                                        </div>
                                        <p onClick={() => navigate('/admin')} className='hover:text-black cursor-pointer'>Admin Dashboard</p>
                                    </>
                                ) : (
                                    <>
                                        <p onClick={() => navigate('/my-profile')} className='hover:text-black cursor-pointer'>My Profile</p>
                                        <p onClick={() => navigate('/my-appointments')} className='hover:text-black cursor-pointer'>My Appointments</p>
                                    </>
                                )}
                                <p onClick={logout} className='hover:text-black cursor-pointer'>Logout</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={() => navigate('/login')}
                        className='bg-indigo-600 text-white px-8 py-3 rounded-full font-medium flex items-center justify-center transition-all hover:bg-indigo-700 hover:scale-105 shadow-sm'>
                        Login / Register
                    </button>
                )}
            </div>
        </div>
    );
};

export default Navbar;
