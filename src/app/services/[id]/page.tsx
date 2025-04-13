'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { StarIcon, MapPinIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
}

interface ServiceProvider {
  id: string;
  name: string;
  type: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  rating: number | null;
  services: Service[];
}

interface Pet {
  id: string;
  name: string;
  type: string;
}

export default function ServiceProviderPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [provider, setProvider] = useState<ServiceProvider | null>(null);
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<string>('');
  const [selectedPet, setSelectedPet] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    Promise.all([
      fetchProvider(),
      fetchPets(),
    ]).finally(() => setLoading(false));
  }, []);

  const fetchProvider = async () => {
    try {
      const response = await fetch(`/api/service-providers/${params.id}`);
      if (!response.ok) throw new Error('Failed to fetch provider');
      const data = await response.json();
      setProvider(data);
    } catch (error) {
      console.error('Error fetching provider:', error);
    }
  };

  const fetchPets = async () => {
    try {
      const response = await fetch('/api/pets');
      if (!response.ok) throw new Error('Failed to fetch pets');
      const data = await response.json();
      setPets(data);
    } catch (error) {
      console.error('Error fetching pets:', error);
    }
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !selectedPet || !selectedDate || !selectedTime) {
      alert('Please fill in all fields');
      return;
    }

    setBookingLoading(true);
    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceId: selectedService,
          petId: selectedPet,
          serviceProviderId: provider?.id,
          date: `${selectedDate}T${selectedTime}`,
        }),
      });

      if (!response.ok) throw new Error('Failed to create appointment');

      router.push('/appointments');
    } catch (error) {
      console.error('Error creating appointment:', error);
      alert('Failed to book appointment. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    return slots;
  };

  if (loading || !provider) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
        {/* Provider Details */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {provider.name}
          </h1>
          <p className="text-sm text-indigo-600 mb-4">{provider.type}</p>
          <p className="text-gray-500 mb-6">{provider.description}</p>

          <div className="space-y-4 mb-8">
            <div className="flex items-center text-gray-500">
              <MapPinIcon className="h-5 w-5 mr-2" />
              {provider.address}
            </div>
            <div className="flex items-center text-gray-500">
              <PhoneIcon className="h-5 w-5 mr-2" />
              {provider.phone}
            </div>
            <div className="flex items-center text-gray-500">
              <EnvelopeIcon className="h-5 w-5 mr-2" />
              {provider.email}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Available Services
            </h2>
            <div className="space-y-4">
              {provider.services.map((service) => (
                <div
                  key={service.id}
                  className="bg-gray-50 p-4 rounded-lg"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {service.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {service.description}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Duration: {service.duration} minutes
                      </p>
                    </div>
                    <p className="text-lg font-medium text-gray-900">
                      ₹{service.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <div className="mt-10 lg:mt-0">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Book an Appointment
            </h2>
            <form onSubmit={handleBooking} className="space-y-6">
              <div>
                <label htmlFor="service" className="block text-sm font-medium text-gray-700">
                  Select Service
                </label>
                <select
                  id="service"
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="">Choose a service</option>
                  {provider.services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name} - ₹{service.price}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="pet" className="block text-sm font-medium text-gray-700">
                  Select Pet
                </label>
                <select
                  id="pet"
                  value={selectedPet}
                  onChange={(e) => setSelectedPet(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="">Choose a pet</option>
                  {pets.map((pet) => (
                    <option key={pet.id} value={pet.id}>
                      {pet.name} ({pet.type})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                  Select Date
                </label>
                <input
                  type="date"
                  id="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                  Select Time
                </label>
                <select
                  id="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="">Choose a time</option>
                  {generateTimeSlots().map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={bookingLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {bookingLoading ? 'Booking...' : 'Book Appointment'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 