import { useState, useEffect } from "react";

const CROPS_DATA = [
  {
    name: "Wheat", hindi: "गेहूं", current: 2200, change: +160, changePct: "+7.8%",
    low52: 1840, high52: 2380, recommendation: "HOLD", daysToSell: 11,
    potentialPrice: 2450, color: "#c8960c",
    reason: "Price historically peaks in 3rd week of April. Current uptrend strong. Hold for 11 more days to earn extra INR 12,960 on 4 acres.",
    monthly: [1840, 1880, 1950, 2020, 2150, 2200, 2280, 2350, 2100, 1960, 1880, 2200],
    predicted: [null, null, null, null, null, null, null, null, null, null, null, null, 2300, 2380, 2450, 2300],
    mandis: [
      { name: "Sikar", price: 2200, dist: "0 km" },
      { name: "Jaipur", price: 2280, dist: "110 km" },
      { name: "Jodhpur", price: 2150, dist: "180 km" },
      { name: "Ajmer", price: 2240, dist: "140 km" },
    ],
    alerts: [],
  },
  {
    name: "Mustard", hindi: "सरसों", current: 5800, change: +680, changePct: "+13.2%",
    low52: 4900, high52: 6200, recommendation: "SELL NOW", daysToSell: 0,
    potentialPrice: 5800, color: "#f0b429",
    reason: "Price at seasonal peak. Historical data shows decline starts next week. Sell immediately to lock in maximum profit.",
    monthly: [4900, 5100, 5200, 5400, 5600, 5800, 5700, 5400, 5100, 4900, 5000, 5800],
    predicted: [null, null, null, null, null, null, null, null, null, null, null, null, 5600, 5300, 5000, 4800],
    mandis: [
      { name: "Sikar", price: 5800, dist: "0 km" },
      { name: "Bharatpur", price: 5950, dist: "230 km" },
      { name: "Alwar", price: 5880, dist: "200 km" },
      { name: "Jaipur", price: 5820, dist: "110 km" },
    ],
    alerts: [],
  },
  {
    name: "Chickpea", hindi: "चना", current: 5200, change: +200, changePct: "+4.0%",
    low52: 4600, high52: 5600, recommendation: "WAIT 7 DAYS", daysToSell: 7,
    potentialPrice: 5500, color: "#8b7355",
    reason: "Government procurement likely in 7 days which typically pushes prices 5-8% higher. Hold if possible.",
    monthly: [4600, 4700, 4800, 4900, 5000, 5100, 5200, 5000, 4800, 4700, 4900, 5200],
    predicted: [null, null, null, null, null, null, null, null, null, null, null, null, 5350, 5500, 5400, 5200],
    mandis: [
      { name: "Sikar", price: 5200, dist: "0 km" },
      { name: "Kota", price: 5350, dist: "210 km" },
      { name: "Bundi", price: 5280, dist: "190 km" },
      { name: "Jaipur", price: 5220, dist: "110 km" },
    ],
    alerts: [],
  },
  {
    name: "Barley", hindi: "जौ", current: 1800, change: +35, changePct: "+2.0%",
    low52: 1600, high52: 1950, recommendation: "HOLD", daysToSell: 20,
    potentialPrice: 1950, color: "#a0856c",
    reason: "Beer industry procurement season starts in 3 weeks. Prices typically rise 8-12%. Hold if you have storage.",
    monthly: [1600, 1650, 1700, 1720, 1750, 1780, 1800, 1820, 1760, 1700, 1720, 1800],
    predicted: [null, null, null, null, null, null, null, null, null, null, null, null, 1850, 1900, 1950, 1920],
    mandis: [
      { name: "Sikar", price: 1800, dist: "0 km" },
      { name: "Jaipur", price: 1860, dist: "110 km" },
      { name: "Bikaner", price: 1820, dist: "190 km" },
      { name: "Nagaur", price: 1840, dist: "120 km" },
    ],
    alerts: [],
  },
  {
    name: "Sunflower", hindi: "सूरजमुखी", current: 6200, change: -200, changePct: "-3.1%",
    low52: 5800, high52: 6800, recommendation: "SELL NOW", daysToSell: 0,
    potentialPrice: 6200, color: "#e8b84b",
    reason: "Downtrend started. New crop arrivals will flood market in 2 weeks. Sell immediately.",
    monthly: [6800, 6700, 6500, 6400, 6300, 6200, 6100, 6000, 5900, 5800, 6000, 6200],
    predicted: [null, null, null, null, null, null, null, null, null, null, null, null, 6000, 5800, 5600, 5500],
    mandis: [
      { name: "Sikar", price: 6200, dist: "0 km" },
      { name: "Jaipur", price: 6280, dist: "110 km" },
      { name: "Ajmer", price: 6150, dist: "140 km" },
      { name: "Pali", price: 6100, dist: "160 km" },
    ],
    alerts: [],
  },
];

