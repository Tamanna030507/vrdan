// VRDAN Supabase Client
// Move these to .env as REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || "https://buaikmuwivgucmzwtpiq.supabase.co";
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1YWlrbXV3aXZndWNtenp3dHBpcSIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzQzMDgzNTYyLCJleHAiOjIwNTg2NTk1NjJ9";

const headers = {
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
  "Content-Type": "application/json",
};

// ─── AUTH ─────────────────────────────────────────────────────────────────────

export const supabase = {
  // Sign up new user
  async signUp({ email, password, name, phone, role }) {
    try {
      // Check if email already exists
      const check = await fetch(`${SUPABASE_URL}/rest/v1/users?email=eq.${encodeURIComponent(email)}`, { headers });
      const existing = await check.json();
      if (existing.length > 0) return { error: "An account with this email already exists." };

      // Create user record
      const res = await fetch(`${SUPABASE_URL}/rest/v1/users`, {
        method: "POST",
        headers: { ...headers, Prefer: "return=representation" },
        body: JSON.stringify({ email, password_hash: btoa(password), name, phone, role: role || "farmer", created_at: new Date().toISOString() }),
      });
      if (!res.ok) {
        // Table might not exist yet — create it
        return { error: "Setup required: Run migrations in Supabase. See README.md" };
      }
      const data = await res.json();
      // Store session
      localStorage.setItem("vrdan_user", JSON.stringify({ ...data[0], name, role }));
      return { user: data[0] };
    } catch (e) {
      return { error: "Network error. Check your connection." };
    }
  },

  // Sign in existing user
  async signIn({ email, password }) {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/users?email=eq.${encodeURIComponent(email)}&limit=1`, { headers });
      const data = await res.json();
      if (!data || data.length === 0) return { error: "No account found with this email." };
      const user = data[0];
      if (user.password_hash !== btoa(password)) return { error: "Incorrect password." };
      localStorage.setItem("vrdan_user", JSON.stringify(user));
      return { name: user.name, role: user.role, phone: user.phone };
    } catch (e) {
      return { error: "Network error. Check your connection." };
    }
  },

  // Get stored session
  getSession() {
    try {
      const stored = localStorage.getItem("vrdan_user");
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  },

  // Sign out
  signOut() {
    localStorage.removeItem("vrdan_user");
  },

  // ─── FARMER PROFILE ────────────────────────────────────────────────────────

  async getProfile() {
    try {
      const session = this.getSession();
      const emailFilter = session?.email ? `?email=eq.${encodeURIComponent(session.email)}&limit=1` : "?limit=1";
      const res = await fetch(`${SUPABASE_URL}/rest/v1/farmers${emailFilter}`, { headers });
      const data = await res.json();
      return data[0] || null;
    } catch { return null; }
  },

  async saveProfile(profile) {
    try {
      const session = this.getSession();
      const existing = await this.getProfile();
      const payload = { ...profile, email: session?.email, updated_at: new Date().toISOString() };
      if (existing) {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/farmers?id=eq.${existing.id}`, {
          method: "PATCH",
          headers: { ...headers, Prefer: "return=representation" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        return data[0];
      } else {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/farmers`, {
          method: "POST",
          headers: { ...headers, Prefer: "return=representation" },
          body: JSON.stringify({ ...payload, created_at: new Date().toISOString() }),
        });
        const data = await res.json();
        return data[0];
      }
    } catch { return null; }
  },

  // ─── SENSOR DATA ────────────────────────────────────────────────────────────

  async saveSensorData(readings) {
    try {
      const session = this.getSession();
      await fetch(`${SUPABASE_URL}/rest/v1/sensor_readings`, {
        method: "POST",
        headers,
        body: JSON.stringify({ ...readings, email: session?.email, timestamp: new Date().toISOString() }),
      });
    } catch {}
  },

  async getLatestSensorData() {
    try {
      const session = this.getSession();
      const res = await fetch(`${SUPABASE_URL}/rest/v1/sensor_readings?email=eq.${encodeURIComponent(session?.email || "")}&order=timestamp.desc&limit=1`, { headers });
      const data = await res.json();
      return data[0] || null;
    } catch { return null; }
  },

  // ─── DISEASE LOGS ────────────────────────────────────────────────────────────

  async logDisease(entry) {
    try {
      const session = this.getSession();
      await fetch(`${SUPABASE_URL}/rest/v1/disease_logs`, {
        method: "POST",
        headers,
        body: JSON.stringify({ ...entry, email: session?.email, timestamp: new Date().toISOString() }),
      });
    } catch {}
  },

  async getDiseaseHistory() {
    try {
      const session = this.getSession();
      const res = await fetch(`${SUPABASE_URL}/rest/v1/disease_logs?email=eq.${encodeURIComponent(session?.email || "")}&order=timestamp.desc&limit=20`, { headers });
      return await res.json();
    } catch { return []; }
  },

  // ─── CART / ORDERS ────────────────────────────────────────────────────────────

  async saveCartOrder(items, total) {
    try {
      const session = this.getSession();
      await fetch(`${SUPABASE_URL}/rest/v1/orders`, {
        method: "POST",
        headers,
        body: JSON.stringify({ email: session?.email, items: JSON.stringify(items), total, status: "pending", created_at: new Date().toISOString() }),
      });
    } catch {}
  },

  async getOrders() {
    try {
      const session = this.getSession();
      const res = await fetch(`${SUPABASE_URL}/rest/v1/orders?email=eq.${encodeURIComponent(session?.email || "")}&order=created_at.desc&limit=10`, { headers });
      return await res.json();
    } catch { return []; }
  },

  // ─── FARMER INTEL / POLICIES ────────────────────────────────────────────────

  async saveFarmerIntel(intel) {
    try {
      const session = this.getSession();
      const existing = await this.getFarmerIntel();
      const payload = { ...intel, email: session?.email, updated_at: new Date().toISOString() };
      if (existing) {
        await fetch(`${SUPABASE_URL}/rest/v1/farmer_intel?id=eq.${existing.id}`, {
          method: "PATCH", headers, body: JSON.stringify(payload),
        });
      } else {
        await fetch(`${SUPABASE_URL}/rest/v1/farmer_intel`, {
          method: "POST", headers, body: JSON.stringify({ ...payload, created_at: new Date().toISOString() }),
        });
      }
    } catch {}
  },

  async getFarmerIntel() {
    try {
      const session = this.getSession();
      const res = await fetch(`${SUPABASE_URL}/rest/v1/farmer_intel?email=eq.${encodeURIComponent(session?.email || "")}&limit=1`, { headers });
      const data = await res.json();
      return data[0] || null;
    } catch { return null; }
  },

  // ─── PROFILE BY ID ─────────────────────────────────────────────────────────

  async getProfileById(id) {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/farmers?id=eq.${id}`, { headers });
      const data = await res.json();
      return data[0] || null;
    } catch { return null; }
  },
};

export default supabase;