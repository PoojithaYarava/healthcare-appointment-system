import React, { useContext, useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'

const Appointment = () => {
  const { docId } = useParams()
  const navigate = useNavigate()
  const { backendUrl, authHeaders, currencySymbol, token } = useContext(AppContext)
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
      <div className='flex flex-col sm:flex-row gap-4'>
        <div>
          <img className='bg-indigo-100 w-full sm:max-w-72 rounded-lg' src={docInfo.image} alt={docInfo.name} />
        </div>

        <div className='flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>
          <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>
            {docInfo.name}
            <img className='w-5' src={assets.verified_icon} alt='' />
          </p>
          <div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
            <p>{docInfo.degree} - {docInfo.speciality}</p>
            <button className='py-0.5 px-2 border text-xs rounded-full'>{docInfo.experience}</button>
          </div>

          <div>
            <p className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3'>
              About <img src={assets.info_icon} alt='' />
            </p>
            <p className='text-sm text-gray-500 max-w-[700px] mt-1'>{docInfo.about}</p>
          </div>

          {docInfo.hospitalId && (
            <p className='text-sm text-gray-500 mt-3'>
              Hospital: <span className='text-gray-800'>{docInfo.hospitalId.name}</span>
            </p>
          )}

          <p className='text-gray-500 font-medium mt-4'>
            Appointment fee: <span className='text-gray-800'>{currencySymbol}{docInfo.fees}</span>
          </p>
        </div>
      </div>

      <div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700'>
        <p>Booking slots</p>
        <div className='flex gap-4 overflow-x-auto mt-4 pb-2'>
          {docSlots.map((daySlots, index) => (
            <button
              key={daySlots[0].slotDate}
              type='button'
              onClick={() => {
                setSlotIndex(index)
                setSlotTime(daySlots[0]?.time || '')
              }}
              className={`min-w-16 rounded-full border px-4 py-3 text-center transition-colors ${slotIndex === index ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'}`}
            >
              <p className='text-xs'>{daySlots[0].datetime.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()}</p>
              <p className='text-lg'>{daySlots[0].datetime.getDate()}</p>
            </button>
          ))}
        </div>

        <div className='flex flex-wrap gap-3 mt-6'>
          {docSlots[slotIndex]?.map((slot) => (
            <button
              key={`${slot.slotDate}-${slot.time}`}
              type='button'
              onClick={() => setSlotTime(slot.time)}
              className={`px-5 py-2 rounded-full text-sm border transition-colors ${slot.time === slotTime ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' : 'text-gray-600 border-gray-300 hover:border-indigo-300 hover:text-indigo-600'}`}
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
          className='bg-indigo-600 text-white text-sm font-medium px-14 py-3 rounded-full my-6 shadow-md hover:bg-indigo-700 transition-colors disabled:bg-gray-300 disabled:text-gray-500 disabled:shadow-none'
        >
          {isBooking ? 'Booking...' : 'Book an appointment'}
        </button>
      </div>
    </div>
  )
}

export default Appointment
