import React from 'react';

const LabTests = () => {
  const tests = [
    { name: "Full Body Checkup", price: "$99", items: "60+ Parameters", time: "24 hrs" },
    { name: "Diabetes Screening", price: "$45", items: "Blood Sugar, HbA1c", time: "12 hrs" },
    { name: "Cardiac Profile", price: "$150", items: "ECG, Lipid Profile", time: "48 hrs" }
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Diagnostic Lab Tests</h1>
        <span className="text-blue-600 font-medium">Free Home Collection</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tests.map((test, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-shadow">
            <h2 className="text-xl font-bold text-gray-800 mb-2">{test.name}</h2>
            <p className="text-sm text-gray-500 mb-4 font-medium">{test.items}</p>
            <div className="flex justify-between items-center pt-4 border-t">
              <div>
                <p className="text-xs text-gray-400 uppercase">Price</p>
                <p className="text-lg font-bold text-blue-600">{test.price}</p>
              </div>
              <button className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-600 hover:text-white transition-all">
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LabTests;