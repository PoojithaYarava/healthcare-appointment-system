import React, { useCallback, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/appContextInstance';

const MyAppointments = () => {
  const navigate = useNavigate();
  const { backendUrl, authHeaders, currencySymbol, token, authRole } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const [labBookings, setLabBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadAppointments = useCallback(async () => {
    if (!token || authRole !== 'user') {
      setAppointments([]);
      return;
    }

    try {
      setIsLoading(true);
      const requestConfig = { headers: authHeaders() };
      const [appointmentResponse, labBookingResponse] = await Promise.all([
        axios.get(`${backendUrl}/api/appointment/my-appointments`, requestConfig),
        axios.get(`${backendUrl}/api/lab-tests/my-bookings`, requestConfig)
      ]);

      if (appointmentResponse.data.success) {
        setAppointments(appointmentResponse.data.appointments);
      } else {
        toast.error(appointmentResponse.data.message);
      }

      if (labBookingResponse.data.success) {
        setLabBookings(labBookingResponse.data.bookings);
      } else {
        toast.error(labBookingResponse.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to load appointments');
    } finally {
      setIsLoading(false);
    }
  }, [authHeaders, authRole, backendUrl, token]);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  if (!token) {
    return <div className='py-16 text-center text-gray-500'>Please log in to view your appointments.</div>;
  }

  if (authRole === 'doctor') {
    return <div className='py-16 text-center text-gray-500'>Doctor accounts can review requests from the doctor dashboard.</div>;
  }

  if (isLoading) {
    return <div className='py-16 text-center text-gray-500'>Loading appointments...</div>;
  }

  return (
    <div className='p-5'>
      <h1 className='text-2xl font-bold text-indigo-900 border-b pb-4'>My Bookings</h1>
      <div className='mt-5'>
        {!appointments.length && !labBookings.length && (
          <p className='text-gray-500'>You do not have any appointments or lab test bookings yet.</p>
        )}

        {appointments.map((item) => (
          <div key={item._id} className='flex gap-6 border-b py-4 items-center'>
            <img className='w-24 rounded-lg bg-indigo-50 object-cover' src={item.docData?.image} alt={item.docData?.name} />
            <div className='flex-1'>
              <p className='font-bold text-indigo-900'>{item.docData?.name}</p>
              <p className='text-emerald-600 text-sm'>{item.docData?.speciality}</p>
              <p className='text-xs text-gray-500 mt-2'>Date: {item.slotDate} | Time: {item.slotTime}</p>
              <p className='text-xs text-gray-500 mt-1'>Amount: {currencySymbol}{item.amount}</p>
              <p className='text-xs text-gray-500 mt-1'>
                Status: {item.cancelled ? 'Cancelled' : item.isCompleted ? 'Confirmed by doctor' : item.doctorApproved ? 'Approved by doctor' : 'Pending doctor approval'}
              </p>
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
                {item.cancelled ? 'Cancelled' : item.isCompleted ? 'Completed' : item.doctorApproved ? 'Approved' : 'Awaiting Approval'}
              </button>
            </div>
          </div>
        ))}

        {!!labBookings.length && (
          <div className='mt-10'>
            <h2 className='text-xl font-semibold text-rose-600'>Lab Tests with Home Sample Collection</h2>
            <div className='mt-4 space-y-4'>
              {labBookings.map((item) => (
                <div key={item._id} className='flex gap-6 border-b py-4 items-start'>
                  <div className='flex h-24 w-24 items-center justify-center rounded-2xl bg-rose-50 text-3xl'>🧪</div>
                  <div className='flex-1'>
                    <p className='font-bold text-slate-900'>{item.testData?.name}</p>
                    <p className='text-rose-600 text-sm'>{item.testData?.category}</p>
                    <p className='text-xs text-gray-500 mt-2'>Home sample date: {item.preferredDate} | Time: {item.preferredTime}</p>
                    <p className='text-xs text-gray-500 mt-1'>Address: {item.address?.line1}{item.address?.line2 ? `, ${item.address.line2}` : ''}</p>
                    <p className='text-xs text-gray-500 mt-1'>Patient: {item.patientName}{item.patientAge ? `, ${item.patientAge}` : ''}{item.gender ? `, ${item.gender}` : ''}</p>
                    {item.landmark && <p className='text-xs text-gray-500 mt-1'>Landmark: {item.landmark}</p>}
                    {item.collectionInstructions && <p className='text-xs text-gray-500 mt-1'>Collection notes: {item.collectionInstructions}</p>}
                    <p className='text-xs text-gray-500 mt-1'>Amount: {currencySymbol}{item.amount}</p>
                    <p className='text-xs text-gray-500 mt-1'>Status: {item.status}</p>
                  </div>
                  <div className='min-w-[170px]'>
                    <button className='w-full border border-rose-200 bg-rose-50 px-4 py-2 rounded-lg text-sm text-rose-700' disabled>
                      {item.status === 'requested' ? 'Pickup Requested' : item.status}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAppointments;