const MONTHS_PAST = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
const MONTHS_PRED = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr*", "May*", "Jun*", "Jul*"];

function BarChart({ crop }) {
  const allData = [...crop.monthly];
  const predData = crop.predicted.filter(Boolean);
  const allValues = [...allData, ...predData];
  const max = Math.max(...allValues) * 1.1;
  const barW = 28;
  const gap = 6;
  const totalBars = MONTHS_PRED.length;
  const chartW = totalBars * (barW + gap);
  const chartH = 180;
  const padB = 24;
  const padL = 50;

  return (
    <div style={{ overflowX: "auto" }}>
      <svg width={chartW + padL + 20} height={chartH + padB + 10} style={{ display: "block" }}>
        {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
          const y = 10 + (1 - pct) * chartH;
          const val = Math.round(max * pct);
          return (
            <g key={i}>
              <line x1={padL} y1={y} x2={padL + chartW} y2={y} stroke="#1a1a1a" strokeWidth="1" />
              <text x={padL - 6} y={y + 4} textAnchor="end" fontSize="9" fill="#444">{val.toLocaleString()}</text>
            </g>
          );
        })}
        {MONTHS_PRED.map((month, i) => {
          const isPred = i >= 12;
          const value = isPred ? crop.predicted[i] : crop.monthly[i];
          if (!value) return null;
          const barH = (value / max) * chartH;
          const x = padL + i * (barW + gap);
          const y = 10 + chartH - barH;
          return (
            <g key={i}>
              <rect
                x={x} y={y} width={barW} height={barH}
                fill={isPred ? "none" : crop.color}
                fillOpacity={isPred ? 0 : 0.8}
                stroke={isPred ? crop.color : "none"}
                strokeWidth={isPred ? 1.5 : 0}
                strokeDasharray={isPred ? "4,3" : "none"}
                rx="3"
              />
              {isPred && (
                <rect x={x} y={y} width={barW} height={barH} fill={crop.color} fillOpacity="0.1" rx="3" />
              )}
              <text x={x + barW / 2} y={chartH + padB - 4} textAnchor="middle" fontSize="9" fill={isPred ? "#666" : "#444"}>{month}</text>
            </g>
          );
        })}
        <line x1={padL + 12 * (barW + gap) - gap / 2} y1={10} x2={padL + 12 * (barW + gap) - gap / 2} y2={chartH + 10} stroke="#333" strokeWidth="1" strokeDasharray="3,3" />
        <text x={padL + 12 * (barW + gap)} y={20} fontSize="9" fill="#555">Predicted →</text>
      </svg>
    </div>
  );
}

