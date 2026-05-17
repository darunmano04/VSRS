import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import Card from '../components/UI/Card';
import { SERVICE_TYPES } from '../utils/constants';
import { useNavigate } from 'react-router-dom';

const BookService = () => {
  const [formData, setFormData] = useState({ vehicleId: '', serviceCenterId: '', date: '', serviceType: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [userVehicles, setUserVehicles] = useState([]);
  const [serviceCenters, setServiceCenters] = useState([]);

  const navigate = useNavigate();
  const { user } = useAuth();
  const { addBooking, getVehicles, getServiceCenters } = useData();

  useEffect(() => {
    if (!user) return;
    getVehicles().then(setUserVehicles).catch(() => {});
    getServiceCenters().then(setServiceCenters).catch(() => {});
  }, [user]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const vehicle = userVehicles.find(v => v.id === formData.vehicleId);
    const serviceCenter = serviceCenters.find(sc => sc.id === formData.serviceCenterId);

    try {
      await addBooking({
        vehicleId: formData.vehicleId,
        vehicleLabel: vehicle ? `${vehicle.brand} ${vehicle.model} - ${vehicle.vehicle_number}` : '',
        serviceCenterId: formData.serviceCenterId,
        serviceCenterName: serviceCenter?.name || '',
        date: formData.date,
        serviceType: formData.serviceType,
        description: formData.description,
      });
      setSuccess(true);
      setTimeout(() => navigate('/customer/service-history'), 1200);
    } catch (err) {
      alert('Booking failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Book Service Appointment</h1>
        <p className="text-gray-400 mt-2">Schedule your vehicle service with your preferred service center</p>
      </div>

      {success && (
        <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-xl flex items-center gap-3">
          <span className="text-xl">✅</span> Booking confirmed! Redirecting...
        </div>
      )}

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Select Vehicle</label>
              <select name="vehicleId" value={formData.vehicleId} onChange={handleChange}
                className="w-full px-4 py-3 bg-[#0f0f0f] border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-[#2563eb] focus:border-transparent" required>
                <option value="">Choose your vehicle</option>
                {userVehicles.map(v => (
                  <option key={v.id} value={v.id}>{v.brand} {v.model} - {v.vehicle_number}</option>
                ))}
              </select>
              {userVehicles.length === 0 && <p className="text-xs text-yellow-400">⚠ Add a vehicle first before booking</p>}
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Service Center</label>
              <select name="serviceCenterId" value={formData.serviceCenterId} onChange={handleChange}
                className="w-full px-4 py-3 bg-[#0f0f0f] border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-[#2563eb] focus:border-transparent" required>
                <option value="">Choose service center</option>
                {serviceCenters.map(sc => (
                  <option key={sc.id} value={sc.id}>{sc.name}</option>
                ))}
              </select>
              {serviceCenters.length === 0 && <p className="text-xs text-yellow-400">⚠ No service centers available yet</p>}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Input label="Preferred Date" name="date" type="date" value={formData.date} onChange={handleChange} required />
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Service Type</label>
              <select name="serviceType" value={formData.serviceType} onChange={handleChange}
                className="w-full px-4 py-3 bg-[#0f0f0f] border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-[#2563eb] focus:border-transparent" required>
                <option value="">Select service type</option>
                {SERVICE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">Description (optional)</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows={4}
              className="w-full px-4 py-3 bg-[#0f0f0f] border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-[#2563eb] focus:border-transparent"
              placeholder="Describe any specific issues or requirements..." />
          </div>

          <div className="flex space-x-4">
            <Button type="submit" disabled={loading || userVehicles.length === 0} className="flex-1">
              {loading ? 'Booking...' : 'Book Appointment'}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate('/customer/dashboard')} className="flex-1">Cancel</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default BookService;
