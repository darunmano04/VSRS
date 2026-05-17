import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import Card from '../components/UI/Card';
import { useNavigate } from 'react-router-dom';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const { getVehicles, getMyBookings } = useData();
  const navigate = useNavigate();

  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    Promise.all([
      getVehicles().then(setVehicles),
      getMyBookings().then(setBookings),
    ])
      .catch((err) => setError(err.message || 'Failed to load data'))
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-xl mt-4">
        ⚠️ {error}
        <button onClick={() => window.location.reload()} className="ml-3 underline text-red-300">Retry</button>
      </div>
    );
  }

  const activeServices = bookings.filter(b => b.status === 'in-progress' || b.status === 'pending').length;
  const completedServices = bookings.filter(b => b.status === 'completed').length;

  const stats = [
    { title: 'Total Vehicles', value: vehicles.length, color: 'text-[#2563eb]', bgColor: 'bg-[#2563eb]/10', icon: '🚗' },
    { title: 'Active Services', value: activeServices, color: 'text-[#f59e0b]', bgColor: 'bg-[#f59e0b]/10', icon: '🔧' },
    { title: 'Completed Services', value: completedServices, color: 'text-[#22c55e]', bgColor: 'bg-[#22c55e]/10', icon: '✅' },
  ];

  const recentBookings = [...bookings].slice(0, 3);

  const statusColors = {
    pending: 'bg-yellow-500/20 text-yellow-400',
    'in-progress': 'bg-blue-500/20 text-blue-400',
    completed: 'bg-green-500/20 text-green-400',
    rejected: 'bg-red-500/20 text-red-400',
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Welcome back, {user?.name}! 👋</h1>
        <p className="text-gray-400 mt-2">Here's what's happening with your vehicles today.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} hover className="text-center">
            <div className={`w-16 h-16 ${stat.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
              <span className="text-2xl">{stat.icon}</span>
            </div>
            <h3 className={`text-3xl font-bold ${stat.color} mb-2`}>{stat.value}</h3>
            <p className="text-gray-400">{stat.title}</p>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card>
          <h3 className="text-xl font-semibold text-white mb-4">Recent Activity</h3>
          {recentBookings.length === 0 ? (
            <p className="text-gray-400 text-sm py-4">No bookings yet. Book your first service!</p>
          ) : (
            <div className="space-y-3">
              {recentBookings.map(b => (
                <div key={b.id} className="flex items-center justify-between p-4 bg-[#0f0f0f] rounded-xl">
                  <div>
                    <p className="text-white text-sm">{b.service_type} — {b.vehicle_label}</p>
                    <p className="text-xs text-gray-400">{b.service_center_name} · {b.date}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[b.status] || 'bg-gray-600/20 text-gray-300'}`}>
                    {b.status === 'in-progress' ? 'In Progress' : b.status?.charAt(0).toUpperCase() + b.status?.slice(1)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button onClick={() => navigate('/customer/book-service')} className="w-full p-4 bg-[#2563eb] text-white rounded-xl hover:bg-[#1d4ed8] transition-colors duration-200 text-left flex items-center gap-3">
              <span className="text-xl">📅</span>
              <div><p className="font-semibold">Book New Service</p><p className="text-xs text-blue-200">Schedule a service appointment</p></div>
            </button>
            <button onClick={() => navigate('/customer/add-vehicle')} className="w-full p-4 bg-[#22c55e] text-white rounded-xl hover:bg-[#16a34a] transition-colors duration-200 text-left flex items-center gap-3">
              <span className="text-xl">🚗</span>
              <div><p className="font-semibold">Add New Vehicle</p><p className="text-xs text-green-100">Register a vehicle</p></div>
            </button>
            <button onClick={() => navigate('/customer/service-history')} className="w-full p-4 bg-[#8b5cf6] text-white rounded-xl hover:bg-[#7c3aed] transition-colors duration-200 text-left flex items-center gap-3">
              <span className="text-xl">📋</span>
              <div><p className="font-semibold">View Service History</p><p className="text-xs text-purple-200">See all your service records</p></div>
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CustomerDashboard;
