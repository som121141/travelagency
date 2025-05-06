import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPackages } from '../store/slices/packageSlice';
import toast from 'react-hot-toast';

function PackageDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { packages, loading, error } = useSelector((state) => state.packages);
  const { user } = useSelector((state) => state.auth);

  const [packageData, setPackageData] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    dispatch(fetchPackages());
  }, [dispatch]);

  useEffect(() => {
    if (packages.length > 0) {
      const foundPackage = packages.find(pkg => pkg._id === id);
      if (foundPackage) {
        setPackageData(foundPackage);
      } else {
        toast.error('Package not found');
        navigate('/packages');
      }
    }
  }, [packages, id, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    toast.error(error);
    return null;
  }

  if (!packageData) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 text-black">
      

      {/* Package Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h1 className="text-3xl font-bold mb-4">{packageData.title}</h1>
            <div className="flex items-center space-x-4 mb-6">
              <span className="text-gray-600">
                <i className="fas fa-map-marker-alt mr-2"></i>
                {packageData.destination}
              </span>
              <span className="text-gray-600">
                <i className="fas fa-clock mr-2"></i>
                {packageData.duration} days
              </span>
            </div>
            <p className="text-gray-700 mb-6">{packageData.description}</p>
          </div>

          {/* Features */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Package Features</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {packageData.features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-blue-600 mb-2">
                ${packageData.price}
              </h2>
              <p className="text-gray-600">per person</p>
            </div>

            {user?.role === 'client' ? (
              <button
                onClick={() => navigate(`/bookings/create/${packageData._id}`)}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300"
              >
                Book Now
              </button>
            ) : user?.role === 'agency' && packageData.agency === user._id ? (
              <div className="space-y-4">
                <button
                  onClick={() => navigate(`/packages/edit/${packageData._id}`)}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300"
                >
                  Edit Package
                </button>
                <button
                  onClick={() => {/* Handle delete */}}
                  className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition duration-300"
                >
                  Delete Package
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300"
              >
                Login to Book
              </button>
            )}

            <div className="mt-6 pt-6 border-t">
              <h3 className="font-semibold mb-2">Package Status</h3>
              <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                packageData.isActive
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {packageData.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PackageDetails; 