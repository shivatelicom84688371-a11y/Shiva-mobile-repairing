'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';

export default function DealerHistory() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [message, setMessage] = useState('Loading...');

  useEffect(() => {
    async function loadHistory() {
      if (!supabase) {
        setMessage('Supabase connection नहीं है।');
        return;
      }

      const { data: authData, error: authError } =
        await supabase.auth.getUser();

      if (authError || !authData.user) {
        setMessage('पहले Dealer Login करें।');
        return;
      }

      const { data, error } = await supabase
        .from('service_requests')
        .select('*')
        .eq('dealer_user_id', authData.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        setMessage('Error: ' + error.message);
        return;
      }

      setBookings(data || []);
      setMessage('');
    }

    loadHistory();
  }, []);

  return (
    <main style={{
      maxWidth: 700,
      margin: '30px auto',
      padding: 20
    }}>
      <h1>Booking History</h1>
      <h3>Shiva Mobile Repairing</h3>

      {message && <p>{message}</p>}

      <h2>Total Bookings: {bookings.length}</h2>

      {bookings.map((booking) => (
        <div key={booking.id} style={{
          border: '1px solid #ccc',
          borderRadius: 10,
          padding: 15,
          marginBottom: 15
        }}>
          <h3>{booking.device_model || 'Device'}</h3>
          <p>Customer: {booking.customer_name || 'N/A'}</p>
          <p>Mobile: {booking.phone || 'N/A'}</p>
          <p>Problem: {booking.problem || 'N/A'}</p>
          <p>Status: {booking.status}</p>
          <p>Booking ID: {booking.id}</p>
          <p>
            Date: {booking.created_at
              ? new Date(booking.created_at).toLocaleString('en-IN')
              : 'N/A'}
          </p>
        </div>
      ))}

      <button
        onClick={() => window.location.href = '/dealer/dashboard'}
        style={{
          width: '100%',
          padding: 14,
          marginTop: 15
        }}
      >
        Dashboard पर वापस जाएँ
      </button>
    </main>
  );
}