import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className='flex flex-col md:flex-row items-center justify-between bg-indigo-900 rounded-3xl px-6 md:px-16 lg:px-20 py-12 md:py-20 text-white mx-4 md:mx-10 shadow-2xl'>
      
      {/* Left Side: Content */}
      <div className='md:w-1/2 flex flex-col items-start gap-6'>
        <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold leading-tight'>
          Healthcare <br /> <span className='text-emerald-400'>Simplified.</span>
        </h1>
        <p className='text-indigo-100 text-lg md:text-xl font-light max-w-md'>
          Book appointments with top-rated specialists and access world-class hospitals with a single click. 
        </p>
        <button 
          onClick={() => navigate('/doctors')}
          className='flex items-center gap-2 bg-emerald-500 px-10 py-4 rounded-2xl text-indigo-900 font-bold hover:bg-white transition-all shadow-lg hover:translate-y-[-2px]'
        >
          Find a Doctor 
          <span className='text-xl'>→</span>
        </button>
      </div>

      {/* Right Side: New High-Quality Image */}
      <div className='md:w-1/2 mt-12 md:mt-0 relative'>
        <img 
          className='w-full max-w-lg rounded-2xl border-8 border-white/10 shadow-2xl transform hover:rotate-2 transition-transform duration-500' 
          src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800" 
          alt="Medical Professional Consultation" 
        />
        {/* Floating Stat Card */}
        <div className='absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl text-indigo-900 hidden lg:block'>
          <p className='text-sm font-bold'>24/7 Support</p>
          <p className='text-xs text-gray-500'>Available Online</p>
        </div>
      </div>
    </div>
  );
};

export default Home;