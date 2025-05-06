import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createPackage } from '../store/slices/packageSlice';
import toast from 'react-hot-toast';

function CreatePackage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.packages);
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    destination: '',
    duration: '',
    price: '',
    features: [''],
    isActive: true
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.destination) newErrors.destination = 'Destination is required';
    if (!formData.duration) newErrors.duration = 'Duration is required';
    if (!formData.price) newErrors.price = 'Price is required';
    if (formData.features.length === 0 || formData.features[0] === '') {
      newErrors.features = 'At least one feature is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData((prev) => ({
      ...prev,
      features: newFeatures,
    }));
    if (errors.features) {
      setErrors((prev) => ({
        ...prev,
        features: '',
      }));
    }
  };

  const addFeature = () => {
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, ''],
    }));
  };

  const removeFeature = (index) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const formDataToSend = new FormData();
      
      // Add basic package information with proper type conversion
      formDataToSend.append('title', formData.title.trim());
      formDataToSend.append('description', formData.description.trim());
      formDataToSend.append('destination', formData.destination.trim());
      formDataToSend.append('duration', formData.duration.toString());
      formDataToSend.append('price', formData.price.toString());
      formDataToSend.append('isActive', formData.isActive.toString());
      
      // Add features as JSON string
      const filteredFeatures = formData.features.filter(feature => feature.trim() !== '');
      formDataToSend.append('features', JSON.stringify(filteredFeatures));
      
      // Log the FormData contents before sending
      const formDataObj = {};
      for (let [key, value] of formDataToSend.entries()) {
        formDataObj[key] = value;
      }
      console.log('Sending form data:', formDataObj);

      const result = await dispatch(createPackage(formDataToSend)).unwrap();
      console.log('Server response:', result);
      
      if (result) {
        toast.success('Package created successfully!');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error creating package:', error);
      toast.error(error || 'Failed to create package');
    }
  };

  if (user?.role !== 'agency') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          You don't have permission to access this page.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 text-black">
      <h1 className="text-3xl font-bold mb-8">Create New Travel Package</h1>
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Package Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full p-2 border-2 border-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                  errors.title ? 'border-red-500' : ''
                }`}
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Destination *
              </label>
              <input
                type="text"
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                className={`w-full p-2 border-2 border-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                  errors.destination ? 'border-red-500' : ''
                }`}
              />
              {errors.destination && <p className="text-red-500 text-sm mt-1">{errors.destination}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (days) *
              </label>
              <input
                type="number"
                name="duration"
                min="1"
                value={formData.duration}
                onChange={handleChange}
                className={`w-full p-2 border-2 border-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                  errors.duration ? 'border-red-500' : ''
                }`}
              />
              {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price ($) *
              </label>
              <input
                type="number"
                name="price"
                min="0"
                value={formData.price}
                onChange={handleChange}
                className={`w-full p-2 border-2 border-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                  errors.price ? 'border-red-500' : ''
                }`}
              />
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Description</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              className={`w-full p-2 border-2 border-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                errors.description ? 'border-red-500' : ''
              }`}
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Package Features</h2>
          <div className="space-y-4">
            {formData.features.map((feature, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => handleFeatureChange(index, e.target.value)}
                  placeholder={`Feature ${index + 1}`}
                  className={`flex-1 p-2 border-2 border-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                    errors.features ? 'border-red-500' : ''
                  }`}
                />
                <button
                  type="button"
                  onClick={() => removeFeature(index)}
                  className="p-2 text-red-500 hover:text-red-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
            {errors.features && <p className="text-red-500 text-sm mt-1">{errors.features}</p>}
            <button
              type="button"
              onClick={addFeature}
              className="mt-2 text-blue-600 hover:text-blue-800 flex items-center"
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Add Feature
            </button>
          </div>
        </div>

        {/* Submit Button */}
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
                Creating Package...
              </span>
            ) : (
              'Create Package'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreatePackage; 