export default function MandiIntel({ language = "EN" }) {
  const [selectedCrop, setSelectedCrop] = useState(CROPS_DATA[0]);
  const [acres, setAcres] = useState(4);
  const [yieldPerAcre, setYieldPerAcre] = useState(18);
  const [alerts, setAlerts] = useState({});
  const [alertPrice, setAlertPrice] = useState("");
  const [alertSet, setAlertSet] = useState(false);

  const totalQtl = acres * yieldPerAcre;
  const currentRevenue = Math.round(totalQtl * selectedCrop.current / 100);
  const potentialRevenue = Math.round(totalQtl * selectedCrop.potentialPrice / 100);
  const extraEarnings = potentialRevenue - currentRevenue;

  const recColor = selectedCrop.recommendation === "SELL NOW" ? "#4ade80" : "#c8960c";

  const handleSetAlert = () => {
    if (!alertPrice) return;
    setAlerts(a => ({ ...a, [selectedCrop.name]: alertPrice }));
    setAlertSet(true);
    setTimeout(() => setAlertSet(false), 2000);
    setAlertPrice("");
  };

  return (
    <div style={S.page}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes slideIn { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
      `}</style>

      {/* Header */}
      <div style={S.header}>
        <div>
          <div style={S.headerTag}>Price Intelligence</div>
          <h1 style={S.headerTitle}>Mandi Intel</h1>
          <p style={S.headerSub}>Select a crop to see live prices, AI sell timing, and profit calculator</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 8px #4ade80", animation: "pulse 2s infinite" }} />
          <span style={{ fontSize: "11px", color: "#4ade80", fontWeight: "700", letterSpacing: "2px" }}>LIVE PRICES</span>
        </div>
      </div>

      {/* Crop Selector Row */}
      <div style={S.cropSelectorRow}>
        {CROPS_DATA.map(crop => (
          <div key={crop.name}
            style={{ ...S.cropPill, borderColor: selectedCrop.name === crop.name ? crop.color : "#1a1a1a", background: selectedCrop.name === crop.name ? crop.color + "12" : "#111" }}
            onClick={() => setSelectedCrop(crop)}>
            <div style={{ fontSize: "13px", fontWeight: "700", color: selectedCrop.name === crop.name ? crop.color : "#e0d8c8" }}>{crop.name}</div>
            <div style={{ fontSize: "12px", fontWeight: "800", color: crop.color, marginTop: "2px" }}>INR {crop.current.toLocaleString()}</div>
            <div style={{ fontSize: "10px", color: crop.change >= 0 ? "#4ade80" : "#c4622d", marginTop: "1px" }}>{crop.changePct}</div>
          </div>
        ))}
      </div>

      {/* Detail Section */}
      <div style={{ ...S.detailSection, animation: "slideIn 0.3s ease" }} key={selectedCrop.name}>

        {/* Top Row — Recommendation + Stats */}
        <div style={S.topRow}>

          {/* AI Recommendation */}
          <div style={{ ...S.card, flex: 1, borderColor: recColor + "33", background: recColor === "#4ade80" ? "rgba(74,222,128,0.03)" : "rgba(200,150,12,0.03)" }}>
            <div style={S.cardTitle}>AI Recommendation</div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "32px", fontWeight: "900", color: recColor, marginTop: "8px" }}>
              {selectedCrop.recommendation}
            </div>
            {selectedCrop.daysToSell > 0 && (
              <div style={{ fontSize: "13px", color: "#555", marginTop: "4px" }}>Optimal sell window in {selectedCrop.daysToSell} days</div>
            )}
            <p style={{ fontSize: "13px", color: "#888", lineHeight: 1.8, marginTop: "12px", padding: "12px", background: "rgba(0,0,0,0.2)", borderRadius: "8px" }}>
              {selectedCrop.reason}
            </p>
          </div>

          {/* Price Stats */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", minWidth: "200px" }}>
            {[
              ["Current Price", `INR ${selectedCrop.current.toLocaleString()}`, selectedCrop.color],
              ["52W Low", `INR ${selectedCrop.low52.toLocaleString()}`, "#c4622d"],
              ["52W High", `INR ${selectedCrop.high52.toLocaleString()}`, "#4ade80"],
              ["Predicted Peak", `INR ${selectedCrop.potentialPrice.toLocaleString()}`, "#4ade80"],
            ].map(([l, v, c]) => (
              <div key={l} style={S.statBox}>
                <div style={S.statLabel}>{l}</div>
                <div style={{ ...S.statVal, color: c }}>{v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div style={S.card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <div style={S.cardTitle}>Price Trend — Historical + Predicted</div>
            <div style={{ display: "flex", gap: "16px", fontSize: "10px", color: "#555" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <div style={{ width: "12px", height: "8px", background: selectedCrop.color, borderRadius: "2px", opacity: 0.8 }} />
                Historical
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <div style={{ width: "12px", height: "8px", border: `1.5px dashed ${selectedCrop.color}`, borderRadius: "2px" }} />
                AI Predicted
              </span>
            </div>
          </div>
          <BarChart crop={selectedCrop} />
        </div>

        {/* Bottom Row — Mandi Comparison + Profit Calc + Alert */}
        <div style={S.bottomRow}>

          {/* Mandi Comparison */}
          <div style={{ ...S.card, flex: 1 }}>
            <div style={S.cardTitle}>Price Across Mandis</div>
            <p style={{ fontSize: "11px", color: "#555", marginTop: "4px", marginBottom: "14px" }}>Sorted by price — highest first</p>
            {[...selectedCrop.mandis].sort((a, b) => b.price - a.price).map((m, i) => (
              <div key={i} style={S.mandiRow}>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: "600", color: "#e0d8c8" }}>{m.name} Mandi</div>
                  <div style={{ fontSize: "10px", color: "#555", marginTop: "2px" }}>{m.dist} from your farm</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "15px", fontWeight: "800", color: i === 0 ? "#4ade80" : selectedCrop.color }}>
                    INR {m.price.toLocaleString()}
                  </div>
                  {i === 0 && <div style={{ fontSize: "9px", color: "#4ade80", fontWeight: "700", letterSpacing: "1px" }}>BEST PRICE</div>}
                </div>
                <div style={S.mandiBar}>
                  <div style={{ ...S.mandiBarFill, width: `${(m.price / Math.max(...selectedCrop.mandis.map(x => x.price))) * 100}%`, background: i === 0 ? "#4ade80" : selectedCrop.color }} />
                </div>
              </div>
            ))}
          </div>

          {/* Profit Calculator */}
          <div style={{ ...S.card, flex: 1 }}>
            <div style={S.cardTitle}>Profit Calculator</div>
            <div style={{ marginTop: "14px", display: "flex", flexDirection: "column", gap: "14px" }}>
              {[
                { label: "Farm Size (Acres)", value: acres, set: setAcres, min: 1, max: 20 },
                { label: "Yield per Acre (Qtl)", value: yieldPerAcre, set: setYieldPerAcre, min: 5, max: 40 },
              ].map(({ label, value, set, min, max }) => (
                <div key={label}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                    <span style={{ fontSize: "11px", color: "#666" }}>{label}</span>
                    <span style={{ fontSize: "13px", fontWeight: "700", color: selectedCrop.color }}>{value}</span>
                  </div>
                  <input type="range" min={min} max={max} value={value}
                    onChange={e => set(Number(e.target.value))}
                    style={{ width: "100%", accentColor: selectedCrop.color }} />
                </div>
              ))}
              <div style={{ height: "1px", background: "#1a1a1a" }} />
              {[
                ["Total Quantity", `${totalQtl} Qtl`, "#e0d8c8"],
                ["Revenue Today", `INR ${currentRevenue.toLocaleString()}`, "#e0d8c8"],
                ["Revenue at Peak", `INR ${potentialRevenue.toLocaleString()}`, "#4ade80"],
              ].map(([l, v, c]) => (
                <div key={l} style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "12px", color: "#555" }}>{l}</span>
                  <span style={{ fontSize: "13px", fontWeight: "700", color: c }}>{v}</span>
                </div>
              ))}
              {extraEarnings > 0 && (
                <div style={{ background: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.15)", borderRadius: "10px", padding: "12px", textAlign: "center" }}>
                  <div style={{ fontSize: "10px", color: "#4ade80", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "4px" }}>Extra by waiting</div>
                  <div style={{ fontSize: "24px", fontWeight: "900", color: "#4ade80", fontFamily: "'Playfair Display', serif" }}>+ INR {extraEarnings.toLocaleString()}</div>
                </div>
              )}
            </div>
          </div>

          {/* Price Alert */}
          <div style={{ ...S.card, flex: 1 }}>
            <div style={S.cardTitle}>Price Alert</div>
            <p style={{ fontSize: "12px", color: "#555", marginTop: "6px", marginBottom: "16px", lineHeight: 1.6 }}>
              Set a target price. We'll notify you on WhatsApp when {selectedCrop.name} crosses it.
            </p>
            <div style={{ marginBottom: "10px" }}>
              <div style={{ fontSize: "10px", color: "#666", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "6px" }}>
                Current: INR {selectedCrop.current.toLocaleString()}
              </div>
              <input
                type="number"
                placeholder={`Enter target price (e.g. ${selectedCrop.potentialPrice})`}
                value={alertPrice}
                onChange={e => setAlertPrice(e.target.value)}
                style={S.alertInput}
              />
            </div>
            <button style={{ ...S.alertBtn, background: alertSet ? "#4ade80" : selectedCrop.color, color: "#0a0a0a" }} onClick={handleSetAlert}>
              {alertSet ? "Alert Set!" : "Set WhatsApp Alert"}
            </button>

            {/* Active alerts */}
            {Object.keys(alerts).length > 0 && (
              <div style={{ marginTop: "16px" }}>
                <div style={{ fontSize: "10px", color: "#555", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "8px" }}>Active Alerts</div>
                {Object.entries(alerts).map(([crop, price]) => (
                  <div key={crop} style={S.alertRow}>
                    <div>
                      <span style={{ fontSize: "12px", fontWeight: "600", color: "#e0d8c8" }}>{crop}</span>
                      <div style={{ fontSize: "10px", color: "#555" }}>Notify at INR {Number(price).toLocaleString()}</div>
                    </div>
                    <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 4px #4ade80" }} />
                  </div>
                ))}
              </div>
            )}

            {/* Tip */}
            <div style={{ marginTop: "16px", padding: "12px", background: "rgba(200,150,12,0.05)", borderRadius: "8px", border: "1px solid rgba(200,150,12,0.1)" }}>
              <div style={{ fontSize: "10px", color: "#c8960c", fontWeight: "700", marginBottom: "4px" }}>PRO TIP</div>
              <div style={{ fontSize: "11px", color: "#555", lineHeight: 1.6 }}>
                AI predicts {selectedCrop.name} will peak at INR {selectedCrop.potentialPrice.toLocaleString()}. Set alert at INR {selectedCrop.potentialPrice - 50} to get notified before peak.
              </div>
            </div>
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
  cropSelectorRow: { display: "flex", gap: "10px", marginBottom: "24px", flexWrap: "wrap" },
  cropPill: { flex: 1, minWidth: "140px", background: "#111", border: "1px solid #1a1a1a", borderRadius: "12px", padding: "14px 16px", cursor: "pointer", transition: "all 0.2s" },
  detailSection: { display: "flex", flexDirection: "column", gap: "16px" },
  topRow: { display: "flex", gap: "16px", flexWrap: "wrap" },
  bottomRow: { display: "flex", gap: "16px", flexWrap: "wrap" },
  card: { background: "#111", borderRadius: "16px", border: "1px solid #1a1a1a", padding: "20px" },
  cardTitle: { fontSize: "10px", color: "#c8960c", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase" },
  statBox: { background: "#111", borderRadius: "10px", border: "1px solid #1a1a1a", padding: "12px 14px" },
  statLabel: { fontSize: "9px", color: "#444", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "4px" },
  statVal: { fontSize: "16px", fontWeight: "800", fontFamily: "'Playfair Display', serif" },
  mandiRow: { display: "flex", alignItems: "center", gap: "12px", padding: "10px 0", borderBottom: "1px solid #141414", position: "relative", flexWrap: "wrap" },
  mandiBar: { position: "absolute", bottom: 0, left: 0, right: 0, height: "2px", background: "#141414", borderRadius: "1px" },
  mandiBarFill: { height: "100%", borderRadius: "1px", transition: "width 0.8s ease" },
  alertInput: { width: "100%", background: "#0d0d0d", border: "1px solid #2a2a2a", borderRadius: "8px", padding: "10px 14px", color: "#e0d8c8", fontSize: "13px", fontFamily: "'DM Sans', sans-serif", outline: "none" },
  alertBtn: { width: "100%", border: "none", padding: "12px", borderRadius: "8px", fontSize: "13px", fontWeight: "800", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s" },
  alertRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 10px", background: "#0d0d0d", borderRadius: "8px", marginBottom: "6px" },
};