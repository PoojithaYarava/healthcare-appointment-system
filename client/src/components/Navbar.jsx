import React, { useContext, useEffect, useMemo, useState } from 'react'
import { assets } from '../assets/assets'
import { NavLink, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/appContextInstance'

const Navbar = () => {
    const navigate = useNavigate();
    const { token, authRole, userData, doctorData, adminData, clearSession } = useContext(AppContext);
    const authToken = token || localStorage.getItem('token');
    const profile = authRole === 'doctor' ? doctorData : authRole === 'admin' ? adminData : userData;
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

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

    useEffect(() => {
        setIsMenuOpen(false);
        setIsProfileMenuOpen(false);
    }, [authRole, authToken]);

    const logout = () => {
        setIsProfileMenuOpen(false);
        setIsMenuOpen(false);
        clearSession();
        navigate(authRole === 'admin' ? '/admin/login' : '/login');
    };

    const navLinkClass = ({ isActive }) => (
        `relative px-1 py-1 transition-colors ${isActive ? 'text-emerald-700' : 'text-slate-900 hover:text-emerald-700'}`
    );

    const publicNavItems = [
        { to: '/', label: 'HOME' },
        { to: '/doctors', label: 'FIND DOCTORS' },
        { to: '/hospitals', label: 'HOSPITALS' },
        { to: '/lab-tests', label: 'LAB TESTS' },
        { to: '/my-appointments', label: 'MY BOOKINGS' }
    ];

    const doctorNavItems = [
        { to: '/doctor/appointments', label: 'DASHBOARD', end: true },
        { to: '/doctor/appointments', label: 'APPOINTMENTS' }
    ];

    const adminNavItems = [{ to: '/admin', label: 'ADMIN', end: true }];

    const navItems = authRole === 'doctor'
        ? doctorNavItems
        : authRole === 'admin'
            ? adminNavItems
            : publicNavItems;

    const desktopUnderlineColor = authRole === 'user' || !authRole ? 'bg-indigo-600' : 'bg-emerald-600';

    const handleNavigate = (path) => {
        setIsMenuOpen(false);
        setIsProfileMenuOpen(false);
        navigate(path);
    };

    return (
        <div className='mb-5 border-b border-b-gray-300 px-4 py-4 text-sm sm:px-[10%]'>
            <div className='flex items-center justify-between gap-3'>
                <div onClick={() => handleNavigate(authRole === 'doctor' ? '/doctor/appointments' : authRole === 'admin' ? '/admin' : '/')} className='flex min-w-0 cursor-pointer items-center gap-2'>
                    <img className='w-8 shrink-0' src={assets.logo} alt="Logo" />
                    <p className='truncate text-xl font-bold tracking-tight sm:text-2xl'>
                        <span className='text-[#3b3486]'>Medi</span><span className='text-[#22c58b]'>Connect</span>
                    </p>
                </div>

                <ul className='hidden md:flex items-center gap-8 font-semibold tracking-tight'>
                    {navItems.map((item) => (
                        <NavLink key={`${item.to}-${item.label}`} to={item.to} end={item.end} className={navLinkClass}>
                            {({ isActive }) => (
                                <>
                                    <li>{item.label}</li>
                                    <span className={`absolute inset-x-0 -bottom-2 h-0.5 rounded-full transition-opacity ${desktopUnderlineColor} ${isActive ? 'opacity-100' : 'opacity-0'}`} />
                                </>
                            )}
                        </NavLink>
                    ))}
                </ul>

                <div className='flex items-center gap-2 sm:gap-4'>
                    <button
                        type='button'
                        onClick={() => setIsMenuOpen((prev) => !prev)}
                        className='inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-slate-700 transition-colors hover:bg-slate-50 md:hidden'
                        aria-label='Toggle navigation menu'
                        aria-expanded={isMenuOpen}
                    >
                        <span className='text-lg'>{isMenuOpen ? 'X' : '='}</span>
                    </button>

                    {authToken ? (
                        <div className='relative flex items-center gap-2'>
                            <button
                                type='button'
                                onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                                className='flex items-center gap-2 rounded-full border border-slate-200 bg-white p-1 pr-2 shadow-sm transition-colors hover:border-slate-300'
                            >
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
                                <div className='hidden text-left sm:block'>
                                    <p className='max-w-36 truncate text-sm font-semibold text-slate-900'>{profile?.name || (authRole === 'doctor' ? 'Doctor Account' : authRole === 'admin' ? 'Admin' : 'My Account')}</p>
                                    <p className='text-xs uppercase tracking-[0.15em] text-slate-400'>{authRole === 'doctor' ? 'Doctor Portal' : authRole === 'admin' ? 'Admin Portal' : 'Patient Portal'}</p>
                                </div>
                                <img className={`w-2.5 transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`} src={assets.dropdown_icon} alt="" />
                            </button>

                            <div className={`absolute right-0 top-full z-20 mt-3 w-64 rounded-2xl border border-slate-200 bg-white p-4 text-base font-medium text-gray-600 shadow-xl transition-all ${isProfileMenuOpen ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-2 opacity-0'}`}>
                                {authRole === 'doctor' ? (
                                    <>
                                        <div>
                                            <p className='text-sm font-semibold text-slate-900'>{profile?.name || 'Doctor Dashboard'}</p>
                                            <p className='text-xs text-slate-500'>{profile?.speciality || 'Manage appointments and confirmations'}</p>
                                        </div>
                                        <button type='button' onClick={() => handleNavigate('/doctor/appointments')} className='mt-4 w-full text-left hover:text-black'>Doctor Dashboard</button>
                                    </>
                                ) : authRole === 'admin' ? (
                                    <>
                                        <div>
                                            <p className='text-sm font-semibold text-slate-900'>{profile?.name || 'Admin'}</p>
                                            <p className='text-xs text-slate-500'>{profile?.email || 'Platform administrator'}</p>
                                        </div>
                                        <button type='button' onClick={() => handleNavigate('/admin')} className='mt-4 w-full text-left hover:text-black'>Admin Dashboard</button>
                                    </>
                                ) : (
                                    <>
                                        <button type='button' onClick={() => handleNavigate('/my-profile')} className='w-full text-left hover:text-black'>My Profile</button>
                                        <button type='button' onClick={() => handleNavigate('/my-appointments')} className='mt-4 w-full text-left hover:text-black'>My Appointments</button>
                                    </>
                                )}
                                <button type='button' onClick={logout} className='mt-4 w-full text-left hover:text-black'>Logout</button>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={() => handleNavigate('/login')}
                            className='flex items-center justify-center rounded-full bg-indigo-600 px-4 py-3 text-sm font-medium text-white shadow-sm transition-all hover:bg-indigo-700 sm:px-8'>
                            Login / Register
                        </button>
                    )}
                </div>
            </div>

            <div className={`mt-4 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all md:hidden ${isMenuOpen ? 'max-h-[70vh] opacity-100' : 'max-h-0 border-transparent opacity-0'}`}>
                <div className='flex flex-col px-4 py-3'>
                    {navItems.map((item) => (
                        <NavLink
                            key={`mobile-${item.to}-${item.label}`}
                            to={item.to}
                            end={item.end}
                            onClick={() => setIsMenuOpen(false)}
                            className={({ isActive }) => `rounded-2xl px-4 py-3 font-semibold transition-colors ${isActive ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-50'}`}
                        >
                            {item.label}
                        </NavLink>
                    ))}

                    {authToken && authRole === 'user' && (
                        <>
                            <button type='button' onClick={() => handleNavigate('/my-profile')} className='mt-2 rounded-2xl px-4 py-3 text-left font-semibold text-slate-700 transition-colors hover:bg-slate-50'>My Profile</button>
                            <button type='button' onClick={logout} className='rounded-2xl px-4 py-3 text-left font-semibold text-slate-700 transition-colors hover:bg-slate-50'>Logout</button>
                        </>
                    )}

                    {authToken && authRole !== 'user' && (
                        <button type='button' onClick={logout} className='mt-2 rounded-2xl px-4 py-3 text-left font-semibold text-slate-700 transition-colors hover:bg-slate-50'>Logout</button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;
