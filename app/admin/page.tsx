"use client";

import { useState, type FormEvent } from "react";
import { supabase } from "../../lib/supabase";

type Request = {
  id: string;
  customer_name: string;
  phone: string;
  device_model: string;
  service_type: string;
  problem: string | null;
  status: string;
  created_at: string;
};

const statuses = [
  "new",
  "contacted",
  "in_progress",
  "ready",
  "delivered",
  "cancelled",
];

export default function AdminPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [requests, setRequests] = useState<Request[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadRequests() {
    if (!supabase) return;

    const { data, error } = await supabase
      .from("service_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setMessage("Booking load error: " + error.message);
      return;
    }

    setRequests(data || []);
  }

  async function login(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!supabase) {
      setMessage("Supabase configuration check karein.");
      return;
    }

    setLoading(true);
    setMessage("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      setMessage(error?.message || "Login failed.");
      setLoading(false);
      return;
    }

    const { data: admin, error: adminError } = await supabase
      .from("admin_users")
      .select("user_id")
      .eq("user_id", data.user.id)
      .maybeSingle();

    if (adminError || !admin) {
      await supabase.auth.signOut();
      setMessage("Admin permission nahi mili.");
      setLoading(false);
      return;
    }

    setLoggedIn(true);
    await loadRequests();
    setLoading(false);
  }

  async function updateStatus(id: string, status: string) {
    if (!supabase) return;

    setMessage("Status अपडेट हो रहा है...");

    const { data, error } = await supabase
      .from("service_requests")
      .update({ status })
      .eq("id", id)
      .select("id, status")
      .maybeSingle();

    if (error) {
      setMessage("Update Error: " + error.message);
      return;
    }

    if (!data) {
      setMessage(
        "Booking अपडेट नहीं हुई। Admin UPDATE Policy चेक करनी होगी।"
      );
      return;
    }

    setMessage("Status सफलतापूर्वक सेव: " + data.status);
    await loadRequests();
  }

  async function logout() {
    if (!supabase) return;

    await supabase.auth.signOut();
    setLoggedIn(false);
    setRequests([]);
  }

  if (!loggedIn) {
    return (
      <main style={{ maxWidth: 420, margin: "70px auto", padding: 24 }}>
        <h1>Shiva Mobile Repairing</h1>
        <h2>Admin Login</h2>

        <form onSubmit={login}>
          <input
            type="email"
            placeholder="Admin Gmail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: 12, marginBottom: 12 }}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: 12, marginBottom: 12 }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{ width: "100%", padding: 12 }}
          >
            {loading ? "Please wait..." : "Login"}
          </button>
        </form>

        <p>{message}</p>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 1000, margin: "30px auto", padding: 20 }}>
      <h1>Shiva Mobile Repairing - Admin</h1>

      <button onClick={logout}>Logout</button>

      <button onClick={loadRequests} style={{ marginLeft: 10 }}>
        Refresh
      </button>

      <p>{message}</p>

      <h2>Repair Requests ({requests.length})</h2>

      {requests.map((item) => (
        <section
          key={item.id}
          style={{
            border: "1px solid #ccc",
            borderRadius: 8,
            padding: 16,
            marginBottom: 14,
          }}
        >
          <h3>
            {item.customer_name} — {item.phone}
          </h3>

          <p>Mobile: {item.device_model}</p>
          <p>Service: {item.service_type}</p>
          <p>Problem: {item.problem || "Not provided"}</p>

          <label>
            Booking Status:{" "}
            <select
              value={item.status}
              onChange={(e) =>
                updateStatus(item.id, e.target.value)
              }
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>
        </section>
      ))}
    </main>
  );
}