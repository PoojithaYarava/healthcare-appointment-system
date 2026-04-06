// src/pages/Hospitals.jsx
import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import HospitalCard from '../components/HospitalCard';

const Hospitals = () => {
  const { hospitals, isDataLoading } = useContext(AppContext);

  if (isDataLoading && !hospitals.length) {
    return <div className='py-16 text-center text-gray-500'>Loading hospitals...</div>;
  }

  return (
    <div className='p-8 max-w-6xl mx-auto'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-800'>Partner Hospitals</h1>
        <p className='mt-2 text-gray-500'>Trusted healthcare facilities part of the MediConnect network.</p>
      </div>

      {!hospitals.length && (
        <p className='mb-6 text-gray-500'>No hospitals are available yet. Seed your Atlas database or add hospitals manually.</p>
      )}

      <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
        {hospitals.map((item, index) => (
          <HospitalCard 
            key={item._id || index} 
            id={item._id}
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
