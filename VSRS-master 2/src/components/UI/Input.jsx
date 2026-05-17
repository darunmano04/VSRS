import React from 'react';

const Input = ({ 
  label, 
  error, 
  type = 'text', 
  className = '', 
  ...props 
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
      <input
        type={type}
        className={`w-full px-4 py-3 bg-[#0f0f0f] border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-[#2563eb] focus:border-transparent transition-all duration-200 ${error ? 'border-[#ef4444] focus:ring-[#ef4444]' : ''} ${className}`}
        {...props}
      />
      {error && (
        <p className="text-sm text-[#ef4444]">{error}</p>
      )}
    </div>
  );
};

export default Input;
