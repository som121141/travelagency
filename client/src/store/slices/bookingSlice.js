import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create a new booking
export const createBooking = createAsyncThunk(
    'bookings/create',
    async(bookingData, { getState, rejectWithValue }) => {
        try {
            const { token } = getState().auth;
            const response = await axios.post(`${API_URL}/bookings`, bookingData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response ? error.data ? error.message : error.message || 'Failed to update booking status' : error.message || 'Failed to update booking status');

        }
    }
);

// Fetch all bookings
export const fetchBookings = createAsyncThunk(
    'bookings/fetchAll',
    async(_, { getState, rejectWithValue }) => {
        try {
            const { token } = getState().auth;
            const response = await axios.get(`${API_URL}/bookings`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response ? error.data ? error.message : error.message || 'Failed to update booking status' : error.message || 'Failed to update booking status');

        }
    }
);

// Update booking status
export const updateBookingStatus = createAsyncThunk(
    'bookings/updateStatus',
    async({ id, status }, { getState, rejectWithValue }) => {
        try {
            const { token } = getState().auth;
            const response = await axios.patch(`${API_URL}/bookings/${id}/status`, { status }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response ? error.data ? error.message : error.message || 'Failed to update booking status' : error.message || 'Failed to update booking status');
        }
    }
);

// Update payment status
export const updatePaymentStatus = createAsyncThunk(
    'bookings/updatePayment',
    async({ id, paymentStatus }, { getState, rejectWithValue }) => {
        try {
            const { token } = getState().auth;
            const response = await axios.patch(`${API_URL}/bookings/${id}/payment`, { paymentStatus }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response ? error.data ? error.message : error.message || 'Failed to update payment status' : error.message || 'Failed to update payment status');
        }
    }
);

const initialState = {
    bookings: [],
    loading: false,
    error: null
};

const bookingSlice = createSlice({
    name: 'bookings',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
        // Create booking
            .addCase(createBooking.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createBooking.fulfilled, (state, action) => {
                state.loading = false;
                state.bookings.push(action.payload);
            })
            .addCase(createBooking.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch bookings
            .addCase(fetchBookings.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBookings.fulfilled, (state, action) => {
                state.loading = false;
                state.bookings = action.payload;
            })
            .addCase(fetchBookings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update booking status
            .addCase(updateBookingStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateBookingStatus.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.bookings.findIndex(booking => booking._id === action.payload._id);
                if (index !== -1) {
                    state.bookings[index] = action.payload;
                }
            })
            .addCase(updateBookingStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update payment status
            .addCase(updatePaymentStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatePaymentStatus.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.bookings.findIndex(booking => booking._id === action.payload._id);
                if (index !== -1) {
                    state.bookings[index] = action.payload;
                }
            })
            .addCase(updatePaymentStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearError } = bookingSlice.actions;
export default bookingSlice.reducer;