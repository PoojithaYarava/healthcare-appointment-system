import React from 'react'
import { assets } from '../assets/assets'

const Footer = ({ compact = false }) => {
  return (
    <div className={`border-t border-gray-200 ${compact ? 'mt-10' : 'mt-20'}`}>
      <div className={`grid grid-cols-1 gap-10 px-2 text-sm text-gray-600 sm:grid-cols-[3fr_1fr_1fr] sm:gap-14 md:mx-10 md:px-0 ${compact ? 'my-8' : 'my-10'}`}>
        <div>
          <img className='mb-5 w-40' src={assets.logo} alt="" />
          <p className='w-full max-w-xl leading-6'>
            MediConnect is your trusted partner in digital healthcare. Book
            appointments with top specialists instantly and manage your health.
          </p>
        </div>

        <div>
          <p className='text-xl font-medium mb-5 text-black'>COMPANY</p>
          <ul className='flex flex-col gap-2'>
            <li>Home</li>
            <li>About us</li>
            <li>Contact us</li>
            <li>Privacy policy</li>
          </ul>
        </div>

        <div>
          <p className='text-xl font-medium mb-5 text-black'>GET IN TOUCH</p>
          <ul className='flex flex-col gap-2'>
            <li>+1-212-456-7890</li>
            <li>support@mediconnect.com</li>
          </ul>
        </div>
      </div>
      <hr />
      <p className='py-5 text-sm text-center text-gray-500'>
        Copyright 2024 @ MediConnect.com - All Rights Reserved.
      </p>
    </div>
  )
}

export default Footer
