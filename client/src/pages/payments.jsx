import React from 'react';

const Payments = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-8">
      <div className="bg-white border p-10 rounded-3xl shadow-xl max-w-md w-full text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Secure Checkout</h2>
        <div className="bg-gray-50 p-4 rounded-xl mb-6 flex justify-between">
          <span className="text-gray-600">Consultation Fee:</span>
          <span className="font-bold text-blue-600">$40.00</span>
        </div>
        <button className="w-full bg-green-500 text-white py-4 rounded-xl font-bold mb-4 hover:bg-green-600 transition-all">
          Pay via PayPal
        </button>
        <button className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all">
          Pay via Stripe/Card
        </button>
        <p className="text-xs text-gray-400 mt-6 font-light">All transactions are encrypted and 100% secure.</p>
      </div>
    </div>
  );
};

export default Payments;