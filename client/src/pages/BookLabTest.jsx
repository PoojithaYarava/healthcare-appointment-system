import React, { useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/appContextInstance';

const BookLabTest = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const { backendUrl, authHeaders, currencySymbol, token, authRole, userData } = useContext(AppContext);
  const [labTest, setLabTest] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    patientName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    preferredDate: '',
    preferredTime: '08:00 AM - 10:00 AM',
    notes: ''
  });

  useEffect(() => {
    const loadLabTest = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/data/lab-tests/${testId}`);
        if (data.success) {
          setLabTest(data.labTest);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Unable to load lab test');
      }
    };

    loadLabTest();
  }, [backendUrl, testId]);

  useEffect(() => {
    if (userData) {
      setFormData((prev) => ({
        ...prev,
        patientName: prev.patientName || userData.name || '',
        phone: prev.phone || userData.phone || '',
        addressLine1: prev.addressLine1 || userData.address?.line1 || '',
        addressLine2: prev.addressLine2 || userData.address?.line2 || ''
      }));
    }
  }, [userData]);

  const minDate = useMemo(() => new Date().toISOString().split('T')[0], []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!token) {
      toast.info('Please log in as a patient to book lab tests');
      navigate('/login');
      return;
    }

    if (authRole !== 'user') {
      toast.info('Lab tests can be booked from a patient account only');
      navigate(authRole === 'doctor' ? '/doctor/appointments' : '/admin');
      return;
    }

    try {
      setIsSubmitting(true);
      const { data } = await axios.post(`${backendUrl}/api/lab-tests/book`, {
        testId,
        ...formData
      }, {
        headers: authHeaders()
      });

      if (data.success) {
        toast.success(data.message);
        navigate('/my-appointments');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to book lab test');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!labTest) {
    return <div className='py-16 text-center text-slate-500'>Loading lab test details...</div>;
  }

  return (
    <div className='mx-auto grid max-w-6xl gap-6 px-4 py-4 lg:grid-cols-[0.9fr_1.1fr]'>
      <div className='rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm'>
        <div className='rounded-[1.5rem] bg-gradient-to-br from-rose-100 via-white to-sky-100 p-6'>
          <p className='text-xs font-semibold uppercase tracking-[0.25em] text-rose-500'>{labTest.category}</p>
          <h1 className='mt-3 text-3xl font-bold text-slate-900'>{labTest.name}</h1>
          <p className='mt-3 text-sm text-slate-600'>{labTest.description}</p>
        </div>

        <div className='mt-5 space-y-3 text-sm text-slate-600'>
          <div className='flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3'>
            <span>Sample type</span>
            <span className='font-semibold text-slate-900'>{labTest.sampleType}</span>
          </div>
          <div className='flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3'>
            <span>Report time</span>
            <span className='font-semibold text-slate-900'>{labTest.reportTime}</span>
          </div>
          <div className='flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3'>
            <span>Collection</span>
            <span className='font-semibold text-emerald-700'>Home sample pickup</span>
          </div>
          <div className='flex items-center justify-between rounded-2xl bg-slate-900 px-4 py-3 text-white'>
            <span>Total price</span>
            <span className='text-lg font-semibold'>{currencySymbol}{labTest.price}</span>
          </div>
        </div>

        {labTest.preparations && (
          <div className='mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-900'>
            <p className='font-semibold'>Preparation notes</p>
            <p className='mt-2'>{labTest.preparations}</p>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className='rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm'>
        <p className='text-xs font-semibold uppercase tracking-[0.25em] text-slate-400'>Book test</p>
        <h2 className='mt-3 text-3xl font-bold text-slate-900'>Schedule home sample collection</h2>
        <p className='mt-2 text-sm text-slate-500'>Enter the patient and pickup details. Our team can visit the home address you provide.</p>

        <div className='mt-6 grid grid-cols-1 gap-4 md:grid-cols-2'>
          <input className='w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-rose-400' placeholder='Patient name' value={formData.patientName} onChange={(e) => setFormData((prev) => ({ ...prev, patientName: e.target.value }))} required />
          <input className='w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-rose-400' placeholder='Phone number' value={formData.phone} onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))} required />
          <input className='w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-rose-400 md:col-span-2' placeholder='Address line 1' value={formData.addressLine1} onChange={(e) => setFormData((prev) => ({ ...prev, addressLine1: e.target.value }))} required />
          <input className='w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-rose-400 md:col-span-2' placeholder='Address line 2' value={formData.addressLine2} onChange={(e) => setFormData((prev) => ({ ...prev, addressLine2: e.target.value }))} />
          <input className='w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-rose-400' type='date' min={minDate} value={formData.preferredDate} onChange={(e) => setFormData((prev) => ({ ...prev, preferredDate: e.target.value }))} required />
          <select className='w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-rose-400' value={formData.preferredTime} onChange={(e) => setFormData((prev) => ({ ...prev, preferredTime: e.target.value }))}>
            <option>08:00 AM - 10:00 AM</option>
            <option>10:00 AM - 12:00 PM</option>
            <option>12:00 PM - 02:00 PM</option>
            <option>02:00 PM - 04:00 PM</option>
            <option>04:00 PM - 06:00 PM</option>
          </select>
          <textarea className='min-h-28 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-rose-400 md:col-span-2' placeholder='Special instructions for the collection team' value={formData.notes} onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))} />
        </div>

        <button type='submit' disabled={isSubmitting} className='mt-6 w-full rounded-2xl bg-rose-500 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-rose-600 disabled:bg-rose-300'>
          {isSubmitting ? 'Scheduling pickup...' : 'Confirm home sample booking'}
        </button>
      </form>
    </div>
  );
};

export default BookLabTest;
