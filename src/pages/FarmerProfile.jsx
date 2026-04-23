import { useState, useEffect } from "react";
import { supabase } from "../supabase";

const BLOCKCHAIN_LOG = [
  { hash: "a3f9c2d1e8b4", action: "Harvest Logged", detail: "Wheat · 18 quintals · Plot 347", date: "Mar 20 · 09:00", color: "#c8960c" },
  { hash: "b7d4e1f8c2a9", action: "Treatment Applied", detail: "Propiconazole 25% EC · 200ml/acre", date: "Mar 19 · 16:45", color: "#4ade80" },
  { hash: "c9f2a8b3d1e5", action: "Disease Detected", detail: "Wheat Rust · Zone C · 94% confidence", date: "Mar 19 · 14:32", color: "#c4622d" },
  { hash: "d1e5b3c7f9a2", action: "Purchase Verified", detail: "Kisan Agro Sikar · INR 340 · UPI", date: "Mar 19 · 15:10", color: "#4ade80" },
  { hash: "e4c7f9a2b3d1", action: "Irrigation Logged", detail: "3.2 hours · Full farm coverage", date: "Mar 15 · 07:00", color: "#4ade80" },
  { hash: "f8a2c1d9e5b7", action: "Soil Reading", detail: "pH 6.4 · Moisture 67% · N: 42mg/kg", date: "Mar 10 · 08:30", color: "#c8960c" },
  { hash: "g2b5d8f1c4e7", action: "Fertilizer Applied", detail: "Urea 12kg · Nitrogen boost", date: "Mar 05 · 06:00", color: "#4ade80" },
  { hash: "h6c3e9a7d2f4", action: "Sowing Logged", detail: "Wheat seed · 4.2 acres · Certified", date: "Feb 20 · 07:00", color: "#c8960c" },
];

const MANDI_RECORDS = [
  { crop: "Wheat", qty: "18 Qtl", price: "INR 2,200/Qtl", total: "INR 39,600", mandi: "Sikar Mandi", date: "Mar 20, 2026", verified: true },
  { crop: "Mustard", qty: "8 Qtl", price: "INR 5,400/Qtl", total: "INR 43,200", mandi: "Jaipur Mandi", date: "Nov 12, 2025", verified: true },
  { crop: "Chickpea", qty: "6 Qtl", price: "INR 5,000/Qtl", total: "INR 30,000", mandi: "Sikar Mandi", date: "Mar 15, 2025", verified: true },
];

const SOIL_DATA = [
  { param: "Nitrogen (N)", value: "42 mg/kg", status: "Low", rec: "Apply Urea 12kg/acre", color: "#c8960c" },
  { param: "Phosphorus (P)", value: "18 mg/kg", status: "Medium", rec: "Apply DAP 10kg/acre", color: "#c8960c" },
  { param: "Potassium (K)", value: "210 mg/kg", status: "High", rec: "No supplement needed", color: "#4ade80" },
  { param: "Soil pH", value: "6.4", status: "Optimal", rec: "Ideal for wheat & mustard", color: "#4ade80" },
  { param: "Organic Carbon", value: "0.52%", status: "Low", rec: "Add FYM 2 tonnes/acre", color: "#c4622d" },
  { param: "Moisture", value: "67%", status: "Good", rec: "Irrigation in 3 days", color: "#4ade80" },
];

