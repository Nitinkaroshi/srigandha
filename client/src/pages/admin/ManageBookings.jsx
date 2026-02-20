import { useState, useEffect } from 'react';
import Sidebar from '../../components/admin/Sidebar';
import ConfirmModal from '../../components/common/ConfirmModal';
import { bookingsAPI, eventsAPI } from '../../utils/api';
import { toast } from 'sonner';

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState(null);
  const [filterEvent, setFilterEvent] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [filterEvent, filterStatus]);

  const fetchData = async () => {
    try {
      const eventsRes = await eventsAPI.getAllAdmin();
      setEvents(eventsRes.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterEvent) params.eventId = filterEvent;
      if (filterStatus) params.status = filterStatus;

      const response = await bookingsAPI.getAll(params);
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await bookingsAPI.updateStatus(id, newStatus);
      setBookings(bookings.map(b =>
        b._id === id ? { ...b, status: newStatus } : b
      ));
      toast.success(`Booking ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update booking status');
    }
  };

  const handleDeleteClick = (id) => {
    setBookingToDelete(id);
    setShowConfirmModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await bookingsAPI.delete(bookingToDelete);
      setBookings(bookings.filter(b => b._id !== bookingToDelete));
      toast.success('Booking deleted');
      setShowConfirmModal(false);
      setBookingToDelete(null);
    } catch (error) {
      toast.error('Failed to delete booking');
      setShowConfirmModal(false);
    }
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  const totalTickets = bookings.reduce((sum, b) => sum + (b.status !== 'cancelled' ? b.tickets : 0), 0);
  const confirmedCount = bookings.filter(b => b.status === 'confirmed').length;
  const pendingCount = bookings.filter(b => b.status === 'pending').length;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">Event Bookings / RSVPs</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-500">Total Bookings</p>
            <p className="text-2xl font-bold">{bookings.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-500">Confirmed</p>
            <p className="text-2xl font-bold text-green-600">{confirmedCount}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-500">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-500">Total Attendees</p>
            <p className="text-2xl font-bold text-blue-600">{totalTickets}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6 flex flex-wrap gap-4">
          <select
            value={filterEvent}
            onChange={(e) => setFilterEvent(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary"
          >
            <option value="">All Events</option>
            {events.map(event => (
              <option key={event._id} value={event._id}>{event.title}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tickets</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {bookings.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                        No bookings found
                      </td>
                    </tr>
                  ) : (
                    bookings.map((booking) => (
                      <tr key={booking._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {new Date(booking.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {booking.event?.title || 'Deleted Event'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {booking.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          <div>{booking.email}</div>
                          <div>{booking.phone}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {booking.tickets}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[booking.status]}`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {booking.status === 'pending' && (
                            <button
                              onClick={() => handleStatusChange(booking._id, 'confirmed')}
                              className="text-green-600 hover:text-green-800 mr-2"
                            >
                              Confirm
                            </button>
                          )}
                          {booking.status !== 'cancelled' && (
                            <button
                              onClick={() => handleStatusChange(booking._id, 'cancelled')}
                              className="text-yellow-600 hover:text-yellow-800 mr-2"
                            >
                              Cancel
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteClick(booking._id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <ConfirmModal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={handleDeleteConfirm}
          title="Delete Booking"
          message="Are you sure you want to delete this booking?"
          confirmText="Delete"
          cancelText="Cancel"
        />
      </div>
    </div>
  );
};

export default ManageBookings;
