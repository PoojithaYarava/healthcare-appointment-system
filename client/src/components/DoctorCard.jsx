import React from 'react';
import { useNavigate } from 'react-router-dom';

const DoctorCard = ({ doctor }) => {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/book-appointment/${doctor._id}`)} 
      className='border border-indigo-100 rounded-2xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500 shadow-sm bg-white'
    >
      <img className='bg-indigo-50 w-full h-48 object-cover' src={doctor.image} alt={doctor.name} />
      <div className='p-4'>
        <div className='flex items-center gap-2 text-sm text-green-500 mb-2'>
          <p className='w-2 h-2 bg-green-500 rounded-full'></p><p>Available</p>
        </div>
        <p className='text-indigo-900 text-lg font-bold'>{doctor.name}</p>
        <p className='text-gray-500 text-sm'>{doctor.speciality}</p>
      </div>
    </div>
  );
};

export default DoctorCard;