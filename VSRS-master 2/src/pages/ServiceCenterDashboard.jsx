import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import Card from '../components/UI/Card';
import Badge from '../components/UI/Badge';
import Button from '../components/UI/Button';

const ServiceCenterDashboard = () => {
  const { getServiceCenterBookings, updateBookingStatus } = useData();
  const [bookings, setBookings] = useState([]);
  const [priceInputs, setPriceInputs] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchBookings = () => {
    setLoading(true);
    getServiceCenterBookings()
      .then(setBookings)
      .catch((err) => setError(err.message || 'Failed to load bookings'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleAction = async (id, status) => {
    try {
      await updateBookingStatus(id, status, priceInputs[id]);
      fetchBookings();
    } catch (err) {
      setError(err.message || 'Action failed');
    }
  };

  const handlePriceChange = (id, val) => setPriceInputs(prev => ({ ...prev, [id]: val }));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading service requests...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-xl mt-4">
        ⚠️ {error}
        <button onClick={() => { setError(''); fetchBookings(); }} className="ml-3 underline text-red-300">Retry</button>
      </div>
    );
  }

  const pending = bookings.filter(b => b.status === 'pending').length;
  const inProgress = bookings.filter(b => b.status === 'in-progress').length;
  const completed = bookings.filter(b => b.status === 'completed').length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Service Center Dashboard</h1>
        <p className="text-gray-400 mt-2">Manage incoming service requests and update service status</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="text-center"><h3 className="text-2xl font-bold text-[#f59e0b] mb-2">{pending}</h3><p className="text-gray-400">Pending Requests</p></Card>
        <Card className="text-center"><h3 className="text-2xl font-bold text-[#2563eb] mb-2">{inProgress}</h3><p className="text-gray-400">In Progress</p></Card>
        <Card className="text-center"><h3 className="text-2xl font-bold text-[#22c55e] mb-2">{completed}</h3><p className="text-gray-400">Completed</p></Card>
      </div>

      <Card>
        <h2 className="text-xl font-semibold text-white mb-6">Service Requests</h2>
        {bookings.length === 0 ? (
          <div className="text-center py-12"><span className="text-4xl mb-3 block">📭</span><p className="text-gray-400">No service requests yet.</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  {['Customer','Vehicle','Service','Date','Status','Price Quote','Actions'].map(h => (
                    <th key={h} className="text-left py-4 px-2 text-gray-300 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id} className="border-b border-gray-800 hover:bg-white/5 transition-colors">
                    <td className="py-4 px-2 text-white">{b.user_name}</td>
                    <td className="py-4 px-2 text-gray-300 text-sm">{b.vehicle_label}</td>
                    <td className="py-4 px-2 text-gray-300">{b.service_type}</td>
                    <td className="py-4 px-2 text-gray-300">{b.date}</td>
                    <td className="py-4 px-2">
                      <Badge variant={b.status}>{b.status === 'in-progress' ? 'In Progress' : b.status?.charAt(0).toUpperCase() + b.status?.slice(1)}</Badge>
                    </td>
                    <td className="py-4 px-2">
                      <input type="text" placeholder="$0"
                        value={priceInputs[b.id] ?? b.price_quote ?? ''}
                        onChange={e => handlePriceChange(b.id, e.target.value)}
                        className="bg-[#0f0f0f] border border-gray-600 rounded-lg px-3 py-1 text-white text-sm w-24" />
                    </td>
                    <td className="py-4 px-2">
                      <div className="flex gap-2">
                        {b.status === 'pending' && (<>
                          <Button size="sm" variant="secondary" onClick={() => handleAction(b.id, 'in-progress')}>Accept</Button>
                          <Button size="sm" variant="danger" onClick={() => handleAction(b.id, 'rejected')}>Reject</Button>
                        </>)}
                        {b.status === 'in-progress' && (
                          <Button size="sm" onClick={() => handleAction(b.id, 'completed')}>Mark Done</Button>
                        )}
                      </div>
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

export default ServiceCenterDashboard;
