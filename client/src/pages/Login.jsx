import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Login = () => {
  const { backendUrl, token, setToken, navigate } = useContext(AppContext)
  const [state, setState] = useState('Sign Up')
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')

  const onSubmitHandler = async (event) => {
    event.preventDefault()

    try {
      // Determine real endpoint based on UI state
      const endpoint = state === 'Sign Up' ? '/api/user/register' : '/api/user/login'
      const payload = state === 'Sign Up' ? { name, email, password } : { email, password }

      // Actual HTTP communication with your Node.js backend
      const { data } = await axios.post(backendUrl + endpoint, payload)

      if (data.success) {
        // Store the real JWT returned by your backend
        localStorage.setItem('token', data.token)
        setToken(data.token)
        toast.success(`${state} successful!`)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      // Handles network errors or server crashes
      toast.error(error.response?.data?.message || "Server connection failed")
    }
  }

  // Redirect to home page automatically once token is present
  useEffect(() => {
    if (token) {
      navigate('/')
    }
  }, [token, navigate])

  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg'>
        <p className='text-2xl font-semibold'>{state === 'Sign Up' ? "Create Account" : "Login"}</p>
        <p className='text-gray-500'>Please {state === 'Sign Up' ? "sign up" : "log in"} to book appointment</p>
        
        {state === 'Sign Up' && (
          <div className='w-full'>
            <p>Full Name</p>
            <input className='border border-zinc-300 rounded w-full p-2 mt-1' type="text" onChange={(e) => setName(e.target.value)} value={name} required />
          </div>
        )}

        <div className='w-full'>
          <p>Email</p>
          <input className='border border-zinc-300 rounded w-full p-2 mt-1' type="email" onChange={(e) => setEmail(e.target.value)} value={email} required />
        </div>

        <div className='w-full'>
          <p>Password</p>
          <input className='border border-zinc-300 rounded w-full p-2 mt-1' type="password" onChange={(e) => setPassword(e.target.value)} value={password} required />
        </div>

        <button type='submit' className='bg-[#5f6FFF] text-white w-full py-2 rounded-md text-base mt-2 hover:bg-[#4e5bd6] transition-all'>
          {state === 'Sign Up' ? "Create account" : "Login"}
        </button>

        <p className='mt-2'>
          {state === 'Sign Up' ? "Already have an account?" : "Create a new account?"} 
          <span onClick={() => setState(state === 'Sign Up' ? 'Login' : 'Sign Up')} className='text-[#5f6FFF] underline cursor-pointer ml-1'>
            {state === 'Sign Up' ? "Login here" : "Click here"}
          </span>
        </p>
      </div>
    </form>
  )
}

export default Login