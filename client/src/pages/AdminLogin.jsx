import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/appContextInstance';

const AdminLogin = () => {
  const { backendUrl, token, authRole, setToken, setAuthRole } = useContext(AppContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setIsSubmitting(true);
      const { data } = await axios.post(`${backendUrl}/api/admin/login`, { email, password });

      if (data.success) {
        setToken(data.token);
        setAuthRole('admin');
        toast.success('Admin login successful');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to log in as admin');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (token && authRole === 'admin') {
      navigate('/admin', { replace: true });
    }
  }, [authRole, navigate, token]);

  return (
    <div className='mx-auto flex min-h-[70vh] w-full max-w-md items-center justify-center px-4'>
      <form onSubmit={handleSubmit} className='w-full rounded-3xl border border-slate-200 bg-white p-8 shadow-xl'>
        <p className='text-xs font-semibold uppercase tracking-[0.25em] text-slate-400'>Admin Access</p>
        <h1 className='mt-3 text-3xl font-bold text-slate-900'>Admin Login</h1>
        <p className='mt-2 text-sm text-slate-500'>Only authorized admins can manage approvals, doctors, and hospitals.</p>
        <div className='mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600'>
          Admin accounts are created internally by the platform owner or operations team. This is a private staff portal, not a public registration flow.
        </div>

        <div className='mt-6 space-y-4'>
          <div>
            <label className='mb-2 block text-sm font-medium text-slate-700'>Admin Email</label>
            <input className='w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500' type='email' value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className='mb-2 block text-sm font-medium text-slate-700'>Password</label>
            <input className='w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500' type='password' value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
        </div>

        <button type='submit' disabled={isSubmitting} className='mt-6 w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-black disabled:bg-slate-400'>
          {isSubmitting ? 'Signing in...' : 'Login as admin'}
        </button>

        <button
          type='button'
          onClick={() => navigate('/login')}
          className='mt-3 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50'
        >
          Back to Patient / Doctor Login
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
