import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';

interface Appointment {
  id: string;
  date: string;
  status: string;
  notes?: string;
  pet: {
    id: string;
    name: string;
  };
  service: {
    id: string;
    name: string;
    duration: number;
    price: number;
  };
  serviceProvider: {
    id: string;
    name: string;
    type: string;
  };
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await fetch('/api/appointments');
      if (!response.ok) throw new Error('Failed to fetch appointments');
      const data = await response.json();
      setAppointments(data);
    } catch (err) {
      setError('Error loading appointments');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update appointment');
      
      // Refresh appointments after update
      fetchAppointments();
    } catch (err) {
      console.error('Error updating appointment:', err);
      alert('Failed to update appointment status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <div className="p-4">Loading appointments...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Appointments</h1>
        <button
          onClick={() => router.push('/services')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Book New Appointment
        </button>
      </div>

      {appointments.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No appointments found.</p>
          <p className="mt-2">
            <button
              onClick={() => router.push('/services')}
              className="text-blue-500 hover:underline"
            >
              Book your first appointment
            </button>
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold">{appointment.service.name}</h3>
                  <p className="text-sm text-gray-600">
                    with {appointment.serviceProvider.name}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    appointment.status
                  )}`}
                >
                  {appointment.status}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">Pet:</span> {appointment.pet.name}
                </p>
                <p>
                  <span className="font-medium">Date:</span>{' '}
                  {format(new Date(appointment.date), 'PPP p')}
                </p>
                <p>
                  <span className="font-medium">Duration:</span>{' '}
                  {appointment.service.duration} minutes
                </p>
                <p>
                  <span className="font-medium">Price:</span> $
                  {appointment.service.price}
                </p>
                {appointment.notes && (
                  <p>
                    <span className="font-medium">Notes:</span>{' '}
                    {appointment.notes}
                  </p>
                )}
              </div>

              {appointment.status === 'scheduled' && (
                <div className="mt-4 space-x-2">
                  <button
                    onClick={() =>
                      handleStatusUpdate(appointment.id, 'completed')
                    }
                    className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                  >
                    Mark Completed
                  </button>
                  <button
                    onClick={() =>
                      handleStatusUpdate(appointment.id, 'cancelled')
                    }
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 