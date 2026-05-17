import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import Card from '../components/UI/Card';
import { VEHICLE_TYPES } from '../utils/constants';

const AddVehicle = () => {
  const [formData, setFormData] = useState({ vehicleNumber: '', vehicleType: '', brand: '', model: '', year: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { addVehicle } = useData();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addVehicle(formData);
      setSuccess(true);
      setTimeout(() => navigate('/customer/dashboard'), 1200);
    } catch (err) {
      alert('Failed to add vehicle: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Add New Vehicle</h1>
        <p className="text-gray-400 mt-2">Register your vehicle for service management</p>
      </div>

      {success && (
        <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-xl flex items-center gap-3">
          <span className="text-xl">✅</span> Vehicle added successfully! Redirecting...
        </div>
      )}

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Input label="Vehicle Number" name="vehicleNumber" value={formData.vehicleNumber} onChange={handleChange} placeholder="e.g., ABC-1234" required />
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Vehicle Type</label>
              <select name="vehicleType" value={formData.vehicleType} onChange={handleChange}
                className="w-full px-4 py-3 bg-[#0f0f0f] border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-[#2563eb] focus:border-transparent" required>
                <option value="">Select vehicle type</option>
                {VEHICLE_TYPES.map(t => <option key={t} value={t.toLowerCase()}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <Input label="Brand" name="brand" value={formData.brand} onChange={handleChange} placeholder="e.g., Toyota" required />
            <Input label="Model" name="model" value={formData.model} onChange={handleChange} placeholder="e.g., Camry" required />
          </div>
          <Input label="Year" name="year" type="number" value={formData.year} onChange={handleChange} placeholder="e.g., 2020" min="1900" max="2030" required />
          <div className="flex space-x-4">
            <Button type="submit" disabled={loading} className="flex-1">{loading ? 'Adding Vehicle...' : 'Add Vehicle'}</Button>
            <Button type="button" variant="outline" onClick={() => navigate('/customer/dashboard')} className="flex-1">Cancel</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddVehicle;
