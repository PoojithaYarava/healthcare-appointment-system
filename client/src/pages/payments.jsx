import React, { useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const Payments = () => {
  const { appointmentId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { backendUrl, authHeaders, currencySymbol, token } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  useEffect(() => {
    const loadAppointments = async () => {
      if (!token) {
        navigate('/login');
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
        toast.error(error.response?.data?.message || 'Unable to load payment details');
      } finally {
        setIsLoading(false);
      }
    };

    loadAppointments();
  }, [authHeaders, backendUrl, navigate, token]);

  const appointment = useMemo(() => (
    location.state?.appointment || appointments.find((item) => item._id === appointmentId)
  ), [appointmentId, appointments, location.state]);

  const confirmPayment = async () => {
    try {
      setIsConfirming(true);
      const { data } = await axios.post(
        `${backendUrl}/api/appointment/confirm-payment`,
        { appointmentId },
        { headers: authHeaders() }
      );

      if (data.success) {
        toast.success(data.message);
        navigate('/my-appointments');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to confirm payment');
    } finally {
      setIsConfirming(false);
    }
  };

  if (isLoading) {
    return <div className='py-16 text-center text-gray-500'>Loading payment details...</div>;
  }

  if (!appointment) {
    return <div className='py-16 text-center text-gray-500'>Appointment not found.</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-8">
      <div className="bg-white border p-10 rounded-3xl shadow-xl max-w-md w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Demo Checkout</h2>
        <p className="text-sm text-gray-500 text-center mb-6">This is a demo payment screen for the selected appointment.</p>

        <div className="space-y-3 bg-gray-50 p-4 rounded-xl mb-6 text-sm">
          <div className="flex justify-between gap-4">
            <span className="text-gray-500">Doctor</span>
            <span className="font-medium text-gray-800">{appointment.docData?.name}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-gray-500">Speciality</span>
            <span className="font-medium text-gray-800">{appointment.docData?.speciality}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-gray-500">Date</span>
            <span className="font-medium text-gray-800">{appointment.slotDate}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-gray-500">Time</span>
            <span className="font-medium text-gray-800">{appointment.slotTime}</span>
          </div>
          <div className="flex justify-between gap-4 pt-2 border-t">
            <span className="text-gray-600">Consultation Fee</span>
            <span className="font-bold text-indigo-600">{currencySymbol}{appointment.amount}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={confirmPayment}
          disabled={isConfirming || appointment.payment}
          className="w-full bg-green-500 text-white py-4 rounded-xl font-bold mb-4 hover:bg-green-600 transition-all disabled:bg-green-300"
        >
          {appointment.payment ? 'Already Paid' : isConfirming ? 'Confirming Payment...' : 'Confirm Demo Payment'}
        </button>

        <button
          type="button"
          onClick={() => navigate('/my-appointments')}
          className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all"
        >
          Back to My Appointments
        </button>

        <p className="text-xs text-gray-400 mt-6 font-light text-center">No real money is charged in this demo flow.</p>
      </div>
    </div>
  );
};

export default Payments;
