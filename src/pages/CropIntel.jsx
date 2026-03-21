import { useState, useEffect } from "react";

const CROPS = [
  {
    name: "Wheat", hindi: "गेहूं", season: "Rabi", duration: "120 days",
    profit: 52000, yield: "18 qtl/acre", water: "Medium", risk: "Low",
    score: 94, color: "#c8960c",
    reasoning: "Perfect pH match for your soil. Optimal temperature window. High mandi demand this season. Low pest pressure in Sikar district right now.",
    soilMatch: ["Loam", "Clay Loam", "Sandy Loam"],
    waterNeed: ["Medium", "High"],
    mandiPrice: 2200, priceChange: "+8%", priceUp: true,
    pesticides: [
      { name: "Propiconazole 25% EC", use: "Rust & fungal diseases", dose: "200ml/acre", timing: "At first sign of disease", price: "INR 340" },
      { name: "Imidacloprid 17.8% SL", use: "Aphid & whitefly", dose: "100ml/acre", timing: "Early morning spray", price: "INR 290" },
      { name: "Chlorpyrifos 20% EC", use: "Termite & soil insects", dose: "2L/acre", timing: "At sowing time", price: "INR 180" },
    ],
    fertilizers: [
      { name: "Urea (46% N)", dose: "50 kg/acre", timing: "Basal + 30 days after sowing" },
      { name: "DAP (18:46:0)", dose: "25 kg/acre", timing: "At sowing" },
      { name: "MOP (60% K)", dose: "15 kg/acre", timing: "Basal dose" },
    ],
  },
  {
    name: "Mustard", hindi: "सरसों", season: "Rabi", duration: "110 days",
    profit: 44000, yield: "8 qtl/acre", water: "Low", risk: "Low",
    score: 87, color: "#f0b429",
    reasoning: "Drought tolerant — ideal for your rain deficit situation. Strong mandi price trend this season. Minimal irrigation needed.",
    soilMatch: ["Loam", "Sandy Loam", "Alluvial"],
    waterNeed: ["Low", "Medium"],
    mandiPrice: 5800, priceChange: "+12%", priceUp: true,
    pesticides: [
      { name: "Mancozeb 75% WP", use: "Alternaria leaf blight", dose: "300g/acre", timing: "At 30 & 50 days", price: "INR 210" },
      { name: "Malathion 50% EC", use: "Aphid control", dose: "400ml/acre", timing: "When infestation seen", price: "INR 160" },
    ],
    fertilizers: [
      { name: "Urea (46% N)", dose: "35 kg/acre", timing: "Split — sowing + 30 days" },
      { name: "SSP (16% P)", dose: "50 kg/acre", timing: "At sowing" },
      { name: "Sulfur 90%", dose: "8 kg/acre", timing: "Basal — improves oil content" },
    ],
  },
  {
    name: "Chickpea", hindi: "चना", season: "Rabi", duration: "100 days",
    profit: 38000, yield: "6 qtl/acre", water: "Low", risk: "Medium",
    score: 79, color: "#8b7355",
    reasoning: "Nitrogen fixing improves soil for next season. Medium water need. Watch for pod borer in your region.",
    soilMatch: ["Sandy Loam", "Loam", "Black Soil"],
    waterNeed: ["Low"],
    mandiPrice: 5200, priceChange: "+4%", priceUp: true,
    pesticides: [
      { name: "Indoxacarb 14.5% SC", use: "Pod borer control", dose: "200ml/acre", timing: "At flowering stage", price: "INR 380" },
      { name: "Tebuconazole 25.9% EC", use: "Wilt & blight", dose: "200ml/acre", timing: "At first symptom", price: "INR 320" },
    ],
    fertilizers: [
      { name: "Rhizobium Culture", dose: "200g/10kg seed", timing: "Seed treatment before sowing" },
      { name: "DAP (18:46:0)", dose: "20 kg/acre", timing: "Basal dose only" },
      { name: "Zinc Sulfate", dose: "5 kg/acre", timing: "Basal dose" },
    ],
  },
  {
    name: "Barley", hindi: "जौ", season: "Rabi", duration: "90 days",
    profit: 28000, yield: "12 qtl/acre", water: "Low", risk: "Low",
    score: 71, color: "#a0856c",
    reasoning: "Fastest harvest this season. Low input cost. Good for farmers with limited irrigation. Beer industry demand rising.",
    soilMatch: ["Sandy Loam", "Loam", "Alluvial"],
    waterNeed: ["Low", "Medium"],
    mandiPrice: 1800, priceChange: "+2%", priceUp: true,
    pesticides: [
      { name: "Propiconazole 25% EC", use: "Stripe rust control", dose: "150ml/acre", timing: "At disease onset", price: "INR 340" },
      { name: "Carbendazim 50% WP", use: "Loose smut", dose: "2g/kg seed", timing: "Seed treatment", price: "INR 120" },
    ],
    fertilizers: [
      { name: "Urea (46% N)", dose: "40 kg/acre", timing: "Half at sowing, half at 30 days" },
      { name: "SSP (16% P)", dose: "30 kg/acre", timing: "At sowing" },
    ],
  },
  {
    name: "Sunflower", hindi: "सूरजमुखी", season: "Rabi/Kharif", duration: "95 days",
    profit: 35000, yield: "5 qtl/acre", water: "Medium", risk: "High",
    score: 62, color: "#e8b84b",
    reasoning: "High market price but significant pest pressure this season in your district. Requires consistent irrigation schedule.",
    soilMatch: ["Loam", "Clay Loam", "Red Soil"],
    waterNeed: ["Medium", "High"],
    mandiPrice: 6200, priceChange: "-3%", priceUp: false,
    pesticides: [
      { name: "Cypermethrin 10% EC", use: "Head borer & aphids", dose: "300ml/acre", timing: "At bud stage", price: "INR 220" },
      { name: "Hexaconazole 5% SC", use: "Downy mildew", dose: "400ml/acre", timing: "Preventive spray", price: "INR 290" },
    ],
    fertilizers: [
      { name: "Urea (46% N)", dose: "45 kg/acre", timing: "3 split doses" },
      { name: "DAP (18:46:0)", dose: "30 kg/acre", timing: "At sowing" },
      { name: "Boron 20%", dose: "1 kg/acre", timing: "At flowering — critical" },
    ],
  },
];

