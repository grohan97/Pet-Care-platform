'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  type: string;
  serviceProvider: {
    id: string;
    name: string;
    type: string;
    rating: number | null;
  };
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('all');
  const router = useRouter();

  useEffect(() => {
    fetchServices();
  }, [selectedType]);

  const fetchServices = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedType !== 'all') {
        params.append('type', selectedType);
      }
      
      const response = await fetch(`/api/services?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch services');
      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const serviceTypes = [
    { id: 'all', name: 'All Services' },
    { id: 'veterinary', name: 'Veterinary Care' },
    { id: 'grooming', name: 'Grooming' },
    { id: 'boarding', name: 'Boarding' },
    { id: 'walking', name: 'Dog Walking' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading services...</p>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Pet Care Services
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Professional pet care services for your beloved companions
          </p>
        </div>

        {/* Service type filter */}
        <div className="mt-12 flex justify-center space-x-4">
          {serviceTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`px-4 py-2 rounded-md ${
                selectedType === type.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              {type.name}
            </button>
          ))}
        </div>

        {/* Services grid */}
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white overflow-hidden shadow-lg rounded-lg hover:shadow-xl transition-shadow"
            >
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {service.name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      by {service.serviceProvider.name}
                    </p>
                  </div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                    {service.type}
                  </span>
                </div>

                <p className="mt-4 text-base text-gray-500">
                  {service.description}
                </p>

                <div className="mt-6 flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      ${service.price}
                    </p>
                    <p className="text-sm text-gray-500">
                      Duration: {service.duration} minutes
                    </p>
                  </div>
                  <button
                    onClick={() => router.push(`/services/${service.id}/book`)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Book Now
                  </button>
                </div>

                {service.serviceProvider.rating && (
                  <div className="mt-4 flex items-center">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`h-5 w-5 ${
                            i < Math.round(service.serviceProvider.rating)
                              ? 'text-yellow-400'
                              : 'text-gray-300'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 15.585l-6.327 3.89 1.42-7.897L.236 6.974l7.896-1.088L10 0l1.868 5.886 7.896 1.088-4.857 4.604 1.42 7.897z"
                          />
                        </svg>
                      ))}
                    </div>
                    <p className="ml-2 text-sm text-gray-500">
                      {service.serviceProvider.rating.toFixed(1)} stars
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {services.length === 0 && (
          <div className="mt-12 text-center">
            <p className="text-gray-500 text-lg">
              No services found for the selected category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 