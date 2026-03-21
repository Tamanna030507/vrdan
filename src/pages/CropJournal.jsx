import { useState, useRef } from "react";

const DISEASES = [
  { name: "Wheat Rust (Puccinia)", confidence: 94, severity: "High", color: "#c4622d", treatment: "Propiconazole 25% EC", dose: "200ml per acre", timing: "Apply before rain", price: "INR 340" },
  { name: "Early Blight (Alternaria)", confidence: 89, severity: "Medium", color: "#c8960c", treatment: "Mancozeb 75% WP", dose: "300g per acre", timing: "Apply in evening", price: "INR 210" },
  { name: "Powdery Mildew", confidence: 91, severity: "Medium", color: "#c8960c", treatment: "Sulfur 80% WP", dose: "250g per acre", timing: "Apply in morning", price: "INR 180" },
];

const SUPPLIERS = [
  { name: "Kisan Agro Sikar", dist: "2.3 km", price: "INR 340", rating: "4.8", verified: true },
  { name: "Green Earth Store", dist: "4.1 km", price: "INR 310", rating: "4.6", verified: true },
  { name: "AgriMart Jaipur", dist: "8.7 km", price: "INR 295", rating: "4.5", verified: true },
];

const TIMELINE = [
  { date: "Mar 19", day: 46, health: 94, status: "healthy", note: "Good canopy growth detected", treatment: null },
  { date: "Mar 15", day: 43, health: 71, status: "warning", note: "Early blight spotted — Zone B", treatment: "Mancozeb applied" },
  { date: "Mar 10", day: 38, health: 88, status: "healthy", note: "Post-irrigation recovery", treatment: "Urea 12kg applied" },
  { date: "Mar 05", day: 33, health: 62, status: "danger", note: "Wheat rust detected", treatment: "Propiconazole applied" },
  { date: "Feb 28", day: 27, health: 95, status: "healthy", note: "Optimal growth stage", treatment: null },
  { date: "Feb 20", day: 19, health: 90, status: "healthy", note: "Germination complete", treatment: null },
];

const BLOCKCHAIN_LOG = [
  { hash: "a3f9c2d1", action: "Disease Detected", detail: "Wheat Rust · Zone C · 94% confidence", date: "Mar 19 · 14:32", color: "#c4622d" },
  { hash: "b7d4e1f8", action: "Treatment Applied", detail: "Propiconazole 25% EC · 200ml/acre", date: "Mar 19 · 16:45", color: "#4ade80" },
  { hash: "c9f2a8b3", action: "Purchase Verified", detail: "Kisan Agro Sikar · INR 340 · UPI", date: "Mar 19 · 15:10", color: "#c8960c" },
  { hash: "d1e5b3c7", action: "Irrigation Logged", detail: "3.2 hours · Full farm", date: "Mar 15 · 07:00", color: "#4ade80" },
  { hash: "e4c7f9a2", action: "Photo Captured", detail: "Weekly scan · All zones", date: "Mar 10 · 09:15", color: "#555" },
];

const STEPS = ["Upload Photo", "AI Analysis", "Buy Treatment"];

