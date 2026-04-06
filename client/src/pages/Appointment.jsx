import React, { useContext, useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { AppContext } from '../context/appContextInstance'
import { assets } from '../assets/assets'

const Appointment = () => {
  const { docId } = useParams()
  const navigate = useNavigate()
  const { backendUrl, authHeaders, currencySymbol, token, authRole } = useContext(AppContext)
  const [docInfo, setDocInfo] = useState(null)
  const [docSlots, setDocSlots] = useState([])
  const [slotIndex, setSlotIndex] = useState(0)
  const [slotTime, setSlotTime] = useState('')
  const [isBooking, setIsBooking] = useState(false)

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/data/doctors/${docId}`)
        if (data.success) {
          setDocInfo(data.doctor)
        } else {
          toast.error(data.message)
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Unable to load doctor details')
      }
    }

    fetchDoctor()
  }, [backendUrl, docId])

  const bookedSlots = useMemo(() => docInfo?.slots_booked || {}, [docInfo])

  useEffect(() => {
    if (!docInfo) {
      setDocSlots([])
      return
    }

    const allSlots = []
    const now = new Date()

    for (let i = 0; i < 7; i += 1) {
      const currentDate = new Date(now)
      currentDate.setDate(now.getDate() + i)
      currentDate.setHours(i === 0 ? Math.max(now.getHours() + 1, 10) : 10, now.getMinutes() > 30 ? 30 : 0, 0, 0)

      const dayEnd = new Date(currentDate)
      dayEnd.setHours(21, 0, 0, 0)

      const slotDate = currentDate.toLocaleDateString('en-GB')
      const daySlots = []

      while (currentDate < dayEnd) {
        const slotValue = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        const isBooked = bookedSlots[slotDate]?.includes(slotValue)

        if (!isBooked) {
          daySlots.push({
            datetime: new Date(currentDate),
            time: slotValue,
            slotDate
          })
        }

        currentDate.setMinutes(currentDate.getMinutes() + 30)
      }

      if (daySlots.length) {
        allSlots.push(daySlots)
      }
    }

    setDocSlots(allSlots)
    setSlotIndex(0)
    setSlotTime(allSlots[0]?.[0]?.time || '')
  }, [bookedSlots, docInfo])

  const bookAppointment = async () => {
    if (!token) {
      toast.info('Please log in to book an appointment')
      navigate('/login')
      return
    }

    if (authRole === 'doctor') {
      toast.info('Doctor accounts can manage bookings from the doctor dashboard')
      navigate('/doctor/appointments')
      return
    }

    const selectedSlot = docSlots[slotIndex]?.find((slot) => slot.time === slotTime) || docSlots[slotIndex]?.[0]
    if (!selectedSlot) {
      toast.error('Please select an available time slot')
      return
    }

    try {
      setIsBooking(true)
      const { data } = await axios.post(
        `${backendUrl}/api/appointment/book-appointment`,
        {
          docId,
          slotDate: selectedSlot.slotDate,
          slotTime: selectedSlot.time
        },
        { headers: authHeaders() }
      )

      if (data.success) {
        toast.success(data.message)
        navigate('/my-appointments')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to book appointment')
    } finally {
      setIsBooking(false)
    }
  }

  if (!docInfo) {
    return <div className='py-16 text-center text-gray-500'>Loading doctor details...</div>
  }

  return (
    <div>
      <div className='flex flex-col gap-4 sm:flex-row'>
        <div>
          <img className='w-full rounded-lg bg-indigo-100 sm:max-w-72' src={docInfo.image} alt={docInfo.name} />
        </div>

        <div className='mx-0 mt-0 flex-1 rounded-lg border border-gray-400 bg-white p-5 py-7 sm:mx-0 sm:p-8'>
          <p className='flex flex-wrap items-center gap-2 text-2xl font-medium text-gray-900'>
            {docInfo.name}
            <img className='w-5' src={assets.verified_icon} alt='' />
          </p>
          <div className='mt-1 flex flex-col gap-2 text-sm text-gray-600 sm:flex-row sm:items-center'>
            <p>{docInfo.degree} - {docInfo.speciality}</p>
            <button className='rounded-full border px-2 py-0.5 text-xs'>{docInfo.experience}</button>
          </div>

          <div>
            <p className='mt-3 flex items-center gap-1 text-sm font-medium text-gray-900'>
              About <img src={assets.info_icon} alt='' />
            </p>
            <p className='mt-1 max-w-[700px] text-sm text-gray-500'>{docInfo.about}</p>
          </div>

          {docInfo.hospitalId && (
            <p className='mt-3 text-sm text-gray-500'>
              Hospital: <span className='text-gray-800'>{docInfo.hospitalId.name}</span>
            </p>
          )}

          <p className='mt-4 font-medium text-gray-500'>
            Appointment fee: <span className='text-gray-800'>{currencySymbol}{docInfo.fees}</span>
          </p>
        </div>
      </div>

      <div className='mt-4 font-medium text-gray-700 sm:ml-72 sm:pl-4'>
        <p>Booking slots</p>
        <div className='mt-4 flex gap-3 overflow-x-auto pb-2'>
          {docSlots.map((daySlots, index) => (
            <button
              key={daySlots[0].slotDate}
              type='button'
              onClick={() => {
                setSlotIndex(index)
                setSlotTime(daySlots[0]?.time || '')
              }}
              className={`min-w-[72px] rounded-full border px-4 py-3 text-center transition-colors ${slotIndex === index ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm' : 'border-gray-200 bg-white text-gray-600 hover:border-indigo-300'}`}
            >
              <p className='text-xs'>{daySlots[0].datetime.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()}</p>
              <p className='text-lg'>{daySlots[0].datetime.getDate()}</p>
            </button>
          ))}
        </div>

        <div className='mt-6 flex flex-wrap gap-3'>
          {docSlots[slotIndex]?.map((slot) => (
            <button
              key={`${slot.slotDate}-${slot.time}`}
              type='button'
              onClick={() => setSlotTime(slot.time)}
              className={`rounded-full border px-4 py-2.5 text-sm transition-colors sm:px-5 ${slot.time === slotTime ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm' : 'border-gray-300 text-gray-600 hover:border-indigo-300 hover:text-indigo-600'}`}
            >
              {slot.time}
            </button>
          ))}
        </div>

        {!docSlots.length && (
          <p className='mt-4 text-sm text-gray-500'>No available slots for the next 7 days.</p>
        )}

        <button
          type='button'
          onClick={bookAppointment}
          disabled={isBooking || !docSlots.length}
          className='my-6 min-h-[52px] w-full rounded-full bg-indigo-600 px-8 py-3 text-sm font-medium text-white shadow-md transition-colors hover:bg-indigo-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:shadow-none sm:w-auto sm:px-14'
        >
          {isBooking ? 'Booking...' : 'Book an appointment'}
        </button>
      </div>
    </div>
  )
}

export default Appointment
