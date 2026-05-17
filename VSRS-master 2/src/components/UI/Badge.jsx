import React from 'react';

const Badge = ({ children, variant = 'default' }) => {
  const variants = {
    default: 'bg-gray-600 text-gray-100',
    pending: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
    'in-progress': 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    completed: 'bg-green-500/20 text-green-400 border border-green-500/30',
    rejected: 'bg-red-500/20 text-red-400 border border-red-500/30'
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
};

export default Badge;