export default function CropJournal({ language = "EN" }) {
  const [step, setStep] = useState(0);
  const [uploaded, setUploaded] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [listening, setListening] = useState(false);
  const [voiceText, setVoiceText] = useState("");
  const [orderedFrom, setOrderedFrom] = useState(null);
  const [activeTab, setActiveTab] = useState("detect");
  const fileRef = useRef();

  const handleUpload = () => {
    setUploaded(true);
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setResult(DISEASES[Math.floor(Math.random() * DISEASES.length)]);
      setStep(1);
    }, 2500);
  };

  const handleVoice = () => {
    setListening(true);
    setTimeout(() => {
      setVoiceText("Mere gehu ki pattiyon par peele daag aa rahe hain aur kuch pattiyan sukh rahi hain");
      setListening(false);
      setTimeout(() => {
        setUploaded(true);
        setAnalyzing(true);
        setTimeout(() => {
          setAnalyzing(false);
          setResult(DISEASES[0]);
          setStep(1);
        }, 2000);
      }, 1000);
    }, 2000);
  };

  const handleOrder = (supplierIdx) => {
    setOrderedFrom(supplierIdx);
    setTimeout(() => setStep(2), 800);
  };

  const resetFlow = () => {
    setStep(0); setUploaded(false); setAnalyzing(false);
    setResult(null); setVoiceText(""); setOrderedFrom(null);
  };

  const healthColor = (h) => h >= 85 ? "#4ade80" : h >= 65 ? "#c8960c" : "#c4622d";

  return (
    <div style={S.page}>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes scan { 0%{top:8%} 100%{top:82%} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes ripple { 0%{transform:scale(1);opacity:1} 100%{transform:scale(2.5);opacity:0} }
        @keyframes slideIn { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
      `}</style>

      {/* Header */}
      <div style={S.header}>
        <div>
          <div style={S.headerTag}>Smart Detection</div>
          <h1 style={S.headerTitle}>Crop Journal</h1>
          <p style={S.headerSub}>Plot 347 · Sikar, Rajasthan · Season Day 46 of 90</p>
        </div>
        <div style={S.tabs}>
          {[["detect", "Disease Detection"], ["timeline", "Photo Timeline"], ["blockchain", "Blockchain Log"]].map(([id, label]) => (
            <button key={id} style={{ ...S.tab, ...(activeTab === id ? S.tabActive : {}) }} onClick={() => setActiveTab(id)}>{label}</button>
          ))}
        </div>
      </div>

      {/* DETECTION TAB */}
      {activeTab === "detect" && (
        <div style={S.detectWrap}>

          {/* Step Indicator */}
          <div style={S.stepBar}>
            {STEPS.map((s, i) => (
              <div key={i} style={S.stepItem}>
                <div style={{ ...S.stepCircle, background: i <= step ? "#c8960c" : "#1a1a1a", border: i <= step ? "none" : "1px solid #2a2a2a", color: i <= step ? "#0a0a0a" : "#444" }}>
                  {i < step ? "✓" : i + 1}
                </div>
                <span style={{ ...S.stepLabel, color: i <= step ? "#c8960c" : "#444" }}>{s}</span>
                {i < STEPS.length - 1 && <div style={{ ...S.stepLine, background: i < step ? "#c8960c" : "#1a1a1a" }} />}
              </div>
            ))}
          </div>

          <div style={S.detectGrid}>

            {/* STEP 0 — Upload */}
            {step === 0 && (
              <div style={{ ...S.card, animation: "fadeUp 0.4s ease" }}>
                <div style={S.cardHeader}>
                  <span style={S.cardTitle}>Upload or Capture</span>
                </div>

                {/* Voice Input */}
                <div style={S.voiceSection}>
                  <button style={{ ...S.voiceBtn, boxShadow: listening ? "0 0 0 12px rgba(200,150,12,0.1)" : "none" }} onClick={handleVoice}>
                    <div style={{ ...S.voiceIcon, animation: listening ? "pulse 1s ease-in-out infinite" : "none" }}>
                      {listening ? "◉" : "◎"}
                    </div>
                    <span>{listening ? "Listening..." : "Speak in Hindi"}</span>
                  </button>
                  {voiceText && (
                    <div style={S.voiceResult}>
                      <div style={S.voiceTag}>Heard</div>
                      <p style={S.voiceQuote} className="hindi">"{voiceText}"</p>
                    </div>
                  )}
                </div>

                <div style={S.orDivider}><div style={S.orLine} /><span style={S.orText}>or</span><div style={S.orLine} /></div>

                {/* Upload Zone */}
                <div style={{ ...S.uploadZone, border: uploaded ? "1px solid rgba(200,150,12,0.4)" : "1px dashed #2a2a2a", background: uploaded ? "rgba(200,150,12,0.04)" : "transparent" }}
                  onClick={() => fileRef.current?.click()}>
                  <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={() => setUploaded(true)} />
                  {!uploaded ? (
                    <>
                      <div style={S.uploadIcon}>+</div>
                      <div style={S.uploadText}>Click to upload crop photo</div>
                      <div style={S.uploadSub}>JPG, PNG · Max 10MB</div>
                    </>
                  ) : (
                    <div style={S.uploadedState}>
                      <div style={S.uploadedCheck}>✓</div>
                      <div style={S.uploadedText}>Photo ready for analysis</div>
                    </div>
                  )}
                </div>

                {/* Scan preview */}
                {uploaded && !analyzing && (
                  <div style={{ ...S.scanPreview, animation: "fadeUp 0.4s ease" }}>
                    <div style={S.scanZone1} /><div style={S.scanZone2} /><div style={S.scanZone3} />
                    <div style={S.scanCornerTL} /><div style={S.scanCornerTR} />
                    <div style={S.scanCornerBL} /><div style={S.scanCornerBR} />
                    <div style={S.previewLabel}>Ready to analyze</div>
                  </div>
                )}

                {analyzing && (
                  <div style={S.analyzingBox}>
                    <div style={S.scanPreview}>
                      <div style={S.scanZone1} /><div style={S.scanZone2} /><div style={S.scanZone3} />
                      <div style={{ ...S.scanLine, animation: "scan 1s ease-in-out infinite alternate" }} />
                      <div style={S.scanCornerTL} /><div style={S.scanCornerTR} />
                      <div style={S.scanCornerBL} /><div style={S.scanCornerBR} />
                    </div>
                    <div style={S.analyzingText}>
                      <div style={S.spinner} />
                      <span>AI analyzing leaf patterns...</span>
                    </div>
                  </div>
                )}

                {uploaded && !analyzing && (
                  <button style={S.analyzeBtn} onClick={handleUpload}>
                    Analyze with AI
                  </button>
                )}
              </div>
            )}

            {/* STEP 1 — Result */}
            {step === 1 && result && (
              <div style={{ ...S.card, animation: "slideIn 0.4s ease" }}>
                <div style={S.cardHeader}>
                  <span style={S.cardTitle}>Detection Result</span>
                  <button style={S.resetBtn} onClick={resetFlow}>New Scan</button>
                </div>

                {/* Disease Result */}
                <div style={{ ...S.resultBox, borderColor: result.color + "44" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                    <div style={{ ...S.detectedBadge, background: result.color + "22", color: result.color }}>DETECTED</div>
                    <div style={S.confidenceBox}>
                      <span style={{ fontSize: "22px", fontWeight: "900", color: result.color, fontFamily: "'Playfair Display', serif" }}>{result.confidence}%</span>
                      <span style={{ fontSize: "10px", color: "#555" }}>confidence</span>
                    </div>
                  </div>
                  <div style={S.diseaseName}>{result.name}</div>
                  <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                    <span style={{ ...S.severityBadge, background: result.color + "15", color: result.color, border: `1px solid ${result.color}33` }}>
                      {result.severity} Severity
                    </span>
                    <span style={S.actionBadge}>Act within 72 hours</span>
                  </div>
                </div>

                {/* Treatment */}
                <div style={S.treatmentBox}>
                  <div style={S.treatmentHeader}>Recommended Treatment</div>
                  <div style={S.treatmentName}>{result.treatment}</div>
                  <div style={S.treatmentRow}>
                    <div style={S.treatmentItem}><span style={S.treatmentLabel}>Dose</span><span style={S.treatmentVal}>{result.dose}</span></div>
                    <div style={S.treatmentItem}><span style={S.treatmentLabel}>Timing</span><span style={S.treatmentVal}>{result.timing}</span></div>
                    <div style={S.treatmentItem}><span style={S.treatmentLabel}>Price</span><span style={{ ...S.treatmentVal, color: "#c8960c" }}>{result.price}</span></div>
                  </div>
                </div>

                {/* Suppliers */}
                <div style={S.suppliersSection}>
                  <div style={S.suppliersHeader}>
                    <span style={S.cardTitle}>Verified Suppliers Near You</span>
                    <span style={{ fontSize: "10px", color: "#555" }}>Sorted by distance</span>
                  </div>
                  {SUPPLIERS.map((sup, i) => (
                    <div key={i} style={{ ...S.supplierCard, border: orderedFrom === i ? "1px solid #4ade80" : "1px solid #1a1a1a", background: orderedFrom === i ? "rgba(74,222,128,0.04)" : "#0d0d0d" }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "3px" }}>
                          <span style={S.supplierName}>{sup.name}</span>
                          {sup.verified && <span style={S.verifiedBadge}>Verified</span>}
                        </div>
                        <div style={{ display: "flex", gap: "10px" }}>
                          <span style={S.supplierMeta}>{sup.dist}</span>
                          <span style={{ ...S.supplierMeta, color: "#c8960c" }}>★ {sup.rating}</span>
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={S.supplierPrice}>{sup.price}</div>
                        <button
                          style={{ ...S.orderBtn, background: orderedFrom === i ? "#4ade80" : "#c8960c", color: "#0a0a0a", marginTop: "4px" }}
                          onClick={() => handleOrder(i)}
                        >
                          {orderedFrom === i ? "Ordered ✓" : "Order · UPI"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2 — Confirmation */}
            {step === 2 && (
              <div style={{ ...S.card, textAlign: "center", padding: "48px 32px", animation: "fadeUp 0.4s ease" }}>
                <div style={S.successCircle}>✓</div>
                <h2 style={S.successTitle}>Order Placed Successfully</h2>
                <p style={S.successDesc}>Payment confirmed via UPI. Delivery in 4-6 hours.</p>
                <div style={S.blockchainConfirm}>
                  <div style={S.blockchainIcon}>⛓</div>
                  <div>
                    <div style={{ fontSize: "12px", fontWeight: "700", color: "#c8960c" }}>Logged on Blockchain</div>
                    <div style={{ fontSize: "10px", color: "#555", marginTop: "2px" }}>Hash: f8a2c1d9 · Tamper-proof forever</div>
                  </div>
                </div>
                <button style={{ ...S.analyzeBtn, marginTop: "24px" }} onClick={resetFlow}>Scan Another Crop</button>
              </div>
            )}

            {/* Right panel — always visible */}
            <div style={S.rightPanel}>
              {/* Crop health summary */}
              <div style={S.card}>
                <div style={S.cardHeader}>
                  <span style={S.cardTitle}>Current Health</span>
                  <span style={{ fontSize: "22px", fontWeight: "900", color: "#4ade80", fontFamily: "'Playfair Display', serif" }}>94%</span>
                </div>
                <div style={S.healthBar}>
                  <div style={{ ...S.healthBarFill, width: "94%", background: "#4ade80" }} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "14px" }}>
                  {[["Crop", "Wheat"], ["Season Day", "46 / 90"], ["Zone", "C · Alert"], ["Last Scan", "2hr ago"]].map(([l, v]) => (
                    <div key={l} style={S.miniStat}>
                      <div style={S.miniLabel}>{l}</div>
                      <div style={S.miniVal}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick history */}
              <div style={S.card}>
                <div style={S.cardHeader}>
                  <span style={S.cardTitle}>Treatment History</span>
                </div>
                {BLOCKCHAIN_LOG.slice(0, 4).map((log, i) => (
                  <div key={i} style={S.logRow}>
                    <div style={{ ...S.logDot, background: log.color }} />
                    <div style={{ flex: 1 }}>
                      <div style={S.logAction}>{log.action}</div>
                      <div style={S.logDetail}>{log.detail}</div>
                      <div style={S.logDate}>{log.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TIMELINE TAB */}
      {activeTab === "timeline" && (
        <div style={S.card}>
          <div style={S.cardHeader}>
            <span style={S.cardTitle}>Weekly Photo Timeline</span>
            <span style={S.cardBadge}>Season Day 1 → 90</span>
          </div>
          <div style={S.timelineGrid}>
            {TIMELINE.map((entry, i) => (
              <div key={i} style={{ ...S.timelineCard, borderColor: entry.status === "healthy" ? "rgba(74,222,128,0.2)" : entry.status === "warning" ? "rgba(200,150,12,0.2)" : "rgba(196,98,45,0.2)" }}>
                <div style={S.timelinePhotoWrap}>
                  <div style={{ ...S.timelinePhoto, background: entry.status === "healthy" ? "#0d1a0a" : entry.status === "warning" ? "#1a0f00" : "#1a0500" }}>
                    <div style={{ ...S.tlZone1, opacity: 0.8 }} />
                    <div style={{ ...S.tlZone2, opacity: entry.status === "danger" ? 0.8 : 0.5 }} />
                    <div style={{ ...S.tlZone3, opacity: 0.7 }} />
                    <div style={{ position: "absolute", bottom: "6px", right: "6px", fontSize: "9px", color: "rgba(255,255,255,0.4)" }}>Day {entry.day}</div>
                  </div>
                  <div style={{ ...S.healthPill, background: healthColor(entry.health) + "22", color: healthColor(entry.health), border: `1px solid ${healthColor(entry.health)}44` }}>
                    {entry.health}%
                  </div>
                </div>
                <div style={S.timelineInfo}>
                  <div style={S.timelineDate}>{entry.date}</div>
                  <div style={S.timelineNote}>{entry.note}</div>
                  {entry.treatment && (
                    <div style={S.timelineTreatment}>{entry.treatment}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* BLOCKCHAIN TAB */}
      {activeTab === "blockchain" && (
        <div style={S.card}>
          <div style={S.cardHeader}>
            <span style={S.cardTitle}>Blockchain Activity Log</span>
            <span style={{ ...S.cardBadge, color: "#4ade80", borderColor: "rgba(74,222,128,0.2)" }}>Tamper-proof</span>
          </div>
          <p style={{ fontSize: "13px", color: "#555", marginBottom: "20px", lineHeight: 1.7 }}>
            Every farm action — disease detection, treatment, purchase, irrigation — is permanently logged with a unique hash. Cannot be edited or deleted.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {BLOCKCHAIN_LOG.map((log, i) => (
              <div key={i} style={{ ...S.blockchainRow, borderLeft: `3px solid ${log.color}` }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                    <span style={{ fontSize: "14px", fontWeight: "700", color: "#e0d8c8" }}>{log.action}</span>
                    <span style={{ fontSize: "10px", color: "#444" }}>{log.date}</span>
                  </div>
                  <div style={{ fontSize: "12px", color: "#666", marginBottom: "6px" }}>{log.detail}</div>
                  <div style={S.hashRow}>
                    <span style={S.hashLabel}>HASH</span>
                    <span style={S.hashValue}>{log.hash}</span>
                    <span style={S.hashVerified}>✓ Verified</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={S.blockchainFooter}>
            <div style={{ fontSize: "11px", color: "#555" }}>All records stored permanently · Cannot be altered · QR scannable by buyers</div>
          </div>
        </div>
      )}
    </div>
  );
}

const S = {
  page: { background: "#0a0a0a", minHeight: "100vh", paddingTop: "70px", color: "#e0d8c8", padding: "90px 48px 48px" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px", flexWrap: "wrap", gap: "16px" },
  headerTag: { fontSize: "10px", color: "#c8960c", fontWeight: "700", letterSpacing: "4px", textTransform: "uppercase", marginBottom: "8px" },
  headerTitle: { fontFamily: "'Playfair Display', serif", fontSize: "36px", fontWeight: "900", color: "#e0d8c8", lineHeight: 1 },
  headerSub: { fontSize: "13px", color: "#555", marginTop: "6px" },
  tabs: { display: "flex", gap: "4px", background: "#111", padding: "4px", borderRadius: "12px", border: "1px solid #1a1a1a" },
  tab: { background: "none", border: "none", padding: "10px 18px", borderRadius: "8px", fontSize: "13px", fontWeight: "500", color: "#555", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s" },
  tabActive: { background: "#1a1a1a", color: "#c8960c" },
  stepBar: { display: "flex", alignItems: "center", marginBottom: "28px" },
  stepItem: { display: "flex", alignItems: "center", gap: "10px" },
  stepCircle: { width: "28px", height: "28px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "700", flexShrink: 0, transition: "all 0.3s" },
  stepLabel: { fontSize: "12px", fontWeight: "600", letterSpacing: "0.3px", transition: "color 0.3s", whiteSpace: "nowrap" },
  stepLine: { width: "60px", height: "1px", transition: "background 0.3s", marginLeft: "10px" },
  detectWrap: {},
  detectGrid: { display: "grid", gridTemplateColumns: "1fr 320px", gap: "20px" },
  card: { background: "#111", borderRadius: "16px", border: "1px solid #1a1a1a", padding: "22px", animation: "fadeUp 0.5s ease forwards" },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" },
  cardTitle: { fontSize: "11px", color: "#c8960c", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase" },
  cardBadge: { fontSize: "10px", color: "#555", background: "#1a1a1a", border: "1px solid #2a2a2a", padding: "3px 10px", borderRadius: "20px" },
  voiceSection: { marginBottom: "20px" },
  voiceBtn: { display: "flex", alignItems: "center", gap: "12px", background: "rgba(200,150,12,0.06)", border: "1px solid rgba(200,150,12,0.2)", borderRadius: "12px", padding: "14px 20px", cursor: "pointer", width: "100%", color: "#c8960c", fontSize: "14px", fontWeight: "600", fontFamily: "'DM Sans', sans-serif", transition: "box-shadow 0.3s" },
  voiceIcon: { fontSize: "20px", transition: "all 0.3s" },
  voiceResult: { marginTop: "12px", padding: "12px 16px", background: "#0d0d0d", borderRadius: "8px", border: "1px solid #1a1a1a" },
  voiceTag: { fontSize: "9px", color: "#555", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "4px" },
  voiceQuote: { fontSize: "13px", color: "#888", lineHeight: 1.6, fontStyle: "italic" },
  orDivider: { display: "flex", alignItems: "center", gap: "12px", margin: "16px 0" },
  orLine: { flex: 1, height: "1px", background: "#1a1a1a" },
  orText: { fontSize: "11px", color: "#444", letterSpacing: "1px" },
  uploadZone: { borderRadius: "12px", padding: "32px", textAlign: "center", cursor: "pointer", transition: "all 0.2s", marginBottom: "16px" },
  uploadIcon: { fontSize: "32px", color: "#2a2a2a", marginBottom: "8px" },
  uploadText: { fontSize: "14px", fontWeight: "600", color: "#555" },
  uploadSub: { fontSize: "11px", color: "#333", marginTop: "4px" },
  uploadedState: { display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" },
  uploadedCheck: { fontSize: "20px", color: "#4ade80" },
  uploadedText: { fontSize: "14px", fontWeight: "600", color: "#4ade80" },
  scanPreview: { height: "120px", background: "#0d1a0a", borderRadius: "10px", position: "relative", overflow: "hidden", marginBottom: "16px" },
  scanZone1: { position: "absolute", background: "#2d5a1b", top: "10%", left: "8%", width: "38%", height: "50%", borderRadius: "4px", opacity: 0.8 },
  scanZone2: { position: "absolute", background: "#4a7c35", top: "15%", left: "50%", width: "40%", height: "40%", borderRadius: "4px", opacity: 0.6 },
  scanZone3: { position: "absolute", background: "#c4622d", top: "60%", left: "22%", width: "32%", height: "28%", borderRadius: "4px", opacity: 0.6 },
  scanLine: { position: "absolute", left: "6px", right: "6px", height: "1px", background: "rgba(200,150,12,0.7)" },
  scanCornerTL: { position: "absolute", top: "6px", left: "6px", width: "12px", height: "12px", borderTop: "2px solid #c8960c", borderLeft: "2px solid #c8960c" },
  scanCornerTR: { position: "absolute", top: "6px", right: "6px", width: "12px", height: "12px", borderTop: "2px solid #c8960c", borderRight: "2px solid #c8960c" },
  scanCornerBL: { position: "absolute", bottom: "6px", left: "6px", width: "12px", height: "12px", borderBottom: "2px solid #c8960c", borderLeft: "2px solid #c8960c" },
  scanCornerBR: { position: "absolute", bottom: "6px", right: "6px", width: "12px", height: "12px", borderBottom: "2px solid #c8960c", borderRight: "2px solid #c8960c" },
  previewLabel: { position: "absolute", bottom: "8px", left: "0", right: "0", textAlign: "center", fontSize: "9px", color: "#c8960c", letterSpacing: "1px" },
  analyzingBox: {},
  analyzingText: { display: "flex", alignItems: "center", gap: "10px", padding: "12px 0", fontSize: "13px", color: "#888" },
  spinner: { width: "16px", height: "16px", border: "2px solid #1a1a1a", borderTop: "2px solid #c8960c", borderRadius: "50%", animation: "spin 0.8s linear infinite", flexShrink: 0 },
  analyzeBtn: { width: "100%", background: "#c8960c", color: "#0a0a0a", border: "none", padding: "14px", borderRadius: "10px", fontSize: "14px", fontWeight: "800", cursor: "pointer", fontFamily: "'DM Sans', sans-serif', letterSpacing: '0.3px" },
  resetBtn: { background: "none", border: "1px solid #2a2a2a", color: "#555", padding: "5px 12px", borderRadius: "6px", fontSize: "11px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" },
  resultBox: { background: "#0d0d0d", borderRadius: "12px", padding: "16px", border: "1px solid", marginBottom: "14px" },
  detectedBadge: { fontSize: "9px", fontWeight: "700", letterSpacing: "2px", padding: "4px 10px", borderRadius: "4px" },
  confidenceBox: { display: "flex", flexDirection: "column", alignItems: "flex-end" },
  diseaseName: { fontFamily: "'Playfair Display', serif", fontSize: "20px", fontWeight: "900", color: "#e0d8c8", marginBottom: "8px" },
  severityBadge: { fontSize: "10px", fontWeight: "700", padding: "3px 10px", borderRadius: "20px" },
  actionBadge: { fontSize: "10px", color: "#c4622d", background: "rgba(196,98,45,0.1)", padding: "3px 10px", borderRadius: "20px", border: "1px solid rgba(196,98,45,0.2)" },
  treatmentBox: { background: "rgba(200,150,12,0.04)", border: "1px solid rgba(200,150,12,0.12)", borderRadius: "12px", padding: "14px", marginBottom: "16px" },
  treatmentHeader: { fontSize: "9px", color: "#555", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "6px" },
  treatmentName: { fontSize: "16px", fontWeight: "800", color: "#c8960c", marginBottom: "10px" },
  treatmentRow: { display: "flex", gap: "16px" },
  treatmentItem: { display: "flex", flexDirection: "column", gap: "2px" },
  treatmentLabel: { fontSize: "9px", color: "#444", letterSpacing: "1px", textTransform: "uppercase" },
  treatmentVal: { fontSize: "12px", fontWeight: "600", color: "#e0d8c8" },
  suppliersSection: { marginTop: "4px" },
  suppliersHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" },
  supplierCard: { borderRadius: "10px", padding: "12px", marginBottom: "8px", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "all 0.3s" },
  supplierName: { fontSize: "13px", fontWeight: "700", color: "#e0d8c8" },
  verifiedBadge: { fontSize: "8px", background: "rgba(74,222,128,0.08)", color: "#4ade80", padding: "2px 6px", borderRadius: "3px", marginLeft: "6px", fontWeight: "700" },
  supplierMeta: { fontSize: "10px", color: "#555" },
  supplierPrice: { fontSize: "14px", fontWeight: "800", color: "#c8960c" },
  orderBtn: { border: "none", padding: "8px 14px", borderRadius: "6px", fontSize: "11px", fontWeight: "800", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s" },
  successCircle: { width: "64px", height: "64px", borderRadius: "50%", background: "rgba(74,222,128,0.1)", border: "2px solid #4ade80", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", color: "#4ade80", margin: "0 auto 20px" },
  successTitle: { fontFamily: "'Playfair Display', serif", fontSize: "24px", fontWeight: "900", color: "#e0d8c8", marginBottom: "8px" },
  successDesc: { fontSize: "14px", color: "#666", marginBottom: "20px" },
  blockchainConfirm: { display: "inline-flex", alignItems: "center", gap: "12px", background: "rgba(200,150,12,0.06)", border: "1px solid rgba(200,150,12,0.15)", borderRadius: "10px", padding: "12px 16px" },
  blockchainIcon: { fontSize: "20px" },
  rightPanel: { display: "flex", flexDirection: "column", gap: "16px" },
  healthBar: { height: "6px", background: "#1a1a1a", borderRadius: "3px", overflow: "hidden" },
  healthBarFill: { height: "100%", borderRadius: "3px", transition: "width 1s ease" },
  miniStat: { background: "#0d0d0d", borderRadius: "8px", padding: "10px 12px" },
  miniLabel: { fontSize: "9px", color: "#444", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "3px" },
  miniVal: { fontSize: "13px", fontWeight: "700", color: "#e0d8c8" },
  logRow: { display: "flex", gap: "10px", alignItems: "flex-start", paddingBottom: "12px", borderBottom: "1px solid #141414", marginBottom: "2px" },
  logDot: { width: "7px", height: "7px", borderRadius: "50%", marginTop: "5px", flexShrink: 0 },
  logAction: { fontSize: "12px", fontWeight: "700", color: "#e0d8c8" },
  logDetail: { fontSize: "11px", color: "#555", marginTop: "2px" },
  logDate: { fontSize: "10px", color: "#333", marginTop: "2px" },
  timelineGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "16px" },
  timelineCard: { borderRadius: "12px", border: "1px solid", overflow: "hidden", background: "#0d0d0d" },
  timelinePhotoWrap: { position: "relative" },
  timelinePhoto: { height: "130px", position: "relative", overflow: "hidden" },
  tlZone1: { position: "absolute", background: "#2d5a1b", top: "10%", left: "8%", width: "40%", height: "50%", borderRadius: "4px" },
  tlZone2: { position: "absolute", background: "#c4622d", top: "55%", left: "25%", width: "35%", height: "30%", borderRadius: "4px" },
  tlZone3: { position: "absolute", background: "#4a7c35", top: "15%", left: "52%", width: "38%", height: "40%", borderRadius: "4px" },
  healthPill: { position: "absolute", top: "8px", right: "8px", fontSize: "11px", fontWeight: "700", padding: "3px 8px", borderRadius: "20px" },
  timelineInfo: { padding: "12px" },
  timelineDate: { fontSize: "11px", color: "#555", marginBottom: "4px" },
  timelineNote: { fontSize: "12px", fontWeight: "600", color: "#e0d8c8", lineHeight: 1.4 },
  timelineTreatment: { fontSize: "10px", color: "#4ade80", marginTop: "5px", background: "rgba(74,222,128,0.06)", padding: "3px 8px", borderRadius: "4px", display: "inline-block" },
  blockchainRow: { background: "#0d0d0d", borderRadius: "10px", padding: "14px 16px" },
  hashRow: { display: "flex", alignItems: "center", gap: "8px" },
  hashLabel: { fontSize: "9px", color: "#444", letterSpacing: "1px", background: "#1a1a1a", padding: "2px 6px", borderRadius: "3px" },
  hashValue: { fontSize: "11px", color: "#555", fontFamily: "monospace" },
  hashVerified: { fontSize: "10px", color: "#4ade80", fontWeight: "600" },
  blockchainFooter: { marginTop: "20px", padding: "14px", background: "rgba(200,150,12,0.04)", borderRadius: "8px", textAlign: "center", border: "1px solid rgba(200,150,12,0.1)" },
};