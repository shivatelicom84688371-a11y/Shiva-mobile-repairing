'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function DealerDashboard() {
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const [form, setForm] = useState({
    shop_name: '',
    owner_name: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    async function loadDealer() {
      if (!supabase) {
        setMessage('Supabase configuration नहीं मिली।');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.auth.getUser();

      if (error || !data.user) {
        setMessage('पहले Dealer Login करें।');
        setLoading(false);
        return;
      }

      setUserId(data.user.id);

      const { data: dealer, error: dealerError } = await supabase
        .from('dealers')
        .select('shop_name, owner_name, phone, address')
        .eq('user_id', data.user.id)
        .maybeSingle();

      if (dealerError) {
        setMessage(dealerError.message);
      } else if (dealer) {
        setForm({
          shop_name: dealer.shop_name || '',
          owner_name: dealer.owner_name || '',
          phone: dealer.phone || '',
          address: dealer.address || '',
        });
        setMessage('दुकान की जानकारी मिल गई।');
      } else {
        setMessage('अपनी दुकान की जानकारी भरें।');
      }

      setLoading(false);
    }

    loadDealer();
  }, []);

  async function saveDealer(e: React.FormEvent) {
    e.preventDefault();

    if (!supabase || !userId) {
      setMessage('पहले Dealer Login करें।');
      return;
    }

    setMessage('जानकारी सेव हो रही है...');

    const { data: existing, error: findError } = await supabase
      .from('dealers')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    if (findError) {
      setMessage(findError.message);
      return;
    }

    let saveError = null;

    if (existing) {
      const { error } = await supabase
        .from('dealers')
        .update(form)
        .eq('user_id', userId);

      saveError = error;
    } else {
      const { error } = await supabase
        .from('dealers')
        .insert({
          ...form,
          user_id: userId,
        });

      saveError = error;
    }

    if (saveError) {
      setMessage('जानकारी सेव नहीं हुई: ' + saveError.message);
      return;
    }

    setMessage('दुकान की जानकारी सफलतापूर्वक सेव हो गई!');
  }

  async function logout() {
    if (supabase) {
      await supabase.auth.signOut();
    }

    window.location.href = '/dealer/login';
  }

  if (loading) {
    return <main style={{ padding: 20 }}>Loading...</main>;
  }

  if (!userId) {
    return (
      <main style={{ padding: 20 }}>
        <h2>Dealer Login जरूरी है</h2>
        <button onClick={() => window.location.href = '/dealer/login'}>
          Login करें
        </button>
        <p>{message}</p>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 450, margin: '40px auto', padding: 20 }}>
      <h1>Dealer Dashboard</h1>
      <p>अपनी दुकान की जानकारी भरें</p>

      <form onSubmit={saveDealer}>
        {([
          ['shop_name', 'Shop Name'],
          ['owner_name', 'Owner Name'],
          ['phone', 'Mobile Number'],
          ['address', 'Address'],
        ] as const).map(([key, label]) => (
          <input
            key={key}
            placeholder={label}
            required
            value={form[key]}
            onChange={(e) =>
              setForm({ ...form, [key]: e.target.value })
            }
            style={{
              display: 'block',
              width: '100%',
              padding: 12,
              marginBottom: 12,
              boxSizing: 'border-box',
            }}
          />
        ))}

        <button
          type="submit"
          style={{ padding: 12, width: '100%' }}
        >
          दुकान की जानकारी सेव करें
        </button>
      </form>

      <p>{message}</p>

      <button onClick={logout}>Logout</button>
    </main>
  );
}