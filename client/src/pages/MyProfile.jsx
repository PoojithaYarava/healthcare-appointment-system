import React, { useContext, useState } from 'react'
import { AppContext } from '../context/appContextInstance'
import { assets } from '../assets/assets'

const MyProfile = () => {
    const { token, authRole, userData, setUserData, isProfileLoading, profileError, loadAuthProfileData } = useContext(AppContext)
    const [isEdit, setIsEdit] = useState(false)

    if (!token) {
        return (
            <div className='flex items-center justify-center min-h-[60vh]'>
                <p className='text-gray-500'>Please log in to view your profile.</p>
            </div>
        )
    }

    if (authRole === 'doctor') {
        return (
            <div className='flex items-center justify-center min-h-[60vh]'>
                <p className='text-gray-500'>Doctor profiles are managed from the doctor dashboard in this version.</p>
            </div>
        )
    }

    if (isProfileLoading) {
        return (
            <div className='flex items-center justify-center min-h-[60vh]'>
                <p className='text-gray-500 animate-pulse'>Loading profile data...</p>
            </div>
        )
    }

    if (!userData) {
        return (
            <div className='flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center'>
                <p className='text-gray-500'>{profileError || 'Unable to load profile data.'}</p>
                <button
                    onClick={() => loadAuthProfileData()}
                    className='border border-primary px-6 py-2 rounded-full hover:bg-primary hover:text-white transition-all'
                >
                    Retry
                </button>
            </div>
        )
    }

    const profileImage = userData.image
        ? (typeof userData.image === 'string' ? userData.image : URL.createObjectURL(userData.image))
        : assets.profile_pic

    return (
        <div className='max-w-lg flex flex-col gap-2 text-sm'>
            <div className='relative inline-block'>
                <img className='w-36 rounded opacity-75' src={profileImage} alt="" />
                {isEdit && (
                    <label htmlFor="image" className='absolute bottom-3 right-3 cursor-pointer'>
                        <img className='w-10' src={assets.upload_icon} alt="" />
                        <input onChange={(e) => setUserData(prev => ({ ...prev, image: e.target.files[0] }))} type="file" id="image" hidden />
                    </label>
                )}
            </div>

            {isEdit
                ? <input className='bg-gray-50 text-3xl font-medium max-w-full mt-4 sm:max-w-60' type="text" value={userData.name} onChange={e => setUserData(prev => ({ ...prev, name: e.target.value }))} />
                : <p className='font-medium text-3xl text-neutral-800 mt-4'>{userData.name}</p>
            }

            <hr className='bg-zinc-400 h-[1px] border-none' />

            <div>
                <p className='text-neutral-500 underline mt-3'>CONTACT INFORMATION</p>
                <div className='grid grid-cols-1 gap-y-2.5 mt-3 text-neutral-700 sm:grid-cols-[1fr_3fr]'>
                    <p className='font-medium'>Email:</p>
                    <p className='break-all text-blue-500'>{userData.email}</p>
                    <p className='font-medium'>Phone:</p>
                    {isEdit
                        ? <input className='bg-gray-100 max-w-full sm:max-w-52' type="text" value={userData.phone} onChange={e => setUserData(prev => ({ ...prev, phone: e.target.value }))} />
                        : <p className='text-blue-400'>{userData.phone}</p>
                    }
                </div>
            </div>

            <div className='mt-10'>
                {isEdit
                    ? <button className='border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all' onClick={() => setIsEdit(false)}>Save information</button>
                    : <button className='border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all' onClick={() => setIsEdit(true)}>Edit</button>
                }
            </div>
        </div>
    )
}

export default MyProfile
