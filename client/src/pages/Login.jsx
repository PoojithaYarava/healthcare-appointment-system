import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { backendUrl, token, setToken } = useContext(AppContext);
  const navigate = useNavigate();
  
  const [state, setState] = useState('Sign Up');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  // ✅ Toggle function to switch modes and clear fields
  const toggleState = () => {
    setState(prev => (prev === 'Sign Up' ? 'Login' : 'Sign Up'));
    setName('');
    setEmail('');
    setPassword('');
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const endpoint = state === 'Sign Up' ? '/api/user/register' : '/api/user/login';
      const payload = state === 'Sign Up' ? { name, email, password } : { email, password };

      const { data } = await axios.post(backendUrl + endpoint, payload);

      if (data.success) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        toast.success(`${state} successful!`);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Server connection failed");
    }
  };

  useEffect(() => {
    if (token) navigate('/');
  }, [token, navigate]);

  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center justify-center px-4'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg bg-white'>
        <p className='text-2xl font-semibold text-[#5f6FFF]'>
            {state === 'Sign Up' ? "Create Account" : "Login"}
        </p>
        <p className='text-gray-500'>
            Please {state === 'Sign Up' ? "sign up" : "log in"} to book an appointment
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

        {/* ✅ Updated Button with explicit branding color to ensure visibility */}
        <button 
            type='submit' 
            className='bg-[#5f6FFF] text-white w-full py-2.5 rounded-md text-base mt-2 hover:opacity-90 transition-all font-medium'
        >
          {state === 'Sign Up' ? "Create account" : "Login"}
        </button>

        <p className='mt-2 text-center w-full'>
          {state === 'Sign Up' ? "Already have an account?" : "Don't have an account?"} 
          <span 
            onClick={toggleState}
            className='text-[#5f6FFF] underline cursor-pointer ml-1 font-medium'
          >
            {state === 'Sign Up' ? "Login here" : "Create one here"}
          </span>
        </p>
      </div>
    </form>
  );
}

export default Login;
