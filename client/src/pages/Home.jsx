import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Paper,
} from '@mui/material';
import { fetchPackages } from '../store/slices/packageSlice';

function Home() {
  const dispatch = useDispatch();
  const { packages } = useSelector((state) => state.packages);

  useEffect(() => {
    dispatch(fetchPackages());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[70vh] bg-cover bg-center" style={{ backgroundImage: 'url(https://source.unsplash.com/random?travel)' }}>
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative h-full flex items-center">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-2xl text-white">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                Discover Your Next Adventure
              </h1>
              <p className="text-xl md:text-2xl mb-8">
                Explore amazing destinations and create unforgettable memories with our curated travel packages.
              </p>
              <RouterLink
                to="/packages"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition duration-300"
              >
                Explore Packages
              </RouterLink>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Packages Section */}
      <div className="container mx-auto px-4 py-16 text-black">
        <h2 className="text-3xl font-bold text-center mb-12">Featured Travel Packages</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.slice(0, 3).map((pkg) => (
            <div key={pkg._id} className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition duration-300">
              <img
                src={pkg.images?.[0] || 'https://source.unsplash.com/random?travel'}
                alt={pkg.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{pkg.title}</h3>
                <p className="text-gray-600 mb-4">{pkg.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-blue-600">${pkg.price}</span>
                  <RouterLink
                    to={`/packages/${pkg._id}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-300"
                  >
                    View Details
                  </RouterLink>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="bg-gray-100 py-16 text-black">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert Travel Guides</h3>
              <p className="text-gray-600">Our experienced guides ensure you have the best travel experience.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Best Price Guarantee</h3>
              <p className="text-gray-600">We offer competitive prices and value for money packages.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
              <p className="text-gray-600">Our customer support team is always ready to help you.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="container mx-auto px-4 py-16 text-center text-black">
        <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
        <p className="text-xl text-gray-600 mb-8">
          Join thousands of satisfied travelers who have experienced the world with us.
        </p>
        <RouterLink
          to="/register"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition duration-300"
        >
          Get Started
        </RouterLink>
      </div>
    </div>
  );
}

export default Home; 