function QRCodeSVG({ value, size = 140, color = "#c8960c" }) {
  const cells = 21;
  const cellSize = size / cells;
  const pattern = Array.from({ length: cells }, (_, r) =>
    Array.from({ length: cells }, (_, c) => {
      const inCorner = (r < 7 && c < 7) || (r < 7 && c >= cells - 7) || (r >= cells - 7 && c < 7);
      const onBorder = inCorner && (r === 0 || r === 6 || c === 0 || c === 6 || (r >= cells - 7 && (r === cells - 7 || r === cells - 1 || c === 0 || c === 6)));
      const innerSquare = (r >= 2 && r <= 4 && c >= 2 && c <= 4) || (r >= 2 && r <= 4 && c >= cells - 5 && c <= cells - 3) || (r >= cells - 5 && r <= cells - 3 && c >= 2 && c <= 4);
      if (inCorner) return onBorder || innerSquare ? 1 : 0;
      const hash = (r * 31 + c * 17 + value.charCodeAt(r % value.length)) % 3;
      return hash === 0 ? 1 : 0;
    })
  );
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <rect width={size} height={size} fill="#0d0d0d" rx="8" />
      {pattern.map((row, r) =>
        row.map((cell, c) =>
          cell ? <rect key={`${r}-${c}`} x={c * cellSize} y={r * cellSize} width={cellSize - 0.5} height={cellSize - 0.5} fill={color} rx="0.5" /> : null
        )
      )}
      <rect x={size / 2 - 14} y={size / 2 - 14} width={28} height={28} fill="#0d0d0d" rx="4" />
      <text x={size / 2} y={size / 2 + 5} textAnchor="middle" fontSize="12" fontWeight="900" fill={color} fontFamily="serif">V</text>
    </svg>
  );
}

const EMPTY_PROFILE = {
  full_name: "", phone: "", village: "", district: "", state: "",
  farm_size: "", soil_type: "", irrigation_source: "", crops_this_season: "",
  years_experience: "", aadhaar_id: "", upi_id: "", languages: "",
  certifications: "", past_yield: "", avatar_letter: "",
};

