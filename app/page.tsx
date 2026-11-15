'use client';

import { FormEvent, useState } from 'react';
import { supabase } from '../lib/supabase';

const services = ['Display / Glass Changing', 'iPhone Glass Repair', 'Curved Glass', 'Flex Bonding', 'CPU / Motherboard Repair', 'Software / Flashing', 'Charging Repair', 'Other'];

export default function Home() {
  const [role, setRole] = useState('customer');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [device, setDevice] = useState('');
  const [service, setService] = useState(services[0]);
  const [problem, setProblem] = useState('');
  const [pickup, setPickup] = useState('Shop visit');
  const [address, setAddress] = useState('');
  const [payment, setPayment] = useState('UPI');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage('');
    if (!/^[6-9]\d{9}$/.test(phone)) { setMessage('कृपया 10 अंकों का सही मोबाइल नंबर डालें।'); return; }
    if (pickup !== 'Shop visit' && address.trim().length < 8) { setMessage('पिकअप के लिए पूरा पता लिखें।'); return; }
    if (!supabase) { setMessage('डेमो फॉर्म तैयार है। लाइव ऑर्डर चालू करने के लिए Supabase सेटअप जरूरी है।'); return; }
    setBusy(true);
    const { error } = await supabase.from('service_requests').insert({
      customer_name: name.trim(), phone, account_type: role, device_model: device.trim(),
      service_type: service, problem: problem.trim(), pickup_type: pickup,
      pickup_address: pickup === 'Shop visit' ? null : address.trim(), payment_preference: payment
    });
    setBusy(false);
    setMessage(error ? 'ऑर्डर जमा नहीं हुआ। कृपया कुछ देर बाद कोशिश करें या हमें कॉल करें।' : 'आपकी रिक्वेस्ट जमा हो गई है। हमारी टीम आपसे संपर्क करेगी।');
    if (!error) { setName(''); setPhone(''); setDevice(''); setProblem(''); setAddress(''); }
  }

  return <main>
    <header className="top"><div className="brandmark">SMR</div><div><strong>SHIVA MOBILE REPAIRING</strong><small>Repair • Pickup • Drop</small></div><a className="call" href="tel:8468837117">Call Now</a></header>
    <section className="hero"><p className="eyebrow">LAXMI NAGAR, DELHI</p><h1>आपके मोबाइल की<br/><span>हर परेशानी का समाधान</span></h1><p>Mobile Repairing | iPhone Glass | Flex Bonding | CPU & Motherboard Repair</p><div className="actions"><a href="#booking" className="primary">बुकिंग करें</a><a href="https://wa.me/918468837117" className="secondary">WhatsApp</a></div></section>
    <section className="services"><h2>हमारी सेवाएँ</h2><div className="servicegrid">{services.map((s) => <div className="service" key={s}><span>✓</span>{s}</div>)}</div><p className="note">दुकानदारों और ग्राहकों—दोनों के मोबाइल रिपेयर किए जाते हैं। Pickup & Drop उपलब्ध।</p></section>
    <section className="booking" id="booking"><h2>Repair Request / रिपेयर बुकिंग</h2><p>अपनी जानकारी भरें। हमारी टीम आपसे संपर्क करेगी।</p>
      <form onSubmit={submit}>
        <label>आप कौन हैं? / Account type<select value={role} onChange={e=>setRole(e.target.value)}><option value="customer">Customer / ग्राहक</option><option value="dealer">Dealer / दुकानदार</option></select></label>
        <div className="two"><label>नाम<input required value={name} onChange={e=>setName(e.target.value)} placeholder="आपका नाम"/></label><label>मोबाइल नंबर<input required inputMode="numeric" maxLength={10} value={phone} onChange={e=>setPhone(e.target.value.replace(/\D/g,''))} placeholder="10 digit number"/></label></div>
        <label>मोबाइल मॉडल<input required value={device} onChange={e=>setDevice(e.target.value)} placeholder="जैसे iPhone 13 / Redmi Note"/></label>
        <label>कौन-सी सर्विस चाहिए?<select value={service} onChange={e=>setService(e.target.value)}>{services.map(s=><option key={s}>{s}</option>)}</select></label>
        <label>समस्या का विवरण<textarea value={problem} onChange={e=>setProblem(e.target.value)} placeholder="मोबाइल में क्या समस्या है?" rows={3}/></label>
        <label>मोबाइल कैसे देना चाहेंगे?<select value={pickup} onChange={e=>setPickup(e.target.value)}><option>Shop visit</option><option>Pickup & Drop</option><option>Pickup only</option></select></label>
        {pickup !== 'Shop visit' && <label>पिकअप का पता<textarea required value={address} onChange={e=>setAddress(e.target.value)} placeholder="पूरा पता और नजदीकी पहचान" rows={2}/></label>}
        <label>पेमेंट का तरीका<select value={payment} onChange={e=>setPayment(e.target.value)}><option>UPI</option><option>Cash</option></select></label>
        <button disabled={busy}>{busy ? 'जमा हो रहा है…' : 'Request Submit करें'}</button>
        {message && <p className="message" role="status">{message}</p>}
      </form>
    </section>
    <footer><strong>SHIVA MOBILE REPAIRING</strong><p>D-380, Gali No. 12, Laxmi Nagar, Delhi</p><p><a href="tel:8468837117">8468837117</a></p><small>UPI अभी केवल payment preference है; भुगतान सत्यापन इस शुरुआती संस्करण में शामिल नहीं है।</small></footer>
  </main>;
}
