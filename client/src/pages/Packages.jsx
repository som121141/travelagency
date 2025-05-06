import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchPackages } from '../store/slices/packageSlice';
import toast from 'react-hot-toast';

function Packages() {
  const dispatch = useDispatch();
  const { packages, loading, error } = useSelector((state) => state.packages);
  const { user } = useSelector((state) => state.auth);

  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    duration: '',
    destination: '',
  });

  useEffect(() => {
    dispatch(fetchPackages());
  }, [dispatch]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const filteredPackages = packages.filter((pkg) => {
    const matchesSearch = pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPrice = (!filters.minPrice || pkg.price >= Number(filters.minPrice)) &&
      (!filters.maxPrice || pkg.price <= Number(filters.maxPrice));

    const matchesDuration = !filters.duration || pkg.duration === Number(filters.duration);

    const matchesDestination = !filters.destination || 
      pkg.destination.toLowerCase().includes(filters.destination.toLowerCase());

    return matchesSearch && matchesPrice && matchesDuration && matchesDestination;
  });

  if (error) {
    toast.error(error);
  }

  return (
    <div className="container mx-auto px-4 py-8 text-black">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Travel Packages</h1>
        {user?.role === 'agency' && (
          <Link
            to="/packages/create"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Create New Package
          </Link>
        )}
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <input
              type="text"
              placeholder="Search packages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border-2 border-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Min Price ($)
            </label>
            <input
              type="number"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleFilterChange}
              className="w-full p-2 border-2 border-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Price ($)
            </label>
            <input
              type="number"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              className="w-full p-2 border-2 border-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration (days)
            </label>
            <input
              type="number"
              name="duration"
              value={filters.duration}
              onChange={handleFilterChange}
              className="w-full p-2 border-2 border-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Destination
            </label>
            <input
              type="text"
              name="destination"
              value={filters.destination}
              onChange={handleFilterChange}
              placeholder="Enter destination..."
              className="w-full p-2 border-2 border-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Packages Grid */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading packages...</p>
        </div>
      ) : filteredPackages.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPackages.map((pkg) => (
            <div key={pkg._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative h-48">
                <img
                  src={pkg.images?.[0] || 'https://source.unsplash.com/random?travel'}
                  alt={pkg.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full">
                  ${pkg.price}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{pkg.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{pkg.description}</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-600">
                    <i className="fas fa-map-marker-alt mr-2"></i>
                    {pkg.destination}
                  </span>
                  <span className="text-gray-600">
                    <i className="fas fa-clock mr-2"></i>
                    {pkg.duration} days
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">
                    <i className="fas fa-users mr-2"></i>
                    Max {pkg.maxGroupSize} people
                  </span>
                  <Link
                    to={`/packages/${pkg._id}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600">No packages found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}

export default Packages; 