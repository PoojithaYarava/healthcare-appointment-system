import React from 'react';
import { useNavigate } from 'react-router-dom';

const HospitalCard = ({ id, name, address, image }) => {
  const navigate = useNavigate();

  return (
    <div className="group overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all hover:shadow-lg">
      <div className="relative overflow-hidden">
        <img src={image} alt={name} className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute right-2 top-2 rounded bg-white/90 px-2 py-1 text-xs font-bold text-blue-600">
          Verified
        </div>
      </div>
      <div className="p-5">
        <h3 className="mb-1 text-xl font-bold text-gray-800">{name}</h3>
        <p className="mb-4 flex items-center gap-1 text-sm text-gray-500">
          <span aria-hidden="true">📍</span>
          {address}
        </p>
        <button
          type="button"
          onClick={() => navigate(`/doctors?hospital=${id}`)}
          className="w-full rounded-xl bg-blue-50 py-2.5 font-semibold text-blue-600 transition-colors hover:bg-blue-600 hover:text-white"
        >
          View Specialists
        </button>
      </div>
    </div>
  );
};

export default HospitalCard;
