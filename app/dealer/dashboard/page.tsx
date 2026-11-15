'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';

export default function DealerDashboard() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [message, setMessage] = useState('Loading...');

  useEffect(() => {
    async function loadDashboard() {
      if (!supabase) return;

      const { data, error } = await supabase.auth.getUser();

      if (error || !data.user) {
        setMessage('पहले Dealer Login करें।');
        return;
      }

      const { data: rows, error: bookingError } = await supabase
        .from('service_requests')
        .select('id, status, device_model, customer_name')
        .eq('dealer_user_id', data.user.id);

      if (bookingError) {
        setMessage(bookingError.message);
        return;
      }

      setBookings(rows || []);
      setMessage('');
    }

    loadDashboard();
  }, []);

  async function logout() {
    if (!supabase) return;

    const { error } = await supabase.auth.signOut();

    if (error) {
      setMessage('Logout Error: ' + error.message);
      return;
    }

    window.location.href = '/dealer';
  }

  const cards = [
    { title: 'Total Bookings', value: bookings.length },
    { title: 'New Bookings', value: bookings.filter(b => b.status === 'new').length },
    { title: 'Repairing', value: bookings.filter(b => b.status === 'in_progress').length },
    { title: 'Ready', value: bookings.filter(b => b.status === 'ready').length },
    { title: 'Delivered', value: bookings.filter(b => b.status === 'delivered').length },
  ];

  return (
    <main style={{ maxWidth: 700, margin: '30px auto', padding: 20 }}>
      <h1>Dealer Dashboard</h1>
      <h3>Shiva Mobile Repairing</h3>

      <button onClick={logout} style={{
        padding: 12,
        background: '#c62828',
        color: 'white',
        border: 'none',
        borderRadius: 6
      }}>
        Logout
      </button>

      {message && <p>{message}</p>}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: 12,
        marginTop: 25
      }}>
        {cards.map(card => (
          <div key={card.title} style={{
            padding: 20,
            border: '1px solid #ccc',
            borderRadius: 10
          }}>
            <h3>{card.title}</h3>
            <h1>{card.value}</h1>
          </div>
        ))}
      </div>

      <h2 style={{ marginTop: 30 }}>मेरी Bookings</h2>

      {bookings.map(booking => (
        <div key={booking.id} style={{
          border: '1px solid #ccc',
          padding: 12,
          borderRadius: 8,
          marginBottom: 10
        }}>
          <b>{booking.device_model}</b>
          <p>Customer: {booking.customer_name}</p>
          <p>Status: {booking.status}</p>
        </div>
      ))}

      <button
        onClick={() => window.location.href = '/dealer/bookings'}
        style={{
          width: '100%',
          padding: 14,
          marginTop: 20,
          background: '#1565c0',
          color: 'white',
          border: 'none',
          borderRadius: 6
        }}
      >
        नई Booking करें
      </button>

      <button
        onClick={() => window.location.href = '/dealer/profile'}
        style={{
          width: '100%',
          padding: 14,
          marginTop: 10
        }}
      >
        Dealer Profile
      </button>
     <button
  onClick={() => window.location.href = '/dealer/history'}
  style={{
    width: '100%',
    padding: 14,
    marginTop: 10,
    background: '#2e7d32',
    color: 'white',
    border: 'none',
    borderRadius: 6
  }}
>
  Booking History देखें
</button>
    </main>
  );
}