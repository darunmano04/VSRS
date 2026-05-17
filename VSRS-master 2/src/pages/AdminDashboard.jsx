import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import Card from '../components/UI/Card';
import Badge from '../components/UI/Badge';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');
  const { getAllUsers, getAllBookings } = useData();
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getAllUsers().then(setUsers),
      getAllBookings().then(setBookings),
    ])
      .catch((err) => setError(err.message || 'Failed to load data'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading admin data...</p>
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

  const customers = users.filter(u => u.role === 'customer');
  const serviceCenters = users.filter(u => u.role === 'service-center');
  const completedCount = bookings.filter(b => b.status === 'completed').length;

  const tabs = ['users', 'service-centers', 'service-records'];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-gray-400 mt-2">Manage system users, service centers, and monitor all activities</p>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <Card className="text-center"><h3 className="text-2xl font-bold text-[#2563eb] mb-2">{users.length}</h3><p className="text-gray-400">Total Users</p></Card>
        <Card className="text-center"><h3 className="text-2xl font-bold text-[#22c55e] mb-2">{serviceCenters.length}</h3><p className="text-gray-400">Service Centers</p></Card>
        <Card className="text-center"><h3 className="text-2xl font-bold text-[#f59e0b] mb-2">{bookings.length}</h3><p className="text-gray-400">Total Bookings</p></Card>
        <Card className="text-center"><h3 className="text-2xl font-bold text-[#8b5cf6] mb-2">{completedCount}</h3><p className="text-gray-400">Completed</p></Card>
      </div>

      <div className="flex space-x-1 bg-[#1f1f1f] p-1 rounded-xl">
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 capitalize ${activeTab === tab ? 'bg-[#2563eb] text-white' : 'text-gray-400 hover:text-white'}`}>
            {tab.replace('-', ' ')}
          </button>
        ))}
      </div>

      <Card>
        {activeTab === 'users' && (
          <>
            <h2 className="text-xl font-semibold text-white mb-6">All Users ({users.length})</h2>
            {users.length === 0 ? <p className="text-gray-400 py-8 text-center">No users yet.</p> : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead><tr className="border-b border-gray-700">
                    {['Name','Email','Phone','Role','Registered'].map(h => <th key={h} className="text-left py-4 px-2 text-gray-300 font-medium">{h}</th>)}
                  </tr></thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id} className="border-b border-gray-800 hover:bg-white/5 transition-colors">
                        <td className="py-4 px-2 text-white">{u.name}</td>
                        <td className="py-4 px-2 text-gray-300">{u.email}</td>
                        <td className="py-4 px-2 text-gray-300">{u.phone || '—'}</td>
                        <td className="py-4 px-2"><Badge variant={u.role === 'service-center' ? 'in-progress' : u.role === 'admin' ? 'completed' : 'default'}>{u.role}</Badge></td>
                        <td className="py-4 px-2 text-gray-400 text-sm">{u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {activeTab === 'service-centers' && (
          <>
            <h2 className="text-xl font-semibold text-white mb-6">Service Center Accounts ({serviceCenters.length})</h2>
            {serviceCenters.length === 0 ? <p className="text-gray-400 py-8 text-center">No service centers registered.</p> : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead><tr className="border-b border-gray-700">
                    {['Name','Email','Phone','Registered'].map(h => <th key={h} className="text-left py-4 px-2 text-gray-300 font-medium">{h}</th>)}
                  </tr></thead>
                  <tbody>
                    {serviceCenters.map(sc => (
                      <tr key={sc.id} className="border-b border-gray-800 hover:bg-white/5 transition-colors">
                        <td className="py-4 px-2 text-white">{sc.name}</td>
                        <td className="py-4 px-2 text-gray-300">{sc.email}</td>
                        <td className="py-4 px-2 text-gray-300">{sc.phone || '—'}</td>
                        <td className="py-4 px-2 text-gray-400 text-sm">{sc.created_at ? new Date(sc.created_at).toLocaleDateString() : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {activeTab === 'service-records' && (
          <>
            <h2 className="text-xl font-semibold text-white mb-6">All Service Records ({bookings.length})</h2>
            {bookings.length === 0 ? <p className="text-gray-400 py-8 text-center">No bookings yet.</p> : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead><tr className="border-b border-gray-700">
                    {['Customer','Vehicle','Service Center','Date','Service','Status','Price'].map(h => <th key={h} className="text-left py-4 px-2 text-gray-300 font-medium">{h}</th>)}
                  </tr></thead>
                  <tbody>
                    {bookings.map(b => (
                      <tr key={b.id} className="border-b border-gray-800 hover:bg-white/5 transition-colors">
                        <td className="py-4 px-2 text-white">{b.user_name}</td>
                        <td className="py-4 px-2 text-gray-300 text-sm">{b.vehicle_label}</td>
                        <td className="py-4 px-2 text-gray-300">{b.service_center_name}</td>
                        <td className="py-4 px-2 text-gray-300">{b.date}</td>
                        <td className="py-4 px-2 text-gray-300">{b.service_type}</td>
                        <td className="py-4 px-2"><Badge variant={b.status}>{b.status === 'in-progress' ? 'In Progress' : b.status?.charAt(0).toUpperCase() + b.status?.slice(1)}</Badge></td>
                        <td className="py-4 px-2 text-gray-300">{b.price_quote || <span className="text-gray-500 italic text-sm">Pending</span>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
};

export default AdminDashboard;
