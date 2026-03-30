import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const MyAppointments = () => {
  const { doctors } = useContext(AppContext);

  return (
    <div className='p-5'>
      <h1 className='text-2xl font-bold text-indigo-900 border-b pb-4'>My Bookings</h1>
      <div className='mt-5'>
        {doctors.slice(0, 2).map((item, index) => (
          <div key={index} className='flex gap-6 border-b py-4 items-center'>
            <img className='w-24 rounded-lg bg-indigo-50' src={item.image} alt="" />
            <div className='flex-1'>
              <p className='font-bold text-indigo-900'>{item.name}</p>
              <p className='text-emerald-600 text-sm'>{item.speciality}</p>
              <p className='text-xs text-gray-500 mt-2'>Date: 24-Oct-2026 | Time: 10:00 AM</p>
            </div>
            <div className='flex flex-col gap-2'>
               <button className='bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm'>Pay Now</button>
               <button className='border border-red-200 text-red-500 px-4 py-2 rounded-lg text-sm'>Cancel</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyAppointments;