import React, { createContext, useContext } from 'react';
import { useAuth } from './AuthContext';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};

export const DataProvider = ({ children }) => {
  const { token } = useAuth();

  // --- API helper with auth token ---
  const api = async (method, path, body) => {
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    if (body) headers['Content-Type'] = 'application/json';

    const res = await fetch(path, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'API error');
    return data;
  };

  // --- Vehicles ---
  const getVehicles = async () => {
    return api('GET', '/api/vehicles');
  };

  const addVehicle = async (vehicle) => {
    return api('POST', '/api/vehicles', vehicle);
  };

  // --- Bookings ---
  const getMyBookings = async () => {
    return api('GET', '/api/bookings/my');
  };

  const getServiceCenterBookings = async () => {
    return api('GET', '/api/bookings/service-center');
  };

  const getAllBookings = async () => {
    return api('GET', '/api/bookings');
  };

  const addBooking = async (booking) => {
    return api('POST', '/api/bookings', booking);
  };

  const updateBookingStatus = async (bookingId, status, priceQuote) => {
    return api('PATCH', `/api/bookings/${bookingId}`, { status, priceQuote });
  };

  // --- Users (admin) ---
  const getAllUsers = async () => {
    return api('GET', '/api/auth/users');
  };

  // --- Service Centers (public) ---
  const getServiceCenters = async () => {
    return api('GET', '/api/auth/service-centers');
  };

  return (
    <DataContext.Provider value={{
      addVehicle,
      getVehicles,
      addBooking,
      getMyBookings,
      getServiceCenterBookings,
      getAllBookings,
      updateBookingStatus,
      getAllUsers,
      getServiceCenters,
    }}>
      {children}
    </DataContext.Provider>
  );
};