export default function FarmerProfile() {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(EMPTY_PROFILE);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("story");
  const [saveMsg, setSaveMsg] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const data = await supabase.getProfile();
      if (data) {
        setProfile(data);
        setForm(data);
      } else {
        setEditing(true);
      }
    } catch (e) {
      console.error(e);
      setEditing(true);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!form.full_name || !form.phone) {
      setSaveMsg("Name and phone are required.");
      return;
    }
    setSaving(true);
    try {
      const toSave = { ...form, avatar_letter: form.full_name.charAt(0).toUpperCase() };
      const saved = await supabase.saveProfile(toSave);
      setProfile(saved || toSave);
      setEditing(false);
      setSaveMsg("Profile saved successfully!");
      setTimeout(() => setSaveMsg(""), 3000);
    } catch (e) {
      setSaveMsg("Error saving. Check your Supabase credentials in supabase.js");
    }
    setSaving(false);
  };

  const upd = (key, val) => setForm(f => ({ ...f, [key]: val }));

  if (loading) return (
    <div style={{ ...S.page, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={S.spinner} />
        <div style={{ fontSize: "13px", color: "#555", marginTop: "12px" }}>Loading profile...</div>
      </div>
    </div>
  );

  // EDIT FORM
  if (editing) return (
    <div style={S.page}>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}} @keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={S.header}>
        <div>
          <div style={S.headerTag}>Farmer Identity</div>
          <h1 style={S.headerTitle}>{profile ? "Edit Profile" : "Create Your Profile"}</h1>
          <p style={S.headerSub}>Your verified identity — buyers and companies will see this</p>
        </div>
      </div>

      <div style={S.formGrid}>
        <div style={S.card}>
          <div style={S.cardTitle}>Personal Information</div>
          <div style={S.fieldGrid}>
            {[
              { key: "full_name", label: "Full Name *", placeholder: "e.g. Ramesh Kumar" },
              { key: "phone", label: "Phone Number *", placeholder: "e.g. 9876543210" },
              { key: "aadhaar_id", label: "Aadhaar / Kisan ID", placeholder: "e.g. XXXX-XXXX-XXXX" },
              { key: "upi_id", label: "UPI ID", placeholder: "e.g. ramesh@upi" },
              { key: "languages", label: "Languages Spoken", placeholder: "e.g. Hindi, Rajasthani" },
              { key: "years_experience", label: "Years of Farming Experience", placeholder: "e.g. 25 years" },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <div style={S.fieldLabel}>{label}</div>
                <input style={S.input} value={form[key] || ""} onChange={e => upd(key, e.target.value)} placeholder={placeholder} />
              </div>
            ))}
          </div>
        </div>

        <div style={S.card}>
          <div style={S.cardTitle}>Farm Details</div>
          <div style={S.fieldGrid}>
            {[
              { key: "village", label: "Village", placeholder: "e.g. Neem Ka Thana" },
              { key: "district", label: "District", placeholder: "e.g. Sikar" },
              { key: "state", label: "State", placeholder: "e.g. Rajasthan" },
              { key: "farm_size", label: "Farm Size", placeholder: "e.g. 4.2 acres" },
              { key: "past_yield", label: "Average Yield per Acre", placeholder: "e.g. 18 Qtl/acre" },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <div style={S.fieldLabel}>{label}</div>
                <input style={S.input} value={form[key] || ""} onChange={e => upd(key, e.target.value)} placeholder={placeholder} />
              </div>
            ))}
            <div>
              <div style={S.fieldLabel}>Soil Type</div>
              <select style={S.input} value={form.soil_type || ""} onChange={e => upd("soil_type", e.target.value)}>
                <option value="">Select soil type</option>
                {["Loam", "Sandy Loam", "Clay Loam", "Black Soil", "Red Soil", "Alluvial"].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <div style={S.fieldLabel}>Irrigation Source</div>
              <select style={S.input} value={form.irrigation_source || ""} onChange={e => upd("irrigation_source", e.target.value)}>
                <option value="">Select source</option>
                {["Borewell", "Canal", "Rain-fed", "Drip Irrigation", "Mixed"].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div style={S.card}>
          <div style={S.cardTitle}>Crops & Certifications</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginTop: "14px" }}>
            <div>
              <div style={S.fieldLabel}>Crops This Season</div>
              <input style={S.input} value={form.crops_this_season || ""} onChange={e => upd("crops_this_season", e.target.value)} placeholder="e.g. Wheat, Mustard, Chickpea" />
            </div>
            <div>
              <div style={S.fieldLabel}>Certifications</div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "6px" }}>
                {["PM-KISAN Registered", "KCC Holder", "PMFBY Enrolled", "Organic Certified", "Soil Health Card"].map(cert => (
                  <button key={cert}
                    style={{ ...S.certBtn, ...(form.certifications?.includes(cert) ? S.certBtnActive : {}) }}
                    onClick={() => {
                      const certs = form.certifications ? form.certifications.split(",").map(c => c.trim()).filter(Boolean) : [];
                      const idx = certs.indexOf(cert);
                      if (idx >= 0) certs.splice(idx, 1); else certs.push(cert);
                      upd("certifications", certs.join(", "));
                    }}>
                    {cert}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {saveMsg && <div style={{ marginTop: "16px", padding: "12px 16px", background: saveMsg.includes("success") ? "rgba(74,222,128,0.08)" : "rgba(196,98,45,0.08)", borderRadius: "8px", border: `1px solid ${saveMsg.includes("success") ? "rgba(74,222,128,0.2)" : "rgba(196,98,45,0.2)"}`, fontSize: "13px", color: saveMsg.includes("success") ? "#4ade80" : "#c4622d" }}>{saveMsg}</div>}

      <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
        <button style={S.saveBtn} onClick={handleSave} disabled={saving}>
          {saving ? "Saving to Database..." : "Save Profile"}
        </button>
        {profile && <button style={S.cancelBtn} onClick={() => setEditing(false)}>Cancel</button>}
      </div>
    </div>
  );

  // PROFILE VIEW
  return (
    <div style={S.page}>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}} @keyframes spin{to{transform:rotate(360deg)}} @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>

      {/* Profile Header */}
      <div style={S.profileHeader}>
        <div style={{ display: "flex", gap: "20px", alignItems: "center", flexWrap: "wrap" }}>
          <div style={S.avatar}>{profile.avatar_letter || profile.full_name?.charAt(0) || "F"}</div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
              <h1 style={S.profileName}>{profile.full_name}</h1>
              <span style={S.verifiedBadge}>✓ Verified Farmer</span>
            </div>
            <div style={{ fontSize: "13px", color: "#666", marginTop: "4px" }}>{[profile.village, profile.district, profile.state].filter(Boolean).join(", ")}</div>
            <div style={{ fontSize: "12px", color: "#555", marginTop: "3px" }}>Farming since {new Date().getFullYear() - parseInt(profile.years_experience || 0)} · {profile.farm_size} farm</div>
            <div style={{ display: "flex", gap: "8px", marginTop: "8px", flexWrap: "wrap" }}>
              {profile.certifications?.split(",").map((c, i) => (
                <span key={i} style={{ fontSize: "9px", color: "#4ade80", background: "rgba(74,222,128,0.08)", padding: "3px 8px", borderRadius: "20px", border: "1px solid rgba(74,222,128,0.2)", fontWeight: "700" }}>{c.trim()}</span>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "16px", alignItems: "flex-start", flexWrap: "wrap" }}>
          {/* QR Code */}
          <div style={S.qrBox}>
            <div style={{ fontSize: "9px", color: "#555", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "8px", textAlign: "center" }}>Scan to Verify</div>
            <QRCodeSVG value={profile.id || profile.full_name || "vrdan-farmer"} size={120} />
            <div style={{ fontSize: "9px", color: "#444", marginTop: "6px", textAlign: "center", fontFamily: "monospace" }}>VRDAN-{(profile.id || "").slice(0, 8).toUpperCase()}</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <button style={S.editBtn} onClick={() => setEditing(true)}>Edit Profile</button>
            <div style={{ ...S.credibilityScore }}>
              <div style={{ fontSize: "9px", color: "#c8960c", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "3px" }}>Credibility</div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "28px", fontWeight: "900", color: "#c8960c" }}>{profile.quality_score || 94}<span style={{ fontSize: "14px" }}>/100</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div style={S.statsRow}>
        {[
          ["Crops", profile.crops_this_season || "Wheat, Mustard"],
          ["Farm Size", profile.farm_size || "N/A"],
          ["Yield/Acre", profile.past_yield || "N/A"],
          ["UPI", profile.upi_id || "N/A"],
          ["Irrigation", profile.irrigation_source || "N/A"],
          ["Soil", profile.soil_type || "N/A"],
        ].map(([l, v]) => (
          <div key={l} style={S.statBox}>
            <div style={{ fontSize: "9px", color: "#444", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "4px" }}>{l}</div>
            <div style={{ fontSize: "12px", fontWeight: "700", color: "#e0d8c8" }}>{v}</div>
          </div>
        ))}
      </div>

      {/* Sub Tabs */}
      <div style={S.subTabs}>
        {[["story", "Farm Story"], ["certificate", "Certificate"], ["history", "History"], ["blockchain", "Blockchain Log"], ["mandi", "Mandi Records"], ["soil", "Soil Health"]].map(([id, label]) => (
          <button key={id} style={{ ...S.subTab, ...(activeTab === id ? S.subTabActive : {}) }} onClick={() => setActiveTab(id)}>{label}</button>
        ))}
      </div>

      {/* FARM STORY */}
      {activeTab === "story" && (
        <div style={{ ...S.card, maxWidth: "680px", animation: "fadeUp 0.4s ease" }}>
          <div style={S.storyHeader}>
            <div style={S.smallAvatar}>{profile.avatar_letter || profile.full_name?.charAt(0)}</div>
            <div>
              <div style={{ fontSize: "16px", fontWeight: "800", color: "#e0d8c8", fontFamily: "'Playfair Display', serif" }}>{profile.full_name}</div>
              <div style={{ fontSize: "11px", color: "#555" }}>{profile.district}, {profile.state} · Farming since {new Date().getFullYear() - parseInt(profile.years_experience || 0)}</div>
            </div>
            <span style={{ ...S.verifiedBadge, marginLeft: "auto" }}>✓ Verified</span>
          </div>
          <div style={{ height: "1px", background: "#1a1a1a", margin: "16px 0" }} />
          <div style={{ background: "#0d0d0d", borderRadius: "10px", padding: "14px", marginBottom: "16px" }}>
            <div style={{ fontSize: "9px", color: "#555", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "4px" }}>Current Harvest</div>
            <div style={{ fontSize: "16px", fontWeight: "800", color: "#e0d8c8", fontFamily: "'Playfair Display', serif" }}>{profile.crops_this_season} · Batch WH-2026-347</div>
            <div style={{ fontSize: "11px", color: "#555", marginTop: "3px" }}>Harvested March 20, 2026 · {profile.farm_size}</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "20px" }}>
            {[["Zero Synthetic Pesticides", "✓", "#4ade80"], ["Organic Treatments Only", "✓", "#4ade80"], ["Water Efficient", "✓", "#4ade80"], ["Fair Price Received", "INR 2,200/Qtl", "#c8960c"]].map(([l, v, c]) => (
              <div key={l} style={{ background: "#0d0d0d", borderRadius: "8px", padding: "10px 12px" }}>
                <div style={{ fontSize: "10px", color: "#555", marginBottom: "4px" }}>{l}</div>
                <div style={{ fontSize: "13px", fontWeight: "700", color: c }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={S.cardTitle}>Journey of This Grain</div>
          <div style={{ marginTop: "14px" }}>
            {[
              { dot: "#c8960c", title: "Seeds Sown", detail: "February 20 · Certified seed · Plot 347", date: "Feb 20" },
              { dot: "#4ade80", title: "Fertilizer Applied", detail: "Urea 12kg · Nitrogen boost · Organic", date: "Mar 05" },
              { dot: "#4ade80", title: "Irrigation Done", detail: "3.2 hours · Rain debt covered", date: "Mar 15" },
              { dot: "#c4622d", title: "Disease Detected", detail: "Wheat Rust · Treated with certified fungicide", date: "Mar 19" },
              { dot: "#4ade80", title: "Treatment Verified", detail: "Propiconazole · Sourced from verified supplier", date: "Mar 19" },
              { dot: "#c8960c", title: "Harvested", detail: `${profile.past_yield || "18 quintals"} · Quality tested · ${profile.quality_score || 94}/100`, date: "Mar 20" },
            ].map((item, i, arr) => (
              <div key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start", marginBottom: "14px", position: "relative" }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: item.dot, marginTop: "5px", flexShrink: 0, zIndex: 1 }} />
                {i < arr.length - 1 && <div style={{ position: "absolute", left: "3px", top: "14px", bottom: "-14px", width: "1px", background: "#1a1a1a" }} />}
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "13px", fontWeight: "700", color: "#e0d8c8" }}>{item.title}</span>
                    <span style={{ fontSize: "10px", color: "#444" }}>{item.date}</span>
                  </div>
                  <div style={{ fontSize: "11px", color: "#555", marginTop: "2px" }}>{item.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CERTIFICATE */}
      {activeTab === "certificate" && (
        <div style={{ maxWidth: "600px", animation: "fadeUp 0.4s ease" }}>
          <div style={{ background: "#111", borderRadius: "16px", border: "1px solid rgba(200,150,12,0.2)", padding: "32px" }}>
            <div style={{ textAlign: "center", marginBottom: "16px" }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "28px", fontWeight: "900", color: "#c8960c", letterSpacing: "6px" }}>VRDAN</div>
              <div style={{ fontSize: "11px", color: "#555", marginTop: "4px", letterSpacing: "2px" }}>वरदान · Verified Farm Certificate</div>
            </div>
            <div style={{ height: "1px", background: "rgba(200,150,12,0.2)", margin: "16px 0" }} />
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", fontWeight: "700", color: "#e0d8c8", textAlign: "center", marginBottom: "16px" }}>Certificate of Authenticity</div>
            <div style={{ fontSize: "13px", color: "#888", lineHeight: 1.9, textAlign: "center", marginBottom: "20px" }}>
              This certifies that the agricultural produce bearing batch number
              <span style={{ color: "#c8960c", fontWeight: "700" }}> WH-2026-347 </span>
              was grown by <span style={{ color: "#c8960c", fontWeight: "700" }}>{profile.full_name}</span> at {profile.village}, {profile.district}, {profile.state}, using verified inputs only, with full traceability on blockchain.
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "16px" }}>
              {[["Farmer", profile.full_name], ["Farm Size", profile.farm_size], ["Quality Score", `${profile.quality_score || 94}/100`], ["Pesticide Use", "Zero Synthetic"], ["Harvest Date", "Mar 20, 2026"], ["Chain ID", "f8a2c1d9e5b7"]].map(([l, v]) => (
                <div key={l} style={{ background: "#0d0d0d", borderRadius: "8px", padding: "10px 12px" }}>
                  <div style={{ fontSize: "9px", color: "#444", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "4px" }}>{l}</div>
                  <div style={{ fontSize: "13px", fontWeight: "700", color: "#c8960c" }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ height: "1px", background: "rgba(200,150,12,0.2)", margin: "16px 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: "10px", color: "#555", letterSpacing: "1px", marginBottom: "4px" }}>BLOCKCHAIN VERIFIED</div>
                <div style={{ fontSize: "11px", color: "#c8960c", fontFamily: "monospace" }}>VRDAN-f8a2c1d9e5b7-2026</div>
              </div>
              <QRCodeSVG value={profile.id || profile.full_name} size={80} />
            </div>
          </div>
        </div>
      )}

      {/* HISTORY */}
      {activeTab === "history" && (
        <div style={{ ...S.card, animation: "fadeUp 0.4s ease" }}>
          <div style={S.cardTitle}>Complete Farm History</div>
          <div style={{ marginTop: "14px", display: "flex", flexDirection: "column", gap: "10px" }}>
            {BLOCKCHAIN_LOG.map((log, i) => (
              <div key={i} style={{ background: "#0d0d0d", borderRadius: "10px", padding: "14px", borderLeft: `3px solid ${log.color}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span style={{ fontSize: "13px", fontWeight: "700", color: "#e0d8c8" }}>{log.action}</span>
                  <span style={{ fontSize: "10px", color: "#444" }}>{log.date}</span>
                </div>
                <div style={{ fontSize: "12px", color: "#666", marginBottom: "6px" }}>{log.detail}</div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <span style={{ fontSize: "9px", color: "#444", background: "#1a1a1a", padding: "2px 6px", borderRadius: "3px" }}>HASH</span>
                  <span style={{ fontSize: "11px", color: "#555", fontFamily: "monospace" }}>{log.hash}</span>
                  <span style={{ fontSize: "10px", color: "#4ade80" }}>✓ Verified</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* BLOCKCHAIN */}
      {activeTab === "blockchain" && (
        <div style={{ ...S.card, animation: "fadeUp 0.4s ease" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
            <div style={S.cardTitle}>Blockchain Activity Log</div>
            <span style={{ fontSize: "10px", color: "#4ade80", background: "rgba(74,222,128,0.08)", padding: "4px 12px", borderRadius: "20px", border: "1px solid rgba(74,222,128,0.2)" }}>Tamper-proof</span>
          </div>
          <p style={{ fontSize: "12px", color: "#555", marginBottom: "16px", lineHeight: 1.7 }}>Every action permanently recorded with a unique cryptographic hash. Cannot be edited, deleted, or faked.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {BLOCKCHAIN_LOG.map((log, i) => (
              <div key={i} style={{ background: "#0d0d0d", borderRadius: "10px", padding: "14px", borderLeft: `3px solid ${log.color}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span style={{ fontSize: "13px", fontWeight: "700", color: "#e0d8c8" }}>{log.action}</span>
                  <span style={{ fontSize: "10px", color: "#444" }}>{log.date}</span>
                </div>
                <div style={{ fontSize: "12px", color: "#666", marginBottom: "6px" }}>{log.detail}</div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <span style={{ fontSize: "9px", color: "#444", background: "#1a1a1a", padding: "2px 6px", borderRadius: "3px" }}>HASH</span>
                  <span style={{ fontSize: "11px", color: "#555", fontFamily: "monospace" }}>{log.hash}</span>
                  <span style={{ fontSize: "10px", color: "#4ade80" }}>✓ On Chain</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MANDI RECORDS */}
      {activeTab === "mandi" && (
        <div style={{ ...S.card, animation: "fadeUp 0.4s ease" }}>
          <div style={S.cardTitle}>Mandi Sell Records</div>
          <p style={{ fontSize: "12px", color: "#555", marginTop: "6px", marginBottom: "16px" }}>All verified sales — buyers can confirm fair price history</p>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>{["Crop", "Quantity", "Price/Qtl", "Total", "Mandi", "Date", "Status"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "8px 12px", fontSize: "10px", color: "#444", fontWeight: "600", letterSpacing: "0.5px", borderBottom: "1px solid #1a1a1a" }}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {MANDI_RECORDS.map((r, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #141414" }}>
                  <td style={{ padding: "10px 12px", fontWeight: "700", color: "#c8960c" }}>{r.crop}</td>
                  <td style={{ padding: "10px 12px", color: "#e0d8c8" }}>{r.qty}</td>
                  <td style={{ padding: "10px 12px", color: "#e0d8c8" }}>{r.price}</td>
                  <td style={{ padding: "10px 12px", color: "#4ade80", fontWeight: "700" }}>{r.total}</td>
                  <td style={{ padding: "10px 12px", color: "#666" }}>{r.mandi}</td>
                  <td style={{ padding: "10px 12px", color: "#555", fontSize: "11px" }}>{r.date}</td>
                  <td style={{ padding: "10px 12px" }}><span style={{ fontSize: "9px", color: "#4ade80", background: "rgba(74,222,128,0.08)", padding: "3px 8px", borderRadius: "4px" }}>✓ Verified</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* SOIL */}
      {activeTab === "soil" && (
        <div style={{ ...S.card, animation: "fadeUp 0.4s ease" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
            <div style={S.cardTitle}>Soil Health Card Data</div>
            <span style={{ fontSize: "11px", color: "#c8960c", background: "rgba(200,150,12,0.08)", padding: "4px 12px", borderRadius: "20px", border: "1px solid rgba(200,150,12,0.2)" }}>Last tested: Mar 2026</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "12px" }}>
            {SOIL_DATA.map((s, i) => (
              <div key={i} style={{ background: "#0d0d0d", borderRadius: "10px", padding: "14px", borderLeft: `3px solid ${s.color}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <span style={{ fontSize: "13px", fontWeight: "700", color: "#e0d8c8" }}>{s.param}</span>
                  <span style={{ fontSize: "12px", fontWeight: "800", color: s.color }}>{s.value}</span>
                </div>
                <div style={{ fontSize: "10px", fontWeight: "700", color: s.color, marginBottom: "4px" }}>{s.status}</div>
                <div style={{ fontSize: "11px", color: "#555" }}>{s.rec}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const S = {
  page: { background: "#0a0a0a", minHeight: "100vh", paddingTop: "70px", color: "#e0d8c8", padding: "90px 48px 48px" },
  header: { marginBottom: "24px" },
  headerTag: { fontSize: "10px", color: "#c8960c", fontWeight: "700", letterSpacing: "4px", textTransform: "uppercase", marginBottom: "8px" },
  headerTitle: { fontFamily: "'Playfair Display', serif", fontSize: "36px", fontWeight: "900", color: "#e0d8c8", lineHeight: 1 },
  headerSub: { fontSize: "13px", color: "#555", marginTop: "6px" },
  profileHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", background: "#111", borderRadius: "16px", border: "1px solid #1a1a1a", padding: "24px", marginBottom: "16px", flexWrap: "wrap", gap: "20px", animation: "fadeUp 0.4s ease" },
  avatar: { width: "64px", height: "64px", borderRadius: "50%", background: "rgba(200,150,12,0.15)", border: "2px solid rgba(200,150,12,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "26px", fontWeight: "900", color: "#c8960c", fontFamily: "'Playfair Display', serif", flexShrink: 0 },
  smallAvatar: { width: "48px", height: "48px", borderRadius: "50%", background: "rgba(200,150,12,0.15)", border: "2px solid rgba(200,150,12,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", fontWeight: "900", color: "#c8960c", fontFamily: "'Playfair Display', serif", flexShrink: 0 },
  profileName: { fontFamily: "'Playfair Display', serif", fontSize: "26px", fontWeight: "900", color: "#e0d8c8" },
  verifiedBadge: { fontSize: "10px", fontWeight: "700", color: "#4ade80", background: "rgba(74,222,128,0.08)", padding: "4px 10px", borderRadius: "20px", border: "1px solid rgba(74,222,128,0.2)" },
  qrBox: { background: "#0d0d0d", borderRadius: "12px", border: "1px solid #1a1a1a", padding: "14px", textAlign: "center" },
  credibilityScore: { background: "#0d0d0d", borderRadius: "12px", border: "1px solid rgba(200,150,12,0.2)", padding: "12px 16px", textAlign: "center" },
  editBtn: { background: "none", border: "1px solid #2a2a2a", color: "#666", padding: "9px 18px", borderRadius: "8px", fontSize: "12px", fontWeight: "600", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" },
  statsRow: { display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "20px" },
  statBox: { flex: 1, minWidth: "120px", background: "#111", borderRadius: "10px", border: "1px solid #1a1a1a", padding: "12px 14px" },
  subTabs: { display: "flex", gap: "4px", flexWrap: "wrap", background: "#111", padding: "4px", borderRadius: "12px", border: "1px solid #1a1a1a", marginBottom: "20px" },
  subTab: { background: "none", border: "none", padding: "9px 16px", borderRadius: "8px", fontSize: "12px", fontWeight: "500", color: "#555", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s" },
  subTabActive: { background: "#1a1a1a", color: "#c8960c" },
  card: { background: "#111", borderRadius: "16px", border: "1px solid #1a1a1a", padding: "22px" },
  cardTitle: { fontSize: "10px", color: "#c8960c", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase" },
  storyHeader: { display: "flex", alignItems: "center", gap: "14px" },
  formGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "16px" },
  fieldGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginTop: "14px" },
  fieldLabel: { fontSize: "10px", color: "#555", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "5px" },
  input: { width: "100%", background: "#0d0d0d", border: "1px solid #2a2a2a", borderRadius: "8px", padding: "10px 12px", color: "#e0d8c8", fontSize: "13px", fontFamily: "'DM Sans', sans-serif", outline: "none", boxSizing: "border-box" },
  certBtn: { background: "#0d0d0d", border: "1px solid #2a2a2a", color: "#555", padding: "6px 12px", borderRadius: "20px", fontSize: "11px", fontWeight: "600", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" },
  certBtnActive: { background: "rgba(200,150,12,0.1)", borderColor: "rgba(200,150,12,0.3)", color: "#c8960c" },
  saveBtn: { background: "#c8960c", color: "#0a0a0a", border: "none", padding: "14px 32px", borderRadius: "10px", fontSize: "14px", fontWeight: "800", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" },
  cancelBtn: { background: "none", border: "1px solid #2a2a2a", color: "#555", padding: "14px 24px", borderRadius: "10px", fontSize: "13px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" },
  spinner: { width: "32px", height: "32px", border: "3px solid #1a1a1a", borderTop: "3px solid #c8960c", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto" },
};