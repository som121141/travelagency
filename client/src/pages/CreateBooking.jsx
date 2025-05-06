import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { createBooking } from '../store/slices/bookingSlice';
import { fetchPackages } from '../store/slices/packageSlice';
import toast from 'react-hot-toast';

function CreateBooking() {
  const { packageId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { packages } = useSelector((state) => state.packages);
  const { loading } = useSelector((state) => state.bookings);

  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    numberOfPeople: 1
  });

  const [errors, setErrors] = useState({});
  const [packageData, setPackageData] = useState(null);

  useEffect(() => {
    dispatch(fetchPackages());
  }, [dispatch]);

  useEffect(() => {
    if (packages.length > 0) {
      const foundPackage = packages.find(pkg => pkg._id === packageId);
      if (foundPackage) {
        setPackageData(foundPackage);
      } else {
        toast.error('Package not found');
        navigate('/packages');
      }
    }
  }, [packages, packageId, navigate]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (!formData.numberOfPeople || formData.numberOfPeople < 1) {
      newErrors.numberOfPeople = 'Number of people must be at least 1';
    }

    // Validate dates
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    const today = new Date();

    if (startDate < today) {
      newErrors.startDate = 'Start date cannot be in the past';
    }
    if (endDate <= startDate) {
      newErrors.endDate = 'End date must be after start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fill in all required fields correctly');
      return;
    }

    try {
      const bookingData = {
        packageId,
        startDate: formData.startDate,
        endDate: formData.endDate,
        numberOfPeople: parseInt(formData.numberOfPeople)
      };

      const result = await dispatch(createBooking(bookingData)).unwrap();
      
      if (result) {
        toast.success('Booking created successfully!');
        navigate('/bookings');
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error(error || 'Failed to create booking');
    }
  };

  if (!packageData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 text-black">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Book Package: {packageData.title}</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Package Details</h2>
            <div className="space-y-2">
              <p className="text-gray-600">
                <span className="font-medium">Destination:</span> {packageData.destination}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Duration:</span> {packageData.duration} days
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Price per person:</span> ${packageData.price}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date *
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className={`w-full p-2 border-2 border-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                  errors.startDate ? 'border-red-500' : ''
                }`}
              />
              {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date *
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                min={formData.startDate || new Date().toISOString().split('T')[0]}
                className={`w-full p-2 border-2 border-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                  errors.endDate ? 'border-red-500' : ''
                }`}
              />
              {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of People *
              </label>
              <input
                type="number"
                name="numberOfPeople"
                min="1"
                value={formData.numberOfPeople}
                onChange={handleChange}
                className={`w-full p-2 border-2 border-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                  errors.numberOfPeople ? 'border-red-500' : ''
                }`}
              />
              {errors.numberOfPeople && <p className="text-red-500 text-sm mt-1">{errors.numberOfPeople}</p>}
            </div>

            <div className="pt-4">
              <h3 className="text-lg font-semibold mb-2">Booking Summary</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600">
                  <span className="font-medium">Total Price:</span> ${packageData.price * formData.numberOfPeople}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Duration:</span> {formData.startDate && formData.endDate ? 
                    Math.ceil((new Date(formData.endDate) - new Date(formData.startDate)) / (1000 * 60 * 60 * 24)) : 0} days
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Booking...
                  </span>
                ) : (
                  'Confirm Booking'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateBooking; 