const SOIL_TYPES = ["Loam", "Sandy Loam", "Clay Loam", "Black Soil", "Red Soil", "Alluvial"];
const WATER_OPTIONS = [
  { label: "High — Canal or Borewell", value: "High" },
  { label: "Medium — Seasonal Rain", value: "Medium" },
  { label: "Low — Rain-fed Only", value: "Low" },
];
const SEASONS = ["Rabi (Oct–Mar)", "Kharif (Jun–Sep)", "Zaid (Mar–Jun)"];

const STEPS = [
  { num: "01", label: "Your Farm" },
  { num: "02", label: "AI Analysis" },
  { num: "03", label: "Results" },
];

function ScoreRing({ score, color, size = 80 }) {
  const [animated, setAnimated] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setAnimated(score), 200);
    return () => clearTimeout(t);
  }, [score]);
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (animated / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#1a1a1a" strokeWidth="6" />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="6"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        style={{ transition: "stroke-dasharray 1s ease" }} />
    </svg>
  );
}

export default function CropIntel({ language = "EN" }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ soil: "", water: "", season: "", acres: 2, ph: 6.5, temp: 22, nitrogen: 50 });
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeMsg, setAnalyzeMsg] = useState(0);
  const [results, setResults] = useState(null);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [cropTab, setCropTab] = useState("pesticides");
  const [whatIf, setWhatIf] = useState({ water: "", soil: "" });
  const [revealedCount, setRevealedCount] = useState(0);

  const ANALYZE_MSGS = [
    "Reading soil composition...",
    "Checking district weather patterns...",
    "Scanning live mandi prices...",
    "Running AI recommendation model...",
    "Calculating pest risk scores...",
    "Finalizing recommendations...",
  ];

  const handleAnalyze = () => {
    if (!form.soil || !form.water || !form.season) return;
    setStep(1);
    setAnalyzing(true);
    setAnalyzeMsg(0);
    let msgIdx = 0;
    const msgInterval = setInterval(() => {
      msgIdx++;
      if (msgIdx < ANALYZE_MSGS.length) setAnalyzeMsg(msgIdx);
      else clearInterval(msgInterval);
    }, 600);
    setTimeout(() => {
      setAnalyzing(false);
      const sorted = [...CROPS].sort((a, b) => b.score - a.score);
      setResults(sorted);
      setSelectedCrop(sorted[0]);
      setRevealedCount(0);
      sorted.forEach((_, i) => {
        setTimeout(() => setRevealedCount(c => c + 1), i * 200 + 300);
      });
      setStep(2);
    }, 4000);
  };

  const getWhatIfScore = (crop) => {
    let adj = crop.score;
    if (whatIf.water && crop.waterNeed.includes(whatIf.water)) adj += 5;
    else if (whatIf.water && !crop.waterNeed.includes(whatIf.water)) adj -= 8;
    if (whatIf.soil && crop.soilMatch.includes(whatIf.soil)) adj += 4;
    else if (whatIf.soil && !crop.soilMatch.includes(whatIf.soil)) adj -= 6;
    return Math.min(99, Math.max(10, adj));
  };

  const reset = () => {
    setStep(0); setResults(null); setSelectedCrop(null);
    setForm({ soil: "", water: "", season: "", acres: 2, ph: 6.5, temp: 22, nitrogen: 50 });
    setWhatIf({ water: "", soil: "" });
  };

  const rankLabel = (i) => i === 0 ? "Best Pick" : i === 1 ? "2nd" : i === 2 ? "3rd" : `${i + 1}th`;
  const rankColor = (i) => i === 0 ? "#c8960c" : i === 1 ? "#aaa" : i === 2 ? "#cd7f32" : "#444";

  return (
    <div style={S.page}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes slideIn { from{opacity:0;transform:translateX(24px)} to{opacity:1;transform:translateX(0)} }
        @keyframes revealUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
      `}</style>

      {/* Header */}
      <div style={S.header}>
        <div>
          <div style={S.headerTag}>AI Recommendation Engine</div>
          <h1 style={S.headerTitle}>Crop Intel</h1>
          <p style={S.headerSub}>Tell us about your farm. AI picks the best crop for this season.</p>
        </div>
        {step === 2 && <button style={S.resetBtn} onClick={reset}>Start Over</button>}
      </div>

      {/* Step indicator */}
      <div style={S.stepBar}>
        {STEPS.map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ ...S.stepCircle, background: i <= step ? "#c8960c" : "#111", border: i <= step ? "none" : "1px solid #2a2a2a", color: i <= step ? "#0a0a0a" : "#444" }}>
                {i < step ? "✓" : s.num}
              </div>
              <span style={{ fontSize: "12px", fontWeight: "600", color: i <= step ? "#c8960c" : "#444", letterSpacing: "0.5px" }}>{s.label}</span>
            </div>
            {i < STEPS.length - 1 && <div style={{ width: "60px", height: "1px", background: i < step ? "#c8960c" : "#1a1a1a", margin: "0 8px", transition: "background 0.5s" }} />}
          </div>
        ))}
      </div>

      {/* STEP 0 — Form */}
      {step === 0 && (
        <div style={{ ...S.formWrap, animation: "fadeUp 0.4s ease" }}>
          <div style={S.formCard}>
            <div style={S.formTitle}>Your Farm Details</div>
            <p style={{ fontSize: "12px", color: "#555", marginBottom: "24px" }}>Fill in your farm conditions — takes 30 seconds</p>

            {/* Soil Type */}
            <div style={S.fieldGroup}>
              <div style={S.fieldLabel}>Soil Type</div>
              <div style={S.optionGrid}>
                {SOIL_TYPES.map(s => (
                  <button key={s} style={{ ...S.optionBtn, ...(form.soil === s ? { ...S.optionBtnActive, borderColor: "#c8960c", color: "#c8960c" } : {}) }}
                    onClick={() => setForm(f => ({ ...f, soil: s }))}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Water */}
            <div style={S.fieldGroup}>
              <div style={S.fieldLabel}>Water Availability</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {WATER_OPTIONS.map(w => (
                  <button key={w.value} style={{ ...S.radioBtn, ...(form.water === w.value ? { borderColor: "rgba(200,150,12,0.4)", color: "#c8960c", background: "rgba(200,150,12,0.06)" } : {}) }}
                    onClick={() => setForm(f => ({ ...f, water: w.value }))}>
                    <div style={{ ...S.radioDot, background: form.water === w.value ? "#c8960c" : "#2a2a2a" }} />
                    {w.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Season */}
            <div style={S.fieldGroup}>
              <div style={S.fieldLabel}>Target Season</div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {SEASONS.map(s => (
                  <button key={s} style={{ ...S.optionBtn, ...(form.season === s ? { ...S.optionBtnActive, borderColor: "#c8960c", color: "#c8960c" } : {}) }}
                    onClick={() => setForm(f => ({ ...f, season: s }))}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Sliders */}
            <div style={S.fieldGroup}>
              <div style={S.fieldLabel}>Farm Parameters</div>
              <div style={S.sliderGrid}>
                {[
                  { key: "acres", label: "Farm Size", unit: "acres", min: 0.5, max: 20, step: 0.5 },
                  { key: "ph", label: "Soil pH", unit: "", min: 4, max: 9, step: 0.1 },
                  { key: "temp", label: "Avg Temperature", unit: "°C", min: 10, max: 45, step: 1 },
                  { key: "nitrogen", label: "Soil Nitrogen", unit: "mg/kg", min: 10, max: 100, step: 5 },
                ].map(({ key, label, unit, min, max, step }) => (
                  <div key={key} style={S.sliderItem}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                      <span style={{ fontSize: "12px", color: "#666" }}>{label}</span>
                      <span style={{ fontSize: "13px", fontWeight: "700", color: "#c8960c" }}>{form[key]}{unit}</span>
                    </div>
                    <input type="range" min={min} max={max} step={step} value={form[key]}
                      onChange={e => setForm(f => ({ ...f, [key]: parseFloat(e.target.value) }))}
                      style={{ width: "100%", accentColor: "#c8960c" }} />
                  </div>
                ))}
              </div>
            </div>

            <button
              style={{ ...S.analyzeBtn, opacity: (!form.soil || !form.water || !form.season) ? 0.4 : 1 }}
              onClick={handleAnalyze}
              disabled={!form.soil || !form.water || !form.season}
            >
              Analyze My Farm with AI
            </button>
          </div>

          {/* Right info */}
          <div style={S.sidePanel}>
            <div style={S.sideCard}>
              <div style={S.sideCardTitle}>Live Mandi Prices</div>
              <div style={{ marginTop: "12px" }}>
                {CROPS.map(c => (
                  <div key={c.name} style={S.mandiRow}>
                    <div>
                      <span style={{ fontSize: "13px", fontWeight: "600", color: "#e0d8c8" }}>{c.name}</span>
                      <span style={{ fontSize: "10px", color: "#555", marginLeft: "6px" }} className="hindi">{c.hindi}</span>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "13px", fontWeight: "700", color: c.color }}>INR {c.mandiPrice.toLocaleString()}</div>
                      <div style={{ fontSize: "10px", color: c.priceUp ? "#4ade80" : "#c4622d" }}>{c.priceChange}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={S.sideCard}>
              <div style={S.sideCardTitle}>How AI Ranks Crops</div>
              <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "10px" }}>
                {[["Soil compatibility", "30%"], ["Water match", "20%"], ["Mandi price trend", "20%"], ["Pest risk in district", "15%"], ["Season alignment", "15%"]].map(([l, v]) => (
                  <div key={l} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "12px", color: "#666" }}>{l}</span>
                    <span style={{ fontSize: "12px", fontWeight: "700", color: "#c8960c" }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 1 — Analyzing */}
      {step === 1 && (
        <div style={S.analyzingScreen}>
          <div style={S.analyzingInner}>
            <div style={S.analyzingRing}>
              <div style={S.spinner} />
            </div>
            <h2 style={S.analyzingTitle}>AI is analyzing your farm</h2>
            <div style={S.analyzingMsgs}>
              {ANALYZE_MSGS.map((msg, i) => (
                <div key={i} style={{ ...S.analyzingMsg, opacity: i <= analyzeMsg ? 1 : 0.2, color: i === analyzeMsg ? "#c8960c" : i < analyzeMsg ? "#4ade80" : "#444", transition: "all 0.4s ease" }}>
                  {i < analyzeMsg ? "✓" : i === analyzeMsg ? "→" : "○"} {msg}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* STEP 2 — Results */}
      {step === 2 && results && (
        <div style={{ animation: "fadeUp 0.5s ease" }}>

          {/* Summary */}
          <div style={S.summaryBar}>
            {[["Soil", form.soil], ["Water", form.water], ["Season", form.season.split(" ")[0]], ["Farm", `${form.acres} acres`], ["pH", form.ph], ["Temp", `${form.temp}°C`]].map(([l, v]) => (
              <div key={l} style={S.summaryItem}>
                <div style={S.summaryLabel}>{l}</div>
                <div style={S.summaryVal}>{v}</div>
              </div>
            ))}
          </div>

          <div style={S.resultsLayout}>

            {/* Rankings */}
            <div style={S.rankCol}>
              <div style={S.colTitle}>AI Rankings</div>

              {results.map((crop, i) => {
                const wscore = (whatIf.water || whatIf.soil) ? getWhatIfScore(crop) : crop.score;
                const isSelected = selectedCrop?.name === crop.name;
                return (
                  <div key={crop.name} style={{
                    ...S.rankCard,
                    opacity: i < revealedCount ? 1 : 0,
                    transform: i < revealedCount ? "translateY(0)" : "translateY(20px)",
                    transition: `all 0.4s ease ${i * 0.1}s`,
                    borderColor: isSelected ? crop.color + "66" : "#1a1a1a",
                    background: isSelected ? crop.color + "08" : "#111",
                    cursor: "pointer",
                  }} onClick={() => setSelectedCrop(crop)}>
                    <div style={{ ...S.rankBadge, color: rankColor(i), borderColor: rankColor(i) + "44", background: rankColor(i) + "11" }}>{rankLabel(i)}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "17px", fontWeight: "800", color: "#e0d8c8" }}>{crop.name}</span>
                        <span style={{ fontSize: "11px", color: "#555" }} className="hindi">{crop.hindi}</span>
                      </div>
                      <div style={{ fontSize: "11px", color: "#555", marginTop: "3px" }}>{crop.duration} · {crop.season} · {crop.water} water</div>
                      <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                        <span style={{ ...S.tag, color: "#4ade80", borderColor: "rgba(74,222,128,0.2)" }}>INR {crop.profit.toLocaleString()}/farm</span>
                        <span style={{ ...S.tag, color: crop.priceUp ? "#4ade80" : "#c4622d", borderColor: crop.priceUp ? "rgba(74,222,128,0.2)" : "rgba(196,98,45,0.2)" }}>Mandi {crop.priceChange}</span>
                      </div>
                    </div>
                    <div style={{ textAlign: "center", position: "relative", width: "64px", height: "64px" }}>
                      <ScoreRing score={wscore} color={crop.color} size={64} />
                      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontSize: "16px", fontWeight: "900", color: crop.color, fontFamily: "'Playfair Display', serif", lineHeight: 1 }}>{wscore}</span>
                        <span style={{ fontSize: "8px", color: "#444", letterSpacing: "0.5px" }}>score</span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* What If Simulator */}
              <div style={S.whatIfBox}>
                <div style={S.whatIfTitle}>What-If Simulator</div>
                <p style={{ fontSize: "11px", color: "#555", marginBottom: "12px" }}>Change conditions and watch scores update live</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div>
                    <div style={{ fontSize: "10px", color: "#666", marginBottom: "5px" }}>Change Water</div>
                    <div style={{ display: "flex", gap: "6px" }}>
                      {["Low", "Medium", "High"].map(w => (
                        <button key={w} style={{ ...S.whatIfBtn, ...(whatIf.water === w ? { background: "rgba(200,150,12,0.15)", borderColor: "#c8960c", color: "#c8960c" } : {}) }}
                          onClick={() => setWhatIf(f => ({ ...f, water: f.water === w ? "" : w }))}>
                          {w}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "10px", color: "#666", marginBottom: "5px" }}>Change Soil</div>
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                      {["Loam", "Sandy Loam", "Black Soil"].map(s => (
                        <button key={s} style={{ ...S.whatIfBtn, ...(whatIf.soil === s ? { background: "rgba(200,150,12,0.15)", borderColor: "#c8960c", color: "#c8960c" } : {}) }}
                          onClick={() => setWhatIf(f => ({ ...f, soil: f.soil === s ? "" : s }))}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                  {(whatIf.water || whatIf.soil) && (
                    <div style={{ fontSize: "11px", color: "#c8960c", marginTop: "4px" }}>Scores updated above</div>
                  )}
                </div>
              </div>
            </div>

            {/* Detail Panel */}
            <div style={S.detailCol}>
              {selectedCrop && (
                <div style={{ animation: "slideIn 0.3s ease" }} key={selectedCrop.name}>

                  {/* Crop Header */}
                  <div style={{ ...S.detailCard, borderColor: selectedCrop.color + "33", background: selectedCrop.color + "05", marginBottom: "14px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "30px", fontWeight: "900", color: selectedCrop.color }}>{selectedCrop.name}</div>
                        <div style={{ fontSize: "13px", color: "#555", marginTop: "2px" }} className="hindi">{selectedCrop.hindi}</div>
                      </div>
                      <div style={{ textAlign: "center", position: "relative", width: "80px", height: "80px" }}>
                        <ScoreRing score={selectedCrop.score} color={selectedCrop.color} size={80} />
                        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                          <span style={{ fontSize: "22px", fontWeight: "900", color: selectedCrop.color, fontFamily: "'Playfair Display', serif", lineHeight: 1 }}>{selectedCrop.score}</span>
                          <span style={{ fontSize: "9px", color: "#444" }}>AI score</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ marginTop: "14px", padding: "12px", background: "rgba(0,0,0,0.25)", borderRadius: "8px" }}>
                      <div style={{ fontSize: "9px", color: "#555", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "5px" }}>Why AI recommends this</div>
                      <p style={{ fontSize: "13px", color: "#888", lineHeight: 1.8 }}>{selectedCrop.reasoning}</p>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", marginTop: "14px" }}>
                      {[
                        ["Expected Profit", `INR ${selectedCrop.profit.toLocaleString()}`],
                        ["Yield", selectedCrop.yield],
                        ["Duration", selectedCrop.duration],
                        ["Water Need", selectedCrop.water],
                        ["Risk Level", selectedCrop.risk],
                        ["Mandi Price", `INR ${selectedCrop.mandiPrice.toLocaleString()}`],
                      ].map(([l, v]) => (
                        <div key={l} style={{ background: "rgba(0,0,0,0.2)", borderRadius: "8px", padding: "10px 12px" }}>
                          <div style={{ fontSize: "9px", color: "#444", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "4px" }}>{l}</div>
                          <div style={{ fontSize: "13px", fontWeight: "700", color: "#e0d8c8" }}>{v}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Comparison Cards */}
                  <div style={S.detailCard}>
                    <div style={S.colTitle}>Quick Comparison</div>
                    <div style={{ overflowX: "auto", marginTop: "12px" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                        <thead>
                          <tr>{["Crop", "Profit", "Water", "Risk", "Mandi"].map(h => (
                            <th key={h} style={{ textAlign: "left", padding: "6px 8px", color: "#444", fontWeight: "600", fontSize: "10px", letterSpacing: "0.5px", borderBottom: "1px solid #1a1a1a" }}>{h}</th>
                          ))}</tr>
                        </thead>
                        <tbody>
                          {results.map((c, i) => (
                            <tr key={c.name} style={{ background: selectedCrop.name === c.name ? c.color + "08" : "transparent", cursor: "pointer" }} onClick={() => setSelectedCrop(c)}>
                              <td style={{ padding: "8px", color: c.color, fontWeight: "700" }}>{c.name}</td>
                              <td style={{ padding: "8px", color: "#e0d8c8" }}>INR {c.profit.toLocaleString()}</td>
                              <td style={{ padding: "8px", color: c.water === "Low" ? "#4ade80" : c.water === "Medium" ? "#c8960c" : "#c4622d" }}>{c.water}</td>
                              <td style={{ padding: "8px", color: c.risk === "Low" ? "#4ade80" : c.risk === "Medium" ? "#c8960c" : "#c4622d" }}>{c.risk}</td>
                              <td style={{ padding: "8px", color: c.priceUp ? "#4ade80" : "#c4622d" }}>{c.priceChange}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Pesticide & Fertilizer Guide */}
                  <div style={S.detailCard}>
                    <div style={S.colTitle}>Input Guide</div>
                    <div style={S.guideTabs}>
                      {[["pesticides", "Pesticide Guide"], ["fertilizers", "Fertilizer Schedule"]].map(([id, label]) => (
                        <button key={id} style={{ ...S.guideTab, ...(cropTab === id ? { color: selectedCrop.color, borderColor: selectedCrop.color, background: selectedCrop.color + "0f" } : {}) }}
                          onClick={() => setCropTab(id)}>{label}</button>
                      ))}
                    </div>

                    {cropTab === "pesticides" && (
                      <div style={{ display: "flex", flexDirection: "column", gap: "10px", animation: "fadeUp 0.3s ease" }}>
                        {selectedCrop.pesticides.map((p, i) => (
                          <div key={i} style={S.guideCard}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                              <span style={{ fontSize: "14px", fontWeight: "700", color: "#e0d8c8" }}>{p.name}</span>
                              <span style={{ fontSize: "12px", fontWeight: "700", color: "#c8960c" }}>{p.price}</span>
                            </div>
                            <div style={{ fontSize: "12px", color: "#666", marginBottom: "10px" }}>{p.use}</div>
                            <div style={{ display: "flex", gap: "20px" }}>
                              {[["Dose", p.dose], ["Timing", p.timing]].map(([l, v]) => (
                                <div key={l}>
                                  <div style={{ fontSize: "9px", color: "#444", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "3px" }}>{l}</div>
                                  <div style={{ fontSize: "12px", fontWeight: "600", color: "#c8960c" }}>{v}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {cropTab === "fertilizers" && (
                      <div style={{ display: "flex", flexDirection: "column", gap: "10px", animation: "fadeUp 0.3s ease" }}>
                        {selectedCrop.fertilizers.map((f, i) => (
                          <div key={i} style={S.guideCard}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                              <span style={{ fontSize: "14px", fontWeight: "700", color: "#e0d8c8" }}>{f.name}</span>
                              <span style={{ fontSize: "9px", color: "#4ade80", background: "rgba(74,222,128,0.08)", padding: "3px 8px", borderRadius: "4px", fontWeight: "700", letterSpacing: "1px" }}>FERTILIZER</span>
                            </div>
                            <div style={{ display: "flex", gap: "20px" }}>
                              {[["Dose", f.dose], ["Timing", f.timing]].map(([l, v]) => (
                                <div key={l}>
                                  <div style={{ fontSize: "9px", color: "#444", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "3px" }}>{l}</div>
                                  <div style={{ fontSize: "12px", fontWeight: "600", color: "#c8960c" }}>{v}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const S = {
  page: { background: "#0a0a0a", minHeight: "100vh", paddingTop: "70px", color: "#e0d8c8", padding: "90px 48px 48px" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px", flexWrap: "wrap", gap: "16px" },
  headerTag: { fontSize: "10px", color: "#c8960c", fontWeight: "700", letterSpacing: "4px", textTransform: "uppercase", marginBottom: "8px" },
  headerTitle: { fontFamily: "'Playfair Display', serif", fontSize: "36px", fontWeight: "900", color: "#e0d8c8", lineHeight: 1 },
  headerSub: { fontSize: "13px", color: "#555", marginTop: "6px" },
  resetBtn: { background: "none", border: "1px solid #2a2a2a", color: "#555", padding: "10px 20px", borderRadius: "8px", fontSize: "13px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" },
  stepBar: { display: "flex", alignItems: "center", marginBottom: "28px", flexWrap: "wrap", gap: "8px" },
  stepCircle: { width: "30px", height: "30px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "700", flexShrink: 0, transition: "all 0.4s" },
  formWrap: { display: "grid", gridTemplateColumns: "1fr 300px", gap: "20px" },
  formCard: { background: "#111", borderRadius: "16px", border: "1px solid #1a1a1a", padding: "28px" },
  formTitle: { fontFamily: "'Playfair Display', serif", fontSize: "22px", fontWeight: "700", color: "#e0d8c8", marginBottom: "6px" },
  fieldGroup: { marginBottom: "24px" },
  fieldLabel: { fontSize: "10px", color: "#c8960c", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "10px" },
  optionGrid: { display: "flex", flexWrap: "wrap", gap: "8px" },
  optionBtn: { background: "#0d0d0d", border: "1px solid #2a2a2a", color: "#666", padding: "8px 14px", borderRadius: "8px", fontSize: "13px", fontWeight: "500", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s" },
  optionBtnActive: { background: "rgba(200,150,12,0.08)" },
  radioBtn: { display: "flex", alignItems: "center", gap: "10px", background: "#0d0d0d", border: "1px solid #2a2a2a", borderRadius: "8px", padding: "12px 16px", cursor: "pointer", fontSize: "13px", color: "#666", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s", textAlign: "left" },
  radioDot: { width: "10px", height: "10px", borderRadius: "50%", flexShrink: 0, transition: "background 0.2s" },
  sliderGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" },
  sliderItem: {},
  analyzeBtn: { width: "100%", background: "#c8960c", color: "#0a0a0a", border: "none", padding: "16px", borderRadius: "10px", fontSize: "15px", fontWeight: "800", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.3px", transition: "opacity 0.2s" },
  sidePanel: { display: "flex", flexDirection: "column", gap: "16px" },
  sideCard: { background: "#111", borderRadius: "14px", border: "1px solid #1a1a1a", padding: "18px" },
  sideCardTitle: { fontSize: "10px", color: "#c8960c", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase" },
  mandiRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #141414" },
  analyzingScreen: { minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" },
  analyzingInner: { textAlign: "center", maxWidth: "400px" },
  analyzingRing: { width: "80px", height: "80px", margin: "0 auto 24px", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(200,150,12,0.08)", borderRadius: "50%", border: "1px solid rgba(200,150,12,0.2)" },
  spinner: { width: "32px", height: "32px", border: "3px solid #1a1a1a", borderTop: "3px solid #c8960c", borderRadius: "50%", animation: "spin 0.8s linear infinite" },
  analyzingTitle: { fontFamily: "'Playfair Display', serif", fontSize: "24px", fontWeight: "700", color: "#e0d8c8", marginBottom: "24px" },
  analyzingMsgs: { display: "flex", flexDirection: "column", gap: "10px", textAlign: "left" },
  analyzingMsg: { fontSize: "13px", transition: "all 0.4s ease", letterSpacing: "0.3px" },
  summaryBar: { display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "20px", padding: "14px 18px", background: "#111", borderRadius: "12px", border: "1px solid #1a1a1a" },
  summaryItem: { flex: 1, minWidth: "70px" },
  summaryLabel: { fontSize: "9px", color: "#444", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "3px" },
  summaryVal: { fontSize: "13px", fontWeight: "700", color: "#c8960c" },
  resultsLayout: { display: "grid", gridTemplateColumns: "380px 1fr", gap: "20px" },
  rankCol: { display: "flex", flexDirection: "column", gap: "10px" },
  detailCol: {},
  colTitle: { fontSize: "10px", color: "#c8960c", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "12px" },
  rankCard: { background: "#111", borderRadius: "12px", border: "1px solid", padding: "14px 16px", display: "flex", alignItems: "center", gap: "14px", transition: "all 0.2s" },
  rankBadge: { fontSize: "9px", fontWeight: "700", letterSpacing: "1px", border: "1px solid", padding: "4px 8px", borderRadius: "20px", flexShrink: 0, textTransform: "uppercase" },
  tag: { fontSize: "9px", fontWeight: "700", border: "1px solid", padding: "3px 8px", borderRadius: "20px", letterSpacing: "0.5px" },
  whatIfBox: { background: "#111", borderRadius: "12px", border: "1px solid rgba(200,150,12,0.15)", padding: "16px", marginTop: "4px" },
  whatIfTitle: { fontSize: "10px", color: "#c8960c", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "6px" },
  whatIfBtn: { background: "#0d0d0d", border: "1px solid #2a2a2a", color: "#666", padding: "6px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: "600", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s" },
  detailCard: { background: "#111", borderRadius: "14px", border: "1px solid #1a1a1a", padding: "20px", marginBottom: "14px" },
  guideTabs: { display: "flex", gap: "4px", background: "#0d0d0d", padding: "4px", borderRadius: "8px", border: "1px solid #1a1a1a", marginBottom: "12px" },
  guideTab: { flex: 1, background: "none", border: "1px solid transparent", padding: "8px", borderRadius: "6px", fontSize: "12px", fontWeight: "600", color: "#555", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s" },
  guideCard: { background: "#0d0d0d", borderRadius: "10px", border: "1px solid #1a1a1a", padding: "14px" },
};