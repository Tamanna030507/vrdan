import { useState } from "react";

const NATIONAL_NEWS = [
  { category: "Price Alert", title: "DAP fertilizer price drops by INR 200 per bag", desc: "Government increases subsidy on DAP from INR 1,350 to INR 1,550 per bag. Effective immediately across all states.", time: "2 hours ago", color: "#4ade80", urgent: true },
  { category: "Export Ban", title: "Wheat export ban extended till June 2026", desc: "Government extends wheat export restrictions citing domestic supply concerns. Mandi prices expected to soften by 8-12%.", time: "5 hours ago", color: "#c4622d", urgent: true },
  { category: "Monsoon", title: "IMD predicts above-normal monsoon for Rajasthan 2026", desc: "106% of normal rainfall expected. Kharif crop outlook positive. Farmers advised to prepare for waterlogging in low-lying areas.", time: "2 days ago", color: "#4ade80", urgent: false },
  { category: "Technology", title: "ICAR releases new drought-resistant wheat variety HD-3385", desc: "New variety gives 20% higher yield with 15% less water. Seeds available at government agricultural centers from April 2026.", time: "4 days ago", color: "#4ade80", urgent: false },
  { category: "Price Alert", title: "Mustard prices hit 3-year high at INR 6,200 per quintal", desc: "Edible oil demand surge and lower production in MP driving prices up. Rajasthan farmers advised to hold stocks.", time: "5 days ago", color: "#4ade80", urgent: false },
  { category: "Policy", title: "PM-KISAN next installment of INR 2,000 due April 1", desc: "Government confirms next PM-KISAN installment on schedule. All registered farmers will receive INR 2,000 directly.", time: "6 days ago", color: "#c8960c", urgent: false },
];

const INTERNATIONAL_NEWS = [
  { category: "Global Market", title: "Russia-Ukraine conflict disrupts global wheat supply", desc: "Ukraine exports down 34% this season. India positioned as alternate supplier but export ban limits opportunity.", time: "1 day ago", color: "#c8960c", urgent: false },
  { category: "Global Market", title: "Indonesia lifts palm oil export ban — sunflower demand may fall", desc: "Indonesia resuming full palm oil exports could reduce demand for alternatives. Sunflower farmers should consider selling.", time: "3 days ago", color: "#c8960c", urgent: false },
  { category: "Trade", title: "EU Carbon Border Tax to impact Indian agri exports from 2027", desc: "European importers will pay premium for sustainably certified Indian produce. Farmers with VRDAN blockchain records eligible.", time: "4 days ago", color: "#4ade80", urgent: false },
  { category: "Trade", title: "China drought pushing chickpea import demand up 18%", desc: "Chinese pulse production hit by drought. India's chickpea exports rising. Domestic prices may firm over next 2 months.", time: "5 days ago", color: "#4ade80", urgent: false },
  { category: "Economy", title: "US Fed rate hike makes fertilizer imports costlier", desc: "Dollar strengthening makes imported fertilizer ingredients costlier. Urea and DAP prices likely to rise 8-10% next quarter.", time: "6 days ago", color: "#c4622d", urgent: true },
  { category: "Global Market", title: "Global food inflation at 4-year high — Indian exports opportunity", desc: "Rising global food prices create export opportunity for Indian farmers. Onion, tomato, and pulses seeing premium demand.", time: "7 days ago", color: "#4ade80", urgent: false },
];

const PESTICIDE_NEWS = [
  { name: "Chlorpyrifos 20% EC", status: "BANNED", detail: "Banned in 8 states including Maharashtra, Punjab. Environmental and health concerns. Switch to Chlorantraniliprole or Emamectin benzoate.", color: "#c4622d", urgent: true },
  { name: "Monocrotophos 36% SL", status: "RESTRICTED", detail: "Highly toxic to birds. Use only with protective gear. Banned on vegetables. Allowed on cotton and rice with restrictions.", color: "#c8960c", urgent: true },
  { name: "Propiconazole 25% EC", status: "APPROVED", detail: "Highly effective against wheat rust and fungal diseases. Available at INR 320-380 per 250ml. Buy only from verified dealers.", color: "#4ade80", urgent: false },
  { name: "Imidacloprid 17.8% SL", status: "APPROVED", detail: "Best for aphid and whitefly control. New generic versions available at 40% lower cost. Check VRDAN marketplace for verified suppliers.", color: "#4ade80", urgent: false },
  { name: "Glyphosate 41% SL", status: "UNDER REVIEW", detail: "WHO review ongoing. Currently allowed but farmers advised to use alternatives where possible. Do not use near water bodies.", color: "#c8960c", urgent: false },
  { name: "Neem Oil 1500 PPM", status: "RECOMMENDED", detail: "Government promoting organic alternatives. PMFBY premium reduced 0.5% for farmers using bio-pesticides. Effective against 200+ pests.", color: "#4ade80", urgent: false },
  { name: "Endosulfan", status: "BANNED", detail: "Completely banned across India. If you have old stock dispose at nearest Krishi Kendra. Severe penalties for use.", color: "#c4622d", urgent: true },
  { name: "Mancozeb 75% WP", status: "APPROVED", detail: "Good for broad spectrum fungal protection. Price stable at INR 180-220 per kg. New 500g packs available for small farmers.", color: "#4ade80", urgent: false },
];

