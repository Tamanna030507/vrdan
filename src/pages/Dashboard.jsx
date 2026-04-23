import { useState, useEffect } from "react";
import { t as tr } from "../translations";

const IOT_DEVICES = [
  { sensor: "Camera", replaces: "Crop Disease Scanner", how: "Farmer points phone at crop — CNN model analyzes leaf patterns and detects disease in 4 seconds with 94% accuracy", icon: "CAM", color: "#c4622d", live: true },
  { sensor: "GPS", replaces: "Field Location Sensor", how: "Phone GPS maps exact farm plot boundaries and zone coordinates — feeds satellite overlay on farm map", icon: "GPS", color: "#4ade80", live: true },
  { sensor: "Ambient Light Sensor", replaces: "Sunlight Intensity Meter", how: "Built into every Android phone — measures lux levels reaching crop canopy to calculate daily sunlight hours", icon: "LUX", color: "#c8960c", live: true },
  { sensor: "OpenWeather API", replaces: "On-Farm Weather Station", how: "Pulls real-time temperature, humidity, wind speed, and rainfall forecast for exact GPS coordinates every hour", icon: "WTR", color: "#4ade80", live: true },
  { sensor: "Camera + AI", replaces: "Soil Moisture Sensor", how: "Dry soil appears lighter in color — camera captures soil image, AI analyzes color tone to estimate moisture level without any hardware", icon: "SOI", color: "#8b7355", live: true },
  { sensor: "Camera + AI", replaces: "Soil pH Sensor", how: "Soil color is strongly correlated with pH — IIT research proven method. Camera image analyzed against pH color database for estimation", icon: "PH", color: "#c8960c", live: false },
  { sensor: "Jio 4G Network", replaces: "IoT Data Transmitter", how: "All sensor readings transmitted to cloud dashboard every 6 hours automatically over existing Jio SIM — zero extra hardware", icon: "4G", color: "#4ade80", live: true },
  { sensor: "ESP32 + Sensors", replaces: "Premium Sensor Kit (Optional)", how: "Optional INR 500 kit — ESP32 chip + soil moisture probe + DHT22 temp sensor. Plug and play with VRDAN for higher accuracy", icon: "KIT", color: "#555", live: false },
];

