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
      <div className='mt-5 space-y-4'>
        {!appointments.length && !labBookings.length && (
          <p className='text-gray-500'>You do not have any appointments or lab test bookings yet.</p>
        )}

        {appointments.map((item) => (
          <div key={item._id} className='flex flex-col gap-4 border-b py-4 sm:flex-row sm:items-center sm:gap-6'>
            <img className='h-24 w-24 rounded-lg bg-indigo-50 object-cover' src={item.docData?.image} alt={item.docData?.name} />
            <div className='flex-1'>
              <p className='font-bold text-indigo-900'>{item.docData?.name}</p>
              <p className='text-sm text-emerald-600'>{item.docData?.speciality}</p>
              <p className='mt-2 text-xs text-gray-500'>Date: {item.slotDate} | Time: {item.slotTime}</p>
              <p className='mt-1 text-xs text-gray-500'>Amount: {currencySymbol}{item.amount}</p>
              <p className='mt-1 text-xs text-gray-500'>
                Status: {item.cancelled ? 'Cancelled' : item.isCompleted ? 'Confirmed by doctor' : item.doctorApproved ? 'Approved by doctor' : 'Pending doctor approval'}
              </p>
            </div>
            <div className='flex w-full flex-col gap-2 sm:w-auto sm:min-w-[150px]'>
              {item.payment ? (
                <button className='rounded-lg bg-emerald-500 px-3 py-2 text-sm text-white sm:w-[150px]' disabled>
                  Payment Confirmed
                </button>
              ) : (
                <button
                  type='button'
                  onClick={() => navigate(`/payments/${item._id}`, { state: { appointment: item } })}
                  className='rounded-lg bg-indigo-600 px-3 py-2 text-sm text-white transition-colors hover:bg-indigo-700 disabled:bg-indigo-300 sm:w-[150px]'
                >
                  Pay Now
                </button>
              )}

              <button className='rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-500 sm:w-[150px]' disabled>
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
                <div key={item._id} className='flex flex-col gap-4 border-b py-4 sm:flex-row sm:items-start sm:gap-6'>
                  <div className='flex h-24 w-24 items-center justify-center rounded-2xl bg-rose-50 text-xl font-semibold text-rose-600'>LAB</div>
                  <div className='flex-1'>
                    <p className='font-bold text-slate-900'>{item.testData?.name}</p>
                    <p className='text-sm text-rose-600'>{item.testData?.category}</p>
                    <p className='mt-2 text-xs text-gray-500'>Home sample date: {item.preferredDate} | Time: {item.preferredTime}</p>
                    <p className='mt-1 text-xs text-gray-500'>Address: {item.address?.line1}{item.address?.line2 ? `, ${item.address.line2}` : ''}</p>
                    <p className='mt-1 text-xs text-gray-500'>Patient: {item.patientName}{item.patientAge ? `, ${item.patientAge}` : ''}{item.gender ? `, ${item.gender}` : ''}</p>
                    {item.landmark && <p className='mt-1 text-xs text-gray-500'>Landmark: {item.landmark}</p>}
                    {item.collectionInstructions && <p className='mt-1 text-xs text-gray-500'>Collection notes: {item.collectionInstructions}</p>}
                    <p className='mt-1 text-xs text-gray-500'>Amount: {currencySymbol}{item.amount}</p>
                    <p className='mt-1 text-xs text-gray-500'>Status: {item.status}</p>
                  </div>
                  <div className='w-full sm:min-w-[170px]'>
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
