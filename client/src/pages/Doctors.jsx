import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const Doctors = () => {
  const { doctors } = useContext(AppContext);
  const navigate = useNavigate();

  return (
    <div className='p-4 max-w-6xl mx-auto'>
      <h1 className='text-2xl font-semibold text-gray-800 mb-6'>Find your Specialist at MediConnect</h1>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
        {doctors.map((item, index) => (
          <div key={index} className='border border-blue-100 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500 shadow-sm'>
            <img className='bg-blue-50 w-full h-48 object-cover' src={item.image} alt="" />
            <div className='p-4'>
              <div className='flex items-center gap-2 text-sm text-center text-green-500'>
                <p className='w-2 h-2 bg-green-500 rounded-full'></p><p>Available</p>
              </div>
              <p className='text-gray-900 text-lg font-medium'>{item.name}</p>
              <p className='text-gray-600 text-sm'>{item.speciality}</p>
              <button 
                onClick={() => navigate(`/appointment/${item._id}`)}
                className='mt-3 w-full py-2 bg-blue-50 text-blue-600 rounded-lg font-medium hover:bg-blue-600 hover:text-white transition-all'
              >
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Doctors;
