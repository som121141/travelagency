import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Alert,
} from '@mui/material';
import { fetchBookings, updateBookingStatus, updatePaymentStatus } from '../store/slices/bookingSlice';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  completed: 'bg-blue-100 text-blue-800',
};

const paymentStatusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-green-100 text-green-800',
  refunded: 'bg-red-100 text-red-800',
};

function Bookings() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { bookings, loading, error } = useSelector((state) => state.bookings);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [newPaymentStatus, setNewPaymentStatus] = useState('');

  useEffect(() => {
    dispatch(fetchBookings());
  }, [dispatch]);

  const handleStatusUpdate = async () => {
    if (selectedBooking && newStatus) {
      await dispatch(updateBookingStatus({ id: selectedBooking._id, status: newStatus }));
      setStatusDialogOpen(false);
      setSelectedBooking(null);
      setNewStatus('');
    }
  };

  const handlePaymentUpdate = async () => {
    if (selectedBooking && newPaymentStatus) {
      await dispatch(updatePaymentStatus({ id: selectedBooking._id, paymentStatus: newPaymentStatus }));
      setPaymentDialogOpen(false);
      setSelectedBooking(null);
      setNewPaymentStatus('');
    }
  };

  const renderBookingCard = (booking) => (
    <div key={booking._id} className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-semibold mb-4">{booking.package.title}</h3>
            <div className="space-y-2">
              <p className="text-gray-600">
                <span className="font-medium">Destination:</span> {booking.package.destination}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Duration:</span> {booking.package.duration} days
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Number of People:</span> {booking.numberOfPeople}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Total Price:</span> ${booking.totalPrice}
              </p>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Booking Details</h4>
            <div className="space-y-2">
              <p className="text-gray-600">
                <span className="font-medium">Start Date:</span>{' '}
                {new Date(booking.startDate).toLocaleDateString()}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">End Date:</span>{' '}
                {new Date(booking.endDate).toLocaleDateString()}
              </p>
              <div className="flex gap-2 mt-4">
                <span className={`px-3 py-1 rounded-full text-sm ${statusColors[booking.status]}`}>
                  {booking.status}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm ${paymentStatusColors[booking.paymentStatus]}`}>
                  {booking.paymentStatus}
                </span>
              </div>
              {(user.role === 'agency' || user.role === 'admin') && (
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => {
                      setSelectedBooking(booking);
                      setNewStatus(booking.status);
                      setStatusDialogOpen(true);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
                  >
                    Update Status
                  </button>
                  <button
                    onClick={() => {
                      setSelectedBooking(booking);
                      setNewPaymentStatus(booking.paymentStatus);
                      setPaymentDialogOpen(true);
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300"
                  >
                    Update Payment
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        {user.role === 'client' ? 'My Bookings' : 'Booking Management'}
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading bookings...</p>
        </div>
      ) : bookings.length > 0 ? (
        <div className="space-y-6">
          {bookings.map(renderBookingCard)}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600">No bookings found.</p>
        </div>
      )}

      {/* Status Update Dialog */}
      {statusDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Update Booking Status</h2>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full p-2 border rounded-lg mb-4"
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setStatusDialogOpen(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleStatusUpdate}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Status Update Dialog */}
      {paymentDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Update Payment Status</h2>
            <select
              value={newPaymentStatus}
              onChange={(e) => setNewPaymentStatus(e.target.value)}
              className="w-full p-2 border rounded-lg mb-4"
            >
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="refunded">Refunded</option>
            </select>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setPaymentDialogOpen(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handlePaymentUpdate}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Bookings; 