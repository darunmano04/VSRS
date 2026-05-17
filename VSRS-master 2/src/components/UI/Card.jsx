import React from 'react';

const Card = ({ children, hover = false, className = '' }) => {
  return (
    <div
      className={`bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-xl
        ${hover ? 'transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:-translate-y-1 hover:shadow-2xl cursor-pointer' : ''}
        ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
