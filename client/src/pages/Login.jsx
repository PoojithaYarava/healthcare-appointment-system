import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/appContextInstance';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { backendUrl, token, authRole, setToken, setAuthRole, hospitals } = useContext(AppContext);
  const navigate = useNavigate();

  const [accountType, setAccountType] = useState('user');
  const [state, setState] = useState('Sign Up');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [speciality, setSpeciality] = useState('');
  const [degree, setDegree] = useState('');
  const [experience, setExperience] = useState('');
  const [about, setAbout] = useState('');
  const [fees, setFees] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [hospitalId, setHospitalId] = useState('');

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setName('');
    setSpeciality('');
    setDegree('');
    setExperience('');
    setAbout('');
    setFees('');
    setAddressLine1('');
    setAddressLine2('');
    setHospitalId('');
  };

  const toggleState = () => {
    setState((prev) => (prev === 'Sign Up' ? 'Login' : 'Sign Up'));
    resetForm();
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const endpointBase = accountType === 'doctor' ? '/api/doctor' : '/api/user';
      const endpoint = state === 'Sign Up' ? `${endpointBase}/register` : `${endpointBase}/login`;
      const payload = state === 'Sign Up'
        ? accountType === 'doctor'
          ? {
              name,
              email,
              password,
              speciality,
              degree,
              experience,
              about,
              fees,
              hospitalId,
              address: JSON.stringify({ line1: addressLine1, line2: addressLine2 })
            }
          : { name, email, password }
        : { email, password };

      const { data } = await axios.post(backendUrl + endpoint, payload);

      if (data.success) {
        if (data.token) {
          setToken(data.token);
          setAuthRole(data.role || accountType);
          toast.success(`${state} successful!`);
        } else {
          toast.success(data.message || `${state} successful!`);
          if (accountType === 'doctor' && state === 'Sign Up') {
            setState('Login');
          }
          resetForm();
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Server connection failed");
    }
  };

  useEffect(() => {
    if (token) {
      navigate(authRole === 'doctor' ? '/doctor/appointments' : '/');
    }
  }, [authRole, token, navigate]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center justify-center px-4'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-[28rem] border rounded-xl text-zinc-600 text-sm shadow-lg bg-white'>
        <div className='w-full'>
          <p className='text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 mb-3'>Account Type</p>
          <div className='grid grid-cols-2 gap-2 rounded-lg bg-slate-100 p-1'>
            <button
              type='button'
              onClick={() => {
                setAccountType('user');
                setState('Sign Up');
                resetForm();
              }}
              className={`rounded-md px-4 py-2 font-medium transition-colors ${accountType === 'user' ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-600'}`}
            >
              Patient
            </button>
            <button
              type='button'
              onClick={() => {
                setAccountType('doctor');
                setState('Login');
                resetForm();
              }}
              className={`rounded-md px-4 py-2 font-medium transition-colors ${accountType === 'doctor' ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-600'}`}
            >
              Doctor
            </button>
          </div>
        </div>

        <p className='text-2xl font-semibold text-[#5f6FFF]'>
          {accountType === 'doctor'
            ? (state === 'Sign Up' ? 'Register Doctor Account' : 'Doctor Login')
            : (state === 'Sign Up' ? 'Create Account' : 'Login')}
        </p>
        <p className='text-gray-500'>
          {accountType === 'doctor'
            ? `Please ${state === 'Sign Up' ? 'register' : 'log in'} to manage appointment requests`
            : `Please ${state === 'Sign Up' ? 'sign up' : 'log in'} to book an appointment`}
        </p>

        {state === 'Sign Up' && (
          <div className='w-full'>
            <p className='font-medium mb-1'>Full Name</p>
            <input
              className='border border-zinc-300 rounded w-full p-2 outline-none focus:border-[#5f6FFF]'
              type="text"
              onChange={(e) => setName(e.target.value)}
              value={name}
              required
            />
          </div>
        )}

        {state === 'Sign Up' && accountType === 'doctor' && (
          <>
            <div className='w-full'>
              <p className='font-medium mb-1'>Speciality</p>
              <input className='border border-zinc-300 rounded w-full p-2 outline-none focus:border-[#5f6FFF]' type="text" value={speciality} onChange={(e) => setSpeciality(e.target.value)} required />
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 w-full'>
              <div>
                <p className='font-medium mb-1'>Degree</p>
                <input className='border border-zinc-300 rounded w-full p-2 outline-none focus:border-[#5f6FFF]' type="text" value={degree} onChange={(e) => setDegree(e.target.value)} required />
              </div>
              <div>
                <p className='font-medium mb-1'>Experience</p>
                <input className='border border-zinc-300 rounded w-full p-2 outline-none focus:border-[#5f6FFF]' type="text" value={experience} onChange={(e) => setExperience(e.target.value)} placeholder='e.g. 7 Years' required />
              </div>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 w-full'>
              <div>
                <p className='font-medium mb-1'>Consultation Fee</p>
                <input className='border border-zinc-300 rounded w-full p-2 outline-none focus:border-[#5f6FFF]' type="number" min="0" value={fees} onChange={(e) => setFees(e.target.value)} required />
              </div>
              <div>
                <p className='font-medium mb-1'>Hospital</p>
                <select className='border border-zinc-300 rounded w-full p-2 outline-none focus:border-[#5f6FFF]' value={hospitalId} onChange={(e) => setHospitalId(e.target.value)}>
                  <option value=''>Independent / Not linked</option>
                  {hospitals.map((hospital) => (
                    <option key={hospital._id} value={hospital._id}>
                      {hospital.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className='w-full'>
              <p className='font-medium mb-1'>About</p>
              <textarea className='border border-zinc-300 rounded w-full p-2 outline-none focus:border-[#5f6FFF] min-h-24' value={about} onChange={(e) => setAbout(e.target.value)} required />
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 w-full'>
              <div>
                <p className='font-medium mb-1'>Address Line 1</p>
                <input className='border border-zinc-300 rounded w-full p-2 outline-none focus:border-[#5f6FFF]' type="text" value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)} required />
              </div>
              <div>
                <p className='font-medium mb-1'>Address Line 2</p>
                <input className='border border-zinc-300 rounded w-full p-2 outline-none focus:border-[#5f6FFF]' type="text" value={addressLine2} onChange={(e) => setAddressLine2(e.target.value)} />
              </div>
            </div>
          </>
        )}

        <div className='w-full'>
          <p className='font-medium mb-1'>Email</p>
          <input
            className='border border-zinc-300 rounded w-full p-2 outline-none focus:border-[#5f6FFF]'
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
        </div>

        <div className='w-full'>
          <p className='font-medium mb-1'>Password</p>
          <input
            className='border border-zinc-300 rounded w-full p-2 outline-none focus:border-[#5f6FFF]'
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />
        </div>

        <button
          type='submit'
          className={`text-white w-full py-2.5 rounded-md text-base mt-2 hover:opacity-90 transition-all font-medium ${accountType === 'doctor' ? 'bg-emerald-600' : 'bg-[#5f6FFF]'}`}
        >
          {accountType === 'doctor'
            ? (state === 'Sign Up' ? 'Create doctor account' : 'Login as doctor')
            : (state === 'Sign Up' ? 'Create account' : 'Login')}
        </button>

        <p className='mt-2 text-center w-full'>
          {state === 'Sign Up' ? 'Already have an account?' : "Don't have an account?"}
          <span
            onClick={toggleState}
            className={`underline cursor-pointer ml-1 font-medium ${accountType === 'doctor' ? 'text-emerald-600' : 'text-[#5f6FFF]'}`}
          >
            {state === 'Sign Up' ? 'Login here' : 'Create one here'}
          </span>
        </p>
      </div>
    </form>
  );
};

export default Login;
