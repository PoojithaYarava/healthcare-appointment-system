import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className='mx-4 flex flex-col items-center justify-between rounded-3xl bg-indigo-900 px-6 py-12 text-white shadow-2xl md:mx-10 md:flex-row md:px-16 md:py-20 lg:px-20'>
      <div className='flex flex-col items-start gap-6 md:w-1/2'>
        <h1 className='text-4xl font-bold leading-tight md:text-5xl lg:text-6xl'>
          Healthcare <br /> <span className='text-emerald-400'>Simplified.</span>
        </h1>
        <p className='max-w-md text-lg font-light text-indigo-100 md:text-xl'>
          Book appointments with top-rated specialists and access world-class hospitals with a single click.
        </p>
        <div className='flex flex-col gap-4 sm:flex-row'>
          <button
            onClick={() => navigate('/login')}
            className='flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-10 py-4 font-bold text-indigo-900 shadow-lg transition-all hover:-translate-y-0.5 hover:bg-white'
          >
            Login / Register
            <span className='text-xl'>&rarr;</span>
          </button>
          <button
            onClick={() => navigate('/doctors')}
            className='flex items-center justify-center gap-2 rounded-2xl border border-white/30 px-10 py-4 font-semibold text-white transition-all hover:border-white hover:bg-white/10'
          >
            Browse Doctors
          </button>
        </div>
      </div>

      <div className='relative mt-12 md:mt-0 md:w-1/2'>
        <img
          className='w-full max-w-lg rounded-2xl border-8 border-white/10 shadow-2xl transition-transform duration-500 hover:rotate-2'
          src='https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800'
          alt='Medical Professional Consultation'
        />
        <div className='absolute -bottom-6 -left-6 hidden rounded-xl bg-white p-4 text-indigo-900 shadow-xl lg:block'>
          <p className='text-sm font-bold'>24/7 Support</p>
          <p className='text-xs text-gray-500'>Available Online</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
