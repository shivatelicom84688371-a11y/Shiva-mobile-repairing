'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function DealerRegistration() {
  const [form, setForm] = useState({
    shop_name: '',
    owner_name: '',
    phone: '',
    address: '',
    email: '',
    password: '',
  });

  const [message, setMessage] = useState('');

  async function register(e: React.FormEvent) {
    e.preventDefault();
    setMessage('Registration हो रहा है...');

    if (!supabase) {
      setMessage('Supabase configuration नहीं मिली।');
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    });

    if (error || !data.user) {
      setMessage(error?.message || 'Registration नहीं हुआ।');
      return;
    }

    if (!data.session) {
      setMessage(
        'Account बन गया। Email confirmation करके login करें, फिर दुकान की जानकारी सेव करें।'
      );
      return;
    }

    const { error: profileError } = await supabase
      .from('dealers')
      .insert({
        user_id: data.user.id,
        shop_name: form.shop_name,
        owner_name: form.owner_name,
        phone: form.phone,
        address: form.address,
      });

    if (profileError) {
      setMessage('दुकान की जानकारी सेव नहीं हुई: ' + profileError.message);
      return;
    }

    setMessage('Dealer Registration सफल हुआ!');
  }

  return (
    <main style={{ maxWidth: 450, margin: '40px auto', padding: 20 }}>
      <h1>Dealer Registration</h1>

      <form onSubmit={register}>
        {([
          ['shop_name', 'Shop Name'],
          ['owner_name', 'Owner Name'],
          ['phone', 'Mobile Number'],
          ['address', 'Address'],
          ['email', 'Email'],
          ['password', 'Password'],
        ] as const).map(([key, label]) => (
          <input
            key={key}
            placeholder={label}
            type={
              key === 'password'
                ? 'password'
                : key === 'email'
                ? 'email'
                : 'text'
            }
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

        <button type="submit" style={{ padding: 12, width: '100%' }}>
          Register
        </button>
      </form>

      <p>{message}</p>
    </main>
  );
}