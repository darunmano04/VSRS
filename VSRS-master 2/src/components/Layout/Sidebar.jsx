import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../UI/Button';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const customerMenuItems = [
    { path: '/customer/dashboard', label: 'Dashboard', icon: '🏠' },
    { path: '/customer/add-vehicle', label: 'Add Vehicle', icon: '🚗' },
    { path: '/customer/book-service', label: 'Book Service', icon: '📅' },
    { path: '/customer/service-history', label: 'Service History', icon: '📋' },
  ];

  const serviceCenterMenuItems = [
    { path: '/service-center/dashboard', label: 'Dashboard', icon: '🏠' },
  ];

  const adminMenuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: '🏠' },
  ];

  let menuItems = [];
  if (user?.role === 'customer') menuItems = customerMenuItems;
  else if (user?.role === 'service-center') menuItems = serviceCenterMenuItems;
  else if (user?.role === 'admin') menuItems = adminMenuItems;

  const roleLabels = {
    customer: { label: 'Customer', color: 'bg-blue-500/20 text-blue-400' },
    'service-center': { label: 'Service Center', color: 'bg-green-500/20 text-green-400' },
    admin: { label: 'Admin', color: 'bg-purple-500/20 text-purple-400' },
  };

  const roleInfo = roleLabels[user?.role] || { label: user?.role, color: 'bg-gray-500/20 text-gray-400' };

  return (
    <div className="bg-[#141414] border-r border-white/5 w-64 min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-white/5">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
            <span className="text-white text-xs font-bold">V</span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">VSRS</span>
        </Link>
      </div>

      {/* User Info */}
      {user && (
        <div className="px-6 py-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm truncate">{user.name}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full ${roleInfo.color}`}>
                {roleInfo.label}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-[#2563eb] text-white shadow-lg shadow-blue-500/20'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                <span className="font-medium text-sm">{item.label}</span>
                {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white"></div>}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/5">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
        >
          <span className="text-lg">🚪</span>
          <span className="font-medium text-sm">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
