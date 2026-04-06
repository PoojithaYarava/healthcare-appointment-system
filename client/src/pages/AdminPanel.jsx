import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Navigate } from 'react-router-dom';
import { AppContext } from '../context/appContextInstance';

const initialHospitalForm = {
  name: '',
  location: '',
  image: '',
  description: ''
};

const initialDoctorForm = {
  name: '',
  email: '',
  password: '',
  speciality: '',
  degree: '',
  experience: '',
  about: '',
  fees: '',
  addressLine1: '',
  addressLine2: '',
  hospitalId: ''
};

const AdminPanel = () => {
  const { backendUrl, currencySymbol, loadDoctors, loadHospitals, authHeaders, authRole, token, adminData } = useContext(AppContext);
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [allDoctors, setAllDoctors] = useState([]);
  const [allHospitals, setAllHospitals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionId, setActionId] = useState('');
  const [hospitalForm, setHospitalForm] = useState(initialHospitalForm);
  const [doctorForm, setDoctorForm] = useState(initialDoctorForm);
  const [doctorImage, setDoctorImage] = useState(null);
  const [isSubmittingHospital, setIsSubmittingHospital] = useState(false);
  const [isSubmittingDoctor, setIsSubmittingDoctor] = useState(false);

  const loadAdminData = useCallback(async () => {
    try {
      setIsLoading(true);
      const requestConfig = { headers: authHeaders() };
      const [pendingResponse, doctorsResponse, hospitalsResponse] = await Promise.all([
        axios.get(`${backendUrl}/api/admin/pending-doctors`, requestConfig),
        axios.get(`${backendUrl}/api/admin/doctors`, requestConfig),
        axios.get(`${backendUrl}/api/admin/hospitals`, requestConfig)
      ]);

      if (pendingResponse.data.success) {
        setPendingDoctors(pendingResponse.data.doctors);
      }

      if (doctorsResponse.data.success) {
        setAllDoctors(doctorsResponse.data.doctors);
      }

      if (hospitalsResponse.data.success) {
        setAllHospitals(hospitalsResponse.data.hospitals);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to load admin data');
    } finally {
      setIsLoading(false);
    }
  }, [authHeaders, backendUrl]);

  useEffect(() => {
    if (token && authRole === 'admin') {
      loadAdminData();
    }
  }, [authRole, loadAdminData, token]);

  const stats = useMemo(() => ({
    pending: pendingDoctors.length,
    approved: allDoctors.filter((doctor) => doctor.isApproved).length,
    hospitals: allHospitals.length
  }), [allDoctors, allHospitals.length, pendingDoctors.length]);

  const handleDoctorStatus = async (doctorId, action) => {
    try {
      setActionId(`${doctorId}-${action}`);
      const { data } = await axios.post(
        `${backendUrl}/api/admin/update-doctor-status`,
        { doctorId, action },
        { headers: authHeaders() }
      );

      if (data.success) {
        toast.success(data.message);
        await loadAdminData();
        await loadDoctors();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to update doctor status');
    } finally {
      setActionId('');
    }
  };

  const handleHospitalSubmit = async (event) => {
    event.preventDefault();
    try {
      setIsSubmittingHospital(true);
      const { data } = await axios.post(`${backendUrl}/api/admin/add-hospital`, hospitalForm, {
        headers: authHeaders()
      });

      if (data.success) {
        toast.success(data.message);
        setHospitalForm(initialHospitalForm);
        await loadAdminData();
        await loadHospitals();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to add hospital');
    } finally {
      setIsSubmittingHospital(false);
    }
  };

  const handleDoctorSubmit = async (event) => {
    event.preventDefault();

    if (!doctorImage) {
      toast.error('Doctor image is required');
      return;
    }

    try {
      setIsSubmittingDoctor(true);
      const formData = new FormData();
      formData.append('image', doctorImage);
      formData.append('name', doctorForm.name);
      formData.append('email', doctorForm.email);
      formData.append('password', doctorForm.password);
      formData.append('speciality', doctorForm.speciality);
      formData.append('degree', doctorForm.degree);
      formData.append('experience', doctorForm.experience);
      formData.append('about', doctorForm.about);
      formData.append('fees', doctorForm.fees);
      formData.append('hospitalId', doctorForm.hospitalId);
      formData.append('address', JSON.stringify({
        line1: doctorForm.addressLine1,
        line2: doctorForm.addressLine2
      }));

      const { data } = await axios.post(`${backendUrl}/api/admin/add-doctor`, formData, {
        headers: authHeaders()
      });

      if (data.success) {
        toast.success(data.message);
        setDoctorForm(initialDoctorForm);
        setDoctorImage(null);
        await loadAdminData();
        await loadDoctors();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to add doctor');
    } finally {
      setIsSubmittingDoctor(false);
    }
  };

  if (!token || authRole !== 'admin') {
    return <Navigate to='/admin/login' replace />;
  }

  return (
    <div className='mx-auto w-full max-w-7xl px-4 py-4'>
      <div className='rounded-[2rem] bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-700 px-6 py-8 text-white shadow-xl'>
        <p className='text-sm uppercase tracking-[0.25em] text-emerald-200'>Admin Console</p>
        <h1 className='mt-3 text-3xl font-bold sm:text-4xl'>Manage doctors, approvals, and hospitals</h1>
        <p className='mt-3 max-w-3xl text-sm text-slate-200'>
          Review pending doctor requests, approve or reject registrations, and directly add hospitals or approved doctors to the platform.
        </p>
        <p className='mt-4 text-sm text-emerald-100'>Signed in as {adminData?.email || 'Admin'}</p>
      </div>

      <div className='mt-6 grid grid-cols-1 gap-4 md:grid-cols-3'>
        <div className='rounded-2xl border border-amber-200 bg-amber-50 p-5'>
          <p className='text-sm text-amber-700'>Pending Approvals</p>
          <p className='mt-2 text-3xl font-bold text-amber-900'>{stats.pending}</p>
        </div>
        <div className='rounded-2xl border border-emerald-200 bg-emerald-50 p-5'>
          <p className='text-sm text-emerald-700'>Approved Doctors</p>
          <p className='mt-2 text-3xl font-bold text-emerald-900'>{stats.approved}</p>
        </div>
        <div className='rounded-2xl border border-sky-200 bg-sky-50 p-5'>
          <p className='text-sm text-sky-700'>Hospitals</p>
          <p className='mt-2 text-3xl font-bold text-sky-900'>{stats.hospitals}</p>
        </div>
      </div>

      <div className='mt-8 grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_0.9fr]'>
        <section className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm'>
          <div className='flex items-center justify-between gap-4'>
            <div>
              <h2 className='text-2xl font-semibold text-slate-900'>Pending Doctor Requests</h2>
              <p className='mt-1 text-sm text-slate-500'>Approve self-registered doctors before they can log in.</p>
            </div>
            <button
              type='button'
              onClick={loadAdminData}
              className='rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50'
            >
              Refresh
            </button>
          </div>

          {isLoading ? (
            <div className='mt-6 space-y-4'>
              {[1, 2].map((item) => (
                <div key={item} className='animate-pulse rounded-2xl border border-slate-200 bg-slate-50 p-5'>
                  <div className='h-5 w-40 rounded bg-slate-200' />
                  <div className='mt-3 h-4 w-72 rounded bg-slate-200' />
                  <div className='mt-5 flex gap-3'>
                    <div className='h-10 w-28 rounded-xl bg-slate-200' />
                    <div className='h-10 w-28 rounded-xl bg-slate-200' />
                  </div>
                </div>
              ))}
            </div>
          ) : !pendingDoctors.length ? (
            <div className='mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center text-slate-500'>
              No pending doctor requests right now.
            </div>
          ) : (
            <div className='mt-6 space-y-4'>
              {pendingDoctors.map((doctor) => (
                <div key={doctor._id} className='rounded-2xl border border-slate-200 bg-white p-5 shadow-sm'>
                  <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
                    <div>
                      <div className='flex flex-wrap items-center gap-3'>
                        <p className='text-xl font-semibold text-slate-900'>{doctor.name}</p>
                        <span className='rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700'>
                          Pending Approval
                        </span>
                      </div>
                      <p className='mt-2 text-sm text-slate-600'>{doctor.speciality} • {doctor.degree}</p>
                      <p className='mt-1 text-sm text-slate-600'>{doctor.email}</p>
                      <p className='mt-1 text-sm text-slate-600'>Experience: {doctor.experience}</p>
                      <p className='mt-1 text-sm text-slate-600'>Hospital: {doctor.hospitalId?.name || 'Independent practice'}</p>
                      <p className='mt-1 text-sm text-slate-600'>Fee: {currencySymbol}{doctor.fees}</p>
                    </div>

                    <div className='flex flex-col gap-3 min-w-[180px]'>
                      <button
                        type='button'
                        disabled={actionId === `${doctor._id}-approve`}
                        onClick={() => handleDoctorStatus(doctor._id, 'approve')}
                        className='rounded-xl bg-emerald-600 px-4 py-3 text-sm font-medium text-white hover:bg-emerald-700 disabled:bg-emerald-300'
                      >
                        {actionId === `${doctor._id}-approve` ? 'Approving...' : 'Approve'}
                      </button>
                      <button
                        type='button'
                        disabled={actionId === `${doctor._id}-reject`}
                        onClick={() => handleDoctorStatus(doctor._id, 'reject')}
                        className='rounded-xl bg-rose-600 px-4 py-3 text-sm font-medium text-white hover:bg-rose-700 disabled:bg-rose-300'
                      >
                        {actionId === `${doctor._id}-reject` ? 'Rejecting...' : 'Reject'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <div className='space-y-6'>
          <section className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm'>
            <h2 className='text-2xl font-semibold text-slate-900'>Add Hospital</h2>
            <p className='mt-1 text-sm text-slate-500'>Create hospitals that doctors can be linked to.</p>

            <form onSubmit={handleHospitalSubmit} className='mt-5 space-y-4'>
              <input className='w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500' placeholder='Hospital name' value={hospitalForm.name} onChange={(e) => setHospitalForm((prev) => ({ ...prev, name: e.target.value }))} required />
              <input className='w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500' placeholder='Location' value={hospitalForm.location} onChange={(e) => setHospitalForm((prev) => ({ ...prev, location: e.target.value }))} required />
              <input className='w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500' placeholder='Image URL' value={hospitalForm.image} onChange={(e) => setHospitalForm((prev) => ({ ...prev, image: e.target.value }))} required />
              <textarea className='min-h-28 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500' placeholder='Description' value={hospitalForm.description} onChange={(e) => setHospitalForm((prev) => ({ ...prev, description: e.target.value }))} />
              <button type='submit' disabled={isSubmittingHospital} className='w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-black disabled:bg-slate-400'>
                {isSubmittingHospital ? 'Adding Hospital...' : 'Add Hospital'}
              </button>
            </form>
          </section>

          <section className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm'>
            <h2 className='text-2xl font-semibold text-slate-900'>Add Approved Doctor</h2>
            <p className='mt-1 text-sm text-slate-500'>Doctors added here are approved immediately and can log in.</p>

            <form onSubmit={handleDoctorSubmit} className='mt-5 space-y-4'>
              <input className='w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500' placeholder='Doctor name' value={doctorForm.name} onChange={(e) => setDoctorForm((prev) => ({ ...prev, name: e.target.value }))} required />
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <input className='w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500' placeholder='Email' type='email' value={doctorForm.email} onChange={(e) => setDoctorForm((prev) => ({ ...prev, email: e.target.value }))} required />
                <input className='w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500' placeholder='Password' type='password' value={doctorForm.password} onChange={(e) => setDoctorForm((prev) => ({ ...prev, password: e.target.value }))} required />
              </div>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <input className='w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500' placeholder='Speciality' value={doctorForm.speciality} onChange={(e) => setDoctorForm((prev) => ({ ...prev, speciality: e.target.value }))} required />
                <input className='w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500' placeholder='Degree' value={doctorForm.degree} onChange={(e) => setDoctorForm((prev) => ({ ...prev, degree: e.target.value }))} required />
              </div>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <input className='w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500' placeholder='Experience' value={doctorForm.experience} onChange={(e) => setDoctorForm((prev) => ({ ...prev, experience: e.target.value }))} required />
                <input className='w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500' placeholder='Consultation fee' type='number' value={doctorForm.fees} onChange={(e) => setDoctorForm((prev) => ({ ...prev, fees: e.target.value }))} required />
              </div>
              <select className='w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500' value={doctorForm.hospitalId} onChange={(e) => setDoctorForm((prev) => ({ ...prev, hospitalId: e.target.value }))}>
                <option value=''>Independent / Not linked</option>
                {allHospitals.map((hospital) => (
                  <option key={hospital._id} value={hospital._id}>{hospital.name}</option>
                ))}
              </select>
              <textarea className='min-h-28 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500' placeholder='About the doctor' value={doctorForm.about} onChange={(e) => setDoctorForm((prev) => ({ ...prev, about: e.target.value }))} required />
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <input className='w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500' placeholder='Address line 1' value={doctorForm.addressLine1} onChange={(e) => setDoctorForm((prev) => ({ ...prev, addressLine1: e.target.value }))} required />
                <input className='w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500' placeholder='Address line 2' value={doctorForm.addressLine2} onChange={(e) => setDoctorForm((prev) => ({ ...prev, addressLine2: e.target.value }))} />
              </div>
              <input type='file' accept='image/*' className='w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500' onChange={(e) => setDoctorImage(e.target.files?.[0] || null)} required />
              <button type='submit' disabled={isSubmittingDoctor} className='w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:bg-emerald-300'>
                {isSubmittingDoctor ? 'Adding Doctor...' : 'Add Approved Doctor'}
              </button>
            </form>
          </section>
        </div>
      </div>

      <div className='mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2'>
        <section className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm'>
          <h2 className='text-2xl font-semibold text-slate-900'>Doctors Directory</h2>
          <p className='mt-1 text-sm text-slate-500'>All doctors, including approval status and hospital mapping.</p>
          <div className='mt-5 space-y-3'>
            {allDoctors.map((doctor) => (
              <div key={doctor._id} className='rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4'>
                <div className='flex flex-wrap items-center gap-3'>
                  <p className='font-semibold text-slate-900'>{doctor.name}</p>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${doctor.isApproved ? 'bg-emerald-100 text-emerald-700' : doctor.registrationStatus === 'rejected' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
                    {doctor.isApproved ? 'Approved' : doctor.registrationStatus === 'rejected' ? 'Rejected' : 'Pending'}
                  </span>
                </div>
                <p className='mt-1 text-sm text-slate-600'>{doctor.speciality} • {doctor.degree}</p>
                <p className='mt-1 text-sm text-slate-600'>{doctor.email}</p>
                <p className='mt-1 text-sm text-slate-600'>Hospital: {doctor.hospitalId?.name || 'Independent practice'}</p>
              </div>
            ))}
          </div>
        </section>

        <section className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm'>
          <h2 className='text-2xl font-semibold text-slate-900'>Hospitals Directory</h2>
          <p className='mt-1 text-sm text-slate-500'>All hospitals currently available in the platform.</p>
          <div className='mt-5 space-y-3'>
            {allHospitals.map((hospital) => (
              <div key={hospital._id} className='rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4'>
                <p className='font-semibold text-slate-900'>{hospital.name}</p>
                <p className='mt-1 text-sm text-slate-600'>{hospital.location}</p>
                {hospital.description && (
                  <p className='mt-2 text-sm text-slate-500'>{hospital.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminPanel;
