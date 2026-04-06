import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContext } from '../context/appContextInstance';

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'approved', label: 'Approved' },
  { key: 'completed', label: 'Completed' }
];

const DoctorAppointments = () => {
  const { backendUrl, authHeaders, token, authRole, doctorData, currencySymbol } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeAction, setActiveAction] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const loadAppointments = useCallback(async () => {
    if (!token || authRole !== 'doctor') {
      setAppointments([]);
      return;
    }

    try {
      setIsLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/doctor/appointments`, {
        headers: authHeaders()
      });

      if (data.success) {
        setAppointments(data.appointments);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to load doctor appointments');
    } finally {
      setIsLoading(false);
    }
  }, [authHeaders, authRole, backendUrl, token]);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  const stats = useMemo(() => ({
    pending: appointments.filter((item) => !item.cancelled && !item.doctorApproved).length,
    approved: appointments.filter((item) => item.doctorApproved && !item.isCompleted && !item.cancelled).length,
    completed: appointments.filter((item) => item.isCompleted).length
  }), [appointments]);

  const filteredAppointments = useMemo(() => {
    if (activeFilter === 'pending') {
      return appointments.filter((item) => !item.cancelled && !item.doctorApproved);
    }

    if (activeFilter === 'approved') {
      return appointments.filter((item) => item.doctorApproved && !item.isCompleted && !item.cancelled);
    }

    if (activeFilter === 'completed') {
      return appointments.filter((item) => item.isCompleted);
    }

    return appointments;
  }, [activeFilter, appointments]);

  const updateStatus = async (appointmentId, action) => {
    try {
      setActiveAction(`${appointmentId}-${action}`);
      const { data } = await axios.post(
        `${backendUrl}/api/doctor/appointments/update-status`,
        { appointmentId, action },
        { headers: authHeaders() }
      );

      if (data.success) {
        toast.success(data.message);
        setAppointments((current) => current.map((item) => (
          item._id === appointmentId ? data.appointment : item
        )));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to update appointment');
    } finally {
      setActiveAction('');
    }
  };

  if (!token || authRole !== 'doctor') {
    return <div className='py-16 text-center text-gray-500'>Please log in with a doctor account to manage appointments.</div>;
  }

  return (
    <div className='space-y-6 px-5 pb-6'>
      <div className='rounded-[2rem] bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-400 px-6 py-8 text-white shadow-lg'>
        <div className='flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between'>
          <div>
            <p className='text-sm uppercase tracking-[0.25em] text-emerald-100'>Doctor Portal</p>
            <h1 className='mt-3 text-3xl font-bold sm:text-4xl'>{doctorData?.name || 'Your Appointment Queue'}</h1>
            <div className='mt-4 flex flex-wrap gap-3 text-sm text-emerald-50'>
              <span className='rounded-full bg-white/15 px-4 py-2'>{doctorData?.speciality || 'Speciality not set'}</span>
              <span className='rounded-full bg-white/15 px-4 py-2'>{doctorData?.experience || 'Experience not set'}</span>
              <span className='rounded-full bg-white/15 px-4 py-2'>
                {doctorData?.hospitalId?.name || 'Independent practice'}
              </span>
            </div>
            <p className='mt-4 max-w-3xl text-sm text-emerald-50'>
              Review new requests, approve visit slots, and confirm completed consultations with a single workflow.
            </p>
          </div>

          <div className='rounded-2xl bg-white/10 px-5 py-4 backdrop-blur-sm'>
            <p className='text-xs uppercase tracking-[0.2em] text-emerald-100'>Consultation Fee</p>
            <p className='mt-2 text-3xl font-bold'>{currencySymbol}{doctorData?.fees || 0}</p>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
        <button type='button' onClick={() => setActiveFilter('pending')} className={`rounded-2xl border p-5 text-left transition-all ${activeFilter === 'pending' ? 'border-amber-400 bg-amber-50 shadow-sm' : 'border-amber-200 bg-amber-50/70'}`}>
          <p className='text-sm text-amber-700'>Pending Approval</p>
          <p className='mt-2 text-3xl font-bold text-amber-900'>{stats.pending}</p>
        </button>
        <button type='button' onClick={() => setActiveFilter('approved')} className={`rounded-2xl border p-5 text-left transition-all ${activeFilter === 'approved' ? 'border-blue-400 bg-blue-50 shadow-sm' : 'border-blue-200 bg-blue-50/70'}`}>
          <p className='text-sm text-blue-700'>Approved</p>
          <p className='mt-2 text-3xl font-bold text-blue-900'>{stats.approved}</p>
        </button>
        <button type='button' onClick={() => setActiveFilter('completed')} className={`rounded-2xl border p-5 text-left transition-all ${activeFilter === 'completed' ? 'border-emerald-400 bg-emerald-50 shadow-sm' : 'border-emerald-200 bg-emerald-50/70'}`}>
          <p className='text-sm text-emerald-700'>Completed</p>
          <p className='mt-2 text-3xl font-bold text-emerald-900'>{stats.completed}</p>
        </button>
      </div>

      <div className='rounded-3xl border border-slate-200 bg-white p-5 shadow-sm'>
        <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
          <div>
            <h2 className='text-xl font-semibold text-slate-900'>Appointment Queue</h2>
            <p className='mt-1 text-sm text-slate-500'>Keep track of pending approvals, approved visits, and completed consultations.</p>
          </div>

          <div className='flex flex-wrap gap-2'>
            {FILTERS.map((filter) => (
              <button
                key={filter.key}
                type='button'
                onClick={() => setActiveFilter(filter.key)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${activeFilter === filter.key ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                {filter.label}
              </button>
            ))}
            <button
              type='button'
              onClick={loadAppointments}
              className='rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50'
            >
              Refresh
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className='mt-6 space-y-4'>
            {[1, 2].map((item) => (
              <div key={item} className='animate-pulse rounded-2xl border border-slate-200 bg-slate-50 p-5'>
                <div className='h-6 w-40 rounded bg-slate-200' />
                <div className='mt-4 h-4 w-60 rounded bg-slate-200' />
                <div className='mt-2 h-4 w-52 rounded bg-slate-200' />
                <div className='mt-5 flex gap-3'>
                  <div className='h-11 w-40 rounded-xl bg-slate-200' />
                  <div className='h-11 w-40 rounded-xl bg-slate-200' />
                </div>
              </div>
            ))}
          </div>
        ) : !filteredAppointments.length ? (
          <div className='mt-6 rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-14 text-center'>
            <p className='text-xl font-semibold text-slate-800'>
              {appointments.length ? 'No appointments match this view yet.' : 'No appointment requests have been assigned yet.'}
            </p>
            <p className='mt-3 text-sm text-slate-500'>
              {appointments.length
                ? 'Try another filter or refresh the queue after new updates.'
                : 'Once patients book with you, new requests will appear here for approval and confirmation.'}
            </p>
            <div className='mt-6 flex flex-wrap justify-center gap-3'>
              <button
                type='button'
                onClick={() => setActiveFilter('all')}
                className='rounded-full bg-emerald-600 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-emerald-700'
              >
                View All Appointments
              </button>
              <button
                type='button'
                onClick={loadAppointments}
                className='rounded-full border border-slate-300 px-5 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-white'
              >
                Refresh Queue
              </button>
            </div>
          </div>
        ) : (
          <div className='mt-6 space-y-4'>
            {filteredAppointments.map((item) => (
              <div key={item._id} className='rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md'>
                <div className='flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between'>
                  <div className='space-y-2'>
                    <div className='flex flex-wrap items-center gap-3'>
                      <p className='text-xl font-semibold text-slate-900'>{item.userData?.name}</p>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        item.cancelled
                          ? 'bg-rose-100 text-rose-700'
                          : item.isCompleted
                            ? 'bg-emerald-100 text-emerald-700'
                            : item.doctorApproved
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-amber-100 text-amber-700'
                      }`}>
                        {item.cancelled ? 'Cancelled' : item.isCompleted ? 'Confirmed' : item.doctorApproved ? 'Approved' : 'Pending Approval'}
                      </span>
                    </div>
                    <p className='text-sm text-gray-600'>Date: {item.slotDate} at {item.slotTime}</p>
                    <p className='text-sm text-gray-600'>Patient email: {item.userData?.email || 'Not provided'}</p>
                    <p className='text-sm text-gray-600'>Patient phone: {item.userData?.phone || 'Not provided'}</p>
                    <p className='text-sm text-gray-600'>Fee: {currencySymbol}{item.amount}</p>
                    <p className='text-sm text-gray-600'>Payment: {item.payment ? 'Received' : 'Pending'}</p>
                  </div>

                  <div className='flex flex-col gap-3 min-w-[220px]'>
                    <button
                      type='button'
                      disabled={item.cancelled || item.doctorApproved || activeAction === `${item._id}-approve`}
                      onClick={() => updateStatus(item._id, 'approve')}
                      className='rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-200'
                    >
                      {activeAction === `${item._id}-approve` ? 'Approving...' : item.doctorApproved ? 'Approved' : 'Approve Appointment'}
                    </button>
                    <button
                      type='button'
                      disabled={item.cancelled || item.isCompleted || !item.doctorApproved || activeAction === `${item._id}-confirm`}
                      onClick={() => updateStatus(item._id, 'confirm')}
                      className='rounded-xl bg-emerald-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-200'
                    >
                      {activeAction === `${item._id}-confirm` ? 'Confirming...' : item.isCompleted ? 'Confirmed' : 'Confirm Appointment'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorAppointments;
