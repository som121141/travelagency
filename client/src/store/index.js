import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import packageReducer from './slices/packageSlice';
import bookingReducer from './slices/bookingSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        packages: packageReducer,
        bookings: bookingReducer,
    },
});

export default store;