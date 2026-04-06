import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { useLocation, useNavigate } from 'react-router-dom';

const Doctors = () => {
  const { doctors, hospitals, isDataLoading } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();
  const hospitalId = new URLSearchParams(location.search).get('hospital');
  const selectedHospital = hospitals.find((hospital) => hospital._id === hospitalId);
  const visibleDoctors = hospitalId
    ? doctors.filter((doctor) => {
        const doctorHospitalId = typeof doctor.hospitalId === 'object' ? doctor.hospitalId?._id : doctor.hospitalId;
        return doctorHospitalId === hospitalId;
      })
    : doctors;

  if (isDataLoading && !doctors.length) {
    return <div className='py-16 text-center text-gray-500'>Loading doctors...</div>;
  }

  return (
    <div className='p-4 max-w-6xl mx-auto'>
      <h1 className='mb-2 text-2xl font-semibold text-gray-800'>
        {selectedHospital ? `${selectedHospital.name} Specialists` : 'Find your Specialist at MediConnect'}
      </h1>
      {selectedHospital && (
        <p className='mb-6 text-gray-500'>Showing doctors associated with {selectedHospital.name}.</p>
      )}
      {!visibleDoctors.length && !doctors.length && (
        <p className='mb-6 text-gray-500'>No doctors are available yet. Seed your Atlas database or add doctors from the admin flow.</p>
      )}
      {!visibleDoctors.length && !!doctors.length && hospitalId && (
        <p className='mb-6 text-gray-500'>No doctors are linked to this hospital yet.</p>
      )}
      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
        {visibleDoctors.map((item, index) => (
          <div key={item._id || index} className='overflow-hidden rounded-xl border border-blue-100 shadow-sm transition-all duration-500 hover:translate-y-[-10px]'>
            <img className='bg-blue-50 w-full h-48 object-cover' src={item.image} alt="" />
            <div className='p-4'>
              <div className={`flex items-center gap-2 text-sm ${item.available ? 'text-green-500' : 'text-red-500'}`}>
                <p className={`w-2 h-2 rounded-full ${item.available ? 'bg-green-500' : 'bg-red-500'}`}></p>
                <p>{item.available ? 'Available' : 'Unavailable'}</p>
              </div>
              <p className='text-lg font-medium text-gray-900'>{item.name}</p>
              <p className='text-gray-600 text-sm'>{item.speciality}</p>
              <button 
                onClick={() => navigate(`/appointment/${item._id}`)}
                className='mt-3 min-h-[44px] w-full rounded-lg bg-blue-50 py-2 font-medium text-blue-600 transition-all hover:bg-blue-600 hover:text-white'
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
