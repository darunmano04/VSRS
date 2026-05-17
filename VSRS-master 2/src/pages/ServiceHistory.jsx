import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import Card from '../components/UI/Card';
import Badge from '../components/UI/Badge';
import Button from '../components/UI/Button';

const ServiceHistory = () => {
  const { user } = useAuth();
  const { getMyBookings } = useData();
  const navigate = useNavigate();
  const [services, setServices] = useState([]);

  useEffect(() => {
    if (!user) return;
    getMyBookings().then(setServices).catch(() => {});
  }, [user]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Service History</h1>
          <p className="text-gray-400 mt-2">Track all your vehicle service appointments</p>
        </div>
        <Button onClick={() => navigate('/customer/book-service')}>Book New Service</Button>
      </div>

      <Card>
        {services.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-4xl mb-3 block">📋</span>
            <h3 className="text-xl font-semibold text-white mb-2">No service history</h3>
            <p className="text-gray-400 mb-6">You haven't booked any services yet.</p>
            <Button onClick={() => navigate('/customer/book-service')}>Book Your First Service</Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-4 px-2 text-gray-300 font-medium">Vehicle</th>
                  <th className="text-left py-4 px-2 text-gray-300 font-medium">Service Center</th>
                  <th className="text-left py-4 px-2 text-gray-300 font-medium">Date</th>
                  <th className="text-left py-4 px-2 text-gray-300 font-medium">Service Type</th>
                  <th className="text-left py-4 px-2 text-gray-300 font-medium">Status</th>
                  <th className="text-left py-4 px-2 text-gray-300 font-medium">Price</th>
                </tr>
              </thead>
              <tbody>
                {services.map((s) => (
                  <tr key={s.id} className="border-b border-gray-800 hover:bg-white/5 transition-colors">
                    <td className="py-4 px-2 text-white">{s.vehicle_label}</td>
                    <td className="py-4 px-2 text-gray-300">{s.service_center_name}</td>
                    <td className="py-4 px-2 text-gray-300">{s.date}</td>
                    <td className="py-4 px-2 text-gray-300">{s.service_type}</td>
                    <td className="py-4 px-2">
                      <Badge variant={s.status}>
                        {s.status === 'in-progress' ? 'In Progress' : s.status?.charAt(0).toUpperCase() + s.status?.slice(1)}
                      </Badge>
                    </td>
                    <td className="py-4 px-2 text-gray-300">
                      {s.price_quote || <span className="text-gray-500 italic text-sm">Pending</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ServiceHistory;
