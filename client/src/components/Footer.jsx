import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className='md:mx-10 border-t border-gray-200 mt-20'>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 text-sm text-gray-600'>
        
        <div>
          <img className='mb-5 w-40' src={assets.logo} alt="" />
          <p className='w-full md:w-2/3 leading-6'>
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