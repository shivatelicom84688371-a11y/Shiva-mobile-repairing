'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../../../lib/supabase';

export default function DealerBookings() {
  const [userId, setUserId] = useState('');
  const [message, setMessage] = useState('');
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    customer_name: '',
    phone: '',
    device_model: '',
    service_type: 'Mobile Repairing',
    problem: '',
    pickup_type: 'Shop visit',
    pickup_address: '',
    payment_preference: 'Cash',
  });

  const loadBookings = useCallback(async (id: string) => {
    if (!supabase) return;

    setLoading(true);

    const { data: rows, error } = await supabase
      .from('service_requests')
      .select('*')
      .eq('dealer_user_id', id)
      .order('created_at', { ascending: false });

    if (error) {
      setMessage(error.message);
    } else {
      setBookings(rows || []);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    async function start() {
      if (!supabase) return;

      const { data, error } = await supabase.auth.getUser();

      if (error || !data.user) {
        setMessage('पहले Dealer Login करें।');
        return;
      }

      setUserId(data.user.id);
      await loadBookings(data.user.id);
    }

    start();
  }, [loadBookings]);

  useEffect(() => {
    if (!userId) return;

    const timer = setInterval(() => {
      loadBookings(userId);
    }, 5000);

    return () => clearInterval(timer);
  }, [userId, loadBookings]);

  async function submitBooking(e: React.FormEvent) {
    e.preventDefault();

    if (!supabase || !userId) {
      setMessage('पहले Dealer Login करें।');
      return;
    }

    setMessage('Booking जमा हो रही है...');

    const { error } = await supabase
      .from('service_requests')
      .insert({
        ...form,
        account_type: 'dealer',
        dealer_user_id: userId,
      });

    if (error) {
      setMessage('Booking नहीं हुई: ' + error.message);
      return;
    }

    setMessage('Booking सफलतापूर्वक जमा हो गई!');

    await loadBookings(userId);

    setForm({
      customer_name: '',
      phone: '',
      device_model: '',
      service_type: 'Mobile Repairing',
      problem: '',
      pickup_type: 'Shop visit',
      pickup_address: '',
      payment_preference: 'Cash',
    });
  }

  if (!userId) {
    return (
      <main style={{ padding: 20 }}>
        <h2>Dealer Login जरूरी है</h2>
        <p>{message}</p>
        <button onClick={() => window.location.href = '/dealer/login'}>
          Login करें
        </button>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 550, margin: '30px auto', padding: 20 }}>
      <h1>Dealer Repair Booking</h1>

      <form onSubmit={submitBooking}>
        <input
          placeholder="Customer Name"
          required
          value={form.customer_name}
          onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
          style={inputStyle}
        />

        <input
          placeholder="Customer Mobile Number"
          required
          pattern="[6-9][0-9]{9}"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          style={inputStyle}
        />

        <input
          placeholder="Mobile Model"
          required
          value={form.device_model}
          onChange={(e) => setForm({ ...form, device_model: e.target.value })}
          style={inputStyle}
        />

        <select
          value={form.service_type}
          onChange={(e) => setForm({ ...form, service_type: e.target.value })}
          style={inputStyle}
        >
          <option>Mobile Repairing</option>
          <option>Display Change</option>
          <option>Glass Change</option>
          <option>Software & Flashing</option>
          <option>Motherboard Repair</option>
          <option>Other</option>
        </select>

        <textarea
          placeholder="Mobile में क्या खराबी है?"
          value={form.problem}
          onChange={(e) => setForm({ ...form, problem: e.target.value })}
          style={inputStyle}
        />

        <select
          value={form.pickup_type}
          onChange={(e) => setForm({ ...form, pickup_type: e.target.value })}
          style={inputStyle}
        >
          <option>Shop visit</option>
          <option>Pickup & Drop</option>
          <option>Pickup only</option>
        </select>

        <input
          placeholder="Pickup Address (अगर जरूरी हो)"
          value={form.pickup_address}
          onChange={(e) => setForm({ ...form, pickup_address: e.target.value })}
          style={inputStyle}
        />

        <select
          value={form.payment_preference}
          onChange={(e) => setForm({ ...form, payment_preference: e.target.value })}
          style={inputStyle}
        >
          <option>Cash</option>
          <option>UPI</option>
        </select>

        <button type="submit" style={buttonStyle}>
          Booking जमा करें
        </button>
      </form>

      <p>{message}</p>

      <h2>मेरी Repair Bookings ({bookings.length})</h2>

      <button
        type="button"
        onClick={() => loadBookings(userId)}
        style={buttonStyle}
      >
        Refresh Bookings
      </button>

      {loading && <p>Bookings अपडेट हो रही हैं...</p>}

      {bookings.map((booking) => (
        <div key={booking.id} style={{
          border: '1px solid #ccc',
          borderRadius: 8,
          padding: 12,
          marginBottom: 12,
        }}>
          <b>{booking.device_model}</b>
          <p>Customer: {booking.customer_name}</p>
          <p>Mobile: {booking.phone}</p>
          <p>Status: {booking.status || 'New'}</p>
          <small>
            {booking.created_at
              ? new Date(booking.created_at).toLocaleString()
              : ''}
          </small>
        </div>
      ))}
    </main>
  );
}

const inputStyle = {
  display: 'block',
  width: '100%',
  padding: 12,
  marginBottom: 12,
  boxSizing: 'border-box' as const,
};

const buttonStyle = {
  width: '100%',
  padding: 14,
  background: '#1565c0',
  color: 'white',
  border: 'none',
  borderRadius: 6,
  cursor: 'pointer',
};