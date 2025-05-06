import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'https://travelagency-drrn.onrender.com/api';

// Create a new package
export const createPackage = createAsyncThunk(
    'packages/create',
    async(formData, { getState, rejectWithValue }) => {
        try {
            const { token } = getState().auth;

            // Convert FormData to a plain object for debugging
            const formDataObj = {};
            for (let [key, value] of formData.entries()) {
                formDataObj[key] = value;
            }
            console.log('Sending data:', formDataObj);

            const response = await axios.post(`${API_URL}/packages`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });
            return response.data;
        } catch (error) {
            console.error('Package creation error:', error.response ? error.data : error.message);
            return rejectWithValue(error.response ? error.data ? error.message : error.message || 'Failed to create package' : error.message || 'Failed to create package');
        }
    }
);

// Fetch all packages
export const fetchPackages = createAsyncThunk(
    'packages/fetchAll',
    async(_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/packages`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

// Fetch agency packages
export const fetchAgencyPackages = createAsyncThunk(
    'packages/fetchAgency',
    async(_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/packages/agency`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

// Update package
export const updatePackage = createAsyncThunk(
    'packages/update',
    async({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${API_URL}/packages/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

// Delete package
export const deletePackage = createAsyncThunk(
    'packages/delete',
    async(id, { rejectWithValue }) => {
        try {
            await axios.delete(`${API_URL}/packages/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

const initialState = {
    packages: [],
    loading: false,
    error: null,
};

const packageSlice = createSlice({
    name: 'packages',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
        // Create package
            .addCase(createPackage.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createPackage.fulfilled, (state, action) => {
                state.loading = false;
                state.packages.push(action.payload);
            })
            .addCase(createPackage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch all packages
            .addCase(fetchPackages.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPackages.fulfilled, (state, action) => {
                state.loading = false;
                state.packages = action.payload;
            })
            .addCase(fetchPackages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch agency packages
            .addCase(fetchAgencyPackages.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAgencyPackages.fulfilled, (state, action) => {
                state.loading = false;
                state.packages = action.payload;
            })
            .addCase(fetchAgencyPackages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update package
            .addCase(updatePackage.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatePackage.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.packages.findIndex((pkg) => pkg._id === action.payload._id);
                if (index !== -1) {
                    state.packages[index] = action.payload;
                }
            })
            .addCase(updatePackage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Delete package
            .addCase(deletePackage.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deletePackage.fulfilled, (state, action) => {
                state.loading = false;
                state.packages = state.packages.filter((pkg) => pkg._id !== action.payload);
            })
            .addCase(deletePackage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearError } = packageSlice.actions;
export default packageSlice.reducer;