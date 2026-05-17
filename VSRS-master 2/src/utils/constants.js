export const SERVICE_TYPES = [
  'Oil Change',
  'Brake Service',
  'Engine Tune-up',
  'Tire Service',
  'AC Service',
  'Battery Replacement',
  'Wheel Alignment',
  'Transmission Service',
  'General Maintenance',
  'Body Repair',
];

export const VEHICLE_TYPES = ['Car', 'SUV', 'Truck', 'Motorcycle', 'Van'];

export const BOOKING_STATUSES = {
  PENDING: 'pending',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
  REJECTED: 'rejected',
};

export const MOCK_SERVICE_CENTERS = [
  { id: 'sc1', name: 'AutoCare Center', location: 'Downtown', rating: 4.5 },
  { id: 'sc2', name: 'Premium Service Hub', location: 'Uptown', rating: 4.8 },
  { id: 'sc3', name: 'Quick Fix Garage', location: 'Suburbs', rating: 4.2 },
  { id: 'sc4', name: 'Elite Motors Service', location: 'Midtown', rating: 4.7 },
];

export const ROLES = {
  CUSTOMER: 'customer',
  SERVICE_CENTER: 'service-center',
  ADMIN: 'admin',
};