const IotDevices = ({ setCurrentPage }) => {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? IOT_DEVICES : IOT_DEVICES.slice(0, 3);
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "10px", marginBottom: "12px" }}>
        {visible.map((d, i) => (
          <div key={i} style={{ background: "#0d0d0d", borderRadius: "10px", border: `1px solid ${d.live ? d.color + "33" : "#1a1a1a"}`, padding: "14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: d.color + "15", border: `1px solid ${d.color}33`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: "800", color: d.color }}>{d.icon}</div>
              <span style={{ fontSize: "9px", fontWeight: "700", letterSpacing: "0.5px", border: "1px solid", padding: "3px 8px", borderRadius: "20px", background: d.live ? "rgba(74,222,128,0.08)" : "rgba(85,85,85,0.1)", color: d.live ? "#4ade80" : "#555", borderColor: d.live ? "rgba(74,222,128,0.2)" : "#2a2a2a" }}>
                {d.live ? "● Live" : "○ Passive"}
              </span>
            </div>
            <div style={{ fontSize: "14px", fontWeight: "700", color: "#e0d8c8", marginBottom: "3px" }}>{d.sensor}</div>
            <div style={{ fontSize: "10px", color: "#c8960c", marginBottom: "6px", fontWeight: "600" }}>Replaces: {d.replaces}</div>
            <div style={{ fontSize: "11px", color: "#555", lineHeight: 1.6 }}>{d.how}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button style={{ background: "none", border: "1px solid #2a2a2a", color: "#c8960c", padding: "8px 16px", borderRadius: "8px", fontSize: "12px", fontWeight: "700", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}
          onClick={() => setExpanded(e => !e)}>
          {expanded ? "Show Less ▲" : `View All ${IOT_DEVICES.length} Sensors ▼`}
        </button>
        <div style={{ display: "flex", gap: "16px", fontSize: "11px" }}>
          <span style={{ color: "#555" }}>Hardware cost: <span style={{ color: "#4ade80", fontWeight: "700" }}>INR 0</span></span>
          <span style={{ color: "#555" }}>You saved: <span style={{ color: "#4ade80", fontWeight: "700" }}>INR 48,000</span></span>
          <button style={{ background: "#c8960c", color: "#0a0a0a", border: "none", padding: "8px 14px", borderRadius: "20px", fontSize: "11px", fontWeight: "800", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}
            onClick={() => setCurrentPage("journal")}>Scan Now</button>
        </div>
      </div>
    </div>
  );
};

const SENSORS = [
  { key: "soilMoisture", value: 67, unit: "%", color: "#4ade80" },
  { key: "humidity", value: 78, unit: "%", color: "#4ade80" },
  { key: "sunlight", value: 84, unit: "%", color: "#c8960c" },
  { key: "nitrogen", value: 42, unit: "mg/kg", color: "#c4622d" },
  { key: "phosphorus", value: 61, unit: "mg/kg", color: "#4ade80" },
  { key: "potassium", value: 55, unit: "mg/kg", color: "#c8960c" },
];

const ALERTS_DATA = [
  { type: "danger", title: "Aphid Outbreak Risk", desc: "73% probability in next 7 days", time: "2 min ago", zone: "Zone C", actionKey: "actNow" },
  { type: "warning", title: "Irrigation Required", desc: "Rain debt at 89mm — crops need water", time: "1 hr ago", zone: "Full Farm", actionKey: "actSoon" },
  { type: "warning", title: "Nitrogen Deficiency", desc: "Levels at 42mg/kg — below optimal", time: "3 hr ago", zone: "Zone A", actionKey: "actSoon" },
  { type: "info", title: "Mandi Price Rising", desc: "Wheat up 8% — hold for 11 more days", time: "6 hr ago", zone: "Market", actionKey: "actNow" },
];

const HISTORY = [
  { date: "Mar 18", event: "treatmentKey", detail: "Neem oil 2L — Aphid prevention", color: "#4ade80" },
  { date: "Mar 15", event: "diseaseKey", detail: "Early blight detected — Zone B", color: "#c4622d" },
  { date: "Mar 12", event: "irrigationKey", detail: "3.2 hours — Full farm", color: "#4ade80" },
  { date: "Mar 09", event: "normalKey", detail: "Routine scan — all clear", color: "#555" },
  { date: "Mar 05", event: "treatmentKey", detail: "Urea 12kg — Nitrogen boost", color: "#4ade80" },
];

const MARKETPLACE = [
  { name: "Propiconazole 25% EC", category: "Fungicide", price: "INR 340", rating: "4.8", tag: "topSeller", verified: true },
  { name: "Neem Oil Concentrate", category: "Bio Pesticide", price: "INR 180", rating: "4.6", tag: "inStock", verified: true },
  { name: "Urea Fertilizer 50kg", category: "Fertilizer", price: "INR 620", rating: "4.7", tag: "inStock", verified: true },
  { name: "Imidacloprid 17.8% SL", category: "Insecticide", price: "INR 290", rating: "4.5", tag: "inStock", verified: true },
];

const SUPPLIERS = [
  { name: "Kisan Agro Sikar", dist: "2.3 km", price: "INR 340" },
  { name: "Green Earth Store", dist: "4.1 km", price: "INR 310" },
];

function SensorBar({ label, value, unit, color }) {
  const [width, setWidth] = useState(0);
  useEffect(() => { setTimeout(() => setWidth(value), 300); }, [value]);
  return (
    <div style={S.sensorRow}>
      <div style={S.sensorLabel}>{label}</div>
      <div style={S.sensorBarWrap}>
        <div style={{ ...S.sensorBarFill, width: `${width}%`, background: color, transition: "width 1s ease" }} />
      </div>
      <div style={{ ...S.sensorValue, color }}>{value}{unit}</div>
    </div>
  );
}

const SENSOR_FIELDS = [
  { key: "soilMoisture", label: "Soil Moisture", unit: "%", color: "#4ade80", min: 0, max: 100, hint: "Touch soil — dry=10-30%, moist=40-70%, wet=80-100%" },
  { key: "humidity", label: "Humidity", unit: "%", color: "#4ade80", min: 0, max: 100, hint: "Dry air=20-40%, normal=50-70%, humid=80%+" },
  { key: "sunlight", label: "Sunlight", unit: "%", color: "#c8960c", min: 0, max: 100, hint: "Full sun=90-100%, partial=50-70%, cloudy=10-30%" },
  { key: "nitrogen", label: "Nitrogen", unit: "mg/kg", color: "#c4622d", min: 0, max: 100, hint: "Pale yellow leaves=low(20-40), dark green=high(60-80)" },
  { key: "phosphorus", label: "Phosphorus", unit: "mg/kg", color: "#4ade80", min: 0, max: 100, hint: "Purple leaf edges=low, healthy green=normal(50-70)" },
  { key: "potassium", label: "Potassium", unit: "mg/kg", color: "#c8960c", min: 0, max: 100, hint: "Brown leaf edges=low, healthy crop=normal(50-70)" },
];

function SensorSection({ t }) {
  const [mode, setMode] = useState("iot");
  const [manual, setManual] = useState({ soilMoisture: 67, humidity: 78, sunlight: 84, nitrogen: 42, phosphorus: 61, potassium: 55 });
  const [saved, setSaved] = useState(false);
  const [activeHint, setActiveHint] = useState(null);

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div style={S.card}>
      <div style={S.cardHeader}>
        <span style={S.cardTitle}>{t("liveSensors")}</span>
        <div style={{ display: "flex", gap: "6px" }}>
          <button style={{ ...S.modeBtn, ...(mode === "iot" ? S.modeBtnActive : {}) }} onClick={() => setMode("iot")}>Phone IoT</button>
          <button style={{ ...S.modeBtn, ...(mode === "manual" ? { ...S.modeBtnActive, background: "rgba(74,222,128,0.1)", borderColor: "rgba(74,222,128,0.3)", color: "#4ade80" } : {}) }} onClick={() => setMode("manual")}>Manual Entry</button>
        </div>
      </div>

      {mode === "iot" && (
        <div>
          <p style={{ fontSize: "11px", color: "#555", marginBottom: "14px" }}>Live readings from your phone sensors — updated every 6 hours</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {SENSORS.map(s => (
              <SensorBar key={s.key} label={t(s.key)} value={s.value} unit={s.unit} color={s.color} />
            ))}
          </div>
        </div>
      )}

      {mode === "manual" && (
        <div>
          <div style={S.manualBanner}>
            <div style={{ fontSize: "20px", flexShrink: 0 }}>✋</div>
            <div>
              <div style={{ fontSize: "13px", fontWeight: "700", color: "#e0d8c8", marginBottom: "2px" }}>Manual Farmer Entry</div>
              <div style={{ fontSize: "11px", color: "#555", lineHeight: 1.6 }}>No IoT device? No problem. Enter your estimates based on experience and observation.</div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "16px" }}>
            {SENSOR_FIELDS.map(field => (
              <div key={field.key}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "13px", color: "#888" }}>{field.label}</span>
                    <button style={S.hintBtn} onClick={() => setActiveHint(activeHint === field.key ? null : field.key)}>?</button>
                  </div>
                  <span style={{ fontSize: "14px", fontWeight: "700", color: field.color }}>{manual[field.key]}{field.unit}</span>
                </div>
                {activeHint === field.key && <div style={S.hintBox}>💡 {field.hint}</div>}
                <input type="range" min={field.min} max={field.max} value={manual[field.key]}
                  onChange={e => setManual(m => ({ ...m, [field.key]: Number(e.target.value) }))}
                  style={{ width: "100%", accentColor: field.color }} />
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
            <button style={S.saveBtn} onClick={handleSave}>{saved ? "Saved ✓" : "Save My Readings"}</button>
          </div>
          {saved && <div style={S.savedConfirm}><div style={{ fontSize: "11px", color: "#4ade80", fontWeight: "700" }}>Readings logged permanently</div></div>}
        </div>
      )}
    </div>
  );
}

export default function Dashboard({ setCurrentPage, language = "EN" }) {
  const t = (key) => tr(language, key);
  const [time, setTime] = useState(new Date());
  const [activeZone, setActiveZone] = useState(null);
  const [cart, setCart] = useState([]);
  const [manualMode, setManualMode] = useState(false);
  const [manualData, setManualData] = useState({ moisture: "", ph: "", nitrogen: "", lastCrop: "", quality: "", notes: "" });
  const [manualSaved, setManualSaved] = useState(false);
  const handleManualSave = () => { setManualSaved(true); setTimeout(() => setManualSaved(false), 2500); };

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const alertColors = { danger: "#c4622d", warning: "#c8960c", info: "#4ade80" };
  const alertBg = { danger: "rgba(196,98,45,0.06)", warning: "rgba(200,150,12,0.06)", info: "rgba(74,222,128,0.06)" };

  return (
    <div style={S.page}>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes scan { 0%{top:10%} 100%{top:80%} }
      `}</style>

      {/* Header */}
      <div style={S.header}>
        <div>
          <div style={S.headerTag}>{t("farmIntelligence")}</div>
          <h1 style={S.headerTitle}>{t("farmDashboard")}</h1>
          <p style={S.headerSub}>{t("farmSubtitle")}</p>
        </div>
        <div style={S.headerRight}>
          <div style={S.clockBox}>
            <div style={S.clockTime}>{time.toLocaleTimeString()}</div>
            <div style={S.clockDate}>{time.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 8px #4ade80", animation: "pulse 2s infinite" }} />
            <span style={{ fontSize: "11px", color: "#4ade80", fontWeight: "700", letterSpacing: "2px" }}>{t("live")}</span>
          </div>
        </div>
      </div>

      {/* TOP ROW */}
      <div style={S.topRow}>
        {/* Disease Detection */}
        <div style={{ ...S.card, border: "1px solid rgba(196,98,45,0.2)", background: "rgba(196,98,45,0.03)", flex: 1 }}>
          <div style={S.cardHeader}>
            <span style={{ ...S.cardTitle, color: "#c4622d" }}>{t("detection")}</span>
            <span style={{ ...S.cardBadge, color: "#c4622d", borderColor: "rgba(196,98,45,0.2)" }}>{t("lastScan")}</span>
          </div>
          <div style={S.diseaseBody}>
            <div style={S.scanBox}>
              <div style={S.scanZone1} /><div style={S.scanZone2} /><div style={S.scanZone3} />
              <div style={S.scanLine} />
              <div style={S.scanCornerTL} /><div style={S.scanCornerTR} />
              <div style={S.scanCornerBL} /><div style={S.scanCornerBR} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "8px" }}>
                <span style={S.detectedBadge}>{t("detected")}</span>
                <span style={{ fontSize: "11px", color: "#4ade80", fontWeight: "600" }}>94% {t("confidence")}</span>
              </div>
              <div style={S.diseaseName}>{t("diseaseName")}</div>
              <div style={S.diseaseDesc}>{t("diseaseDesc")}</div>
              <div style={{ marginTop: "12px", padding: "10px 12px", background: "rgba(200,150,12,0.06)", borderRadius: "8px", border: "1px solid rgba(200,150,12,0.12)" }}>
                <div style={{ fontSize: "9px", color: "#555", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "4px" }}>{t("recommendedTreatment")}</div>
                <div style={{ fontSize: "13px", fontWeight: "700", color: "#c8960c" }}>{t("treatmentName")}</div>
                <div style={{ fontSize: "11px", color: "#555", marginTop: "2px" }}>{t("treatmentDose")}</div>
              </div>
            </div>
          </div>
          <div style={{ marginTop: "14px" }}>
            <div style={{ fontSize: "9px", color: "#555", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "8px" }}>{t("suppliersNearby")}</div>
            {SUPPLIERS.map((s, i) => (
              <div key={i} style={S.supplierRow}>
                <div>
                  <span style={{ fontSize: "12px", fontWeight: "600", color: "#e0d8c8" }}>{s.name}</span>
                  <span style={S.verifiedBadge}>{t("verified")}</span>
                  <div style={{ fontSize: "10px", color: "#444" }}>{s.dist}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "13px", fontWeight: "700", color: "#c8960c" }}>{s.price}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: "8px", marginTop: "14px" }}>
            <button style={S.orderBtn}>{t("orderNow")}</button>
            <button style={S.scanBtn} onClick={() => setCurrentPage("journal")}>{t("scanNewDisease")}</button>
          </div>
        </div>

        {/* Marketplace */}
        <div style={{ ...S.card, flex: 1 }}>
          <div style={S.cardHeader}>
            <span style={S.cardTitle}>{t("marketplace")}</span>
            <button style={{ background: "none", border: "none", color: "#c8960c", fontSize: "11px", fontWeight: "700", cursor: "pointer" }}>{t("viewAll")}</button>
          </div>
          <p style={{ fontSize: "12px", color: "#555", marginBottom: "14px" }}>{t("marketplaceSub")}</p>
          <div style={S.marketGrid}>
            {MARKETPLACE.map((p, i) => (
              <div key={i} style={S.marketCard}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                  <span style={{ fontSize: "10px", color: "#555", background: "#1a1a1a", padding: "2px 6px", borderRadius: "4px" }}>{p.category}</span>
                  {p.tag === "topSeller" && <span style={{ fontSize: "9px", color: "#c8960c", fontWeight: "700" }}>{t("topSeller")}</span>}
                </div>
                <div style={{ fontSize: "13px", fontWeight: "700", color: "#e0d8c8", marginBottom: "4px", lineHeight: 1.3 }}>{p.name}</div>
                <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "8px" }}>
                  <span style={{ fontSize: "10px", color: "#c8960c" }}>★ {p.rating}</span>
                  {p.verified && <span style={{ fontSize: "9px", color: "#4ade80", background: "rgba(74,222,128,0.08)", padding: "1px 5px", borderRadius: "3px" }}>{t("verified")}</span>}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "14px", fontWeight: "800", color: "#c8960c" }}>{p.price}</span>
                  <button style={{ ...S.addBtn, background: cart.includes(i) ? "rgba(74,222,128,0.1)" : "rgba(200,150,12,0.1)", color: cart.includes(i) ? "#4ade80" : "#c8960c", borderColor: cart.includes(i) ? "rgba(74,222,128,0.2)" : "rgba(200,150,12,0.2)" }}
                    onClick={() => setCart(c => c.includes(i) ? c.filter(x => x !== i) : [...c, i])}>
                    {cart.includes(i) ? "✓" : t("addToCart")}
                  </button>
                </div>
              </div>
            ))}
          </div>
          {cart.length > 0 && (
            <div style={S.cartBar}>
              <span style={{ fontSize: "13px", color: "#e0d8c8" }}>{cart.length} item{cart.length > 1 ? "s" : ""} in cart</span>
              <button style={S.orderBtn}>Checkout · UPI</button>
            </div>
          )}
        </div>
      </div>

      {/* BOTTOM GRID */}
      <div style={S.mainGrid}>
        <div style={S.leftCol}>
          {/* Map */}
          <div style={S.card}>
            <div style={S.cardHeader}>
              <span style={S.cardTitle}>{t("satelliteView")}</span>
              <span style={S.cardBadge}>4.2 Acres</span>
            </div>
            <div style={S.mapWrap}>
              {[
                { id: "A", top: "8%", left: "6%", w: "42%", h: "40%", bg: "#2d5a1b", label: "healthy" },
                { id: "B", top: "8%", left: "52%", w: "40%", h: "38%", bg: "#c8960c", label: "monitor" },
                { id: "C", top: "54%", left: "6%", w: "30%", h: "38%", bg: "#2d5a1b", label: "healthy" },
                { id: "D", top: "54%", left: "40%", w: "22%", h: "28%", bg: "#c4622d", label: "alert" },
                { id: "E", top: "54%", left: "66%", w: "26%", h: "38%", bg: "#2d5a1b", label: "healthy" },
              ].map(z => (
                <div key={z.id} style={{ ...S.mapZone, top: z.top, left: z.left, width: z.w, height: z.h, background: z.bg, border: activeZone === z.id ? "2px solid #c8960c" : "1px solid transparent" }}
                  onClick={() => setActiveZone(activeZone === z.id ? null : z.id)}>
                  <span style={S.zoneLabel}>{z.id} · {t(z.label)}</span>
                </div>
              ))}
              <div style={{ ...S.pulseDot, top: "68%", left: "50%", background: "#c4622d", boxShadow: "0 0 0 4px rgba(196,98,45,0.2)" }} />
              <div style={{ ...S.pulseDot, top: "22%", left: "72%", background: "#c8960c", boxShadow: "0 0 0 4px rgba(200,150,12,0.2)" }} />
              <div style={S.mapLegend}>
                {[["#2d5a1b", t("healthy")], ["#c8960c", t("monitor")], ["#c4622d", t("alert")]].map(([c, l]) => (
                  <div key={l} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <div style={{ width: "8px", height: "8px", borderRadius: "2px", background: c }} />
                    <span style={{ fontSize: "9px", color: "#666" }}>{l}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sensors */}
          <SensorSection t={t} />

          {/* IoT Devices */}
          <div style={S.card}>
            <div style={S.cardHeader}>
              <span style={S.cardTitle}>{t("iotSensorNetwork")}</span>
              <span style={{ ...S.cardBadge, color: "#4ade80", borderColor: "rgba(74,222,128,0.2)" }}>{t("zeroCost")}</span>
            </div>
            <p style={{ fontSize: "12px", color: "#555", marginBottom: "16px", lineHeight: 1.7 }}>{t("iotDesc")}</p>
            <IotDevices setCurrentPage={setCurrentPage} />
          </div>

          {/* Manual Intel */}
          <div style={{ ...S.card, border: manualMode ? "1px solid rgba(200,150,12,0.25)" : "1px solid #1a1a1a" }}>
            <div style={S.cardHeader}>
              <div>
                <span style={S.cardTitle}>Manual Farm Intel</span>
                <div style={{ fontSize: "11px", color: "#555", marginTop: "4px" }}>No device? Add your own estimates based on experience.</div>
              </div>
              <button style={{ ...S.manualToggle, background: manualMode ? "rgba(200,150,12,0.1)" : "#0d0d0d", borderColor: manualMode ? "rgba(200,150,12,0.3)" : "#2a2a2a", color: manualMode ? "#c8960c" : "#555" }}
                onClick={() => setManualMode(m => !m)}>
                {manualMode ? "Close" : "Add Intel"}
              </button>
            </div>
            {!manualMode && (
              <div style={S.manualPrompt}>
                <div style={{ fontSize: "24px", flexShrink: 0 }}>✍</div>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: "700", color: "#e0d8c8", marginBottom: "4px" }}>Share what you know about your farm</div>
                  <div style={{ fontSize: "12px", color: "#555", lineHeight: 1.7 }}>Your experience is more valuable than any sensor. Add soil estimates, crop history, and field observations.</div>
                </div>
              </div>
            )}
            {manualMode && (
              <div style={{ animation: "fadeUp 0.3s ease" }}>
                <div style={S.manualGrid}>
                  {[
                    { key: "moisture", label: "Soil Moisture Estimate", placeholder: "e.g. 60-70%" },
                    { key: "ph", label: "Soil pH Estimate", placeholder: "e.g. 6.5" },
                    { key: "nitrogen", label: "Nitrogen (mg/kg)", placeholder: "e.g. 45" },
                    { key: "lastCrop", label: "Last Crop Grown", placeholder: "e.g. Wheat" },
                    { key: "quality", label: "Last Season Quality", placeholder: "e.g. Good" },
                  ].map(({ key, label, placeholder }) => (
                    <div key={key} style={S.manualField}>
                      <div style={S.manualLabel}>{label}</div>
                      <input style={S.manualInput} value={manualData[key]} onChange={e => setManualData(d => ({ ...d, [key]: e.target.value }))} placeholder={placeholder} />
                    </div>
                  ))}
                  <div style={{ ...S.manualField, gridColumn: "1 / -1" }}>
                    <div style={S.manualLabel}>Field Observations</div>
                    <textarea style={{ ...S.manualInput, height: "80px", resize: "vertical" }} value={manualData.notes} onChange={e => setManualData(d => ({ ...d, notes: e.target.value }))} placeholder="Anything you've observed about your land..." />
                  </div>
                </div>
                <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
                  <button style={{ ...S.manualSaveBtn, background: manualSaved ? "#4ade80" : "#c8960c", color: "#0a0a0a" }} onClick={handleManualSave}>
                    {manualSaved ? "Saved to AI Model ✓" : "Save & Update AI Model"}
                  </button>
                  <button style={S.manualClearBtn} onClick={() => setManualData({ moisture: "", ph: "", nitrogen: "", lastCrop: "", quality: "", notes: "" })}>Clear</button>
                </div>
                {manualSaved && <div style={S.manualSuccess}>Your farm intel has been saved. AI recommendations now include your experience-based inputs.</div>}
              </div>
            )}
          </div>
        </div>

        <div style={S.rightCol}>
          {/* Today's Action */}
          <div style={{ ...S.card, border: "1px solid rgba(200,150,12,0.2)", background: "rgba(200,150,12,0.03)" }}>
            <div style={S.cardHeader}>
              <span style={S.cardTitle}>{t("todayAction")}</span>
              <span style={S.cardBadge}>{t("day")} 43 {t("of")} 90</span>
            </div>
            <div style={S.actionGrid}>
              <div style={S.actionItem}>
                <div style={S.actionLabel}>{t("temperature")}</div>
                <div style={S.actionValue}>34°C</div>
                <div style={S.actionStatus}>Normal</div>
              </div>
              <div style={S.actionItem}>
                <div style={S.actionLabel}>{t("rainDebt")}</div>
                <div style={{ ...S.actionValue, color: "#c8960c" }}>89mm</div>
                <div style={{ ...S.actionStatus, color: "#c8960c" }}>{t("irrigate")}</div>
              </div>
            </div>
            <div style={S.actionAlerts}>
              {[
                { dot: "#c4622d", title: t("pestAlert"), desc: t("aphid") },
                { dot: "#c8960c", title: t("mandiAlert"), desc: t("hold") }
              ].map((a, i) => (
                <div key={i} style={S.actionAlertRow}>
                  <div style={{ ...S.actionAlertDot, background: a.dot }} />
                  <div>
                    <div style={S.actionAlertTitle}>{a.title}</div>
                    <div style={S.actionAlertDesc}>{a.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Alerts */}
          <div style={S.card}>
            <div style={S.cardHeader}>
              <span style={S.cardTitle}>{t("activeAlerts")}</span>
              <span style={{ ...S.cardBadge, color: "#c4622d", borderColor: "rgba(196,98,45,0.2)" }}>{ALERTS_DATA.length} Active</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {ALERTS_DATA.map((a, i) => (
                <div key={i} style={{ ...S.alertRow, background: alertBg[a.type], borderLeft: `3px solid ${alertColors[a.type]}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3px" }}>
                    <span style={{ fontSize: "13px", fontWeight: "700", color: "#e0d8c8" }}>{a.title}</span>
                    <span style={{ fontSize: "10px", color: "#444" }}>{a.time}</span>
                  </div>
                  <div style={{ fontSize: "12px", color: "#666", marginBottom: "6px" }}>{a.desc}</div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <span style={{ fontSize: "10px", color: "#555", background: "#1a1a1a", padding: "2px 8px", borderRadius: "4px" }}>{a.zone}</span>
                    <span style={{ fontSize: "10px", fontWeight: "700", color: alertColors[a.type] }}>{t(a.actionKey)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* History */}
          <div style={S.card}>
            <div style={S.cardHeader}>
              <span style={S.cardTitle}>{t("farmHistory")}</span>
              <span style={S.cardBadge}>Last 30 days</span>
            </div>
            {HISTORY.map((h, i) => (
              <div key={i} style={S.historyRow}>
                <div style={{ ...S.historyDot, background: h.color }} />
                <div style={S.historyLine} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "13px", fontWeight: "600", color: "#e0d8c8" }}>
                      {t(h.event === "treatmentKey" ? "treatmentApplied" : h.event === "diseaseKey" ? "diseaseDetected" : h.event === "irrigationKey" ? "irrigationDone" : "normal")}
                    </span>
                    <span style={{ fontSize: "11px", color: "#444" }}>{h.date}</span>
                  </div>
                  <div style={{ fontSize: "12px", color: "#555", marginTop: "2px" }}>{h.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const S = {
  page: { background: "#0a0a0a", minHeight: "100vh", paddingTop: "70px", color: "#e0d8c8", padding: "90px 48px 48px" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px", flexWrap: "wrap", gap: "16px" },
  headerTag: { fontSize: "10px", color: "#c8960c", fontWeight: "700", letterSpacing: "4px", textTransform: "uppercase", marginBottom: "8px" },
  headerTitle: { fontFamily: "'Playfair Display', serif", fontSize: "36px", fontWeight: "900", color: "#e0d8c8", lineHeight: 1 },
  headerSub: { fontSize: "13px", color: "#555", marginTop: "6px" },
  headerRight: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px" },
  clockBox: { textAlign: "right" },
  clockTime: { fontFamily: "'Playfair Display', serif", fontSize: "24px", fontWeight: "700", color: "#c8960c" },
  clockDate: { fontSize: "11px", color: "#444", marginTop: "2px" },
  topRow: { display: "flex", gap: "20px", marginBottom: "20px", flexWrap: "wrap" },
  mainGrid: { display: "grid", gridTemplateColumns: "1fr 380px", gap: "20px" },
  leftCol: { display: "flex", flexDirection: "column", gap: "20px" },
  rightCol: { display: "flex", flexDirection: "column", gap: "20px" },
  card: { background: "#111", borderRadius: "16px", border: "1px solid #1a1a1a", padding: "20px", animation: "fadeUp 0.5s ease forwards" },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" },
  cardTitle: { fontSize: "11px", color: "#c8960c", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase" },
  cardBadge: { fontSize: "10px", color: "#555", background: "#1a1a1a", border: "1px solid #2a2a2a", padding: "3px 10px", borderRadius: "20px" },
  diseaseBody: { display: "flex", gap: "14px", alignItems: "flex-start" },
  scanBox: { width: "100px", height: "100px", background: "#0d1a0a", borderRadius: "8px", position: "relative", overflow: "hidden", flexShrink: 0 },
  scanZone1: { position: "absolute", background: "#2d5a1b", top: "10%", left: "10%", width: "40%", height: "45%", borderRadius: "3px", opacity: 0.8 },
  scanZone2: { position: "absolute", background: "#4a7c35", top: "15%", left: "54%", width: "36%", height: "35%", borderRadius: "3px", opacity: 0.6 },
  scanZone3: { position: "absolute", background: "#c4622d", top: "58%", left: "20%", width: "35%", height: "28%", borderRadius: "3px", opacity: 0.6 },
  scanLine: { position: "absolute", left: "4px", right: "4px", height: "1px", background: "rgba(200,150,12,0.7)", top: "50%", animation: "scan 2s ease-in-out infinite alternate" },
  scanCornerTL: { position: "absolute", top: "4px", left: "4px", width: "10px", height: "10px", borderTop: "1.5px solid #c8960c", borderLeft: "1.5px solid #c8960c" },
  scanCornerTR: { position: "absolute", top: "4px", right: "4px", width: "10px", height: "10px", borderTop: "1.5px solid #c8960c", borderRight: "1.5px solid #c8960c" },
  scanCornerBL: { position: "absolute", bottom: "4px", left: "4px", width: "10px", height: "10px", borderBottom: "1.5px solid #c8960c", borderLeft: "1.5px solid #c8960c" },
  scanCornerBR: { position: "absolute", bottom: "4px", right: "4px", width: "10px", height: "10px", borderBottom: "1.5px solid #c8960c", borderRight: "1.5px solid #c8960c" },
  detectedBadge: { fontSize: "9px", fontWeight: "700", letterSpacing: "1.5px", color: "#c4622d", background: "rgba(196,98,45,0.1)", padding: "3px 8px", borderRadius: "4px" },
  diseaseName: { fontSize: "15px", fontWeight: "800", color: "#e0d8c8", fontFamily: "'Playfair Display', serif", marginBottom: "3px" },
  diseaseDesc: { fontSize: "11px", color: "#c4622d" },
  supplierRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #141414" },
  verifiedBadge: { fontSize: "8px", background: "rgba(74,222,128,0.08)", color: "#4ade80", padding: "2px 5px", borderRadius: "3px", marginLeft: "6px", fontWeight: "700" },
  orderBtn: { flex: 1, background: "#c8960c", color: "#0a0a0a", border: "none", padding: "10px 14px", borderRadius: "8px", fontSize: "11px", fontWeight: "800", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" },
  scanBtn: { background: "transparent", color: "#c8960c", border: "1px solid rgba(200,150,12,0.3)", padding: "10px 14px", borderRadius: "8px", fontSize: "11px", fontWeight: "700", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" },
  marketGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" },
  marketCard: { background: "#0d0d0d", borderRadius: "10px", padding: "12px", border: "1px solid #1a1a1a" },
  addBtn: { border: "1px solid", padding: "5px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: "700", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", background: "none", transition: "all 0.2s" },
  cartBar: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px", padding: "10px 14px", background: "rgba(200,150,12,0.06)", borderRadius: "8px", border: "1px solid rgba(200,150,12,0.15)" },
  mapWrap: { height: "220px", background: "#0d1a0a", borderRadius: "12px", position: "relative", overflow: "hidden" },
  mapZone: { position: "absolute", borderRadius: "6px", cursor: "pointer", transition: "border 0.2s", display: "flex", alignItems: "flex-end", padding: "5px 7px", opacity: 0.85 },
  zoneLabel: { fontSize: "9px", color: "rgba(255,255,255,0.7)", fontWeight: "700" },
  pulseDot: { position: "absolute", width: "10px", height: "10px", borderRadius: "50%", transform: "translate(-50%,-50%)", animation: "pulse 2s ease-in-out infinite" },
  mapLegend: { position: "absolute", bottom: "8px", right: "8px", display: "flex", gap: "8px", background: "rgba(0,0,0,0.6)", padding: "5px 8px", borderRadius: "6px" },
  sensorRow: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" },
  sensorLabel: { fontSize: "12px", color: "#666", width: "100px", flexShrink: 0 },
  sensorBarWrap: { flex: 1, height: "4px", background: "#1a1a1a", borderRadius: "2px", overflow: "hidden" },
  sensorBarFill: { height: "100%", borderRadius: "2px" },
  sensorValue: { fontSize: "12px", fontWeight: "700", width: "60px", textAlign: "right", flexShrink: 0 },
  modeBtn: { background: "#0d0d0d", border: "1px solid #2a2a2a", color: "#555", padding: "5px 12px", borderRadius: "6px", fontSize: "11px", fontWeight: "600", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s" },
  modeBtnActive: { background: "rgba(200,150,12,0.1)", borderColor: "rgba(200,150,12,0.3)", color: "#c8960c" },
  manualBanner: { display: "flex", gap: "12px", alignItems: "flex-start", padding: "14px", background: "rgba(74,222,128,0.04)", borderRadius: "10px", border: "1px solid rgba(74,222,128,0.12)" },
  hintBtn: { width: "16px", height: "16px", borderRadius: "50%", background: "#1a1a1a", border: "1px solid #2a2a2a", color: "#555", fontSize: "9px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif", flexShrink: 0 },
  hintBox: { fontSize: "11px", color: "#888", background: "#0d0d0d", borderRadius: "6px", padding: "8px 10px", marginBottom: "6px", lineHeight: 1.6, border: "1px solid #1a1a1a" },
  saveBtn: { flex: 1, background: "#c8960c", color: "#0a0a0a", border: "none", padding: "12px", borderRadius: "8px", fontSize: "13px", fontWeight: "800", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s" },
  savedConfirm: { marginTop: "10px", padding: "10px 14px", background: "rgba(74,222,128,0.06)", borderRadius: "8px", border: "1px solid rgba(74,222,128,0.15)" },
  manualToggle: { background: "#0d0d0d", border: "1px solid", padding: "8px 16px", borderRadius: "8px", fontSize: "12px", fontWeight: "700", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s" },
  manualPrompt: { display: "flex", gap: "14px", alignItems: "flex-start", padding: "14px", background: "#0d0d0d", borderRadius: "10px", border: "1px solid #1a1a1a" },
  manualGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" },
  manualField: {},
  manualLabel: { fontSize: "10px", color: "#c8960c", fontWeight: "700", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "6px" },
  manualInput: { width: "100%", background: "#0d0d0d", border: "1px solid #2a2a2a", borderRadius: "8px", padding: "10px 14px", color: "#e0d8c8", fontSize: "13px", fontFamily: "'DM Sans', sans-serif", outline: "none", boxSizing: "border-box" },
  manualSaveBtn: { flex: 1, border: "none", padding: "12px", borderRadius: "8px", fontSize: "13px", fontWeight: "800", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.3s" },
  manualClearBtn: { background: "none", border: "1px solid #2a2a2a", color: "#555", padding: "12px 20px", borderRadius: "8px", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" },
  manualSuccess: { marginTop: "12px", padding: "12px 14px", background: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.15)", borderRadius: "8px", fontSize: "12px", color: "#4ade80", lineHeight: 1.6 },
  actionGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "14px" },
  actionItem: { background: "#0d0d0d", borderRadius: "10px", padding: "12px" },
  actionLabel: { fontSize: "10px", color: "#555", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "4px" },
  actionValue: { fontFamily: "'Playfair Display', serif", fontSize: "22px", fontWeight: "900", color: "#e0d8c8", lineHeight: 1 },
  actionStatus: { fontSize: "11px", color: "#4ade80", marginTop: "4px" },
  actionAlerts: { display: "flex", flexDirection: "column", gap: "10px" },
  actionAlertRow: { display: "flex", gap: "10px", alignItems: "flex-start" },
  actionAlertDot: { width: "7px", height: "7px", borderRadius: "50%", marginTop: "4px", flexShrink: 0, animation: "pulse 2s ease-in-out infinite" },
  actionAlertTitle: { fontSize: "12px", fontWeight: "700", color: "#e0d8c8" },
  actionAlertDesc: { fontSize: "11px", color: "#555", marginTop: "2px" },
  alertRow: { borderRadius: "10px", padding: "11px 13px", marginBottom: "6px" },
  historyRow: { display: "flex", gap: "12px", alignItems: "flex-start", paddingBottom: "14px", position: "relative" },
  historyDot: { width: "8px", height: "8px", borderRadius: "50%", marginTop: "5px", flexShrink: 0, zIndex: 1 },
  historyLine: { position: "absolute", left: "3px", top: "14px", bottom: 0, width: "1px", background: "#1a1a1a" },
};