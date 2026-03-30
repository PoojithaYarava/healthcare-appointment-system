import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const BookAppointment = () => {
  const { docId } = useParams();
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState('');

  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  // 1. Function must be inside the component
  const getAvailableSlots = () => {
    let today = new Date();
    let allSlots = [];

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      let endTime = new Date(today);
      endTime.setDate(today.getDate() + i);
      endTime.setHours(21, 0, 0, 0);

      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(currentDate.getHours() >= 10 ? currentDate.getHours() + 1 : 10);
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }

      let timeSlots = [];
      while (currentDate < endTime) {
        timeSlots.push({
          datetime: new Date(currentDate),
          time: currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }
      allSlots.push(timeSlots);
    }
    setDocSlots(allSlots);
  };

  // 2. useEffect must be AFTER the function definition
  useEffect(() => {
    getAvailableSlots();
  }, [docId]);

  return (
    <div className="p-5 max-w-4xl mx-auto">
      {/* Doctor Info Card */}
      <div className="flex flex-col sm:flex-row gap-6 bg-white border p-6 rounded-2xl shadow-sm mb-10">
        <div className="bg-blue-600 w-full sm:max-w-60 rounded-xl overflow-hidden">
          <img src="https://via.placeholder.com/200" alt="doc" className="w-full" />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-800">Doctor Profile</h1>
          <p className="text-blue-600 font-semibold mt-1">Specialist Physician</p>
          <p className="text-gray-500 text-sm mt-3 leading-relaxed">
            Expert in providing digital healthcare consultations.
          </p>
          <p className="mt-4 font-bold text-gray-700 underline">Fee: $40</p>
        </div>
      </div>

      {/* Slots Section */}
      <p className="font-semibold text-gray-700 mb-4">Select Appointment Date</p>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {docSlots.length > 0 && docSlots.map((item, index) => (
          <div 
            key={index} 
            onClick={() => setSlotIndex(index)}
            className={`flex-shrink-0 text-center py-6 w-16 rounded-full cursor-pointer border transition-all ${
              slotIndex === index ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-500 border-gray-200'
            }`}
          >
            <p className="text-xs">{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
            <p className="text-lg font-bold">{item[0] && item[0].datetime.getDate()}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 mt-6">
        {docSlots.length > 0 && docSlots[slotIndex]?.map((item, index) => (
          <p 
            key={index} 
            onClick={() => setSlotTime(item.time)}
            className={`px-5 py-2 rounded-full text-sm cursor-pointer border transition-all ${
              item.time === slotTime ? 'bg-blue-600 text-white border-blue-600' : 'text-gray-400 border-gray-300'
            }`}
          >
            {item.time.toLowerCase()}
          </p>
        ))}
      </div>

      <button className="mt-10 bg-blue-600 text-white px-20 py-4 rounded-full font-bold shadow-lg hover:bg-blue-700 active:scale-95 transition-all">
        Book Now
      </button>
    </div>
  );
};

export default BookAppointment;
