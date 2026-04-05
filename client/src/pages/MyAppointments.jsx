import React, { useCallback, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const MyAppointments = () => {
  const navigate = useNavigate();
  const { backendUrl, authHeaders, currencySymbol, token } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadAppointments = useCallback(async () => {
    if (!token) {
      setAppointments([]);
      return;
    }

    try {
      setIsLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/appointment/my-appointments`, {
        headers: authHeaders()
      });

      if (data.success) {
        setAppointments(data.appointments);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to load appointments');
    } finally {
      setIsLoading(false);
    }
  }, [authHeaders, backendUrl, token]);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  if (!token) {
    return <div className='py-16 text-center text-gray-500'>Please log in to view your appointments.</div>;
  }

  if (isLoading) {
    return <div className='py-16 text-center text-gray-500'>Loading appointments...</div>;
  }

  return (
    <div className='p-5'>
      <h1 className='text-2xl font-bold text-indigo-900 border-b pb-4'>My Bookings</h1>
      <div className='mt-5'>
        {!appointments.length && (
          <p className='text-gray-500'>You do not have any appointments yet.</p>
        )}

        {appointments.map((item) => (
          <div key={item._id} className='flex gap-6 border-b py-4 items-center'>
            <img className='w-24 rounded-lg bg-indigo-50 object-cover' src={item.docData?.image} alt={item.docData?.name} />
            <div className='flex-1'>
              <p className='font-bold text-indigo-900'>{item.docData?.name}</p>
              <p className='text-emerald-600 text-sm'>{item.docData?.speciality}</p>
              <p className='text-xs text-gray-500 mt-2'>Date: {item.slotDate} | Time: {item.slotTime}</p>
              <p className='text-xs text-gray-500 mt-1'>Amount: {currencySymbol}{item.amount}</p>
            </div>
            <div className='flex flex-col gap-2 min-w-[170px]'>
              {item.payment ? (
                <button className='bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm' disabled>
                  Payment Confirmed
                </button>
              ) : (
                <button
                  type='button'
                  onClick={() => navigate(`/payments/${item._id}`, { state: { appointment: item } })}
                  className='bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition-colors disabled:bg-indigo-300'
                >
                  Pay Now
                </button>
              )}

              <button className='border border-gray-200 text-gray-500 px-4 py-2 rounded-lg text-sm' disabled>
                {item.cancelled ? 'Cancelled' : item.isCompleted ? 'Completed' : 'Scheduled'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyAppointments;
