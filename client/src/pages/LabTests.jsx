import React, { useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/appContextInstance';

const initialBookingForm = {
  patientName: '',
  patientAge: '',
  gender: 'Female',
  phone: '',
  alternatePhone: '',
  addressLine1: '',
  addressLine2: '',
  landmark: '',
  preferredDate: '',
  preferredTime: '08:00 AM - 10:00 AM',
  notes: '',
  collectionInstructions: ''
};

const LabTests = () => {
  const navigate = useNavigate();
  const {
    labTests,
    currencySymbol,
    loadLabTests,
    token,
    authRole,
    userData,
    backendUrl,
    authHeaders
  } = useContext(AppContext);

  const [selectedCategory, setSelectedCategory] = useState('All Tests');
  const [selectedTest, setSelectedTest] = useState(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingForm, setBookingForm] = useState(initialBookingForm);

  useEffect(() => {
    loadLabTests();
  }, [loadLabTests]);

  useEffect(() => {
    if (userData) {
      setBookingForm((prev) => ({
        ...prev,
        patientName: prev.patientName || userData.name || '',
        phone: prev.phone || userData.phone || '',
        addressLine1: prev.addressLine1 || userData.address?.line1 || '',
        addressLine2: prev.addressLine2 || userData.address?.line2 || ''
      }));
    }
  }, [userData]);

  const categories = useMemo(() => (
    ['All Tests', ...new Set(labTests.map((test) => test.category))]
  ), [labTests]);

  const filteredTests = useMemo(() => (
    selectedCategory === 'All Tests'
      ? labTests
      : labTests.filter((test) => test.category === selectedCategory)
  ), [labTests, selectedCategory]);

  const minDate = useMemo(() => new Date().toISOString().split('T')[0], []);

  const openBooking = (test) => {
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

    setSelectedTest(test);
    setIsBookingOpen(true);
  };

  const closeBooking = () => {
    setIsBookingOpen(false);
    setSelectedTest(null);
  };

  const handleBooking = async (event) => {
    event.preventDefault();

    if (!selectedTest) {
      toast.error('Please choose a lab test first');
      return;
    }

    try {
      setIsSubmitting(true);
      const { data } = await axios.post(`${backendUrl}/api/lab-tests/book`, {
        testId: selectedTest._id,
        ...bookingForm
      }, {
        headers: authHeaders()
      });

      if (data.success) {
        toast.success(data.message);
        setBookingForm((prev) => ({
          ...initialBookingForm,
          patientName: prev.patientName,
          phone: prev.phone,
          addressLine1: prev.addressLine1,
          addressLine2: prev.addressLine2
        }));
        closeBooking();
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

  return (
    <div className='mx-auto max-w-7xl px-4 py-4'>
      <div className='rounded-[2rem] bg-gradient-to-r from-rose-50 via-white to-sky-50 px-6 py-10 shadow-sm'>
        <p className='text-sm font-semibold uppercase tracking-[0.25em] text-rose-500'>At-home diagnostics</p>
        <h1 className='mt-3 text-4xl font-bold text-slate-900'>Book lab tests with home sample collection</h1>
        <p className='mt-3 max-w-3xl text-sm text-slate-600'>
          Select a test type, review the available tests, and schedule a home sample pickup with patient and collection details.
        </p>
      </div>

      <div className='mt-6 grid grid-cols-1 gap-4 md:grid-cols-3'>
        <div className='rounded-3xl border border-rose-100 bg-rose-50 p-5'>
          <p className='text-sm text-rose-600'>Available tests</p>
          <p className='mt-2 text-3xl font-bold text-slate-900'>{labTests.length}</p>
        </div>
        <div className='rounded-3xl border border-emerald-100 bg-emerald-50 p-5'>
          <p className='text-sm text-emerald-600'>Collection type</p>
          <p className='mt-2 text-xl font-semibold text-slate-900'>Home sample pickup</p>
        </div>
        <div className='rounded-3xl border border-sky-100 bg-sky-50 p-5'>
          <p className='text-sm text-sky-600'>Selected type</p>
          <p className='mt-2 text-xl font-semibold text-slate-900'>{selectedCategory}</p>
        </div>
      </div>

      <div className='mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm'>
        <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
          <div>
            <h2 className='text-2xl font-semibold text-slate-900'>Choose lab test type</h2>
            <p className='mt-1 text-sm text-slate-500'>Use `All Tests` to browse everything, or narrow the list by category.</p>
          </div>
          <button
            type='button'
            onClick={loadLabTests}
            className='rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50'
          >
            Refresh tests
          </button>
        </div>

        <div className='mt-5 flex flex-wrap gap-3'>
          {categories.map((category) => (
            <button
              key={category}
              type='button'
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${selectedCategory === category ? 'bg-slate-900 text-white' : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'}`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {!labTests.length ? (
        <div className='mt-8 rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center text-slate-500'>
          No lab tests are available right now. Try `Refresh tests`, restart the backend, or add tests from the admin portal.
        </div>
      ) : !filteredTests.length ? (
        <div className='mt-8 rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center text-slate-500'>
          No tests found in this category. Choose `All Tests` to see the full list.
        </div>
      ) : (
        <div className='mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3'>
          {filteredTests.map((test) => (
            <div key={test._id} className='overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-transform hover:-translate-y-1'>
              <div className='h-44 bg-gradient-to-br from-rose-100 via-white to-sky-100'>
                {test.image ? (
                  <img src={test.image} alt={test.name} className='h-full w-full object-cover' />
                ) : (
                  <div className='flex h-full items-center justify-center text-2xl font-semibold text-rose-500'>LAB</div>
                )}
              </div>
              <div className='p-6'>
                <div className='flex items-start justify-between gap-3'>
                  <div>
                    <p className='text-xs font-semibold uppercase tracking-[0.2em] text-rose-500'>{test.category}</p>
                    <h2 className='mt-2 text-xl font-semibold text-slate-900'>{test.name}</h2>
                  </div>
                  <div className='rounded-2xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white'>
                    {currencySymbol}{test.price}
                  </div>
                </div>
                <p className='mt-3 text-sm text-slate-600'>{test.description}</p>
                <div className='mt-4 grid grid-cols-2 gap-3 text-sm text-slate-600'>
                  <div className='rounded-2xl bg-slate-50 px-4 py-3'>
                    <p className='text-xs uppercase tracking-[0.15em] text-slate-400'>Sample</p>
                    <p className='mt-1 font-medium text-slate-800'>{test.sampleType}</p>
                  </div>
                  <div className='rounded-2xl bg-slate-50 px-4 py-3'>
                    <p className='text-xs uppercase tracking-[0.15em] text-slate-400'>Reports</p>
                    <p className='mt-1 font-medium text-slate-800'>{test.reportTime}</p>
                  </div>
                </div>
                <button
                  type='button'
                  onClick={() => openBooking(test)}
                  className='mt-5 w-full rounded-2xl bg-rose-500 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-rose-600'
                >
                  Book test and home sample collection
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isBookingOpen && selectedTest && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 py-8'>
          <div className='max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-[2rem] bg-white p-6 shadow-2xl'>
            <div className='flex items-start justify-between gap-4'>
              <div>
                <p className='text-xs font-semibold uppercase tracking-[0.25em] text-rose-500'>Sample collection details</p>
                <h2 className='mt-2 text-3xl font-bold text-slate-900'>{selectedTest.name}</h2>
                <p className='mt-2 text-sm text-slate-500'>
                  Enter patient and pickup details so the home sample collection team can visit the correct address.
                </p>
              </div>
              <button
                type='button'
                onClick={closeBooking}
                className='rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50'
              >
                Close
              </button>
            </div>

            <div className='mt-5 rounded-3xl bg-slate-50 p-5'>
              <div className='flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
                <div>
                  <p className='text-sm text-slate-500'>Selected test</p>
                  <p className='text-xl font-semibold text-slate-900'>{selectedTest.name}</p>
                </div>
                <div className='rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white'>
                  {currencySymbol}{selectedTest.price}
                </div>
              </div>
              <div className='mt-4 grid grid-cols-1 gap-3 md:grid-cols-3 text-sm text-slate-600'>
                <div className='rounded-2xl bg-white px-4 py-3'>
                  <p className='text-xs uppercase tracking-[0.15em] text-slate-400'>Type</p>
                  <p className='mt-1 font-medium text-slate-800'>{selectedTest.category}</p>
                </div>
                <div className='rounded-2xl bg-white px-4 py-3'>
                  <p className='text-xs uppercase tracking-[0.15em] text-slate-400'>Sample</p>
                  <p className='mt-1 font-medium text-slate-800'>{selectedTest.sampleType}</p>
                </div>
                <div className='rounded-2xl bg-white px-4 py-3'>
                  <p className='text-xs uppercase tracking-[0.15em] text-slate-400'>Report</p>
                  <p className='mt-1 font-medium text-slate-800'>{selectedTest.reportTime}</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleBooking} className='mt-6 grid grid-cols-1 gap-4 md:grid-cols-2'>
              <input className='w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-rose-400' placeholder='Patient name' value={bookingForm.patientName} onChange={(e) => setBookingForm((prev) => ({ ...prev, patientName: e.target.value }))} required />
              <input className='w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-rose-400' placeholder='Patient age' value={bookingForm.patientAge} onChange={(e) => setBookingForm((prev) => ({ ...prev, patientAge: e.target.value }))} required />
              <select className='w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-rose-400' value={bookingForm.gender} onChange={(e) => setBookingForm((prev) => ({ ...prev, gender: e.target.value }))} required>
                <option value='Female'>Female</option>
                <option value='Male'>Male</option>
                <option value='Other'>Other</option>
              </select>
              <input className='w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-rose-400' placeholder='Primary phone number' value={bookingForm.phone} onChange={(e) => setBookingForm((prev) => ({ ...prev, phone: e.target.value }))} required />
              <input className='w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-rose-400 md:col-span-2' placeholder='Address line 1' value={bookingForm.addressLine1} onChange={(e) => setBookingForm((prev) => ({ ...prev, addressLine1: e.target.value }))} required />
              <input className='w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-rose-400' placeholder='Address line 2' value={bookingForm.addressLine2} onChange={(e) => setBookingForm((prev) => ({ ...prev, addressLine2: e.target.value }))} />
              <input className='w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-rose-400' placeholder='Landmark' value={bookingForm.landmark} onChange={(e) => setBookingForm((prev) => ({ ...prev, landmark: e.target.value }))} />
              <input className='w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-rose-400' placeholder='Alternate phone number' value={bookingForm.alternatePhone} onChange={(e) => setBookingForm((prev) => ({ ...prev, alternatePhone: e.target.value }))} />
              <input className='w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-rose-400' type='date' min={minDate} value={bookingForm.preferredDate} onChange={(e) => setBookingForm((prev) => ({ ...prev, preferredDate: e.target.value }))} required />
              <select className='w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-rose-400' value={bookingForm.preferredTime} onChange={(e) => setBookingForm((prev) => ({ ...prev, preferredTime: e.target.value }))}>
                <option>08:00 AM - 10:00 AM</option>
                <option>10:00 AM - 12:00 PM</option>
                <option>12:00 PM - 02:00 PM</option>
                <option>02:00 PM - 04:00 PM</option>
                <option>04:00 PM - 06:00 PM</option>
              </select>
              <textarea className='min-h-24 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-rose-400 md:col-span-2' placeholder='Special notes for the patient or test' value={bookingForm.notes} onChange={(e) => setBookingForm((prev) => ({ ...prev, notes: e.target.value }))} />
              <textarea className='min-h-24 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-rose-400 md:col-span-2' placeholder='Collection instructions for the sample team (fasting, entry guidance, floor number, etc.)' value={bookingForm.collectionInstructions} onChange={(e) => setBookingForm((prev) => ({ ...prev, collectionInstructions: e.target.value }))} />

              <div className='md:col-span-2 flex flex-col gap-3 sm:flex-row sm:justify-end'>
                <button
                  type='button'
                  onClick={closeBooking}
                  className='rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  disabled={isSubmitting}
                  className='rounded-2xl bg-rose-500 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-rose-600 disabled:bg-rose-300'
                >
                  {isSubmitting ? 'Booking sample pickup...' : 'Confirm test and home sample collection'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LabTests;
