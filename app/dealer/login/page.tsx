'use client';

import { useState } from 'react';
import { supabase } from '../../../lib/supabase';

export default function DealerLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setMessage('Login हो रहा है...');

    if (!supabase) {
      setMessage('Supabase configuration नहीं मिली।');
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    window.location.href = '/dealer';
  }

  return (
    <main style={{ maxWidth: 450, margin: '40px auto', padding: 20 }}>
      <h1>Dealer Login</h1>
      <form onSubmit={login}>
        <input type="email" placeholder="Email" required value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ display: 'block', width: '100%', padding: 12, marginBottom: 12 }} />

        <input type="password" placeholder="Password" required value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ display: 'block', width: '100%', padding: 12, marginBottom: 12 }} />

        <button type="submit" style={{ padding: 12, width: '100%' }}>
          Login
        </button>
      </form>
      <p>{message}</p>
    </main>
  );
}