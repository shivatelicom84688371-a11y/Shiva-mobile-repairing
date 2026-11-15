'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';

export default function DealerProfile() {
  const [profile, setProfile] = useState<any>(null);
  const [message, setMessage] = useState('Loading...');

  useEffect(() => {
    async function loadProfile() {
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
        .from('dealers')
        .select('shop_name, owner_name, phone, address')
        .eq('user_id', authData.user.id)
        .maybeSingle();

      if (error) {
        setMessage('Profile Error: ' + error.message);
        return;
      }

      if (!data) {
        setMessage('Dealer Profile नहीं मिला।');
        return;
      }

      setProfile(data);
      setMessage('');
    }

    loadProfile();
  }, []);

  return (
    <main style={{
      maxWidth: 600,
      margin: '30px auto',
      padding: 20
    }}>
      <h1>Dealer Profile</h1>
      <h3>Shiva Mobile Repairing</h3>

      {message && <p>{message}</p>}

      {profile && (
        <div style={{
          border: '1px solid #ccc',
          borderRadius: 10,
          padding: 20,
          marginTop: 20
        }}>
          <h2>{profile.shop_name}</h2>
          <p><b>Owner Name:</b> {profile.owner_name}</p>
          <p><b>Mobile:</b> {profile.phone}</p>
          <p><b>Address:</b> {profile.address}</p>
        </div>
      )}

      <button
        onClick={() => window.location.href = '/dealer/dashboard'}
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
        Dashboard पर वापस जाएँ
      </button>
    </main>
  );
}