const GLOBAL_EVENTS = [
  { event: "Russia-Ukraine War", impact: "Wheat prices up 23%", detail: "Black Sea region produces 30% of world wheat. Disruption pushes global prices up. India's domestic market partially insulated by export ban.", direction: "up", crop: "Wheat" },
  { event: "Indonesia Palm Oil Ban Lifted", impact: "Sunflower demand down 12%", detail: "Indonesia resuming exports reduces global edible oil deficit. Competing oils cheaper, reducing demand for sunflower.", direction: "down", crop: "Sunflower" },
  { event: "China Drought — Sichuan Province", impact: "Chickpea imports up 18%", detail: "Chinese pulse production hit by drought. India's chickpea exports rising. Domestic prices may firm up over next 2 months.", direction: "up", crop: "Chickpea" },
  { event: "EU Carbon Border Tax", impact: "Organic premium up 31%", detail: "European importers paying premium for sustainably grown produce. Indian farmers with verified blockchain records can export at premium.", direction: "up", crop: "All Crops" },
  { event: "US Fed Rate Hike", impact: "Fertilizer costs up 8%", detail: "Dollar strengthening makes imported fertilizer ingredients costlier. Urea and DAP prices likely to rise 8-10% next quarter.", direction: "down", crop: "Input Cost" },
];

const PEST_OUTBREAKS = [
  { district: "Sikar", pest: "Aphid", crop: "Wheat", severity: "High", farms: 234, color: "#c4622d" },
  { district: "Nagaur", pest: "Army Worm", crop: "Mustard", severity: "Medium", farms: 156, color: "#c8960c" },
  { district: "Jaipur", pest: "Whitefly", crop: "Chickpea", severity: "Low", farms: 89, color: "#4ade80" },
  { district: "Jodhpur", pest: "Locust", crop: "Barley", severity: "High", farms: 312, color: "#c4622d" },
  { district: "Bikaner", pest: "Stem Borer", crop: "Wheat", severity: "Medium", farms: 178, color: "#c8960c" },
  { district: "Ajmer", pest: "Pod Borer", crop: "Chickpea", severity: "Low", farms: 67, color: "#4ade80" },
];

const CROP_DEMAND = [
  { name: "Wheat", pct: 28, color: "#c8960c" },
  { name: "Rice", pct: 22, color: "#4ade80" },
  { name: "Mustard", pct: 16, color: "#f0b429" },
  { name: "Chickpea", pct: 14, color: "#8b7355" },
  { name: "Soybean", pct: 11, color: "#a0856c" },
  { name: "Others", pct: 9, color: "#555" },
];

const TICKER_ITEMS = [
  { name: "Wheat", price: "INR 2,200", change: "+7.8%", up: true },
  { name: "Mustard", price: "INR 5,800", change: "+13.2%", up: true },
  { name: "Rice", price: "INR 3,400", change: "+2.1%", up: true },
  { name: "Chickpea", price: "INR 5,200", change: "+4.0%", up: true },
  { name: "Urea", price: "INR 266/bag", change: "-5.2%", up: false },
  { name: "DAP", price: "INR 1,350/bag", change: "-12.9%", up: false },
  { name: "Sunflower", price: "INR 6,200", change: "-3.1%", up: false },
  { name: "Barley", price: "INR 1,800", change: "+2.0%", up: true },
];

