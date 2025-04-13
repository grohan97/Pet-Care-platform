'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

interface Pet {
  id: string;
  name: string;
  type: string;
  breed: string | null;
  dateOfBirth: string | null;
  weight: number | null;
  dietaryNotes: string | null;
}

export default function PetsPage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      const response = await fetch('/api/pets');
      if (!response.ok) throw new Error('Failed to fetch pets');
      const data = await response.json();
      setPets(data);
    } catch (error) {
      console.error('Error fetching pets:', error);
    } finally {
      setLoading(false);
    }
  };

  const deletePet = async (petId: string) => {
    if (!confirm('Are you sure you want to remove this pet?')) return;

    try {
      const response = await fetch(`/api/pets/${petId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete pet');
      setPets(pets.filter(pet => pet.id !== petId));
    } catch (error) {
      console.error('Error deleting pet:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading pets...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Pets</h1>
        <button
          onClick={() => router.push('/pets/new')}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Pet
        </button>
      </div>

      {pets.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <h3 className="mt-2 text-sm font-medium text-gray-900">No pets</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by adding your first pet.
          </p>
          <div className="mt-6">
            <button
              onClick={() => router.push('/pets/new')}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Pet
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pets.map((pet) => (
            <div
              key={pet.id}
              className="bg-white rounded-lg shadow overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {pet.name}
                  </h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => router.push(`/pets/${pet.id}/edit`)}
                      className="p-1 text-gray-400 hover:text-gray-500"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => deletePet(pet.id)}
                      className="p-1 text-gray-400 hover:text-red-500"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <dl className="mt-4 space-y-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Type</dt>
                    <dd className="mt-1 text-sm text-gray-900">{pet.type}</dd>
                  </div>
                  {pet.breed && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Breed</dt>
                      <dd className="mt-1 text-sm text-gray-900">{pet.breed}</dd>
                    </div>
                  )}
                  {pet.dateOfBirth && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Age</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {new Date(pet.dateOfBirth).toLocaleDateString()}
                      </dd>
                    </div>
                  )}
                  {pet.weight && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Weight
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {pet.weight} kg
                      </dd>
                    </div>
                  )}
                </dl>
                <div className="mt-6 flex space-x-3">
                  <button
                    onClick={() => router.push(`/pets/${pet.id}/health`)}
                    className="flex-1 text-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Health Records
                  </button>
                  <button
                    onClick={() => router.push(`/pets/${pet.id}/appointments`)}
                    className="flex-1 text-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Book Service
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 