import React from 'react';

const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div className="min-h-screen bg-[#0f0f0f] flex flex-col items-center justify-center">
      <div className="relative w-16 h-16 mb-6">
        <div className="absolute inset-0 rounded-full border-4 border-blue-500/20"></div>
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 animate-spin"></div>
        <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-green-400 animate-spin" style={{ animationDuration: '0.7s', animationDirection: 'reverse' }}></div>
      </div>
      <p className="text-gray-400 text-sm tracking-widest uppercase">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