function PieChart({ data }) {
  const size = 180;
  const cx = size / 2, cy = size / 2, r = 72;
  let cumAngle = -90;
  const slices = data.map(d => {
    const angle = (d.pct / 100) * 360;
    const start = cumAngle;
    cumAngle += angle;
    const r1 = (start * Math.PI) / 180;
    const r2 = ((start + angle) * Math.PI) / 180;
    const x1 = cx + r * Math.cos(r1), y1 = cy + r * Math.sin(r1);
    const x2 = cx + r * Math.cos(r2), y2 = cy + r * Math.sin(r2);
    const large = angle > 180 ? 1 : 0;
    return { ...d, path: `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${large},1 ${x2},${y2} Z` };
  });
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
      <svg width={size} height={size}>
        {slices.map((s, i) => (
          <path key={i} d={s.path} fill={s.color} stroke="#111" strokeWidth="2" opacity="0.9" />
        ))}
        <circle cx={cx} cy={cy} r={32} fill="#111" />
        <text x={cx} y={cy - 5} textAnchor="middle" fontSize="9" fontWeight="700" fill="#e0d8c8">Global</text>
        <text x={cx} y={cy + 7} textAnchor="middle" fontSize="9" fontWeight="700" fill="#e0d8c8">Demand</text>
      </svg>
      <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
        {data.map((d, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "7px" }}>
            <div style={{ width: "9px", height: "9px", borderRadius: "2px", background: d.color, flexShrink: 0 }} />
            <span style={{ fontSize: "11px", color: "#888", minWidth: "65px" }}>{d.name}</span>
            <span style={{ fontSize: "12px", fontWeight: "700", color: d.color }}>{d.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const statusColor = { "BANNED": "#c4622d", "RESTRICTED": "#c8960c", "APPROVED": "#4ade80", "UNDER REVIEW": "#c8960c", "RECOMMENDED": "#4ade80" };
const statusBg = { "BANNED": "rgba(196,98,45,0.1)", "RESTRICTED": "rgba(200,150,12,0.1)", "APPROVED": "rgba(74,222,128,0.08)", "UNDER REVIEW": "rgba(200,150,12,0.08)", "RECOMMENDED": "rgba(74,222,128,0.1)" };

export default function NewsPage({ language = "EN" }) {
  const [newsTab, setNewsTab] = useState("national");
  const [globalExpanded, setGlobalExpanded] = useState(false);
  const [nationalFilter, setNationalFilter] = useState("All");
  const [intlFilter, setIntlFilter] = useState("All");

  const natCategories = ["All", "Price Alert", "Export Ban", "Monsoon", "Technology", "Policy"];
  const intlCategories = ["All", "Global Market", "Trade", "Economy"];
  const filteredNational = nationalFilter === "All" ? NATIONAL_NEWS : NATIONAL_NEWS.filter(n => n.category === nationalFilter);
  const filteredIntl = intlFilter === "All" ? INTERNATIONAL_NEWS : INTERNATIONAL_NEWS.filter(n => n.category === intlFilter);

  return (
    <div style={S.page}>
      <style>{`
        @keyframes ticker { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>

      <div style={S.header}>
        <div>
          <div style={S.headerTag}>Market Intelligence</div>
          <h1 style={S.headerTitle}>News & Trends</h1>
          <p style={S.headerSub}>Live prices · National & international news · Pesticide updates</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 8px #4ade80", animation: "pulse 2s infinite" }} />
          <span style={{ fontSize: "11px", color: "#4ade80", fontWeight: "700", letterSpacing: "2px" }}>LIVE</span>
        </div>
      </div>

      {/* Ticker */}
      <div style={S.tickerWrap}>
        <div style={S.tickerTrack}>
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} style={S.tickerItem}>
              <span style={{ color: "#e0d8c8", fontWeight: "600", fontSize: "12px" }}>{item.name}</span>
              <span style={{ color: item.up ? "#4ade80" : "#c4622d", fontWeight: "700", fontSize: "12px", marginLeft: "6px" }}>{item.price}</span>
              <span style={{ color: item.up ? "#4ade80" : "#c4622d", fontSize: "10px", marginLeft: "4px" }}>{item.change}</span>
              <span style={{ color: "#2a2a2a", margin: "0 16px" }}>·</span>
            </span>
          ))}
        </div>
      </div>

      {/* News Sub-Tabs */}
      <div style={S.subTabs}>
        {[["national", "National News"], ["international", "International News"], ["pesticides", "Pesticides"]].map(([id, label]) => (
          <button key={id} style={{ ...S.subTab, ...(newsTab === id ? S.subTabActive : {}) }} onClick={() => setNewsTab(id)}>{label}</button>
        ))}
      </div>

      <div style={S.layout}>
        {/* Left — News content based on tab */}
        <div>
          {newsTab === "national" && (
            <div style={{ animation: "fadeUp 0.3s ease" }}>
              <div style={S.filterRow}>
                {natCategories.map(cat => (
                  <button key={cat} style={{ ...S.filterBtn, ...(nationalFilter === cat ? S.filterBtnActive : {}) }} onClick={() => setNationalFilter(cat)}>{cat}</button>
                ))}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {filteredNational.map((n, i) => (
                  <div key={i} style={{ ...S.newsCard, borderLeft: `3px solid ${n.color}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <span style={{ ...S.newsCat, background: n.color + "15", color: n.color, borderColor: n.color + "33" }}>{n.category}</span>
                        {n.urgent && <span style={S.urgentBadge}>URGENT</span>}
                      </div>
                      <span style={{ fontSize: "10px", color: "#444" }}>{n.time}</span>
                    </div>
                    <div style={S.newsTitle}>{n.title}</div>
                    <div style={S.newsDesc}>{n.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {newsTab === "international" && (
            <div style={{ animation: "fadeUp 0.3s ease" }}>
              <div style={S.filterRow}>
                {intlCategories.map(cat => (
                  <button key={cat} style={{ ...S.filterBtn, ...(intlFilter === cat ? S.filterBtnActive : {}) }} onClick={() => setIntlFilter(cat)}>{cat}</button>
                ))}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {filteredIntl.map((n, i) => (
                  <div key={i} style={{ ...S.newsCard, borderLeft: `3px solid ${n.color}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <span style={{ ...S.newsCat, background: n.color + "15", color: n.color, borderColor: n.color + "33" }}>{n.category}</span>
                        {n.urgent && <span style={S.urgentBadge}>URGENT</span>}
                      </div>
                      <span style={{ fontSize: "10px", color: "#444" }}>{n.time}</span>
                    </div>
                    <div style={S.newsTitle}>{n.title}</div>
                    <div style={S.newsDesc}>{n.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {newsTab === "pesticides" && (
            <div style={{ animation: "fadeUp 0.3s ease" }}>
              <p style={{ fontSize: "12px", color: "#555", marginBottom: "16px", lineHeight: 1.7 }}>
                Latest updates on pesticide approvals, bans, restrictions, and price changes. Always verify before buying.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {PESTICIDE_NEWS.map((p, i) => (
                  <div key={i} style={{ ...S.newsCard, borderLeft: `3px solid ${statusColor[p.status]}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                      <span style={{ fontSize: "14px", fontWeight: "700", color: "#e0d8c8" }}>{p.name}</span>
                      <span style={{ fontSize: "9px", fontWeight: "700", color: statusColor[p.status], background: statusBg[p.status], padding: "4px 10px", borderRadius: "20px", border: `1px solid ${statusColor[p.status]}33`, letterSpacing: "0.5px" }}>{p.status}</span>
                    </div>
                    <div style={{ fontSize: "12px", color: "#666", lineHeight: 1.7 }}>{p.detail}</div>
                    {p.urgent && <div style={{ marginTop: "8px" }}><span style={S.urgentBadge}>Requires Immediate Action</span></div>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={S.card}>
            <div style={S.cardTitle}>Global Crop Demand 2026</div>
            <div style={{ marginTop: "14px" }}><PieChart data={CROP_DEMAND} /></div>
            <p style={{ fontSize: "11px", color: "#555", marginTop: "10px", lineHeight: 1.6 }}>Wheat dominates at 28%. India is world's 2nd largest producer.</p>
          </div>

          {/* Global Events Toggle */}
          <div style={S.card}>
            <button
              style={S.toggleHeader}
              onClick={() => setGlobalExpanded(e => !e)}
            >
              <div style={S.cardTitle}>Global Events Impact</div>
              <span style={{ fontSize: "12px", color: "#c8960c", fontWeight: "600" }}>{globalExpanded ? "Hide ▲" : "Show ▼"}</span>
            </button>
            {globalExpanded && (
              <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "10px", animation: "fadeUp 0.3s ease" }}>
                {GLOBAL_EVENTS.map((e, i) => (
                  <div key={i} style={{ padding: "12px", background: "#0d0d0d", borderRadius: "10px", borderLeft: `3px solid ${e.direction === "up" ? "#4ade80" : "#c4622d"}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "5px" }}>
                      <span style={{ fontSize: "12px", fontWeight: "700", color: "#e0d8c8" }}>{e.event}</span>
                      <span style={{ fontSize: "11px", fontWeight: "700", color: e.direction === "up" ? "#4ade80" : "#c4622d", flexShrink: 0, marginLeft: "8px" }}>{e.impact}</span>
                    </div>
                    <div style={{ fontSize: "11px", color: "#555", marginBottom: "4px", lineHeight: 1.5 }}>{e.detail}</div>
                    <span style={{ fontSize: "9px", color: "#c8960c", background: "rgba(200,150,12,0.08)", padding: "2px 8px", borderRadius: "4px", fontWeight: "700" }}>Affects: {e.crop}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pest map */}
          <div style={S.card}>
            <div style={S.cardTitle}>District Pest Outbreak Map</div>
            <p style={{ fontSize: "11px", color: "#555", marginTop: "4px", marginBottom: "12px" }}>Active outbreaks in Rajasthan</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {PEST_OUTBREAKS.map((p, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "9px 12px", background: "#0d0d0d", borderRadius: "8px", border: `1px solid ${p.color}22` }}>
                  <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: p.color, flexShrink: 0, boxShadow: p.severity === "High" ? `0 0 5px ${p.color}` : "none" }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "12px", fontWeight: "700", color: "#e0d8c8" }}>{p.district} — {p.pest}</div>
                    <div style={{ fontSize: "10px", color: "#555" }}>{p.crop} · {p.farms} farms affected</div>
                  </div>
                  <span style={{ fontSize: "9px", fontWeight: "700", color: p.color, background: p.color + "15", padding: "3px 7px", borderRadius: "4px" }}>{p.severity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const S = {
  page: { background: "#0a0a0a", minHeight: "100vh", paddingTop: "70px", color: "#e0d8c8", padding: "90px 48px 48px" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px", flexWrap: "wrap", gap: "16px" },
  headerTag: { fontSize: "10px", color: "#c8960c", fontWeight: "700", letterSpacing: "4px", textTransform: "uppercase", marginBottom: "8px" },
  headerTitle: { fontFamily: "'Playfair Display', serif", fontSize: "36px", fontWeight: "900", color: "#e0d8c8", lineHeight: 1 },
  headerSub: { fontSize: "13px", color: "#555", marginTop: "6px" },
  tickerWrap: { background: "#0d0d0d", border: "1px solid #1a1a1a", borderRadius: "8px", overflow: "hidden", marginBottom: "20px", padding: "10px 0" },
  tickerTrack: { display: "flex", whiteSpace: "nowrap", animation: "ticker 30s linear infinite" },
  tickerItem: { display: "inline-flex", alignItems: "center", padding: "0 8px" },
  subTabs: { display: "flex", gap: "4px", background: "#111", padding: "4px", borderRadius: "12px", border: "1px solid #1a1a1a", marginBottom: "20px", width: "fit-content" },
  subTab: { background: "none", border: "none", padding: "9px 18px", borderRadius: "8px", fontSize: "13px", fontWeight: "500", color: "#555", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s" },
  subTabActive: { background: "#1a1a1a", color: "#c8960c" },
  layout: { display: "grid", gridTemplateColumns: "1fr 360px", gap: "20px" },
  filterRow: { display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "14px" },
  filterBtn: { background: "#111", border: "1px solid #1a1a1a", color: "#555", padding: "5px 12px", borderRadius: "20px", fontSize: "11px", fontWeight: "600", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s" },
  filterBtnActive: { background: "rgba(200,150,12,0.1)", borderColor: "rgba(200,150,12,0.3)", color: "#c8960c" },
  newsCard: { background: "#111", borderRadius: "12px", padding: "16px", border: "1px solid #1a1a1a", marginBottom: "0" },
  newsCat: { fontSize: "9px", fontWeight: "700", letterSpacing: "1px", border: "1px solid", padding: "3px 8px", borderRadius: "20px", textTransform: "uppercase" },
  urgentBadge: { fontSize: "9px", fontWeight: "700", color: "#c4622d", background: "rgba(196,98,45,0.1)", padding: "3px 8px", borderRadius: "4px", letterSpacing: "0.5px" },
  newsTitle: { fontSize: "14px", fontWeight: "700", color: "#e0d8c8", marginBottom: "6px", lineHeight: 1.4 },
  newsDesc: { fontSize: "12px", color: "#666", lineHeight: 1.7 },
  card: { background: "#111", borderRadius: "16px", border: "1px solid #1a1a1a", padding: "18px" },
  cardTitle: { fontSize: "10px", color: "#c8960c", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase" },
  toggleHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", background: "none", border: "none", cursor: "pointer", padding: 0 },
};