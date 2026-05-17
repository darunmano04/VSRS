import React from 'react';

const Button = ({
  children,
  type = 'button',
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  ...props
}) => {
  const base =
    'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0f0f0f] disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary:
      'bg-[#2563eb] hover:bg-[#1d4ed8] text-white shadow-lg shadow-blue-500/20 focus:ring-blue-500',
    secondary:
      'bg-[#22c55e] hover:bg-[#16a34a] text-white shadow-lg shadow-green-500/20 focus:ring-green-500',
    danger:
      'bg-[#ef4444] hover:bg-[#dc2626] text-white shadow-lg shadow-red-500/20 focus:ring-red-500',
    outline:
      'border border-[#2563eb] text-[#2563eb] hover:bg-[#2563eb] hover:text-white focus:ring-blue-500',
    ghost:
      'bg-transparent text-gray-300 hover:bg-gray-700 hover:text-white focus:ring-gray-500',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-8 py-3.5 text-base',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
