// src/pages/Hospitals.jsx
import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import HospitalCard from '../components/HospitalCard';

const Hospitals = () => {
  const { hospitals } = useContext(AppContext);

  return (
    <div className='p-8 max-w-6xl mx-auto'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-800'>Partner Hospitals</h1>
        <p className='text-gray-500 mt-2'>Trusted healthcare facilities part of the MediConnect network.</p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
        {hospitals.map((item, index) => (
          <HospitalCard 
            key={index} 
            name={item.name} 
            address={item.location} 
            image={item.image} 
          />
        ))}
      </div>
    </div>
  );
};

export default Hospitals;