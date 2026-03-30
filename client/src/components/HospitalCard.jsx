// src/components/HospitalCard.jsx
import React from 'react';

const HospitalCard = ({ name, address, image }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all group">
      <div className="relative overflow-hidden">
        <img src={image} alt={name} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-xs font-bold text-blue-600">
          Verified
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-800 mb-1">{name}</h3>
        <p className="text-gray-500 text-sm mb-4 flex items-center gap-1">
           📍 {address}
        </p>
        <button className="w-full py-2.5 bg-blue-50 text-blue-600 rounded-xl font-semibold hover:bg-blue-600 hover:text-white transition-colors">
          View Specialists
        </button>
      </div>
    </div>
  );
};

export default HospitalCard;